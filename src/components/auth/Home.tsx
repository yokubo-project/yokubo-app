import React from "react";
import { Image, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import Button from "../../shared/components/Button";
import ClickableText from "../../shared/components/ClickableText";
import PrimaryText from "../../shared/components/PrimaryText";

import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import authStore from "../../state/authStore";

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
        color: theme.text.primaryColor,
        fontSize: 20,
        textAlign: "center"
    } as TextStyle
});

interface IProps {
    navigation: NavigationScreenProp<any, any>;
}
export default class Home extends React.Component<IProps, null> {

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            header: null
        };
    }

    componentWillMount() {
        if (authStore.isAuthenticated) {
            this.props.navigation.navigate("Tasks");
        }
    }

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
                        title={i18n.t("home.signupButton")}
                        onPress={() => this.props.navigation.navigate("SignUp")}
                    />
                    <View style={{ flex: 1, flexDirection: "row", padding: 15, justifyContent: "center" }}>
                        <PrimaryText
                            text={i18n.t("home.alreadyRegistered")}
                        />
                        <ClickableText
                            text={i18n.t("home.signinLink")}
                            onPress={() => this.props.navigation.navigate("SignIn")}
                        />
                    </View>
                </View>
            </View>
        );
    }

}
