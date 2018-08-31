import * as _ from "lodash";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
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
    } as ViewStyle
});

interface IProps {
    navigation: NavigationScreenProp<any, any>;
}
interface IState {
    inputEmail: string;
    inputEmailError: string;
    inputGeneralError: string;
    emailHint: string;
}
export default class ForgotPwd extends React.Component<IProps, IState> {

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
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
        const email = _.trim(this.state.inputEmail);

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
                    <TextInputField
                        placeholder={i18n.t("forgotPwd.emailPlaceholder")}
                        onChangeText={(e) => this.parseEmail(e)}
                        autoFocus={true}
                    />
                    {this.showEmailError()}
                    {this.showGeneralError()}

                    <Button
                        title={i18n.t("forgotPwd.resetPwdButton")}
                        onPress={() => { this.processForgotPwd(); }}
                    />

                    {this.state.emailHint &&
                        <View style={{ flexDirection: "row", padding: 15, justifyContent: "center" }}>
                            <Text
                                style={{
                                    padding: 5,
                                    marginTop: 10,
                                    fontSize: 18,
                                    color: theme.text.primaryColor,
                                    textAlign: "center"
                                }}
                            >
                                {this.state.emailHint}
                            </Text>
                        </View>
                    }
                    <View style={{ flexDirection: "row", padding: 15, justifyContent: "center" }}>
                        <PrimaryText
                            text={i18n.t("forgotPwd.signinText")}
                        />
                        <ClickableText
                            text={i18n.t("forgotPwd.signinLink")}
                            onPress={() => this.props.navigation.navigate("SignIn")}
                        />
                    </View>
                </View>
            </View>
        );
    }

}
