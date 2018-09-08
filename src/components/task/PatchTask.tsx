import { Ionicons } from "@expo/vector-icons";
import { ImagePicker, Permissions } from "expo";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { FormInput, FormValidationMessage, Icon } from "react-native-elements";
import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import Button from "../../shared/components/Button";
import LoadingIndicatorModal from "../../shared/components/LoadingIndicatorModal";
import ModalButton from "../../shared/components/ModalButton";
import TextInputField from "../../shared/components/TextInputField";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import { uploadImageAsync } from "../../shared/uploadImage";
import taskStore, { IFullTask, IMetric } from "../../state/taskStore";
import DeleteTaskModal from "../task/modals/DeleteTaskModal";
import CreateMetricModal from "./modals/CreateMetricModal";
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
        height: 150
    }
});

interface IState {
    name: string;
    imageUid: string;
    inputNameError: string;
    inputGeneralError: string;
    metrics: {
        uid: string;
        name: string;
        unit: string;
    }[];
    metricsToBePatched: {
        uid?: string;
        name: string;
        unit: string;
        action: string;
    }[];
    image: any;
    isDeleteModalVisible: boolean;
    isCreateMetricModalVisible: boolean;
    isUpdateMetricModalVisible: boolean;
    isPatchingTaskModalVisible: boolean;
    isPreparingImageModalVisible: boolean;
    metricToBePatched: IMetric;
}

interface IProps {
    navigation: NavigationScreenProp<{
        params: {
            task: IFullTask;
        };
    } & {
        [prop: string]: any;
    }, any>;
}

export default class PatchTask extends React.Component<IProps, IState> {

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        const taskName = navigation.getParam("taskName");

