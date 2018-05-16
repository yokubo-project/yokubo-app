import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, Button, FormInput, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import authStore from "../../state/authStore";
import { theme } from "../../shared/styles";
import i18n from "../../shared/i18n";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    formContainer: {
        flex: 5,
        justifyContent: "flex-start",
        backgroundColor: theme.backgroundColor,
        marginTop: 10
    } as ViewStyle,
    inputStyle: {
        color: theme.inputTextColor,
        fontSize: 20,
        marginBottom: 10
    }
});
interface State {
    inputName: string;
    inputEmail: string;
    inputPassword: string;
    inputNameError: string;
    inputEmailError: string;
    inputPasswordError: string;
    inputGeneralError: string;
}
export default class Component extends React.Component<null, State> {

    constructor(props) {
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
        const email = this.state.inputEmail;
        const password = this.state.inputPassword;
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
                        inputGeneralError: i18n.t("signUp.unexpectedError"),
                    });
            }
        } else {
            this.setState({
                inputNameError: null,
                inputEmailError: null,
                inputPasswordError: null,
                inputGeneralError: null
            });
            Actions.tasks();
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={theme.backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: i18n.t("signUp.header"), style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>
                <View style={styles.formContainer}>
                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder={i18n.t("signUp.namePlaceholder")}
                        onChangeText={(e) => this.parseName(e)}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                    />
                    {this.showNameError()}

                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder={i18n.t("signUp.emailPlaceholder")}
                        onChangeText={(e) => this.parseEmail(e)}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                    />
                    {this.showEmailError()}

                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder={i18n.t("signUp.pwdPlaceholder")}
                        onChangeText={(e) => this.parsePassword(e)}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                        secureTextEntry={true}
                    />
                    {this.showPasswordError()}
                    {this.showGeneralError()}

                    <Button
                        raised
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={i18n.t("signUp.signupButton")}
                        onPress={() => { this.processSignUp(); }}
                    />
                    <View style={{ flexDirection: "row", padding: 30, justifyContent: "center" }}>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: theme.inputTextColor }}
                        >
                            {i18n.t("signUp.alreadyRegistered")}
                        </Text>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: theme.textColor }}
                            onPress={() => { Actions.signIn(); }}
                        >
                            {i18n.t("signUp.signinLink")}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

}
