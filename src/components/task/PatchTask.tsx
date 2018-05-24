import React from "react";
import { StyleSheet, View, ViewStyle, Text, Image, TouchableOpacity } from "react-native";
import { Header, FormInput, FormValidationMessage, Button, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";
import { ImagePicker } from "expo";

import * as Config from "../../config";
import authStore from "../../state/authStore";
import taskStore, { IMetric } from "../../state/taskStore";
import { IFullTask } from "../../state/taskStore";
import DeleteTask from "../task/DeleteTask";
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
        height: 90,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    formContainer: {
        flex: 1,
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
    metricsToBePatched: Array<{
        uid?: string;
        name: string;
        unit: string;
        action: string;
    }>;
    image: any;
    isDeleteModalVisible: boolean;
    isCreateMetricModalVisible: boolean;
    isUpdateMetricModalVisible: boolean;
    isPatchingTaskModalVisible: boolean;
    isPreparingImageModalVisible: boolean;
    metricToBePatched: IMetric;
}

interface Props {
    task: IFullTask;
}

export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.task.name,
            imageUid: this.props.task.image.uid,
            metrics: this.props.task.metrics,
            metricsToBePatched: [],
            inputNameError: null,
            inputGeneralError: null,
            image: this.props.task.image.thumbnail,
            isDeleteModalVisible: false,
            isCreateMetricModalVisible: false,
            isUpdateMetricModalVisible: false,
            isPatchingTaskModalVisible: false,
            isPreparingImageModalVisible: false,
            metricToBePatched: null
        };
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
        await taskStore.patchTask(this.props.task.uid, { name, imageUid, metrics });

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
        let metric = this.props.task.metrics.filter((metric: any) => metric.uid === metricToBePatched.uid)[0];
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
            const metrics = this.state.metrics.filter(metric => metric.uid !== metricToBePatched.uid);
            metrics.push(metricToBePatched);
            this.setState({ metrics });
        }
        this.hideUpdateMetricModal();
    }

    deleteMetric(metricToBeDeleted) {
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

    _pickImage = async () => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
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
            console.log("Error picking image: ", e);
            this.setState({ isPreparingImageModalVisible: false });
        }
    }

    hideDeleteModal() { this.setState({ isDeleteModalVisible: false }); }
    showDeleteModal() { this.setState({ isDeleteModalVisible: true }); }
    hideCreateMetricModal = () => this.setState({ isCreateMetricModalVisible: false });
    showCreateMetricModal = () => this.setState({ isCreateMetricModalVisible: true });
    hideUpdateMetricModal() { this.setState({ isUpdateMetricModalVisible: false }); }
    showUpdateMetricModal(metric) {
        this.setState({
            metricToBePatched: metric
        });
        this.setState({ isUpdateMetricModalVisible: true });
    }

    render() {
        const taskName = this.props.task.name.length > 15 ? `${this.props.task.name.slice(0, 15)}...` : `${this.props.task.name}`;

        return (
            <View style={styles.mainContainer}>
                <DeleteTask
                    task={this.props.task}
                    visible={this.state.isDeleteModalVisible}
                    hideVisibility={() => this.hideDeleteModal()}
                />
                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={theme.backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        } as any}
                        centerComponent={{ text: i18n.t("patchTask.header", { taskName }), style: { color: "#fff", fontSize: 20, fontWeight: "bold" } } as any}
                        rightComponent={{
                            icon: "delete",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { this.showDeleteModal(); }
                        } as any}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>
                <View
                    style={styles.imageContainer}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={this._pickImage}
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
                    defaultValue={this.state.name}
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
                            iconStyle={{ marginLeft: 10, marginRight: 10, marginTop: 3 }}
                            onPress={() => { this.showCreateMetricModal(); }}
                        />
                    </View>
                    {
                        !this.state.metrics || this.state.metrics.length === 0 && <Text style={{
                            color: theme.inputTextColor,
                            fontSize: 20,
                        }}>
                            {i18n.t("patchTask.noMetricsYet")}
                        </Text>
                    }
                    {this.state.metrics.map(metric =>
                        <View key={`${metric.name}${metric.unit}`} style={{ flexDirection: "row", paddingTop: 15 }}>
                            <Text style={{ color: theme.textColor, fontSize: 20, paddingRight: 5 }}>{"\u2022"}</Text>
                            <Text style={{ color: theme.inputTextColor, fontSize: 20, paddingRight: 5 }}>{metric.name} ({metric.unit})</Text>
                            <View style={{ flexDirection: "row", paddingTop: 15, position: "absolute", right: 10 }}>
                                <Icon
                                    name="create"
                                    color="#fff"
                                    underlayColor="transparent"
                                    iconStyle={{ marginLeft: 10, marginRight: 10 }}
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
