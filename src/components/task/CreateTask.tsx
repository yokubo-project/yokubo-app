import React from "react";
import { StyleSheet, View, ViewStyle, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Header, FormInput, FormValidationMessage, Button, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";
import { ImagePicker, FileSystem } from "expo";
import * as uuid from "uuid";

import * as Config from "../../config";
import authStore from "../../state/authStore";
import taskStore, { IMetric } from "../../state/taskStore";
import { uploadImageAsync } from "../../shared/uploadImage";
import { theme } from "../../shared/styles";
import LoadingIndicatorModal from "../../shared/modals/LoadingIndicatorModal";
import i18n from "../../shared/i18n";
import CreateMetricModal from "./modals/CreateMetricModal";
import UpdateMetricModal from "./modals/UpdateMetricModal";

const PLACEHOLDER_IMAGE = require("../../../assets/placeholder.jpg");

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        alignItems: "stretch",
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    formContainer: {
        flex: 2,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    imageContainer: {
        backgroundColor: theme.backgroundColor,
        alignItems: "center",
        marginBottom: 20
    } as ViewStyle,
    inputStyle: {
        color: theme.inputTextColor,
        fontSize: 20,
        marginRight: 100,
    },
    modalInputStyle: {
        color: theme.inputTextColor,
        fontSize: 20,
        marginBottom: 10
    },
    modalContent: {
        backgroundColor: theme.backgroundColor,
        justifyContent: "center",
        alignItems: "stretch",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    imageStyle: {
        width: 150,
        height: 150,
    }
});

interface State {
    name: string;
    imageUid: string;
    inputNameError: string;
    inputGeneralError: string;
    metrics: Array<{
        uid: string;
        name: string;
        unit: string;
    }>;
    image: any;
    isCreatingTaskModalVisible: boolean;
    isCreateMetricModalVisible: boolean;
    isUpdateMetricModalVisible: boolean;
    isPreparingImageModalVisible: boolean;
    metricToBePatched: IMetric;
}
export default class Component extends React.Component<null, State> {

    tempMetricName: string = "";
    tempMetricUnit: string = "";

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            imageUid: null,
            metrics: [],
            inputNameError: null,
            inputGeneralError: null,
            image: null,
            isCreatingTaskModalVisible: false,
            isCreateMetricModalVisible: false,
            isUpdateMetricModalVisible: false,
            isPreparingImageModalVisible: false,
            metricToBePatched: null
        };
    }

    async createTask() {
        const name = this.state.name;
        const metrics = this.state.metrics.map(metric => { return { name: metric.name, unit: metric.unit }; });
        const imageUid = this.state.imageUid;

        if (name.length < 3) {
            this.setState({
                inputNameError: i18n.t("createTask.nameToShort"),
                inputGeneralError: null
            });
            return;
        }

        this.setState({ isCreatingTaskModalVisible: true });
        await taskStore.createTask({ name, imageUid, metrics });

        if (taskStore.error !== null) {
            switch (taskStore.error) {
                default:
                    this.setState({
                        inputNameError: null,
                        inputGeneralError: i18n.t("createTask.unexpectedError"),
                        isCreatingTaskModalVisible: false
                    });
            }
        } else {
            Actions.pop();
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

    showCreateMetricModal = () => this.setState({ isCreateMetricModalVisible: true });
    hideCreateMetricModal = () => this.setState({ isCreateMetricModalVisible: false });
    hideUpdateMetricModal() { this.setState({ isUpdateMetricModalVisible: false }); }
    showUpdateMetricModal(metric) {
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
                unit: unit,
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

    deleteMetric(metricToBeDeleted) {
        this.setState({
            metrics: this.state.metrics.filter((metric: any) => metric.uid !== metricToBeDeleted.uid)
        });
    }

    pickImage = async () => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        try {
            if (!pickerResult.cancelled) {
                this.setState({ isPreparingImageModalVisible: true });
                const imageUid = await uploadImageAsync(pickerResult.uri);
                this.setState({
                    image: pickerResult.uri,
                    imageUid: imageUid,
                    isPreparingImageModalVisible: false
                });
            }
        } catch (e) {
            console.log("Error picking image: ", e);
            this.setState({ isPreparingImageModalVisible: false });
        }
    }

    uploadImageAsync = async (uri) => {
        let apiUrl = `${Config.BASE_URL}/api/v1/images`;
        let uriParts = uri.split(".");
        let fileType = uriParts[uriParts.length - 1];

        let formData = new FormData();
        formData.append("photo", {
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        } as any);

        let options: any = {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${authStore.credentials.accessToken}`,
            },
        };

        return fetch(apiUrl, options);
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={theme.backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: "New Task", style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>
                <View
                    style={styles.imageContainer}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={this.pickImage}
                    >
                        <Image
                            source={this.state.image ? { uri: this.state.image } : PLACEHOLDER_IMAGE}
                            style={styles.imageStyle}
                            resizeMode="cover"
                            // @ts-ignore
                            borderRadius={100}
                        />
                    </TouchableOpacity>
                </View>
                <FormInput
                    inputStyle={styles.inputStyle}
                    placeholder={i18n.t("createTask.namePlaceholder")}
                    onChangeText={(value) => this.setState({ name: value })}
                    underlineColorAndroid={theme.textColor}
                    selectionColor={theme.inputTextColor} // cursor color
                />
                {this.showNameError()}

                <View style={{
                    marginTop: 15,
                    marginLeft: 15
                }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: theme.inputTextColor, fontSize: 20 }}>{i18n.t("patchTask.metrics")}</Text>
                        <Icon
                            name="add"
                            color="#fff"
                            underlayColor="transparent"
                            style={{ marginLeft: 10, marginRight: 10, marginTop: 3 }}
                            onPress={() => { this.showCreateMetricModal(); }}
                        />
                    </View>
                    {
                        !this.state.metrics || this.state.metrics.length === 0 && <Text style={{
                            color: theme.inputTextColor,
                            fontSize: 20,
                        }}>
                            {i18n.t("createTask.noMetricsYet")}
                        </Text>
                    }
                    {this.state.metrics.map(metric =>
                        <View key={metric.name} style={{ flexDirection: "row", paddingTop: 15 }}>
                            <Text style={{ color: theme.textColor, fontSize: 20, paddingRight: 5 }}>{"\u2022"}</Text>
                            <Text style={{ color: theme.inputTextColor, fontSize: 20, paddingRight: 5 }}>{metric.name} ({metric.unit})</Text>
                            <View style={{ flexDirection: "row", paddingTop: 15, position: "absolute", right: 10 }}>
                                <Icon
                                    name="create"
                                    color="#fff"
                                    underlayColor="transparent"
                                    style={{ marginLeft: 10, marginRight: 10 }}
                                    onPress={() => { this.showUpdateMetricModal(metric); }}
                                />
                                <Icon
                                    name="delete"
                                    color="#fff"
                                    underlayColor="transparent"
                                    onPress={() => { this.deleteMetric(metric); }}
                                />
                            </View>
                        </View>
                    )}
                </View>

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

                <View style={styles.formContainer}>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
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
