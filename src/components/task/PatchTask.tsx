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
                inputNameError: "Name must be at least 3 characters long",
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
                        inputGeneralError: "An unexpected error happened",
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
        this.setState({ isPreparingImageModalVisible: true });

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        try {
            if (!pickerResult.cancelled) {
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
        const headerText = this.props.task.name.length > 15 ? `Update ${this.props.task.name.slice(0, 15)}...` : `Update ${this.props.task.name}`;

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
                        centerComponent={{ text: headerText, style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
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
                    <Text style={{ color: theme.inputTextColor, fontSize: 20 }}>Metrics:</Text>
                    {
                        !this.state.metrics || this.state.metrics.length === 0 && <Text style={{
                            color: theme.inputTextColor,
                            fontSize: 20,
                        }}>
                            You haven't added any metrics yet.
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
                        Add metric
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
                            placeholder="Name"
                            onChangeText={(value) => this.tempMetricName = value}
                            underlineColorAndroid={theme.textColor}
                            selectionColor={theme.inputTextColor} // cursor color
                        />
                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            placeholder="Unit"
                            onChangeText={(value) => this.tempMetricUnit = value}
                            underlineColorAndroid={theme.textColor}
                            selectionColor={theme.inputTextColor} // cursor color
                        />
                        <Button
                            raised
                            buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={"ADD METRIC"}
                            onPress={() => { this.addMetric(); }}
                        />
                    </View>
                </Modal>
                <View style={styles.formContainer}>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"UPDATE TASK"}
                        onPress={() => { this.updateTask(); }}
                    />
                </View>
                {this.showGeneralError()}

                <LoadingIndicatorModal
                    isVisible={this.state.isPatchingTaskModalVisible}
                    loadingText={"Updating Task"}
                />
                <LoadingIndicatorModal
                    isVisible={this.state.isPreparingImageModalVisible}
                    loadingText={"Preparing Image"}
                />
            </View>
        );
    }

}
