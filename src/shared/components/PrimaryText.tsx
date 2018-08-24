import React from "react";
import { StyleSheet, Text } from "react-native";

import { theme } from "../styles";

const styles = StyleSheet.create({
    text: {
        padding: 5,
        fontSize: 18,
        color: theme.text.primaryColor
    }
});

interface IProps {
    text: string;
}

export default class PrimaryText extends React.Component<IProps, null> {

    render() {
        return (
            <Text
                style={styles.text}
            >
                {this.props.text}
            </Text>
        );
    }

}
