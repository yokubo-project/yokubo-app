import React from "react";
import { StyleSheet, Text, View, TextStyle, ScrollView } from "react-native";
import { FormInput, Button, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import authStore from "../../../state/authStore";
import { theme } from "../../../shared/styles";
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

interface State {
    inputGeneralError: string;
}

interface Props {
    isVisible: boolean;
    hide: () => void;
    sortItemsAndHide: (sortKey: string, sortDirection: string) => void;
    metrics: any;
}

export default class Component extends React.Component<Props, State> {

    sortEntriesAndHide(sortKey, sortDirection) {
        this.props.sortItemsAndHide(sortKey, sortDirection);
    }

    closeModal() {
        this.props.hide();
    }

    renderMetricTags(metrics) {
        const renderedMetricTagsAsc = metrics.map(metric => {
            return (
                <Text
                    key={`${metric.uid}asc`}
                    style={styles.textElement}
                    onPress={() => {
                        this.sortEntriesAndHide((item) => {
                            const merticQuanitity = item.metricQuantities.filter((metricQuantity) => metricQuantity.metric.uid === metric.uid)[0];
                            return merticQuanitity.quantity;
                        }, "asc");
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
                            const merticQuanitity = item.metricQuantities.filter((metricQuantity) => metricQuantity.metric.uid === metric.uid)[0];
                            return merticQuanitity.quantity;
                        }, "desc");
                    }}
                >
                    {"\u2022"} {`${metric.name} `} &#8595;
                </Text>
            );
        });
        const renderedMetricTags = renderedMetricTagsAsc.concat(renderedMetricTagsDesc);

        return renderedMetricTags;
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
                        {"\u2022"} {"Name"} &#8593;
                    </Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("name", "desc"); }}
                    >
                        {"\u2022"} {"Name"} &#8595;
                    </Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("createdAt", "asc"); }}
                    >
                        {"\u2022"} {"Datum"} &#8593;
                    </Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("createdAt", "desc"); }}
                    >
                        {"\u2022"} {"Datum"} &#8595;
                    </Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("duration", "asc"); }}
                    >
                        {"\u2022"} {"Duration"} &#8593;
                    </Text>
                    <Text
                        style={styles.textElement}
                        onPress={() => { this.sortEntriesAndHide("duration", "desc"); }}
                    >
                        {"\u2022"} {"Duration"} &#8595;
                    </Text>
                    {this.renderMetricTags(this.props.metrics)}
                </View>
            </Modal>
        );
    }

}
