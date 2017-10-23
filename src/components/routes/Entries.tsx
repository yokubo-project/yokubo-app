import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Header, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import TabNavigator from "react-native-tab-navigator";

import ListEntries from "./ListEntries";
import StatEntries from "./StatEntries";
import ChartEntries from "./ChartEntries";

const primaryColor1 = "green";

interface State {
    selectedTab: string;
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
        flexGrow: 6,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
});

@observer
export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "entryList",
        };
    }

    changeTab(selectedTab) {
        this.setState({ selectedTab });
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
                    <TabNavigator>
                        <TabNavigator.Item
                            titleStyle={{ fontWeight: "bold", fontSize: 10 }}
                            selectedTitleStyle={{ marginTop: -1, marginBottom: 6, color: primaryColor1 }}
                            selected={this.state.selectedTab === "entryList"}
                            title={this.state.selectedTab === "entryList" ? "List" : null}
                            renderIcon={() => <Icon containerStyle={{ justifyContent: "center", alignItems: "center", marginTop: 12 }} color={"#a9a9a9"} name="list" size={33} />}
                            renderSelectedIcon={() => <Icon color={primaryColor1} name="list" size={30} />}
                            onPress={() => this.changeTab("entryList")}>
                            <ListEntries
                                uid={this.props.uid}
                                inputMetrics={this.props.inputMetrics}
                            />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            titleStyle={{ fontWeight: "bold", fontSize: 10 }}
                            selectedTitleStyle={{ marginTop: -1, marginBottom: 6, color: primaryColor1 }}
                            selected={this.state.selectedTab === "entryStats"}
                            title={this.state.selectedTab === "entryStats" ? "Statistics" : null}
                            renderIcon={() => <Icon containerStyle={{ justifyContent: "center", alignItems: "center", marginTop: 12 }} color={"#a9a9a9"} name="equalizer" size={33} />}
                            renderSelectedIcon={() => <Icon color={primaryColor1} name="equalizer" size={30} />}
                            onPress={() => this.changeTab("entryStats")}>
                            <StatEntries
                                uid={this.props.uid}
                                inputMetrics={this.props.inputMetrics}
                            />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            titleStyle={{ fontWeight: "bold", fontSize: 10 }}
                            selectedTitleStyle={{ marginTop: -1, marginBottom: 6, color: primaryColor1 }}
                            selected={this.state.selectedTab === "entryCharts"}
                            title={this.state.selectedTab === "entryCharts" ? "Charts" : null}
                            renderIcon={() => <Icon containerStyle={{ justifyContent: "center", alignItems: "center", marginTop: 12 }} color={"#a9a9a9"} name="dashboard" size={33} />}
                            renderSelectedIcon={() => <Icon color={primaryColor1} name="dashboard" size={30} />}
                            onPress={() => this.changeTab("entryCharts")}>
                            <ChartEntries
                                uid={this.props.uid}
                                inputMetrics={this.props.inputMetrics}
                            />
                        </TabNavigator.Item>                        
                    </TabNavigator>
                </View>

            </View>
        );
    }

}
