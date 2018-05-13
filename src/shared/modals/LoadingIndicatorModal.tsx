import React from "react";
import { StyleSheet, Text, View, TextStyle, ActivityIndicator } from "react-native";
import { FormInput, Button, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import authStore from "../../state/authStore";
import { theme } from "../styles";
import taskStore, { IItem } from "../../state/taskStore";

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
    },
});

interface Props {
    isVisible: boolean;
    loadingText: string;
}

export default class Component extends React.Component<Props, null> {

    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}
            >
                <View style={styles.modalContent}>
                    <View style={{
                        marginTop: 15,
                        marginLeft: 15,
                        marginBottom: 15,
                        marginRight: 15,
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}>
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
