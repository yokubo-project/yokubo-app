import React from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { Button, FormInput, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";

import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";

const styles = StyleSheet.create({
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
    }
});

interface IState {
    inputCurrentPwd: string;
    inputNewPwd: string;
    inputNewPwdError: string;
    inputCurrentPwdError: string;
    inputGeneralError: string;
}

interface IProps {
    isVisible: boolean;
    hide(): void;
}

export default class Component extends React.Component<IProps, IState> {

    constructor(props: IProps) {
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
                inputNewPwdError: i18n.t("resetPwd.pwdToShort"),
                inputCurrentPwdError: null,
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
                        inputCurrentPwdError: i18n.t("resetPwd.wrongPwd"),
                        inputGeneralError: null
                    });
                    break;
                case "PasswordWeak":
                    this.setState({
                        inputNewPwdError: i18n.t("resetPwd.newPwdToWeak"),
                        inputCurrentPwdError: null,
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputNewPwdError: null,
                        inputCurrentPwdError: null,
                        inputGeneralError: i18n.t("resetPwd.unexpectedError")
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
            inputCurrentPwdError: null,
            inputGeneralError: null
        });
        this.props.hide();
    }

    showNewPwdError() {
        if (this.state.inputNewPwdError) {
            return <FormValidationMessage> {this.state.inputNewPwdError}</FormValidationMessage>;
        }

        return null;
    }

    showCurrentPwdError() {
        if (this.state.inputCurrentPwdError) {
            return <FormValidationMessage>{this.state.inputCurrentPwdError}</FormValidationMessage>;
        }

        return null;
    }

    showGeneralError() {
        if (this.state.inputGeneralError) {
            return <FormValidationMessage>{this.state.inputGeneralError}</FormValidationMessage>;
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
                        placeholder={i18n.t("resetPwd.currentPwdPlaceholder")}
                        onChangeText={(value) => this.setState({ inputCurrentPwd: value })}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                        secureTextEntry={true}
                    />
                    {this.showCurrentPwdError()}

                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        placeholder={i18n.t("resetPwd.newPwdPlaceholder")}
                        onChangeText={(value) => this.setState({ inputNewPwd: value })}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                        secureTextEntry={true}
                    />
                    {this.showNewPwdError()}

                    <Button
                        raised={true}
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={i18n.t("resetPwd.resetPwdButton")}
                        onPress={() => { this.resetPwd(); }}
                    />
                    {this.showGeneralError()}
                </View>
            </Modal>
        );
    }

}
