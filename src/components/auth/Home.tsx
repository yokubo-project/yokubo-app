import React from "react";
import { I18nextProvider, translate } from "react-i18next";
import { Image, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";

// tslint:disable-next-line:no-var-requires
const LOGO = require("../../../assets/yokubo_logo.png");

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    logoContainer: {
        flex: 1,
        marginTop: 100,
        marginLeft: 40,
        marginRight: 40
    } as ViewStyle,
    image: {
        width: undefined,
        height: undefined,
        flex: 1
    } as TextStyle,
    buttonContainer: {
        flex: 2
    } as ViewStyle,
    quote: {
        flex: 1,
        color: theme.inputTextColor,
        fontSize: 20,
        textAlign: "center"
    } as TextStyle
});
export default class Component extends React.Component<null, null> {

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={LOGO}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text
                        style={styles.quote}
                    >
                        {i18n.t("home.quote")}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        raised={true}
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={i18n.t("home.signupButton")}
                        onPress={() => { Actions.signUp(); }}
                    />
                    <View style={{ flex: 1, flexDirection: "row", padding: 30, justifyContent: "center" }}>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: theme.inputTextColor }}
                        >
                            {i18n.t("home.alreadyRegistered")}
                        </Text>
                        <Text
                            style={{ padding: 5, fontSize: 20, color: theme.textColor }}
                            onPress={() => { Actions.signIn(); }}
                        >
                            {i18n.t("home.signinLink")}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

}
