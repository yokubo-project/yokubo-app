import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Header, Button, FormInput, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import authStore from "../../state/authStore";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

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
        backgroundColor,
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor,
    } as ViewStyle,
    formContainer: {
        flex: 5,
        justifyContent: "flex-start",
        backgroundColor,
        marginTop: 10
    } as ViewStyle,
    inputStyle: {
        color: inputTextColor,
        fontSize: 20,
        marginBottom: 10        
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
        const email = this.state.inputEmail;
        const password = this.state.inputPassword;
        const name = this.state.inputName;

        if (name.length < 3) {
            this.setState({
                inputNameError: "Name must have at least 3 characters",
                inputEmailError: null,
                inputPasswordError: null,
                inputGeneralError: null
            });
            return;
        } else if (email.length < 5) {
            this.setState({
                inputNameError: null,
                inputEmailError: "Email must have at least 5 characters",
                inputPasswordError: null,
                inputGeneralError: null
            });
            return;
        } else if (password.length < 6) {
            this.setState({
                inputNameError: null,
                inputEmailError: null,
                inputPasswordError: "Password must have at least 6 characters",
                inputGeneralError: null
            });
            return;
        }

        await authStore.signUp(email, password, name);
        if (authStore.error !== null) {
            switch (authStore.error) {
                case "PasswordWrong":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: null,
                        inputPasswordError: "Wrong Password.",
                        inputGeneralError: null
                    });
                    break;
                case "UserAlreadyExists":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: "Email already exists.",
                        inputPasswordError: null,
                        inputGeneralError: null
                    });
                    break;
                case "InvalidUsername":
                    this.setState({
                        inputNameError: null,
                        inputEmailError: "Email is invalid.",
                        inputPasswordError: null,
                        inputGeneralError: null
                    });
                    break;
                case "PasswordWeak":
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
            Actions.tasks();
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: "Sign up", style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>

                <View style={styles.formContainer}>

                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Full Name"
                        onChangeText={(e) => this.parseName(e)}
                        underlineColorAndroid={textColor}
                        selectionColor={inputTextColor} // cursor color
                    />
                    {this.showNameError()}

                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Email"
                        onChangeText={(e) => this.parseEmail(e)}
                        underlineColorAndroid={textColor}
                        selectionColor={inputTextColor} // cursor color
                    />
                    {this.showEmailError()}

                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder="Password"
                        onChangeText={(e) => this.parsePassword(e)}
                        underlineColorAndroid={textColor}
                        selectionColor={inputTextColor} // cursor color
                        secureTextEntry={true}
                    />
                    {this.showPasswordError()}

                    {this.showGeneralError()}

                    <Button
                        raised
                        buttonStyle={{ backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"SIGN UP"}
                        onPress={() => { this.processSignUp(); }}
                    />

                    <View style={{ flexDirection: "row", padding: 30, justifyContent: "center" }}>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: inputTextColor }}
                        >
                            Already a member?
                        </Text>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: textColor }}
                            onPress={() => { Actions.signIn(); }}
                        >
                            Sign In
                        </Text>
                    </View>

                </View>

            </View>
        );
    }

}
