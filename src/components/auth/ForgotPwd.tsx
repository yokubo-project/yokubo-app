import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button, FormInput, FormValidationMessage } from "react-native-elements";

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
        backgroundColor: theme.backgroundColor,
        marginTop: 10
    } as ViewStyle,
    inputStyle: {
        color: theme.inputTextColor,
        fontSize: 20,
        marginBottom: 10
    }
});

interface IProps {
    navigation: any;
}
interface IState {
    inputEmail: string;
    inputEmailError: string;
    inputGeneralError: string;
    emailHint: string;
}
export default class ForgotPwd extends React.Component<IProps, IState> {

    static navigationOptions = ({ navigation }: any) => {
        return {
            title: "Forgot Password"
        };
    }

    // tslint:disable-next-line:member-ordering
    constructor(props: IProps) {
        super(props);
        this.state = {
            inputEmail: "",
            inputEmailError: null,
            inputGeneralError: null,
            emailHint: null
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

    showGeneralError() {
        if (this.state.inputGeneralError) {
            return <FormValidationMessage>{this.state.inputGeneralError}</FormValidationMessage>;
        }

        return null;
    }

    async processForgotPwd() {
        const email = this.state.inputEmail;

        if (email.length < 5) {
            this.setState({
                inputEmailError: i18n.t("forgotPwd.emailToShort"),
                inputGeneralError: null
            });

            return;
        } else if (!validateEmail(email)) {
            this.setState({
                inputEmailError: i18n.t("forgotPwd.invalidEmail"),
                inputGeneralError: null
            });

            return;
        }

        await authStore.sendForgottenPwdMail(email);

        if (authStore.error !== null) {
            switch (authStore.error) {
                default:
                    this.setState({
                        inputEmailError: null,
                        inputGeneralError: i18n.t("forgotPwd.unexpectedError")
                    });
            }
        } else {
            this.setState({
                inputEmailError: null,
                inputGeneralError: null,
                emailHint: i18n.t("forgotPwd.emailHint")
            });
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.formContainer}>
                    <FormInput
                        inputStyle={styles.inputStyle}
                        placeholder={i18n.t("forgotPwd.emailPlaceholder")}
                        onChangeText={(e) => this.parseEmail(e)}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                    />
                    {this.showEmailError()}
                    {this.showGeneralError()}

                    <Button
                        raised={true}
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={i18n.t("forgotPwd.resetPwdButton")}
                        onPress={() => { this.processForgotPwd(); }}
                    />

                    <View style={{ flexDirection: "row", padding: 30, justifyContent: "center" }}>
                        {this.state.emailHint &&
                            <Text
                                style={{
                                    padding: 5,
                                    marginBottom: 5,
                                    marginTop: 10,
                                    fontSize: 20,
                                    color: theme.inputTextColor,
                                    textAlign: "center"
                                }}
                            >
                                {this.state.emailHint}
                            </Text>}
                    </View>
                    <View style={{ flexDirection: "row", padding: 30, justifyContent: "center" }}>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: theme.inputTextColor }}
                        >
                            {i18n.t("forgotPwd.signinText")}
                        </Text>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: theme.textColor }}
                            onPress={() => this.props.navigation.navigate("SignIn")}
                        >
                            {i18n.t("forgotPwd.signinLink")}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

}