        return {
            title: i18n.t("patchTask.header", { taskName }),
            headerRight: (
                <ModalButton
                    navigation={navigation}
                    getParameter="showDeleteModal"
                    ioniconName="md-trash"
                    ioniconColor="white"
                    marginRight={15}
                />
            )
        };
    }

    // tslint:disable-next-line:variable-name
    _showDeleteModal = () => {
        this.setState({ isDeleteModalVisible: true });
    }

    // tslint:disable-next-line:member-ordering
    constructor(props: IProps) {
        super(props);

        const task = this.props.navigation.state.params.task;

        this.state = {
            name: task.name,
            imageUid: task.image.uid,
            metrics: task.metrics,
            metricsToBePatched: [],
            inputNameError: null,
            inputGeneralError: null,
            image: task.image.thumbnail,
            isDeleteModalVisible: false,
            isCreateMetricModalVisible: false,
            isUpdateMetricModalVisible: false,
            isPatchingTaskModalVisible: false,
            isPreparingImageModalVisible: false,
            metricToBePatched: null
        };
    }

    componentDidMount() {
        const task = this.props.navigation.state.params.task;

        this.props.navigation.setParams({
            taskName: task.name.length > 15 ? `${task.name.slice(0, 15)}...` : `${task.name}`,
            showDeleteModal: this._showDeleteModal
        });
    }

    async updateTask() {
        const name = this.state.name;
        const imageUid = this.state.imageUid;
        const metrics = this.state.metricsToBePatched;

        if (name.length < 3) {
            this.setState({
                inputNameError: i18n.t("patchTask.nameToShort"),
                inputGeneralError: null
            });

            return;
        }

        this.setState({ isPatchingTaskModalVisible: true });
        await taskStore.patchTask(this.props.navigation.state.params.task.uid, { name, imageUid, metrics });

        if (taskStore.error !== null) {
            switch (taskStore.error) {
                default:
                    this.setState({
                        inputNameError: null,
                        inputGeneralError: i18n.t("patchTask.unexpectedError"),
                        isPatchingTaskModalVisible: false
                    });
            }
        } else {
            this.setState({
                isPatchingTaskModalVisible: false
            });
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

    addMetric(uid: string, name: string, unit: string) {
        this.setState({
            metrics: this.state.metrics.concat({
                uid,
                name,
                unit
            })
        });
        this.setState({
            metricsToBePatched: this.state.metricsToBePatched.concat({
                name,
                unit,
                action: "create"
            })
        });
        this.hideCreateMetricModal();
    }

    patchMetric(metricToBePatched: IMetric) {
        // update metric injected via props
        const metric = this.props.navigation.state.params.task.metrics.filter(e => e.uid === metricToBePatched.uid)[0];
        if (metric) {
            metric.name = metricToBePatched.name;
            metric.unit = metricToBePatched.unit;
            this.setState({
                metricsToBePatched: this.state.metricsToBePatched.concat({
                    uid: metric.uid,
                    name: metric.name,
                    unit: metric.unit,
                    action: "patch"
                })
            });
        } else {
            // update metric just added via addMetric()
            const metrics = this.state.metrics.filter(e => e.uid !== metricToBePatched.uid);
            metrics.push(metricToBePatched);
            this.setState({ metrics });
        }
        this.hideUpdateMetricModal();
    }

    deleteMetric(metricToBeDeleted: any) {
        this.setState({
            metrics: this.state.metrics.filter((metric: any) => metric.uid !== metricToBeDeleted.uid)
        });
        this.setState({
            metricsToBePatched: this.state.metricsToBePatched.concat({
                uid: metricToBeDeleted.uid,
                name: metricToBeDeleted.name,
                unit: metricToBeDeleted.unit,
                action: "delete"
            })
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
            // tslint:disable-next-line:no-console
            console.log("Permission not granted, aborting image picker");
            this.setState({
                isPreparingImageModalVisible: false,
                inputGeneralError: "Permission not granted to pick image."
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
                    isPreparingImageModalVisible: false
                });
            }
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log("Error picking image: ", e);
            this.setState({ isPreparingImageModalVisible: false });
        }
    }

    hideDeleteModal() { this.setState({ isDeleteModalVisible: false }); }
    showDeleteModal() { this.setState({ isDeleteModalVisible: true }); }
    hideCreateMetricModal = () => this.setState({ isCreateMetricModalVisible: false });
    showCreateMetricModal = () => this.setState({ isCreateMetricModalVisible: true });
    hideUpdateMetricModal() { this.setState({ isUpdateMetricModalVisible: false }); }
    showUpdateMetricModal(metric: any) {
        this.setState({
            metricToBePatched: metric
        });
        this.setState({ isUpdateMetricModalVisible: true });
    }

    async deleteTask() {
        await taskStore.deleteTask(this.props.navigation.state.params.task.uid);
        this.props.navigation.goBack();
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
                    <DeleteTaskModal
                        task={this.props.navigation.state.params.task}
                        visible={this.state.isDeleteModalVisible}
                        hideVisibility={() => this.hideDeleteModal()}
                        deleteTask={() => this.deleteTask()}
                    />
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
                                borderWidth={1}
                                borderColor={theme.borderColor}
                            />
                        </TouchableOpacity>
                    </View>
                    <TextInputField
                        placeholder={this.state.name}
                        defaultValue={this.state.name}
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
                            <Text style={{ color: theme.text.primaryColor, fontSize: 20 }}>{i18n.t("patchTask.metrics")}</Text>
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
                                    fontSize: 20
                                }}
                            >
                                {i18n.t("patchTask.noMetricsYet")}
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
                        title={i18n.t("patchTask.updateTaskButton")}
                        onPress={() => { this.updateTask(); }}
                    />
                </View>
                {this.showGeneralError()}

                <LoadingIndicatorModal
                    isVisible={this.state.isPatchingTaskModalVisible}
                    loadingText={i18n.t("patchTask.loadingUpdatingTask")}
                />
                <LoadingIndicatorModal
                    isVisible={this.state.isPreparingImageModalVisible}
                    loadingText={i18n.t("patchTask.loadingPrepareImage")}
                />
            </View>
        );
    }

}
