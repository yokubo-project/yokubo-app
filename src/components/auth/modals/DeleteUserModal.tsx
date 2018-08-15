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
    inputDeleteUserPwd: string;
    inputPwdError: string;
    inputGeneralError: string;
}

interface IProps {
    navigation: any;
    isVisible: boolean;
    hide(): void;
}

export default class DeleteUserModal extends React.Component<IProps, IState> {

    static navigationOptions: any = { header: null };

    constructor(props: IProps) {
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
            this.props.navigation.navigate("Home");
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
                    <Text
                        style={{
                            color: theme.inputTextColor,
                            fontSize: 15,
                            textAlign: "center",
                            marginBottom: 20
                        }}
                    >
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
                        raised={true}
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
