import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";

const primaryColor1 = "green";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
});

export default class Component extends React.Component<null, null> {

    render() {
        return (
            <View style={styles.mainContainer}>
                <Button
                    raised
                    buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                    textStyle={{ textAlign: "center", fontSize: 18 }}
                    title={"SIGN IN"}
                    onPress={() => { Actions.signIn(); }}
                />
                <Button
                    raised
                    buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                    textStyle={{ textAlign: "center", fontSize: 18 }}
                    title={"SIGN UP"}
                    onPress={() => { Actions.signUp(); }}
                />
            </View>
        );
    }

}
