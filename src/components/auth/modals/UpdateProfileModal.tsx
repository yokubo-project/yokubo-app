import React from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";
import { FormInput, Button, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";

import authStore from "../../../state/authStore";
import { theme } from "../../../shared/styles";

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
    inputName: string;
    inputEmail: string;
    inputNameError: string;
    inputEmailError: string;
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
            inputName: "",
            inputEmail: "",
            inputNameError: null,
            inputEmailError: null,
            inputGeneralError: null
        };
    }

    async patchProfile() {
        const email = this.state.inputEmail !== "" ? this.state.inputEmail : authStore.username;
        const name = this.state.inputName !== "" ? this.state.inputName : authStore.profile.name;

        if (name.length < 3) {
            this.setState({
                inputNameError: "Name must have at least 3 characters",
                inputEmailError: null,
                inputGeneralError: null
            });
            return;
        } else if (email.length < 5) {
            this.setState({
                inputNameError: null,
                inputEmailError: "Email must have at least 5 characters",
                inputGeneralError: null
            });
            return;
        }

        await authStore.patchProfile(email, name);
        if (authStore.error !== null) {
            switch (authStore.error) {
                case "UserAlreadyExists":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: "Email already exists",
                        inputGeneralError: null
                    });
                    break;
                case "InvalidUsername":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: "Email already exists",
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputNameError: null,
                        inputEmailError: null,
                        inputGeneralError: "An unexpected error happened"
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
                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        defaultValue={authStore.profile.name}
                        placeholder={"Name"}
                        onChangeText={(value) => this.setState({ inputName: value })}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                    />
                    {this.showNameError()}

                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        defaultValue={authStore.username}
                        placeholder={"Email"}
                        onChangeText={(value) => this.setState({ inputEmail: value })}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                    />
                    {this.showEmailError()}

                    <Button
                        raised
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"Update Profile"}
                        onPress={() => { this.patchProfile(); }}
                    />
                    {this.showGeneralError()}
                </View>
            </Modal>
        );
    }

}
