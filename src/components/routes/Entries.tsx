import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle, ScrollView } from "react-native";
import { Header, Button, List, ListItem } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import activities from "../../state/activities";

const primaryColor1 = "green";

interface State {
}

interface Props {
    uid: string;
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
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    listContainer: {
        flexGrow: 5,
        // justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    button: {
        position: "absolute",
        bottom: 50,
        right: 50,
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
        Actions.createEntry({ uid: this.props.uid });
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
                    <Text>
                        {`Hello, ${this.props.uid}`}
                    </Text>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                        textStyle={{ textAlign: "center", fontSize: 18 }}
                        title={"CREATE ENTRY"}
                        onPress={() => { this.handleOnIconClick(); }}
                    />
                </View>

                <ScrollView style={styles.listContainer}>
                    <List containerStyle={{ marginBottom: 20 }}>
                        {
                            activities.entries.map((entry) => (
                                <ListItem
                                    key={entry.uid}
                                    title={entry.name}
                                />
                            ))
                        }
                    </List>
                </ScrollView>

            </View>
        );
    }

}
