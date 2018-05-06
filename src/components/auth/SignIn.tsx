import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, Button, FormInput, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import authStore from "../../state/authStore";
import { theme } from "../../shared/styles";

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
    inputEmail: string;
    inputPassword: string;
    inputEmailError: string;
    inputPasswordError: string;
    inputGeneralError: string;
}

export default class Component extends React.Component<null, State> {

    constructor(props) {
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
                inputEmailError: "Email must have at least 5 characters",
                inputPasswordError: null,
                inputGeneralError: null
            });
            return;
        } else if (password.length < 6) {
            this.setState({
                inputEmailError: null,
                inputPasswordError: "Password must have at least 6 characters",
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
                        inputGeneralError: "This user is disabled"
                    });
                    break;
                case "InvalidLogin":
                    this.setState({
                        inputEmailError: null,
                        inputPasswordError: "Invalid email or password",
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputEmailError: null,
                        inputPasswordError: null,
                        inputGeneralError: "An unexpected error happened"
                    });
            }
        } else {
            this.setState({
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
                        centerComponent={{ text: "Sign In", style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>
                <View style={styles.formContainer}>
                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Email"
                        onChangeText={(e) => this.parseEmail(e)}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                    />
                    {this.showEmailError()}

                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Password"
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
                        title={"SIGN IN"}
                        onPress={() => { this.processSignIn(); }}
                    />
                    <View style={{ flexDirection: "row", paddingTop: 30, justifyContent: "center" }}>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: theme.inputTextColor }}
                        >
                            Not a member yet?
                        </Text>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: theme.textColor }}
                            onPress={() => { Actions.signUp(); }}
                        >
                            Sign Up
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", paddingTop: 15, justifyContent: "center" }}>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: theme.inputTextColor }}
                        >
                            Forgot your password?
                        </Text>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: theme.textColor }}
                            onPress={() => { Actions.forgotPwd(); }}
                        >
                            Help
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

}
