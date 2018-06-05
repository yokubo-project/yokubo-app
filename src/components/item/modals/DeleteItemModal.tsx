import React from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
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
    taskUid: string;
    item: IItem;
    hide(): void;
}

export default class Component extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            inputGeneralError: null
        };
    }

    async deleteItem() {
        await taskStore.deleteItem(this.props.taskUid, this.props.item.uid);
        if (taskStore.error !== null) {
            switch (taskStore.error) {
                default:
                    this.setState({
                        inputGeneralError: "An unexpected error happened"
                    });
            }
        } else {
            this.setState({
                inputGeneralError: null
            });
            this.props.hide();
            Actions.pop();
        }
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
        if (this.props.item === null) {
            return null;
        }

        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.closeModal()}
                onBackButtonPress={() => this.closeModal()}
            >
                <View style={styles.modalContent}>
                    <View
                        style={{
                            marginTop: 15,
                            marginLeft: 15,
                            marginBottom: 15,
                            marginRight: 15,
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}
                    >
                        <Text
                            style={{ padding: 5, color: theme.inputTextColor, fontSize: 20, textAlign: "center", paddingTop: 10 }}
                        >
                            {i18n.t("deleteItem.deleteHint", { itemName: this.props.item.name })}
                        </Text>
                    </View>

                    <Button
                        raised={true}
                        buttonStyle={{ backgroundColor: theme.backgroundColor, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={i18n.t("deleteItem.deleteButton")}
                        onPress={() => { this.deleteItem(); }}
                    />
                </View>
            </Modal>
        );
    }

}
