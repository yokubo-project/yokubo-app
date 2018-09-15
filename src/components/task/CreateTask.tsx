import { ImagePicker, Permissions } from "expo";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { FormInput, FormValidationMessage, Header, Icon } from "react-native-elements";
import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";
import Sentry from "sentry-expo";
import * as uuid from "uuid";

import * as Config from "../../config";
import Button from "../../shared/components/Button";
import LoadingIndicatorModal from "../../shared/components/LoadingIndicatorModal";
import TextInputField from "../../shared/components/TextInputField";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import { UPLOAD_IMAGE_ERR_SIZE_TO_LARGE, uploadImageAsync } from "../../shared/uploadImage";
import authStore from "../../state/authStore";
import taskStore, { IMetric } from "../../state/taskStore";
import CreateMetricModal from "./modals/CreateMetricModal";
import MetricInfoModal from "./modals/MetricInfoModal";
import UpdateMetricModal from "./modals/UpdateMetricModal";

// tslint:disable-next-line:no-var-requires
const PLACEHOLDER_IMAGE = require("../../../assets/placeholder.jpg");

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    buttonContainer: {
        justifyContent: "flex-end",
        backgroundColor: theme.backgroundColor,
        marginBottom: 30
    } as ViewStyle,
    imageContainer: {
        marginTop: 30,
        backgroundColor: theme.backgroundColor,
        alignItems: "center",
        marginBottom: 20
    } as ViewStyle,
    imageStyle: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        borderWidth: 2,
        borderColor: theme.borderColor
    }
});

