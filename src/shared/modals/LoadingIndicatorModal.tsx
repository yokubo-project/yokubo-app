import React from "react";
import { ActivityIndicator, StyleSheet, Text, TextStyle, View } from "react-native";
import { Button, FormInput, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";
import { Actions } from "react-native-router-flux";

import authStore from "../../state/authStore";
import taskStore, { IItem } from "../../state/taskStore";
import { theme } from "../styles";

const styles = StyleSheet.create({
    modalInputStyle: {
        color: theme.inputTextColor,
        fontSize: 20,
        marginBottom: 10
    },
    modalContent: {
        backgroundColor: theme.backgroundColor,
        justifyContent: "center",
        alignItems: "stretch",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    }
});

interface IProps {
    isVisible: boolean;
    loadingText: string;
}

export default class Component extends React.Component<IProps, null> {

    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}
            >
                <View style={styles.modalContent}>
                    <View
                        style={{
                            marginTop: 15,
                            marginLeft: 15,
                            marginBottom: 15,
                            marginRight: 15,
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}
                    >
                        <ActivityIndicator size="large" color={theme.spinnerColor} />
                        <Text
                            style={{ color: theme.textColor, fontSize: 20, textAlign: "center", paddingTop: 5, paddingLeft: 10 }}
                        >
                            {this.props.loadingText}
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }

}
