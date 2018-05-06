import React from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";
import { FormInput, Button, FormValidationMessage } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import authStore from "../../../state/authStore";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

interface State {
    inputGeneralError: string;
}

interface Props {
    isVisible: boolean;
    hide: () => void;
}

const styles = StyleSheet.create({
    modalInputStyle: {
        color: inputTextColor,
        fontSize: 20,
        marginBottom: 10
    },
    modalContent: {
        backgroundColor,
        justifyContent: "center",
        alignItems: "stretch",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
});

export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            inputGeneralError: null
        };
    }

    async signOut() {
        this.props.hide();
        await authStore.signOut();
        Actions.home();
    }

    closeModal() {
        this.setState({
            inputGeneralError: null
        });
        this.props.hide();
    }

    showGeneralError() {
        if (this.state.inputGeneralError) {
            return <FormValidationMessage labelStyle={{ color: errorTextColor }}>{this.state.inputGeneralError}</FormValidationMessage>;
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
                    <Text style={{ color: inputTextColor, fontSize: 15, textAlign: "center", marginBottom: 20 }}>Are you sure you want to logut?</Text>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"Yes, logout"}
                        onPress={() => { this.signOut(); }}
                    />
                    {this.showGeneralError()}
                </View>
            </Modal>
        );
    }

}