interface IProps {
    navigation: NavigationScreenProp<any, any>;
}
interface IState {
    name: string;
    imageUid: string;
    inputNameError: string;
    inputImageError: string;
    inputGeneralError: string;
    metrics: {
        uid: string;
        name: string;
        unit: string;
    }[];
    image: any;
    isMetricInfoModalVisible: boolean;
    isCreatingTaskModalVisible: boolean;
    isCreateMetricModalVisible: boolean;
    isUpdateMetricModalVisible: boolean;
    isPreparingImageModalVisible: boolean;
    metricToBePatched: IMetric;
}
export default class CreateTask extends React.Component<IProps, IState> {

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            title: i18n.t("createTask.header")
        };
    }

    // tslint:disable:member-ordering
    tempMetricName: string = "";
    tempMetricUnit: string = "";
    constructor(props: IProps) {
        super(props);
        this.state = {
            name: "",
            imageUid: null,
            metrics: [],
            inputNameError: null,
            inputImageError: null,
            inputGeneralError: null,
            image: null,
            isMetricInfoModalVisible: false,
            isCreatingTaskModalVisible: false,
            isCreateMetricModalVisible: false,
            isUpdateMetricModalVisible: false,
            isPreparingImageModalVisible: false,
            metricToBePatched: null
        };
    }
    // tslint:enable:member-ordering

    async createTask() {
        const name = this.state.name;
        const metrics = this.state.metrics.map(metric => { return { name: metric.name, unit: metric.unit }; });
        const imageUid = this.state.imageUid;

        if (name.length < 3) {
            this.setState({
                inputNameError: i18n.t("createTask.nameToShort"),
                inputImageError: null,
                inputGeneralError: null
            });

            return;
        }

        if (this.state.inputImageError || this.state.inputGeneralError) {
            return;
        }

        this.setState({ isCreatingTaskModalVisible: true });
        await taskStore.createTask({ name, imageUid, metrics });

        if (taskStore.error !== null) {
            switch (taskStore.error) {
                default:
                    this.setState({
                        inputNameError: null,
                        inputImageError: null,
                        inputGeneralError: i18n.t("createTask.unexpectedError"),
                        isCreatingTaskModalVisible: false
                    });
            }
        } else {
            this.props.navigation.goBack();
        }
    }

    showNameError() {
        if (this.state.inputNameError) {
            return <FormValidationMessage>{this.state.inputNameError}</FormValidationMessage>;
        }

        return null;
    }

    showGeneralError() {
        if (this.state.inputGeneralError) {
            return <FormValidationMessage>{this.state.inputGeneralError}</FormValidationMessage>;
        }

        return null;
    }

    showImageError() {
        if (this.state.inputImageError) {
            return <FormValidationMessage>{this.state.inputImageError}</FormValidationMessage>;
        }

        return null;
    }

    showMetricInfoModal = () => this.setState({ isMetricInfoModalVisible: true });
    hideMetricInfoModal = () => this.setState({ isMetricInfoModalVisible: false });
    showCreateMetricModal = () => this.setState({ isCreateMetricModalVisible: true });
    hideCreateMetricModal = () => this.setState({ isCreateMetricModalVisible: false });
    hideUpdateMetricModal() { this.setState({ isUpdateMetricModalVisible: false }); }
    showUpdateMetricModal(metric: any) {
        this.setState({
            metricToBePatched: metric
        });
        this.setState({ isUpdateMetricModalVisible: true });
    }

    addMetric(uid: string, name: string, unit: string) {
        this.setState({
            metrics: this.state.metrics.concat({
                uid: uuid.v4(),
                name: name,
                unit: unit
            })
        });
        this.hideCreateMetricModal();
    }

    patchMetric(metricToBePatched: IMetric) {
        const metrics = this.state.metrics.filter(metric => metric.uid !== metricToBePatched.uid);
        metrics.push(metricToBePatched);
        this.setState({ metrics });
        this.hideUpdateMetricModal();
    }

    deleteMetric(metricToBeDeleted: any) {
        this.setState({
            metrics: this.state.metrics.filter((metric: any) => metric.uid !== metricToBeDeleted.uid)
        });
    }

    pickImage = async () => {
        const permissionResults = await Promise.all([
            await Permissions.askAsync(Permissions.CAMERA_ROLL),
            await Permissions.askAsync(Permissions.CAMERA)
        ]);
        const isPermissionGranted = permissionResults.some(permissionResult => {
            return permissionResult.status !== "granted";
        }) === true ? false : true;

        if (!isPermissionGranted) {
            this.setState({
                isPreparingImageModalVisible: false,
                inputImageError: i18n.t("createTask.noCameraPermission")
            });

            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false
        });

        try {
            if (!pickerResult.cancelled) {
                this.setState({ isPreparingImageModalVisible: true });
                const imageUid = await uploadImageAsync(pickerResult.uri);
                this.setState({
                    imageUid: imageUid,
                    image: pickerResult.uri,
                    isPreparingImageModalVisible: false,
                    inputImageError: null
                });
            }
        } catch (e) {
            if (e.message === UPLOAD_IMAGE_ERR_SIZE_TO_LARGE) {
                this.setState({
                    inputNameError: null,
                    inputImageError: i18n.t("createTask.imageToLarge"),
                    inputGeneralError: null,
                    isPreparingImageModalVisible: false
                });
            } else {
                this.setState({
                    inputNameError: null,
                    inputImageError: i18n.t("createTask.unknownUploadError"),
                    inputGeneralError: null,
                    isPreparingImageModalVisible: false
                });
            }
            this.setState({ isPreparingImageModalVisible: false });
        }
    }

    uploadImageAsync = async (uri: string) => {
        const apiUrl = `${Config.BASE_URL}/api/v1/images`;
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        const formData = new FormData();
        formData.append("photo", {
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`
        } as any);

        const options: any = {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${authStore.credentials.accessToken}`
            }
        };

        return fetch(apiUrl, options);
    }

    // tslint:disable-next-line:max-func-body-length
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={styles.mainContainer}
                    keyboardDismissMode="none"
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.imageContainer}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={this.pickImage}
                        >
                            <Image
                                source={this.state.image ? { uri: this.state.image } : PLACEHOLDER_IMAGE}
                                style={styles.imageStyle}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                    {this.showImageError()}

                    <TextInputField
                        placeholder={i18n.t("createTask.namePlaceholder")}
                        onChangeText={(value) => this.setState({ name: value })}
                    />
                    {this.showNameError()}

                    <View
                        style={{
                            marginTop: 15,
                            marginLeft: 20,
                            marginRight: 20
                        }}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: theme.text.primaryColor, fontSize: 20 }}>{i18n.t("createTask.metrics")}</Text>
                            {!this.state.metrics || this.state.metrics.length === 0 && <Icon
                                name="info"
                                color={theme.text.linkColor}
                                underlayColor="transparent"
                                iconStyle={{ marginLeft: 10, marginRight: 2, marginTop: 3 }}
                                onPress={() => { this.showMetricInfoModal(); }}
                            />}
                            <Icon
                                name="add"
                                color={theme.button.backgroundColor}
                                underlayColor="transparent"
                                iconStyle={{ marginLeft: 10, marginRight: 10, marginTop: 3 }}
                                onPress={() => { this.showCreateMetricModal(); }}
                            />
                        </View>
                        {
                            !this.state.metrics || this.state.metrics.length === 0 && <Text
                                style={{
                                    color: theme.text.primaryColor,
                                    fontSize: 20,
                                    paddingTop: 15
                                }}
                            >
                                {i18n.t("createTask.noMetricsYet")}
                            </Text>
                        }
                        {this.state.metrics.map(metric =>
                            <View key={`${metric.name}${metric.unit}`} style={{ flexDirection: "row", paddingTop: 15 }}>
                                <Text style={{ color: theme.text.primaryColor, fontSize: 20, paddingRight: 5 }}>{"\u2022"}</Text>
                                <Text style={{ color: theme.text.primaryColor, fontSize: 20, paddingRight: 5 }}>
                                    {metric.name} ({metric.unit})
                            </Text>
                                <View style={{ flexDirection: "row", paddingTop: 15, position: "absolute", right: 10 }}>
                                    <Icon
                                        name="create"
                                        color={theme.button.backgroundColor}
                                        underlayColor="transparent"
                                        iconStyle={{ marginLeft: 10, marginRight: 10 }}
                                        onPress={() => { this.showUpdateMetricModal(metric); }}
                                    />
                                    <Icon
                                        name="delete"
                                        color={theme.button.backgroundColor}
                                        underlayColor="transparent"
                                        onPress={() => { this.deleteMetric(metric); }}
                                    />
                                </View>
                            </View>
                        )}
                    </View>

                    <MetricInfoModal
                        isVisible={this.state.isMetricInfoModalVisible}
                        hide={() => this.hideMetricInfoModal()}
                    />
                    <CreateMetricModal
                        isVisible={this.state.isCreateMetricModalVisible}
                        hide={() => this.hideCreateMetricModal()}
                        addMetric={(uid: string, name: string, unit: string) => this.addMetric(uid, name, unit)}
                    />
                    {this.state.metricToBePatched && <UpdateMetricModal
                        isVisible={this.state.isUpdateMetricModalVisible}
                        hide={() => this.hideUpdateMetricModal()}
                        patchMetric={(metric: IMetric) => this.patchMetric(metric)}
                        metric={this.state.metricToBePatched}
                    />}
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <Button
                        title={i18n.t("createTask.createTaskButton")}
                        onPress={() => { this.createTask(); }}
                    />
                </View>
                {this.showGeneralError()}

                <LoadingIndicatorModal
                    isVisible={this.state.isCreatingTaskModalVisible}
                    loadingText={i18n.t("createTask.loadingCreateTask")}
                />
                <LoadingIndicatorModal
                    isVisible={this.state.isPreparingImageModalVisible}
                    loadingText={i18n.t("createTask.loadingPrepareImage")}
                />
            </View>
        );
    }

}
