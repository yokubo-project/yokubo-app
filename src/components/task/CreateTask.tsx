import React from "react";
import { StyleSheet, View, ViewStyle, Text, Image } from "react-native";
import { Header, FormInput, FormValidationMessage, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";
import { ImagePicker } from "expo";

import authStore from "../../state/authStore";
import taskStore from "../../state/taskStore";

const primaryColor1 = "green";

interface State {
    name: string;
    imageUid: string;
    nameError: string;
    imageUidError: string;
    metrics: Array<{
        name: string;
        unit: string;
    }>;
    isInputFieldsModalVisible: boolean;
    image: any;
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    formContainer: {
        flex: 2,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    inputStyle: {
        marginRight: 100,
        color: "black",
        fontSize: 20
    },
    modalInputStyle: {
        color: "black",
        fontSize: 20
    },
    modalContent: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "stretch",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    modalButtonStyle: {
        // flex: 1
    }
});

export default class Component extends React.Component<null, State> {

    tempMetricName: string = "";
    tempMetricUnit: string = "";

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            imageUid: "",
            metrics: [],
            nameError: null,
            imageUidError: null,
            isInputFieldsModalVisible: false,
            image: null
        };
    }

    async createTask() {
        taskStore.createTask({
            name: this.state.name,
            imageUid: this.state.imageUid,
            metrics: this.state.metrics
        });
        Actions.pop();
    }

    parseName(value: any) {
        this.setState({
            name: value
        });
    }

    parseImageUid(value: any) {
        this.setState({
            imageUid: value
        });
    }

    showNameError() {
        if (this.state.nameError) {
            return <FormValidationMessage>{this.state.nameError}</FormValidationMessage>;
        }
        return null;
    }

    showimageUidError() {
        if (this.state.imageUidError) {
            return <FormValidationMessage>{this.state.imageUidError}</FormValidationMessage>;
        }
        return null;
    }

    _showInputFieldsModal = () => this.setState({ isInputFieldsModalVisible: true });

    _hideInputFieldsModal = () => this.setState({ isInputFieldsModalVisible: false });


    parseNewMetricName(value: any) {
        this.tempMetricName = value;
    }

    parseNewMetricUnit(value: any) {
        this.tempMetricUnit = value;
    }

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

        console.log("picking image ...");
        let uploadResponse, uploadResult;

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
        });

        console.log("picker result is: ", JSON.stringify(pickerResult));

        try {
            if (!pickerResult.cancelled) {
                this.setState({ image: pickerResult.uri });
                uploadResponse = await this.uploadImageAsync(pickerResult.uri);
                uploadResult = await uploadResponse.json();
                this.parseImageUid(uploadResult[0].uid);
            }
        } catch (e) {
            console.log({ uploadResponse });
            console.log({ uploadResult });
            console.log({ e });
        }

        return uploadResult;

    }

    uploadImageAsync = async (uri) => {
        let apiUrl = "http://139.59.134.125:8080/api/v1/images";

        let uriParts = uri.split(".");
        let fileType = uriParts[uriParts.length - 1];

        let formData = new FormData();
        formData.append("photo", {
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        } as any);

        // TODO: typing
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
                        backgroundColor={primaryColor1}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: "New Task", style: { color: "#fff", fontSize: 20 } }}
                        statusBarProps={{ barStyle: "dark-content", translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <FormInput
                    inputStyle={styles.inputStyle}
                    placeholder="Enter name of task"
                    onChangeText={(e) => this.parseName(e)}
                    underlineColorAndroid={primaryColor1}
                    selectionColor="black" // cursor color
                />
                {this.showNameError()}

                <Button
                    raised
                    buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                    textStyle={{ textAlign: "center", fontSize: 18 }}
                    title={"Pick Image"}
                    onPress={this._pickImage}
                />
                {this.state.image &&
                    <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}

                <Text>Metrices: {this.state.metrics.map(field => `name: ${field.name} - unit: ${field.unit}; `)}</Text>

                <Button
                    raised
                    buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                    textStyle={{ textAlign: "center", fontSize: 18 }}
                    title={"Add Metric"}
                    onPress={this._showInputFieldsModal}
                />

                <Modal
                    isVisible={this.state.isInputFieldsModalVisible}
                    onBackdropPress={this._hideInputFieldsModal}
                    onBackButtonPress={this._hideInputFieldsModal}
                >
                    <View style={styles.modalContent}>
                        <Text>Hello, please enter your new metric</Text>
                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            placeholder="Name"
                            onChangeText={(value) => this.parseNewMetricName(value)}
                            underlineColorAndroid={primaryColor1}
                            selectionColor="black" // cursor color
                        />
                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            placeholder="Unit"
                            onChangeText={(value) => this.parseNewMetricUnit(value)}
                            underlineColorAndroid={primaryColor1}
                            selectionColor="black" // cursor color
                        />
                        <Button
                            inputStyle={styles.modalButtonStyle}
                            raised
                            buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={"Add metric"}
                            onPress={() => { this.addMetric(); }}
                        />
                    </View>
                </Modal>

                <View style={styles.formContainer}>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"CREATE"}
                        onPress={() => { this.createTask(); }}
                    />
                </View>

            </View>
        );
    }

}
