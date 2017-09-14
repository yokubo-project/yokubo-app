import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, Button, FormLabel, FormInput, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import firebase from "firebase";

import auth from "../../state/auth";
import { AuthError } from "../../state/auth";

const primaryColor1 = "green";

interface Props {
}

interface State {
    inputName: string;
    inputEmail: string;
    inputPassword: string;
    inputNameError: string;
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
    fullNameText: {
        textAlign: "center",
        color: primaryColor1,
        marginBottom: 10,
    } as TextStyle,
    signUpText: {
        textAlign: "center",
        color: primaryColor1,
        marginBottom: 10,
    } as TextStyle,
    forgotPwdText: {
        textAlign: "center",
        color: primaryColor1,
    } as TextStyle,
    inputStyle: {
        color: "black",
        fontSize: 20
    }
});
export default class Component extends React.Component<Props, State> {

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
        const signUpData = {
            name: this.state.inputName,
            email: this.state.inputEmail,
            password: this.state.inputPassword
        };

        if (signUpData.name.length < 3) {
            this.setState({
                inputNameError: "Name must have at least 3 characters",
                inputEmailError: null,
                inputPasswordError: null,
                inputGeneralError: null
            });
            return;
        } else if (signUpData.email.length < 5) {
            this.setState({
                inputNameError: null,
                inputEmailError: "Email must have at least 5 characters",
                inputPasswordError: null,
                inputGeneralError: null
            });
            return;
        } else if (signUpData.password.length < 6) {
            this.setState({
                inputNameError: null,
                inputEmailError: null,
                inputPasswordError: "Password must have at least 6 characters",
                inputGeneralError: null
            });
            return;
        }

        const signUpResponse = await auth.signUp(signUpData);
        if (auth.error !== null) {
            switch (auth.error) {
                case "PasswordWrong":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: null,
                        inputPasswordError: "Wrong Password.",
                        inputGeneralError: null
                    });
                    break;
                case "EmailAlreadyExists":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: "Email already exists.",
                        inputPasswordError: null,
                        inputGeneralError: null
                    });
                    break;
                case "InvalidEmail":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: "Email is invalid.",
                        inputPasswordError: null,
                        inputGeneralError: null
                    });
                    break;
                case "WeakPassword":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: null,
                        inputPasswordError: "Thats a weak password.",
                        inputGeneralError: null
                    });
                    break;
                default:
                    this.setState({
                        inputNameError: null,
                        inputEmailError: null,
                        inputPasswordError: null,
                        inputGeneralError: "An unexpected error happened."
                    });
            }
        } else {
            this.setState({
                inputNameError: null,
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
                        centerComponent={{ text: "Sign up to Bode", style: { color: "#fff", fontSize: 20 } }}
                        statusBarProps={{ barStyle: "dark-content", translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <View style={styles.formContainer}>

                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Enter your name"
                        onChangeText={(e) => this.parseName(e)}
                        underlineColorAndroid={primaryColor1}
                        selectionColor="black" // cursor color
                    />
                    {this.showNameError()}

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
                        title={"SIGN UP"}
                        onPress={() => { this.processSignUp(); }}
                    />

                    <Text style={styles.signUpText} onPress={() => { Actions.signIn(); }}>
                        {"SIGN IN"}
                    </Text>

                </View>

                <View style={styles.spaceContainer}>

                </View>
            </View>
        );
    }

}
