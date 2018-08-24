import React from "react";
import { StyleSheet, Text } from "react-native";

import { theme } from "../styles";

const styles = StyleSheet.create({
    text: {
        padding: 5,
        fontSize: 18,
        color: theme.text.linkColor
    }
});

interface IProps {
    text: string;
    onPress(): any;
}

export default class ClickableText extends React.Component<IProps, null> {

    render() {
        return (
            <Text
                style={styles.text}
                onPress={this.props.onPress}
            >
                {this.props.text}
            </Text>
        );
    }

}
