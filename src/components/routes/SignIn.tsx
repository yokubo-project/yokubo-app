import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, Button, FormInput, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import auth from "../../state/auth";

const primaryColor1 = "green";

interface Props {
}

interface State {
    inputEmail: string;
    inputPassword: string;
    inputEmailError: string;
    inputPasswordError: string;
    inputGeneralError: string;
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    formContainer: {
        flex: 3,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    spaceContainer: {
        flex: 3,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    signUpText: {
        textAlign: "center",
        color: primaryColor1,
        marginBottom: 10,
    } as TextStyle,
    forgotPwdText: {
        textAlign: "center",
        color: primaryColor1,
    },
    inputStyle: {
        color: "black",
        fontSize: 20
    }
});
export default class Component extends React.Component<Props, State> {

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

        await auth.signInWithPassword(email, password);

        // TODO: Refactore error handling
        if (auth.error !== null) {
            switch (auth.error) {
                case "UserDisabled":
                    this.setState({
                        inputEmailError: null,
                        inputPasswordError: null,
                        inputGeneralError: "This user is disabled."
                    });
                    break;
                case "InvalidUsername":
                    this.setState({
                        inputEmailError: "Email is invalid.",
                        inputPasswordError: null,
                        inputGeneralError: null
                    });
                    break;
                case "UserNotFound":
                    this.setState({
                        inputEmailError: "User not found.",
                        inputPasswordError: null,
                        inputGeneralError: null
                    });
                    break;
                case "PasswordWrong":
                    this.setState({
                        inputEmailError: null,
                        inputPasswordError: "Password is wrong.",
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputEmailError: null,
                        inputPasswordError: null,
                        inputGeneralError: "An unexpected error happened."
                    });
            }
        } else {
            this.setState({
                inputEmailError: null,
                inputPasswordError: null,
                inputGeneralError: null
            });
            Actions.activities();
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={primaryColor1}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: "Sign in to Bode", style: { color: "#fff", fontSize: 20 } }}
                        statusBarProps={{ barStyle: "dark-content", translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <View style={styles.formContainer}>

                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Email"
                        onChangeText={(e) => this.parseEmail(e)}
                        underlineColorAndroid={primaryColor1}
                        selectionColor="black" // cursor color
                    />
                    {this.showEmailError()}

                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Password"
                        onChangeText={(e) => this.parsePassword(e)}
                        underlineColorAndroid={primaryColor1}
                        selectionColor="black" // cursor color
                    />
                    {this.showPasswordError()}

                    {this.showGeneralError()}

                    <Button
                        raised
                        buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"SIGN IN"}
                        onPress={() => { this.processSignIn(); }}
                    />

                    <Text style={styles.signUpText} onPress={() => { Actions.signUp(); }}>
                        {"SIGN UP FOR BODE"}
                    </Text>

                    <Text style={styles.forgotPwdText} onPress={() => { console.log("Forgot your pwd was clicked.."); }}>
                        {"FORGOT YOUR PASSWORD?"}
                    </Text>
                </View>

                <View style={styles.spaceContainer}>

                </View>
            </View>
        );
    }


}
