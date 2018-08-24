import React from "react";
import { StyleSheet, TextInput } from "react-native";

import { theme } from "../styles";

const styles = StyleSheet.create({
    inputStyle: {
        color: theme.textInput.inputColor,
        fontSize: 18,
        height: 50,
        borderWidth: 1,
        borderColor: theme.textInput.borderColor,
        borderRadius: 3,
        margin: 15,
        marginBottom: 0,
        padding: 8,
        backgroundColor: theme.textInput.backgroundColor
    }
});

interface IProps {
    placeholder: string;
    defaultValue?: string;
    secureTextEntry?: boolean;
    autoFocus?: boolean;
    additionalStyles?: Object;
    onChangeText(value: string): any;
}

export default class TextInputField extends React.Component<IProps, null> {

    render() {
        return (
            <TextInput
                style={[styles.inputStyle, this.props.additionalStyles]}
                defaultValue={this.props.defaultValue || null}
                placeholder={this.props.placeholder}
                placeholderTextColor={theme.textInput.placeholderTextColor}
                onChangeText={this.props.onChangeText}
                selectionColor={theme.textInput.selectionColor} // cursor color
                underlineColorAndroid="transparent"
                autoCorrect={false}
                secureTextEntry={this.props.secureTextEntry || false}
                autoFocus={this.props.autoFocus || false}
            />

        );
    }

}
