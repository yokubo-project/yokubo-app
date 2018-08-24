import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "../styles";

const styles = StyleSheet.create({
    wrapper: {
        height: 50,
        borderWidth: 1,
        borderColor: theme.textInput.borderColor,
        borderRadius: 3,
        margin: 15,
        marginBottom: 0,
        padding: 8,
        backgroundColor: theme.textInput.backgroundColor,
        flexDirection: "row",
        paddingBottom: 10
    },
    textInput: {
        flex: 1,
        padding: 3,
        fontSize: 18,
        color: theme.textInput.inputColor
    },
    textField: {
        paddingTop: 3,
        color: theme.text.primaryColor,
        fontSize: 18,
        alignItems: "flex-end"
    }
});

interface IProps {
    label: string;
    placeholder: string;
    keyboardType?: "numeric" | "default" | "email-address";
    defaultValue?: string;
    secureTextEntry?: boolean;
    autoFocus?: boolean;
    additionalStyles?: Object;
    maxTextInputLength?: number;
    onChangeText(value: string): any;
}

export default class TextInputFieldWithLabel extends React.Component<IProps, null> {

    render() {
        return (
            <View style={styles.wrapper}>
                <TextInput
                    style={styles.textInput}
                    defaultValue={this.props.defaultValue || null}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={theme.textInput.placeholderTextColor}
                    onChangeText={this.props.onChangeText}
                    selectionColor={theme.textInput.selectionColor} // cursor color
                    underlineColorAndroid="transparent"
                    autoCorrect={false}
                    maxLength={this.props.maxTextInputLength || 12}
                    keyboardType={this.props.keyboardType || "default"}
                />
                <Text style={styles.textField}>{this.props.label}</Text>
            </View>
        );
    }

}
