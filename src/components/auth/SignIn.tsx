import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { FormValidationMessage } from "react-native-elements";
import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import Button from "../../shared/components/Button";
import ClickableText from "../../shared/components/ClickableText";
import PrimaryText from "../../shared/components/PrimaryText";
import TextInputField from "../../shared/components/TextInputField";

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
    } as ViewStyle
});

// tslint:disable-next-line:no-empty-interface
interface IProps {
    navigation: NavigationScreenProp<any, any>;
}
interface IState {
    inputEmail: string;
    inputPassword: string;
    inputEmailError: string;
    inputPasswordError: string;
    inputGeneralError: string;
}

export default class SignIn extends React.Component<IProps, IState> {

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            title: "Sign In"
        };
    }

    // tslint:disable-next-line:member-ordering
    constructor(props: IProps) {
        super(props);
        this.state = {
            inputEmail: "",
            inputPassword: "",
            inputEmailError: null,
            inputPasswordError: null,
            inputGeneralError: null
        };
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

    async processSignIn() {
        const email = this.state.inputEmail;
        const password = this.state.inputPassword;

        if (email.length < 5) {
            this.setState({
                inputEmailError: i18n.t("signIn.emailToShort"),
                inputPasswordError: null,
                inputGeneralError: null
            });

            return;
        } else if (password.length < 6) {
            this.setState({
                inputEmailError: null,
                inputPasswordError: i18n.t("signIn.pwdToShort"),
                inputGeneralError: null
            });

            return;
        }

        await authStore.signInWithPassword(email, password);

        if (authStore.error !== null) {
            switch (authStore.error) {
                case "UserDisabled":
                    this.setState({
                        inputEmailError: null,
                        inputPasswordError: null,
                        inputGeneralError: i18n.t("signIn.userDisabled")
                    });
                    break;
                case "InvalidLogin":
                    this.setState({
                        inputEmailError: null,
                        inputPasswordError: i18n.t("signIn.invalidLogin"),
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputEmailError: null,
                        inputPasswordError: null,
                        inputGeneralError: i18n.t("signIn.unexpectedError")
                    });
            }
        } else {
            this.setState({
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
                        placeholder={i18n.t("signIn.emailPlaceholder")}
                        onChangeText={(e) => this.parseEmail(e)}
                        autoFocus={true}
                    />
                    {this.showEmailError()}

                    <TextInputField
                        placeholder={i18n.t("signIn.pwdPlaceholder")}
                        onChangeText={(e) => this.parsePassword(e)}
                        secureTextEntry={true}
                    />
                    {this.showPasswordError()}
                    {this.showGeneralError()}

                    <Button
                        title={i18n.t("signIn.signinButton")}
                        onPress={() => { this.processSignIn(); }}
                    />

                    <View style={{ flexDirection: "row", paddingTop: 15, justifyContent: "center" }}>
                        <PrimaryText
                            text={i18n.t("signIn.notAMember")}
                        />
                        <ClickableText
                            text={i18n.t("signIn.signupLink")}
                            onPress={() => this.props.navigation.navigate("SignUp")}
                        />
                    </View>
                    <View style={{ flexDirection: "row", paddingTop: 5, justifyContent: "center" }}>
                        <PrimaryText
                            text={i18n.t("signIn.forgotPwd")}
                        />
                        <ClickableText
                            text={i18n.t("signIn.forgotPwdLink")}
                            onPress={() => this.props.navigation.navigate("ForgotPwd")}
                        />
                    </View>
                </View>
            </View>
        );
    }

}
