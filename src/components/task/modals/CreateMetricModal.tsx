import React from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { FormInput, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";
import * as uuid from "uuid";

import Button from "../../../shared/components/Button";
import TextInputField from "../../../shared/components/TextInputField";
import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";
import taskStore, { IFullItem } from "../../../state/taskStore";

const styles = StyleSheet.create({
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

interface IState {
    name: string;
    unit: string;
    inputNameError: string;
    inputUnitError: string;
}

interface IProps {
    isVisible: boolean;
    hide(): void;
    addMetric(uid: string, name: string, unit: string): void;
}

export default class CreateMetricModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            name: "",
            unit: "",
            inputNameError: null,
            inputUnitError: null
        };
    }

    closeModal() {
        this.setState({
            name: "",
            unit: "",
            inputNameError: null,
            inputUnitError: null
        });
        this.props.hide();
    }

    addMetric() {
        if (this.state.name.length < 2) {
            this.setState({
                inputNameError: i18n.t("addMetric.nameToShort"),
                inputUnitError: null
            });

            return;
        } else if (this.state.unit.length < 1) {
            this.setState({
                inputNameError: null,
                inputUnitError: i18n.t("addMetric.unitToShort")
            });

            return;
        }
        this.setState({
            name: "",
            unit: "",
            inputNameError: null,
            inputUnitError: null
        });
        this.props.addMetric(uuid.v4(), this.state.name, this.state.unit);
    }

    showNameError() {
        if (this.state.inputNameError) {
            return <FormValidationMessage>{this.state.inputNameError}</FormValidationMessage>;
        }

        return null;
    }

    showUnitError() {
        if (this.state.inputUnitError) {
            return <FormValidationMessage>{this.state.inputUnitError}</FormValidationMessage>;
        }

        return null;
    }

    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.closeModal()}
                onBackButtonPress={() => this.closeModal()}
            >
                <View style={styles.modalContent}>
                    <TextInputField
                        placeholder={i18n.t("addMetric.metricNamePlaceholder")}
                        onChangeText={(value) => this.setState({ name: value })}
                    />
                    {this.showNameError()}

                    <TextInputField
                        placeholder={i18n.t("addMetric.metricUnitPlaceholder")}
                        onChangeText={(value) => this.setState({ unit: value })}
                    />
                    {this.showUnitError()}

                    <Button
                        title={i18n.t("addMetric.addMetricButton")}
                        onPress={() => this.addMetric()}
                    />
                </View>
            </Modal>
        );
    }

}
