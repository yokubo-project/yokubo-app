import React from "react";
import { ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { FormInput, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";

import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";
import taskStore, { IFullItem } from "../../../state/taskStore";

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: theme.backgroundColor
    },
    textElement: {
        padding: 5,
        color: theme.text.primaryColor,
        fontSize: 20,
        textAlign: "center"
    }
});

interface IState {
    inputGeneralError: string;
}

interface IProps {
    isVisible: boolean;
    metrics: any;
    hide(): void;
    filterMetrics(metricKey: string): void;
}

export default class Component extends React.Component<IProps, IState> {

    filterMetrics(metricKey: string) {
        this.props.filterMetrics(metricKey);
    }

    closeModal() {
        this.props.hide();
    }

    renderMetricTags(metrics: any) {
        return metrics.map(metric => {
            return (
                <View key={`${metric.uid}`}>
                    <Text
                        key={metric.uid}
                        style={styles.textElement}
                        onPress={() => { this.filterMetrics(metric.uid); }}
                    >
                        {"\u2022"} {`${metric.name} `}
                    </Text>
                </View>
            );
        });
    }

    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.closeModal()}
                onBackButtonPress={() => this.closeModal()}
            >
                <View
                    style={{
                        backgroundColor: theme.backgroundColor
                    }}
                >
                    <ScrollView style={styles.modalContent}>
                        <Text
                            style={{
                                textAlign: "left",
                                paddingLeft: 20,
                                color: theme.text.primaryColor,
                                fontSize: 20,
                                paddingTop: 30
                            }}
                        >
                            {i18n.t("filterMetrics.header")}
                        </Text>
                        <Text
                            style={styles.textElement}
                            onPress={() => { this.filterMetrics("count"); }}
                        >
                            {"\u2022"} {i18n.t("filterMetrics.count")}
                        </Text>
                        <Text
                            style={styles.textElement}
                            onPress={() => { this.filterMetrics("duration"); }}
                        >
                            {"\u2022"} {i18n.t("filterMetrics.duration")}
                        </Text>
                        {this.renderMetricTags(this.props.metrics)}
                        <View style={{ paddingBottom: 30 }} />
                    </ScrollView>
                </View>
            </Modal>
        );
    }

}
