import React from "react";
import { StyleSheet, Text, View, TextStyle, ScrollView } from "react-native";
import { FormInput, Button, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import authStore from "../../../state/authStore";
import { theme } from "../../../shared/styles";
import taskStore, { IItem } from "../../../state/taskStore";
import i18n from "../../../shared/i18n";

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

interface State {
    inputGeneralError: string;
}

interface Props {
    isVisible: boolean;
    hide: () => void;
}

export default class Component extends React.Component<Props, State> {

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
