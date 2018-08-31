import * as _ from "lodash";
import React from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";

import Button from "../../../shared/components/Button";
import TextInputField from "../../../shared/components/TextInputField";
import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";

const styles = StyleSheet.create({
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
    inputName: string;
    inputEmail: string;
    inputNameError: string;
    inputEmailError: string;
    inputGeneralError: string;
}

interface IProps {
    isVisible: boolean;
    hide(): void;
}

export default class UpdateProfileModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            inputName: "",
            inputEmail: "",
            inputNameError: null,
            inputEmailError: null,
            inputGeneralError: null
        };
    }

    async patchProfile() {
        const email = _.trim(this.state.inputEmail);
        const name = this.state.inputName;

        if (name !== "" && name.length < 3) {
            this.setState({
                inputNameError: i18n.t("updateProfile.nameToShort"),
                inputEmailError: null,
                inputGeneralError: null
            });

            return;
        } else if (email !== "" && email.length < 5) {
            this.setState({
                inputNameError: null,
                inputEmailError: i18n.t("updateProfile.emailToShort"),
                inputGeneralError: null
            });

            return;
        }

        // only patch properties that changed
        const profile: { username?: string; name?: string } = {};
        if (email !== authStore.profile.username && email !== "") { profile.username = email; }
        if (name !== authStore.profile.name && name !== "") { profile.name = name; }

        await authStore.patchProfile(profile);
        if (authStore.error !== null) {
            switch (authStore.error) {
                case "UserAlreadyExists":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: i18n.t("updateProfile.userAlreadyExists"),
                        inputGeneralError: null
                    });
                    break;
                case "InvalidUsername":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: i18n.t("updateProfile.invalidEmail"),
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputNameError: null,
                        inputEmailError: null,
                        inputGeneralError: i18n.t("updateProfile.unexpectedError")
                    });
            }
        } else {
            this.setState({
                inputNameError: null,
                inputEmailError: null,
                inputGeneralError: null
            });
            this.props.hide();
        }
    }

    closeModal() {
        this.setState({
            inputNameError: null,
            inputEmailError: null,
            inputGeneralError: null
        });
        this.props.hide();
    }

    showEmailError() {
        if (this.state.inputEmailError) {
            return <FormValidationMessage>{this.state.inputEmailError}</FormValidationMessage>;
        }

        return null;
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

    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.closeModal()}
                onBackButtonPress={() => this.closeModal()}
            >
                <View style={styles.modalContent}>
                    <TextInputField
                        defaultValue={authStore.profile.name}
                        placeholder={i18n.t("updateProfile.namePlaceholder")}
                        onChangeText={(value) => this.setState({ inputName: value })}
                        autoFocus={true}
                    />
                    {this.showNameError()}

                    <TextInputField
                        defaultValue={authStore.username}
                        placeholder={i18n.t("updateProfile.emailPlaceholder")}
                        onChangeText={(value) => this.setState({ inputEmail: value })}
                    />
                    {this.showEmailError()}

                    <Button
                        title={i18n.t("updateProfile.updateProfileButton")}
                        onPress={() => { this.patchProfile(); }}
                    />
                    {this.showGeneralError()}
                </View>
            </Modal>
        );
    }

}
