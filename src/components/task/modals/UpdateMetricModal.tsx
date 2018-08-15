import React from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { Button, FormInput, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";
import { Actions } from "react-native-router-flux";

import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";
import taskStore, { IMetric } from "../../../state/taskStore";

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: theme.backgroundColor,
        justifyContent: "center",
        alignItems: "stretch",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    modalInputStyle: {
        color: theme.inputTextColor,
        fontSize: 20,
        marginBottom: 10
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
    metric: IMetric;
    hide(): void;
    patchMetric(metric: { uid: string; name: string; unit: string }): void;
}

export default class UpdateMetricModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            name: this.props.metric.name,
            unit: this.props.metric.unit,
            inputNameError: null,
            inputUnitError: null
        };
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps !== this.props) {
            this.setState({
                name: nextProps.metric.name,
                unit: nextProps.metric.unit
            });
        }
    }

    closeModal() {
        this.setState({
            inputNameError: null,
            inputUnitError: null
        });
        this.props.hide();
    }

    patchMetric() {
        if (this.state.name.length < 2) {
            this.setState({
                inputNameError: i18n.t("patchMetric.nameToShort"),
                inputUnitError: null
            });

            return;
        } else if (this.state.unit.length < 1) {
            this.setState({
                inputNameError: null,
                inputUnitError: i18n.t("patchMetric.unitToShort")
            });

            return;
        }
        this.setState({
            inputNameError: null,
            inputUnitError: null
        });
        this.props.patchMetric({
            uid: this.props.metric.uid,
            name: this.state.name,
            unit: this.state.unit
        });
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
                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        defaultValue={this.state.name}
                        onChangeText={(value) => this.setState({ name: value })}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                    />
                    {this.showNameError()}

                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        defaultValue={this.state.unit}
                        onChangeText={(value) => this.setState({ unit: value })}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                    />
                    {this.showUnitError()}

                    <Button
                        raised={true}
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={i18n.t("patchMetric.patchMetricButton")}
                        onPress={() => this.patchMetric()}
                    />
                </View>
            </Modal>
        );
    }

}
