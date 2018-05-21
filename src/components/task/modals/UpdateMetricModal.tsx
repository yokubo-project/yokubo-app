import React from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";
import { FormInput, Button, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import authStore from "../../../state/authStore";
import { theme } from "../../../shared/styles";
import taskStore, { IMetric } from "../../../state/taskStore";
import i18n from "../../../shared/i18n";

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
    },
});

interface State {
    name: string;
    unit: string;
}

interface Props {
    isVisible: boolean;
    hide: () => void;
    patchMetric: (metric: { uid: string; name: string, unit: string }) => void;
    metric: IMetric;
}

export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.metric.name,
            unit: this.props.metric.unit
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.setState({
                name: nextProps.metric.name,
                unit: nextProps.metric.unit
            });
        }
    }

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
                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        defaultValue={this.state.name}
                        onChangeText={(value) => this.setState({ name: value })}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                    />
                    <FormInput
                        inputStyle={styles.modalInputStyle}
                        defaultValue={this.state.unit}
                        onChangeText={(value) => this.setState({ unit: value })}
                        underlineColorAndroid={theme.textColor}
                        selectionColor={theme.inputTextColor} // cursor color
                    />
                    <Button
                        raised
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={i18n.t("patchTask.patchMetricButton")}
                        onPress={() => {
                            this.props.patchMetric({
                                uid: this.props.metric.uid,
                                name: this.state.name,
                                unit: this.state.unit
                            });
                        }}
                    />
                </View>
            </Modal>
        );
    }

}