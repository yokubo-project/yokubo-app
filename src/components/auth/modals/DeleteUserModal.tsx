import React from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";
import { FormInput, Button, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import authStore from "../../../state/authStore";
import { theme } from "../../../shared/styles";
import i18n from "../../../shared/i18n";

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
    },
});

interface State {
    inputDeleteUserPwd: string;
    inputPwdError: string;
    inputGeneralError: string;
}

interface Props {
    isVisible: boolean;
    hide: () => void;
}

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
                        inputPwdError: i18n.t("deleteUser.wrongPwd"),
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputPwdError: null,
                        inputGeneralError: i18n.t("deleteUser.unexpectedError")
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
            return <FormValidationMessage>{this.state.inputPwdError}</FormValidationMessage>;
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
                    <Text style={{
                        color: theme.inputTextColor,
                        fontSize: 15,
                        textAlign: "center",
                        marginBottom: 20
                    }}>
                        {i18n.t("deleteUser.deleteUserHint")}
                    </Text>
                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        placeholder={i18n.t("deleteUser.currentPwdPlaceholder")}
                        onChangeText={(value) => this.setState({ inputDeleteUserPwd: value })}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                        secureTextEntry={true}
                    />
                    {this.showPwdError()}

                    <Button
                        raised
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={i18n.t("deleteUser.deleteUserButton")}
                        onPress={() => { this.deleteUser(); }}
                    />
                    {this.showGeneralError()}

                </View>
            </Modal>
        );
    }

}
