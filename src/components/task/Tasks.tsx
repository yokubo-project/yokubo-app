import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, TextStyle, Image, View, ScrollView, ViewStyle, TouchableOpacity } from "react-native";
import * as _ from "lodash";
import { Header } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import authStore from "../../state/authStore";
import taskStore from "../../state/taskStore";

import AddIcon from "../elements/AddIcon";
const primaryColor1 = "green";

interface State {
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    formContainer: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    listContainer: {
        flexGrow: 5,
        backgroundColor: "#fff",
    } as ViewStyle,
    formContainerTextElement: {
        position: "absolute",
        fontSize: 20,
        textAlign: "center",
        color: "white",
        bottom: 10,
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
    borderStyle: {
        borderColor: "black",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 25,
        flex: 1,
        overflow: "hidden"
    },
});

@observer
export default class Component extends React.Component<null, State> {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        taskStore.fetchTasks();
    }

    async processSignOut() {
        authStore.signOut();
        Actions.home();
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
                                Actions.items({
                                    task,
                                });
                            }}
                            style={styles.formContainerTouchableElement}
                            activeOpacity={0.8}
                        >
                            <Image
                                key={`column${columnIndex}`}
                                source={{ uri: task.image.file }}
                                style={styles.formContainerImageElement}
                            >
                                <Text
                                    key={`column${columnIndex}`}
                                    style={styles.formContainerTextElement}
                                >
                                    {task.name}
                                </Text>
                            </Image>
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
                        backgroundColor={primaryColor1}
                        rightComponent={{
                            icon: "rowing",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { this.processSignOut(); }
                        }}
                        centerComponent={{ text: "Tasks", style: { color: "#fff", fontSize: 20 } }}
                        statusBarProps={{ barStyle: "dark-content", translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <ScrollView style={styles.listContainer}>
                    {tasks}
                </ScrollView>

                <AddIcon
                    onPress={() => this.handleOnCreateTaskClick()}
                />

            </View>
        );
    }

}
