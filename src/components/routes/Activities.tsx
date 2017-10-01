import React from "react";
import { observer } from "mobx-react";
import * as _ from "lodash";
import { StyleSheet, Text, TextStyle, Image, View, ScrollView, ViewStyle, TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import auth from "../../state/auth";
import AddIcon from "../elements/AddIcon";

import activities from "../../state/activities";

const primaryColor1 = "green";

interface State {
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // justifyContent: "space-around",
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
        // justifyContent: "space-around",
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
        activities.fetchActivities();
    }

    async processSignOut() {
        auth.signOut();
        Actions.home();
    }

    handleOnIconClick() {
        Actions.createActivity();
    }

    renderActivities(activities) {

        let activityIndex = 0;
        const columnCount = 2;
        const rowCount = _.ceil(activities.length / columnCount);

        const rows = [];
        _.range(rowCount).forEach((rowIndex) => {

            const columns = [];
            _.range(columnCount).forEach((columnIndex) => {

                if (activityIndex < activities.length) {

                    const activity = activities[activityIndex];
                    columns.push(
                        <TouchableOpacity
                            key={`column${columnIndex}`}
                            onPress={() => { Actions.entries({ uid: activity.uid }); }}
                            style={styles.formContainerTouchableElement}
                            activeOpacity={0.8}
                        >
                            <Image
                                key={`column${columnIndex}`}
                                source={{ uri: activity.imageUrl }}
                                style={styles.formContainerImageElement}
                            >
                                <Text
                                    key={`column${columnIndex}`}
                                    style={styles.formContainerTextElement}
                                >
                                    {activity.name}
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
                ++activityIndex;

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

        const myActivities = this.renderActivities(activities.activities);

        return (
            <View style={styles.mainContainer}>

                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={primaryColor1}
                        rightComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { this.processSignOut(); }
                        }}
                        centerComponent={{ text: "Activities", style: { color: "#fff", fontSize: 20 } }}
                        statusBarProps={{ barStyle: "dark-content", translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <ScrollView style={styles.listContainer}>
                    {myActivities}
                </ScrollView>

                <AddIcon
                    onPress={() => this.handleOnIconClick()}
                />

            </View>
        );
    }

}
