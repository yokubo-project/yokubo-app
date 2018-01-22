import React from "react";
import { StyleSheet, View, ViewStyle, Text } from "react-native";
import { Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";

import taskStore from "../../state/taskStore";
import { IFullTask } from "../../state/taskStore";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

interface State {
}

interface Props {
    task: IFullTask;
    visible: boolean;
    hideVisibility: () => void;
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: backgroundColor,
    } as ViewStyle,
    inputStyle: {
        marginRight: 100,
        color: "black",
        fontSize: 20
    },
    modalInputStyle: {
        color: "black",
        fontSize: 20
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
    }

    async deleteTask() {
        taskStore.deleteTask(this.props.task.uid);
        Actions.pop();
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <Modal
                    isVisible={this.props.visible}
                    onBackdropPress={() => this.props.hideVisibility()}
                    onBackButtonPress={() => this.props.hideVisibility()}
                >
                    <View style={styles.modalContent}>
                        <View style={{
                            marginTop: 15,
                            marginLeft: 15,
                            marginBottom: 15,
                            marginRight: 15,
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}>
                            <Text
                                style={{ padding: 5, color: inputTextColor, fontSize: 20, textAlign: "center", paddingTop: 10 }}
                            >
                                Delete task
                            </Text>
                            <Text
                                style={{ color: textColor, fontSize: 20, textAlign: "center", paddingTop: 10 }}
                            >
                                {this.props.task.name}
                            </Text>
                            <Text
                                style={{ padding: 5, color: inputTextColor, fontSize: 20, textAlign: "center", paddingTop: 10 }}
                            >
                                ?
                            </Text>
                        </View>

                        <Button
                            raised
                            buttonStyle={{ backgroundColor, borderRadius: 0 }}
                            textStyle={{ textAlign: "center", fontSize: 18 }}
                            title={"DELETE"}
                            onPress={() => { this.deleteTask(); }}
                        />
                    </View>
                </Modal>

            </View>
        );
    }

}
