import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, TextStyle, Image, View, ScrollView, ViewStyle, TouchableOpacity } from "react-native";
import * as _ from "lodash";
import { Header, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import authStore from "../../state/authStore";
import taskStore from "../../state/taskStore";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: backgroundColor,
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor
    } as ViewStyle,
    listContainer: {
        flexGrow: 7,
        backgroundColor,
    } as ViewStyle,
    formContainer: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: backgroundColor,
    } as ViewStyle,
    formContainerXElement: {
        flexDirection: "row",
        justifyContent: "center",
        position: "absolute",
        bottom: 10,
        width: "100%"
    },
    formContainerTextElement: {
        fontSize: 20,
        textAlign: "center",
        color: "white",
    } as TextStyle,
    formContainerTouchableElement: {
        margin: 10,
        flex: 1,
    } as TextStyle,
    formContainerImageElement: {
        height: 200,
        // Center child
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    } as TextStyle,
    formContainerEmpty: {
        flex: 1,
        margin: 10,
        height: 200,
    },
});

@observer
export default class Component extends React.Component<null, null> {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        taskStore.fetchTasks();
    }

    handleOnCreateTaskClick() {
        Actions.createTask();
    }

    renderTasks(tasks) {
        let taskIndex = 0;
        const columnCount = 2;
        const rowCount = _.ceil(tasks.length / columnCount);

        const rows = [];
        _.range(rowCount).forEach((rowIndex) => {

            const columns = [];
            _.range(columnCount).forEach((columnIndex) => {

                if (taskIndex < tasks.length) {
                    const task = tasks[taskIndex];

                    columns.push(
                        <TouchableOpacity
                            key={`column${columnIndex}`}
                            onPress={() => {
                                Actions.items({ task });
                            }}
                            onLongPress={() => {
                                Actions.patchTask({ task });
                            }}
                            style={styles.formContainerTouchableElement}
                            activeOpacity={0.8}
                        >
                            <Image
                                key={`image${columnIndex}`}
                                source={{ uri: task.image.file }}
                                style={styles.formContainerImageElement}
                                // @ts-ignore
                                borderRadius={10}
                            >
                            </Image>
                            <View style={styles.formContainerXElement}>
                                <Text
                                    key={`text${columnIndex}`}
                                    style={styles.formContainerTextElement}
                                >
                                    {task.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                } else {
                    columns.push(
                        <Text
                            key={`column${columnIndex}`}
                            style={styles.formContainerEmpty}
                        >
                        </Text>
                    );
                }
                ++taskIndex;
            });
            rows.push(
                <View key={`row${rowIndex}`} style={styles.formContainer}>
                    {columns}
                </View>
            );
        });

        return rows;
    }

    render() {
        const tasks = this.renderTasks(taskStore.tasks);
        return (
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={backgroundColor}
                        leftComponent={{
                            icon: "account-circle",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.profile(); }
                        }}
                        centerComponent={{ text: "Tasks", style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        rightComponent={{
                            icon: "add",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { this.handleOnCreateTaskClick(); }
                        }}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>
                <ScrollView style={styles.listContainer}>
                    {tasks}
                </ScrollView>
            </View>
        );
    }

}
