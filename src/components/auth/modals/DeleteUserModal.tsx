import React from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";
import { FormInput, Button, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import authStore from "../../../state/authStore";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

interface State {
    inputDeleteUserPwd: string;
    inputPwdError: string;
    inputGeneralError: string;
}

interface Props {
    isVisible: boolean;
    hide: () => void;
}

const styles = StyleSheet.create({
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
});

export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            inputDeleteUserPwd: "",
            inputPwdError: null,
            inputGeneralError: null
        };
    }

    async deleteUser() {
        await authStore.deleteUser(this.state.inputDeleteUserPwd);
        if (authStore.error !== null) {
            switch (authStore.error) {
                case "PasswordsDontMatch":
                    this.setState({
                        inputPwdError: "Wrong password",
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputPwdError: null,
                        inputGeneralError: "An unexpected error happened"
                    });
            }
        } else {
            this.setState({
                inputPwdError: null,
                inputGeneralError: null
            });
            this.props.hide();
            Actions.home();
        }
    }

    closeModal() {
        this.setState({
            inputPwdError: null,
            inputGeneralError: null
        });
        this.props.hide();
    }

    showPwdError() {
        if (this.state.inputPwdError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputPwdError}</FormValidationMessage>;
        }
        return null;
    }

    showGeneralError() {
        if (this.state.inputGeneralError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputGeneralError}</FormValidationMessage>;
        }
        return null;
    }

    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.closeModal()}
                onBackButtonPress={() => this.closeModal()}
            >
                <View style={styles.modalContent}>
                    <Text style={{ color: inputTextColor, fontSize: 15, textAlign: "center", marginBottom: 20 }}>Please enter your current password in order to delete your user. Note that deleting your user is irreversibly and all data associated with your account will be lost.</Text>
                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        placeholder="Current Password"
                        onChangeText={(value) => this.setState({ inputDeleteUserPwd: value })}
                        underlineColorAndroid={textColor}
                        selectionColor={inputTextColor} // cursor color
                        secureTextEntry={true}
                    />
                    {this.showPwdError()}

                    <Button
                        raised
                        buttonStyle={{ backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"Delete User"}
                        onPress={() => { this.deleteUser(); }}
                    />
                    {this.showGeneralError()}

                </View>
            </Modal>
        );
    }

}
