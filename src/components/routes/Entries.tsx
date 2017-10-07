import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle, ScrollView } from "react-native";
import { Header, List, ListItem } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import AddIcon from "../elements/AddIcon";
import activities from "../../state/activities";

const primaryColor1 = "green";

interface State {
}

interface Props {
    uid: string;
    inputMetrics: any;
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
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    listContainer: {
        flexGrow: 6,
        // justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    button: {
        position: "absolute",
        bottom: 50,
        right: 50,
    },
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    tagElement: {
        backgroundColor: "gray",
        marginLeft: 10,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 3
    }
});

@observer
export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        activities.fetchEntries(this.props.uid);
    }

    handleOnIconClick() {
        Actions.createEntry({
            uid: this.props.uid,
            inputMetrics: this.props.inputMetrics
        });
    }

    sortEntries(sortKey, sortDirection) {
        activities.sortEntries(sortKey, sortDirection);
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={primaryColor1}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: "Entries", style: { color: "#fff", fontSize: 20 } }}
                        statusBarProps={{ barStyle: "dark-content", translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.tagContainer}>
                        <Text
                            style={styles.tagElement}
                            onPress={() => { this.sortEntries("name", "asc"); }}
                        >
                            {"name asc"}
                        </Text>
                        <Text
                            style={styles.tagElement}
                            onPress={() => { this.sortEntries("name", "desc"); }}
                        >
                            {"name desc"}
                        </Text>
                        <Text
                            style={styles.tagElement}
                            onPress={() => { this.sortEntries("datum", "asc"); }}
                        >
                            {"datum asc"}
                        </Text>
                        <Text
                            style={styles.tagElement}
                            onPress={() => { this.sortEntries("datum", "desc"); }}
                        >
                            {"datum desc"}
                        </Text>
                    </View>
                </View>

                <ScrollView style={styles.listContainer}>
                    <List containerStyle={{ marginBottom: 20 }}>
                        {
                            activities.entries.map((entry) => (
                                <ListItem
                                    key={entry.uid}
                                    title={entry.name}
                                    subtitle={entry.datum}
                                />
                            ))
                        }
                    </List>
                </ScrollView>

                <AddIcon
                    onPress={() => this.handleOnIconClick()}
                />

            </View>
        );
    }

}
