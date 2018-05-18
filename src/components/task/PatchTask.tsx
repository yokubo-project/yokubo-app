import React from "react";
import { StyleSheet, View, ViewStyle, Text, Image, TouchableOpacity } from "react-native";
import { Header, FormInput, FormValidationMessage, Button, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";
import { ImagePicker } from "expo";

import * as Config from "../../config";
import authStore from "../../state/authStore";
import taskStore from "../../state/taskStore";
import { IFullTask } from "../../state/taskStore";
import DeleteTask from "../task/DeleteTask";
import { uploadImageAsync } from "../../shared/uploadImage";
import { theme } from "../../shared/styles";
import LoadingIndicatorModal from "../../shared/modals/LoadingIndicatorModal";
import i18n from "../../shared/i18n";

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
        name: string;
        unit: string;
    }>;
    isInputFieldsModalVisible: boolean;
    image: any;
    isDeleteModalVisible: boolean;
    isPatchingTaskModalVisible: boolean;
    isPreparingImageModalVisible: boolean;
}

interface Props {
    task: IFullTask;
}

export default class Component extends React.Component<Props, State> {

    tempMetricName: string = "";
    tempMetricUnit: string = "";

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.task.name,
            imageUid: this.props.task.image.uid,
            metrics: this.props.task.metrics,
            inputNameError: null,
            inputGeneralError: null,
            isInputFieldsModalVisible: false,
            image: this.props.task.image.thumbnail,
            isDeleteModalVisible: false,
            isPatchingTaskModalVisible: false,
            isPreparingImageModalVisible: false
        };
    }

    async updateTask() {
        const name = this.state.name;
        const imageUid = this.state.imageUid;
        const metrics = this.state.metrics;

        if (name.length < 3) {
            this.setState({
                inputNameError: i18n.t("patchTask.nameToShort"),
                inputGeneralError: null
            });
            return;
        }

        // TODO: Patch metrics
        this.setState({ isPatchingTaskModalVisible: true });
        await taskStore.patchTask(this.props.task.uid, { name, imageUid });

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

    _showInputFieldsModal = () => this.setState({ isInputFieldsModalVisible: true });
    _hideInputFieldsModal = () => this.setState({ isInputFieldsModalVisible: false });

    addMetric() {
        this.setState({
            metrics: this.state.metrics.concat({
                name: this.tempMetricName,
                unit: this.tempMetricUnit,
            })
        });
        this._hideInputFieldsModal();
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

    hideVisibility() {
        this.setState({
            isDeleteModalVisible: false
        });
    }

    showVisibility() {
        this.setState({
            isDeleteModalVisible: true
        });
    }

    render() {
        const taskName = this.props.task.name.length > 15 ? `${this.props.task.name.slice(0, 15)}...` : `${this.props.task.name}`;

        return (
            <View style={styles.mainContainer}>
                <DeleteTask
                    task={this.props.task}
                    visible={this.state.isDeleteModalVisible}
                    hideVisibility={() => this.hideVisibility()}
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
                        }}
                        centerComponent={{ text: i18n.t("patchTask.header", { taskName }), style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        rightComponent={{
                            icon: "delete",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { this.showVisibility(); }
                        }}
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
                    <Text style={{ color: theme.inputTextColor, fontSize: 20 }}>{i18n.t("patchTask.metrics")}</Text>
                    {
                        !this.state.metrics || this.state.metrics.length === 0 && <Text style={{
                            color: theme.inputTextColor,
                            fontSize: 20,
                        }}>
                            {i18n.t("patchTask.noMetricsYet")}
                        </Text>
                    }
                    {this.state.metrics.map(field =>
                        <View key={field.name} style={{ flexDirection: "row", paddingTop: 15 }}>
                            <Text style={{ color: theme.textColor, fontSize: 20, paddingRight: 5 }}>{"\u2022"}</Text>
                            <Text style={{ color: theme.inputTextColor, fontSize: 20, paddingRight: 5 }}>{field.name}: {field.unit}</Text>
                        </View>
                    )}
                    <Text
                        style={{ color: theme.textColor, fontSize: 20, textAlign: "center", paddingTop: 10 }}
                        onPress={this._showInputFieldsModal}
                    >
                        {i18n.t("patchTask.addMetric")}
                    </Text>
                </View>
                <Modal
                    isVisible={this.state.isInputFieldsModalVisible}
                    onBackdropPress={this._hideInputFieldsModal}
                    onBackButtonPress={this._hideInputFieldsModal}
                >
                    <View style={styles.modalContent}>
                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            placeholder={i18n.t("patchTask.metricNamePlaceholder")}
                            onChangeText={(value) => this.tempMetricName = value}
                            underlineColorAndroid={theme.textColor}
                            selectionColor={theme.inputTextColor} // cursor color
                        />
                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            placeholder={i18n.t("patchTask.metricUnitPlaceholder")}
                            onChangeText={(value) => this.tempMetricUnit = value}
                            underlineColorAndroid={theme.textColor}
                            selectionColor={theme.inputTextColor} // cursor color
                        />
                        <Button
                            raised
                            buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={i18n.t("patchTask.addMetricButton")}
                            onPress={() => { this.addMetric(); }}
                        />
                    </View>
                </Modal>
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
