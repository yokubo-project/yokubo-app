import React from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";
import { FormInput, Button, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";

import authStore from "../../../state/authStore";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

interface State {
    inputCurrentPwd: string;
    inputNewPwd: string;
    inputNewPwdError: string;
    inputCurrentPwdError: string;
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
            inputCurrentPwd: "",
            inputNewPwd: "",
            inputCurrentPwdError: null,
            inputNewPwdError: null,
            inputGeneralError: null
        };
    }

    async resetPwd() {
        const currentPwd = this.state.inputCurrentPwd;
        const newPwd = this.state.inputNewPwd;

        if (newPwd.length < 6) {
            this.setState({
                inputNewPwdError: "Password must have at least 6 characters",
                inputGeneralError: null
            });
            return;
        }

        await authStore.resetPwd(currentPwd, newPwd);
        if (authStore.error !== null) {
            switch (authStore.error) {
                case "PasswordsDontMatch":
                    this.setState({
                        inputNewPwdError: null,
                        inputCurrentPwdError: "The password entered does not match your curent password",
                        inputGeneralError: null
                    });
                    break;
                case "PasswordWeak":
                    this.setState({
                        inputNewPwdError: "New password is to weak",
                        inputCurrentPwdError: null,
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputNewPwdError: null,
                        inputCurrentPwdError: null,
                        inputGeneralError: "An unexpected error happened"
                    });
            }
        } else {
            this.setState({
                inputNewPwdError: null,
                inputCurrentPwdError: null,
                inputGeneralError: null
            });
            this.props.hide();
        }
    }

    closeModal() {
        this.setState({
            inputNewPwdError: null,
            inputGeneralError: null
        });
        this.props.hide();
    }

    showNewPwdError() {
        if (this.state.inputNewPwdError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputNewPwdError}</FormValidationMessage>;
        }
        return null;
    }

    showCurrentPwdError() {
        if (this.state.inputCurrentPwdError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputCurrentPwdError}</FormValidationMessage>;
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
                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        placeholder="Current Password"
                        onChangeText={(value) => this.setState({ inputCurrentPwd: value })}
                        underlineColorAndroid={textColor}
                        selectionColor={inputTextColor} // cursor color
                        secureTextEntry={true}
                    />
                    {this.showCurrentPwdError()}

                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        placeholder="New Password"
                        onChangeText={(value) => this.setState({ inputNewPwd: value })}
                        underlineColorAndroid={textColor}
                        selectionColor={inputTextColor} // cursor color
                        secureTextEntry={true}
                    />
                    {this.showNewPwdError()}

                    <Button
                        raised
                        buttonStyle={{ backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"Reset Password"}
                        onPress={() => { this.resetPwd(); }}
                    />
                    {this.showGeneralError()}
                </View>
            </Modal>
        );
    }

}
