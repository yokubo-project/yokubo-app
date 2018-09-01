import moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { FormInput, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";

import Button from "../../../shared/components/Button";
import { formatDuration } from "../../../shared/helpers";
import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";
import taskStore, { IItem } from "../../../state/taskStore";

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: theme.backgroundColor,
        paddingLeft: 10,
        paddingRight: 10
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: theme.backgroundColor,
        marginBottom: 20
    } as ViewStyle,
    primaryText: {
        color: theme.text.linkColor,
        fontSize: 22,
        textAlign: "center",
        marginBottom: 20
    },
    secondaryText: {
        color: theme.text.primaryColor,
        fontSize: 18,
        textAlign: "center",
        marginBottom: 16
    }
});

// tslint:disable-next-line:no-empty-interface
interface IState { }

interface IProps {
    isVisible: boolean;
    item: IItem;
    hide(): void;
}

export default class Component extends React.Component<IProps, IState> {

    closeModal() {
        this.props.hide();
    }

    renderMetrices(entry: any) {
        const metrices = entry.metricQuantities.map(metric => {
            return (
                <Text style={styles.secondaryText} key={metric.uid}>
                    {metric.metric.name}: {metric.quantity} {metric.metric.unit}
                </Text>
            );
        });

        return (
            <View>{metrices}</View>
        );
    }

    render() {
        if (this.props.item === null) {
            return null;
        }

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
                        <View style={{ paddingTop: 30 }} />
                        <Text style={styles.primaryText}>
                            {this.props.item.name}
                        </Text>
                        <Text style={styles.secondaryText}>
                            {i18n.t("showItemDetails.startDate", {
                                itemStart: moment(this.props.item.period[0]).format("DD.MM.YYYY HH:mm")
                            })}
                        </Text>
                        <Text style={styles.secondaryText}>
                            {i18n.t("showItemDetails.endDate", {
                                itemÈnd: moment(this.props.item.period[1]).format("DD.MM.YYYY HH:mm")
                            })}
                        </Text>
                        <Text style={styles.secondaryText}>
                            {i18n.t("showItemDetails.duration", { itemDuration: formatDuration(this.props.item.duration) })}
                        </Text>
                        {this.renderMetrices(this.props.item)}
                        {/* <Text style={styles.secondaryText}>
                            {i18n.t("showItemDetails.createdAt", {
                                itemCreatedAt: moment(this.props.item.createdAt).format("DD.MM.YYYY HH:mm")
                            })}
                        </Text> */}
                        {this.props.item.desc !== null &&
                            <Text style={styles.secondaryText}>
                                {i18n.t("showItemDetails.desc", { itemDescription: this.props.item.desc })}
                            </Text>
                        }
                        <View style={styles.buttonContainer}>
                            <Button
                                title={i18n.t("showItemDetails.closeButton")}
                                onPress={() => { this.closeModal(); }}
                            />
                        </View>
                        <View style={{ paddingBottom: 30 }} />
                    </ScrollView>
                </View>
            </Modal>
        );
    }

}
