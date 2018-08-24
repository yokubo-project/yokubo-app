import React from "react";
import { ScrollView, StyleSheet, Text, TextStyle, View } from "react-native";
import { Button, FormInput, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";

import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";
import taskStore, { IItem } from "../../../state/taskStore";

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: theme.backgroundColor,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    }
});

interface IState {
    inputGeneralError: string;
}

interface IProps {
    isVisible: boolean;
    hide(): void;
}

export default class MetricInfoModal extends React.Component<IProps, IState> {

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
                    <Text style={{ textAlign: "center", color: theme.text.primaryColor, fontSize: 18 }}>
                        {i18n.t("metricInfo.desc")}
                    </Text>
                </View>
            </Modal>
        );
    }

}
