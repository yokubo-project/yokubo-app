import React from "react";
import { StyleSheet, View, ViewStyle, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Header, FormInput, FormValidationMessage, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";
import { ImagePicker, FileSystem } from "expo";

import * as Config from "../../config";
import authStore from "../../state/authStore";
import taskStore from "../../state/taskStore";
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
    isCreatingTaskModalVisible: boolean;
    isPreparingImageModalVisible: boolean;
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
            isInputFieldsModalVisible: false,
            image: null,
            isCreatingTaskModalVisible: false,
            isPreparingImageModalVisible: false
        };
    }

    async createTask() {
        const name = this.state.name;
        const metrics = this.state.metrics;
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
                    <Text style={{ color: theme.inputTextColor, fontSize: 20 }}>{i18n.t("createTask.metrics")}</Text>
                    {
                        !this.state.metrics || this.state.metrics.length === 0 && <Text style={{
                            color: theme.inputTextColor,
                            fontSize: 20,
                        }}>
                            {i18n.t("createTask.noMetricsYet")}
                        </Text>
                    }
                    {this.state.metrics.map(field =>
                        <View key={field.name} style={{ flexDirection: "row", paddingTop: 15 }}>
                            <Text style={{ color: theme.textColor, fontSize: 20, paddingRight: 5 }}>{"\u2022"}</Text>
                            <Text style={{ color: theme.inputTextColor, fontSize: 20, paddingRight: 5 }}>{field.name} ({field.unit})</Text>
                        </View>
                    )}
                    <Text
                        style={{ color: theme.textColor, fontSize: 20, textAlign: "center", paddingTop: 10 }}
                        onPress={this._showInputFieldsModal}
                    >
                        {i18n.t("createTask.addMetric")}
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
                            placeholder={i18n.t("createTask.metricNamePlaceholder")}
                            onChangeText={(value) => this.tempMetricName = value}
                            underlineColorAndroid={theme.textColor}
                            selectionColor={theme.inputTextColor} // cursor color
                        />
                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            placeholder={i18n.t("createTask.metricUnitPlaceholder")}
                            onChangeText={(value) => this.tempMetricUnit = value}
                            underlineColorAndroid={theme.textColor}
                            selectionColor={theme.inputTextColor} // cursor color
                        />
                        <Button
                            raised
                            buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={i18n.t("createTask.addMetricButton")}
                            onPress={() => { this.addMetric(); }}
                        />
                    </View>
                </Modal>
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
