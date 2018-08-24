import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";

import { theme } from "../styles";

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: theme.button.backgroundColor,
        borderRadius: 4,
        borderColor: "transparent",
        borderWidth: 0,
        height: 55,
        marginTop: 30
    },
    textStyle: {
        textAlign: "center",
        fontSize: 18
    }
});

interface IProps {
    title: string;
    onPress(): any;
}

export default class Component extends React.Component<IProps, null> {

    render() {
        return (
            <Button
                buttonStyle={styles.buttonStyle}
                textStyle={styles.textStyle}
                title={this.props.title}
                onPress={this.props.onPress}
            />
        );
    }

}
