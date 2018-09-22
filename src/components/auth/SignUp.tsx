import * as _ from "lodash";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { FormValidationMessage } from "react-native-elements";
import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import Button from "../../shared/components/Button";
import ClickableText from "../../shared/components/ClickableText";
import PrimaryText from "../../shared/components/PrimaryText";
import TextInputField from "../../shared/components/TextInputField";

import { validateEmail } from "../../shared/helpers";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import authStore from "../../state/authStore";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    formContainer: {
        flex: 1,
        justifyContent: "flex-start",
        marginTop: 10
    } as ViewStyle,
    inputStyle: {
        color: theme.textInput.inputColor,
        fontSize: 18,
        height: 50,
        borderWidth: 1,
        borderColor: theme.textInput.borderColor,
        borderRadius: 3,
        margin: 15,
        marginBottom: 0,
        padding: 8,
        backgroundColor: theme.textInput.backgroundColor
    }
});

interface IProps {
    navigation: NavigationScreenProp<any, any>;
}
interface IState {
    inputName: string;
    inputEmail: string;
    inputPassword: string;
    inputNameError: string;
    inputEmailError: string;
    inputPasswordError: string;
    inputGeneralError: string;
}
export default class SignUp extends React.Component<IProps, IState> {

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            title: i18n.t("signUp.header")
        };
    }

    // tslint:disable-next-line:member-ordering
    constructor(props: IProps) {
        super(props);
        this.state = {
            inputName: "",
            inputEmail: "",
            inputPassword: "",
            inputNameError: null,
            inputEmailError: null,
            inputPasswordError: null,
            inputGeneralError: null
        };
    }

    parseName(value: any) {
        this.setState({
            inputName: value
        });
    }

    showNameError() {
        if (this.state.inputNameError) {
            return <FormValidationMessage>{this.state.inputNameError}</FormValidationMessage>;
        }

        return null;
    }

    parseEmail(value: any) {
        this.setState({
            inputEmail: value
        });
    }

    showEmailError() {
        if (this.state.inputEmailError) {
            return <FormValidationMessage>{this.state.inputEmailError}</FormValidationMessage>;
        }

        return null;
    }

    parsePassword(value: any) {
        this.setState({
            inputPassword: value
        });
    }

    showPasswordError() {
        if (this.state.inputPasswordError) {
            return <FormValidationMessage>{this.state.inputPasswordError}</FormValidationMessage>;
        }

        return null;
    }

    showGeneralError() {
        if (this.state.inputGeneralError) {
            return <FormValidationMessage>{this.state.inputGeneralError}</FormValidationMessage>;
        }

        return null;
    }

    async processSignUp() {
        const email = _.trim(this.state.inputEmail);
        const password = _.trim(this.state.inputPassword);
        const name = this.state.inputName;

        if (name.length < 3) {
            this.setState({
                inputNameError: i18n.t("signUp.nameToShort"),
                inputEmailError: null,
                inputPasswordError: null,
                inputGeneralError: null
            });

            return;
        } else if (email.length < 5) {
            this.setState({
                inputNameError: null,
                inputEmailError: i18n.t("signUp.emailToShort"),
                inputPasswordError: null,
                inputGeneralError: null
            });

            return;
        } else if (!validateEmail(email)) {
            this.setState({
                inputNameError: null,
                inputEmailError: i18n.t("signUp.invalidEmail"),
                inputPasswordError: null,
                inputGeneralError: null
            });

            return;
        } else if (password.length < 6) {
            this.setState({
                inputNameError: null,
                inputEmailError: null,
                inputPasswordError: i18n.t("signUp.pwdToShort"),
                inputGeneralError: null
            });

            return;
        }

        await authStore.signUp(email, password, name);
        if (authStore.error !== null) {
            switch (authStore.error) {
                case "UserAlreadyExists":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: i18n.t("signUp.userAlreadyExists"),
                        inputPasswordError: null,
                        inputGeneralError: null
                    });
                    break;
                case "InvalidUsername":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: i18n.t("signUp.invalidEmail"),
                        inputPasswordError: null,
                        inputGeneralError: null
                    });
                    break;
                case "PasswordWeak":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: null,
                        inputPasswordError: i18n.t("signUp.pwdToWeak"),
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputNameError: null,
                        inputEmailError: null,
                        inputPasswordError: null,
                        inputGeneralError: i18n.t("signUp.unexpectedError")
                    });
            }
        } else {
            this.setState({
                inputNameError: null,
                inputEmailError: null,
                inputPasswordError: null,
                inputGeneralError: null
            });
            this.props.navigation.navigate("Tasks");
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.formContainer}>
                    <TextInputField
                        placeholder={i18n.t("signUp.namePlaceholder")}
                        onChangeText={(e) => this.parseName(e)}
                        autoFocus={true}
                    />
                    {this.showNameError()}

                    <TextInputField
                        placeholder={i18n.t("signUp.emailPlaceholder")}
                        onChangeText={(e) => this.parseEmail(e)}
                    />
                    {this.showEmailError()}

                    <TextInputField
                        placeholder={i18n.t("signUp.pwdPlaceholder")}
                        onChangeText={(e) => this.parsePassword(e)}
                        secureTextEntry={true}
                    />
                    {this.showPasswordError()}
                    {this.showGeneralError()}

                    <Button
                        title={i18n.t("signUp.signupButton")}
                        onPress={() => { this.processSignUp(); }}
                    />

                    <View style={{ flexDirection: "row", padding: 15, justifyContent: "center" }}>
                        <PrimaryText
                            text={i18n.t("signUp.alreadyRegistered")}
                        />
                        <ClickableText
                            text={i18n.t("signUp.signinLink")}
                            onPress={() => this.props.navigation.navigate("SignIn")}
                        />
                    </View>
                </View>
            </View>
        );
    }

}
