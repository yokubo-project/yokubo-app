import React from "react";
import { StyleSheet, View, ViewStyle, Text, Image, TouchableOpacity } from "react-native";
import { Header, FormInput, FormValidationMessage, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";
import { ImagePicker } from "expo";

import authStore from "../../state/authStore";
import taskStore from "../../state/taskStore";
import { IFullTask } from "../../state/taskStore";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

const PLACEHOLDER_IMAGE = require("../../../assets/placeholder.jpg");

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

interface Props {
    task: IFullTask;
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: backgroundColor,
        alignItems: "stretch",
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor
    } as ViewStyle,
    formContainer: {
        flex: 2,
        justifyContent: "space-around",
        backgroundColor
    } as ViewStyle,
    imageContainer: {
        backgroundColor: backgroundColor,
        alignItems: "center",
        marginBottom: 20
    } as ViewStyle,
    inputStyle: {
        color: inputTextColor,
        fontSize: 20,
        marginRight: 100,
    },
    modalInputStyle: {
        color: inputTextColor,
        fontSize: 20,
        marginBottom: 10
    },
    modalContent: {
        backgroundColor,
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

export default class Component extends React.Component<Props, State> {

    tempMetricName: string = "";
    tempMetricUnit: string = "";

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.task.name,
            imageUid: this.props.task.image.uid,
            metrics: this.props.task.metrics,
            nameError: null,
            imageUidError: null,
            isInputFieldsModalVisible: false,
            image: this.props.task.image.file
        };
    }

    async updateTask() {
        taskStore.patchTask(this.props.task.uid, {
            name: this.state.name,
            imageUid: this.state.imageUid,
            // metrics: this.state.metrics
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
            this.setState({ image: pickerResult.uri });

            if (!pickerResult.cancelled) {
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

        const headerText = this.props.task.name.length > 15 ? `Update ${this.props.task.name.slice(0, 15)}...` : `Update ${this.props.task.name}`;

        return (
            <View style={styles.mainContainer}>

                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: headerText, style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
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
                    onChangeText={(e) => this.parseName(e)}
                    underlineColorAndroid={textColor}
                    selectionColor={inputTextColor} // cursor color
                />
                {this.showNameError()}

                <View style={{
                    marginTop: 15,
                    marginLeft: 15
                }}>
                    <Text style={{ color: inputTextColor, fontSize: 20 }}>Metrics:</Text>
                    {
                        !this.state.metrics || this.state.metrics.length === 0 && <Text style={{
                            color: inputTextColor,
                            fontSize: 20,
                        }}>
                            You haven't added any metrics yet.
                        </Text>
                    }
                    {this.state.metrics.map(field =>
                        <View key={field.name} style={{ flexDirection: "row", paddingTop: 15 }}>
                            <Text style={{ color: textColor, fontSize: 20, paddingRight: 5 }}>{"\u2022"}</Text>
                            <Text style={{ color: inputTextColor, fontSize: 20, paddingRight: 5 }}>{field.name}: {field.unit}</Text>
                        </View>
                    )}
                    <Text
                        style={{ color: textColor, fontSize: 20, textAlign: "center", paddingTop: 10 }}
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
                            onChangeText={(value) => this.parseNewMetricName(value)}
                            underlineColorAndroid={textColor}
                            selectionColor={inputTextColor} // cursor color
                        />
                        <FormInput
                            inputStyle={styles.modalInputStyle}
                            placeholder="Unit"
                            onChangeText={(value) => this.parseNewMetricUnit(value)}
                            underlineColorAndroid={textColor}
                            selectionColor={inputTextColor} // cursor color
                        />
                        <Button
                            raised
                            buttonStyle={{ backgroundColor, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={"ADD METRIC"}
                            onPress={() => { this.addMetric(); }}
                        />
                    </View>
                </Modal>

                <View style={styles.formContainer}>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"UPDATE TASK"}
                        onPress={() => { this.updateTask(); }}
                    />
                </View>

            </View>
        );
    }

}
