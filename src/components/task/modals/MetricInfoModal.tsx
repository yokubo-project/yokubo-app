import React from "react";
import { ScrollView, StyleSheet, Text, TextStyle, View } from "react-native";
import { Button, FormInput, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";
import { Actions } from "react-native-router-flux";

import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";
import taskStore, { IItem } from "../../../state/taskStore";

const styles = StyleSheet.create({
    modalInputStyle: {
        color: theme.inputTextColor,
        fontSize: 20,
        marginBottom: 10
    },
    modalContent: {
        backgroundColor: theme.backgroundColor,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    textElement: {
        padding: 5,
        color: theme.inputTextColor,
        fontSize: 20,
        textAlign: "center"
    }
});

interface IState {
    inputGeneralError: string;
}

interface IProps {
    isVisible: boolean;
    hide(): void;
}

export default class Component extends React.Component<IProps, IState> {

    closeModal() {
        this.props.hide();
    }

    render() {

        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.closeModal()}
                onBackButtonPress={() => this.closeModal()}
            >
                <View style={styles.modalContent}>
                    <Text style={{ textAlign: "center", color: theme.inputTextColor, fontSize: 18 }}>
                        {i18n.t("metricInfo.desc")}
                    </Text>
                </View>
            </Modal>
        );
    }

}
