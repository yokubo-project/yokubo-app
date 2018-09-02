import * as _ from "lodash";
import { observer } from "mobx-react";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { Button, Header } from "react-native-elements";
import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import NavigationButton from "../../shared/components/NavigationButton";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import authStore from "../../state/authStore";
import taskStore from "../../state/taskStore";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    listContainer: {
        flexGrow: 7,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    formContainer: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor
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
        color: "white"
    } as TextStyle,
    formContainerTouchableElement: {
        margin: 10,
        flex: 1
    } as TextStyle,
    formContainerImageElement: {
        height: 200,
        // Center child
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    } as TextStyle,
    formContainerEmpty: {
        flex: 1,
        margin: 10,
        height: 200
    },
    welcomeScreen: {
        flex: 1,
        color: theme.text.primaryColor,
        textAlign: "center",
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 20
    } as TextStyle
});

// tslint:disable-next-line:no-empty-interface
interface IProps {
    navigation: NavigationScreenProp<any, any>;
}
interface IState {
    loadedTasks: boolean;
}
@observer
export default class Tasks extends React.Component<IProps, IState> {

    static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            title: i18n.t("tasks.header"),
            headerLeft: (
                <NavigationButton
                    navigation={navigation}
                    navigateToScreen="Profile"
                    ioniconName="md-more"
                    ioniconColor="white"
                />
            ),
            headerRight: (
                <NavigationButton
                    navigation={navigation}
                    navigateToScreen="CreateTask"
                    ioniconName="md-add"
                    ioniconColor="white"
                />
            )
        };
    }

    // tslint:disable-next-line:member-ordering
    constructor(props: IProps) {
        super(props);

        this.state = {
            loadedTasks: false
        };
    }

    componentWillMount() {
        authStore.getProfile();
    }

    async componentDidMount() {
        await taskStore.fetchTasks();
        this.setState({
            loadedTasks: true
        });
    }

    renderTasks(tasks: any) {
        let taskIndex = 0;
        const columnCount = 2;
        const rowCount = _.ceil(tasks.length / columnCount);

        const rows = [];
        // tslint:disable-next-line:underscore-consistent-invocation
        _.range(rowCount).forEach((rowIndex) => {

            const columns = [];
            // tslint:disable-next-line:underscore-consistent-invocation
            _.range(columnCount).forEach((columnIndex) => {

                if (taskIndex < tasks.length) {
                    const task = tasks[taskIndex];
                    columns.push(
                        <TouchableOpacity
                            key={`column${columnIndex}`}
                            onPress={() => {
                                taskStore.setActiveTask(task);
                                this.props.navigation.navigate("ItemTabNavigation");
                            }}
                            onLongPress={() => {
                                this.props.navigation.navigate("PatchTask", { task });
                            }}
                            style={styles.formContainerTouchableElement}
                            activeOpacity={0.8}
                        >
                            <Image
                                key={`image${columnIndex}`}
                                source={{ uri: task.image.thumbnail }}
                                style={styles.formContainerImageElement}
                                // @ts-ignore
                                borderRadius={10}
                            />
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
                        />
                    );
                }
                // tslint:disable-next-line:no-increment-decrement
                ++taskIndex;
            });
            rows.push(
                <View key={`row${rowIndex}`} style={styles.formContainer}>
                    {columns}
                </View>
            );
        });

        return (
            <ScrollView style={styles.listContainer}>
                {rows}
            </ScrollView>
        );
    }

    renderWelcomeScreen() {
        return (
            <Text style={styles.welcomeScreen}>
                {i18n.t("tasks.welcome", { username: authStore.profile ? authStore.profile.name : "" })} {"\n"}
                {i18n.t("tasks.getStarted")}
            </Text>
        );
    }

    render() {

        let content;
        if (!this.state.loadedTasks) {
            content = null;
        } else if (taskStore.tasks.length > 0) {
            content = this.renderTasks(taskStore.tasks);
        } else {
            content = this.renderWelcomeScreen();
        }

        return (
            <View style={styles.mainContainer}>
                {content}
            </View>
        );
    }

}
