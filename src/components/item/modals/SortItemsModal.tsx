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
    metrics: any;
    hide(): void;
    sortItemsAndHide(sortKey: string, sortDirection: string): void;
}

export default class Component extends React.Component<IProps, IState> {

    sortEntriesAndHide(sortKey: any, sortDirection: string) {
        this.props.sortItemsAndHide(sortKey, sortDirection);
    }

    closeModal() {
        this.props.hide();
    }

    renderMetricTags(metrics: any) {
        const renderedMetricTagsAsc = metrics.map(metric => {
            return (
                <Text
                    key={`${metric.uid}asc`}
                    style={styles.textElement}
                    onPress={() => {
                        this.sortEntriesAndHide((item) => {
                            const merticQuanitity = item.metricQuantities.filter(
                                (metricQuantity) => metricQuantity.metric.uid === metric.uid
                            )[0];

                            return merticQuanitity.quantity;
                        },                      "asc");
                    }}
                >
                    {"\u2022"} {`${metric.name} `} &#8593;
                </Text>
            );
        });
        const renderedMetricTagsDesc = metrics.map(metric => {
            return (
                <Text
                    key={`${metric.uid}desc`}
                    style={styles.textElement}
                    onPress={() => {
                        this.sortEntriesAndHide((item) => {
                            const merticQuanitity = item.metricQuantities.filter(
                                (metricQuantity) => metricQuantity.metric.uid === metric.uid
                            )[0];

                            return merticQuanitity.quantity;
                        },                      "desc");
                    }}
                >
                    {"\u2022"} {`${metric.name} `} &#8595;
                </Text>
            );
        });

        return renderedMetricTagsAsc.concat(renderedMetricTagsDesc);

    }

    render() {

        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.closeModal()}
                onBackButtonPress={() => this.closeModal()}
            >
                <View style={styles.modalContent}>
                    <Text style={{ textAlign: "left", paddingLeft: 20, color: theme.inputTextColor, fontSize: 20 }}>Sort by:</Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("name", "asc"); }}
                    >
                        {"\u2022"} {i18n.t("sortItems.sortByName")} &#8593;
                    </Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("name", "desc"); }}
                    >
                        {"\u2022"} {i18n.t("sortItems.sortByName")} &#8595;
                    </Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("createdAt", "asc"); }}
                    >
                        {"\u2022"} {i18n.t("sortItems.sortByDate")} &#8593;
                    </Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("createdAt", "desc"); }}
                    >
                        {"\u2022"} {i18n.t("sortItems.sortByDate")} &#8595;
                    </Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("duration", "asc"); }}
                    >
                        {"\u2022"} {i18n.t("sortItems.sortByDuration")} &#8593;
                    </Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("duration", "desc"); }}
                    >
                        {"\u2022"} {i18n.t("sortItems.sortByDuration")} &#8595;
                    </Text>
                    {this.renderMetricTags(this.props.metrics)}
                </View>
            </Modal>
        );
    }

}
