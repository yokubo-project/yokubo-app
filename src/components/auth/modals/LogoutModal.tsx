import React from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { Button, FormInput, FormValidationMessage } from "react-native-elements";
import Modal from "react-native-modal";
import { Actions } from "react-native-router-flux";

import i18n from "../../../shared/i18n";
import { theme } from "../../../shared/styles";
import authStore from "../../../state/authStore";

const styles = StyleSheet.create({
    modalInputStyle: {
        color: theme.inputTextColor,
        fontSize: 20,
        marginBottom: 10
    },
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
    inputGeneralError: string;
}

interface IProps {
    isVisible: boolean;
    hide(): void;
}

export default class Component extends React.Component<IProps, IState> {

    constructor(props: IProps) {
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
            return <FormValidationMessage>{this.state.inputGeneralError}</FormValidationMessage>;
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
                    <Text
                        style={{
                            color: theme.inputTextColor,
                            fontSize: 15,
                            textAlign: "center",
                            marginBottom: 20
                        }}
                    >
                        {i18n.t("logout.logoutHint")}
                    </Text>
                    <Button
                        raised={true}
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={i18n.t("logout.logoutButton")}
                        onPress={() => { this.signOut(); }}
                    />
                    {this.showGeneralError()}
                </View>
            </Modal>
        );
    }

}
