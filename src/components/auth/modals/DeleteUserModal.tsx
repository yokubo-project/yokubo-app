import React from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";
import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import Button from "../../../shared/components/Button";
import TextInputField from "../../../shared/components/TextInputField";
import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";

const styles = StyleSheet.create({
    modalInputStyle: {
        color: theme.text.primaryColor,
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
    navigation: NavigationScreenProp<any, any>;
    isVisible: boolean;
    hide(): void;
}

export default class DeleteUserModal extends React.Component<IProps, IState> {

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            header: null
        };
    }

    // tslint:disable-next-line:member-ordering
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
                            color: theme.text.primaryColor,
                            fontSize: 15,
                            textAlign: "center",
                            marginBottom: 20
                        }}
                    >
                        {i18n.t("deleteUser.deleteUserHint")}
                    </Text>

                    <TextInputField
                        placeholder={i18n.t("deleteUser.currentPwdPlaceholder")}
                        onChangeText={(value) => this.setState({ inputDeleteUserPwd: value })}
                        secureTextEntry={true}
                    />
                    {this.showPwdError()}

                    <Button
                        title={i18n.t("deleteUser.deleteUserButton")}
                        onPress={() => { this.deleteUser(); }}
                    />
                    {this.showGeneralError()}
                </View>
            </Modal>
        );
    }

}
