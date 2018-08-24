import React from "react";
import { StyleSheet, Text, View } from "react-native";
import DatePicker from "react-native-datepicker";

import { theme } from "../styles";

const styles = StyleSheet.create({
    text: {
        padding: 5,
        fontSize: 18,
        color: theme.text.linkColor
    }
});

interface IProps {
    date: string;
    placeholder: string;
    confirmBtnText: string;
    cancelBtnText: string;
    onDateChange(date: string): any;
}

export default class ClickableText extends React.Component<IProps, null> {

    render() {
        return (
            <View style={{ marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                <DatePicker
                    style={{
                        width: "100%",
                        height: 50,
                        borderWidth: 1,
                        borderColor: theme.textInput.borderColor,
                        borderRadius: 3,
                        marginBottom: 0,
                        padding: 0,
                        backgroundColor: theme.textInput.backgroundColor
                    }}
                    date={this.props.date}
                    mode="datetime"
                    placeholder={this.props.placeholder}
                    format="YYYY-MM-DD HH:mm"
                    confirmBtnText={this.props.confirmBtnText}
                    cancelBtnText={this.props.cancelBtnText}
                    showIcon={false}
                    onDateChange={this.props.onDateChange}
                    customStyles={{
                        dateInput: {
                            borderWidth: 0,
                            marginLeft: 5
                        },
                        dateText: {
                            fontSize: 18,
                            position: "absolute",
                            left: 0,
                            marginLeft: 2,
                            color: theme.textInput.inputColor
                        },
                        placeholderText: {
                            fontSize: 18,
                            position: "absolute",
                            left: 0,
                            marginLeft: 2,
                            color: theme.textInput.placeholderTextColor
                        }
                    }}
                />
            </View>
        );
    }

}
