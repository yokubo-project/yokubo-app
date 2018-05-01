import React from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle, Image } from "react-native";
import { Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

const LOGO = require("../../../assets/yokubo_logo.png");

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor,
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
        flex: 1,
    } as TextStyle,
    buttonContainer: {
        flex: 2
    } as ViewStyle,
    quote: {
        flex: 1,
        color: inputTextColor,
        fontSize: 20,
        textAlign: "center",
    } as TextStyle,
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
                        It's the challenge that makes the greatness.
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"SIGN UP"}
                        onPress={() => { Actions.signUp(); }}
                    />
                    <View style={{ flex: 1, flexDirection: "row", padding: 30, justifyContent: "center" }}>
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
