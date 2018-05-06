import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Header, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import TabNavigator from "react-native-tab-navigator";

import ItemsList from "./ItemsList";
import ItemsStats from "./ItemsStats";
import ItemsChart from "./ItemsChart";
import { IFullTask } from "../../state/taskStore";
import { theme } from "../../shared/styles";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    formContainer: {
        flexGrow: 7,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
});

interface State {
    selectedTab: string;
}

interface Props {
    task: IFullTask;
}
@observer
export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "itemList",
        };
    }

    changeTab(selectedTab) {
        this.setState({ selectedTab });
    }

    handleOnAddIconClick() {
        Actions.createItem({
            task: this.props.task,
        });
    }

    render() {
        const headerText = this.props.task.name.length > 20 ? `${this.props.task.name.slice(0, 20)}...` : this.props.task.name;

        return (
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={theme.backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        }}
                        centerComponent={{ text: headerText, style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        rightComponent={{
                            icon: "add",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { this.handleOnAddIconClick(); }
                        }}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>
                <View style={styles.formContainer}>
                    <TabNavigator>
                        <TabNavigator.Item
                            titleStyle={{ fontWeight: "bold", fontSize: 10 }}
                            selectedTitleStyle={{ marginTop: -1, marginBottom: 6, color: theme.backgroundColor }}
                            selected={this.state.selectedTab === "itemList"}
                            title={this.state.selectedTab === "itemList" ? "List" : null}
                            renderIcon={() => <Icon containerStyle={{ justifyContent: "center", alignItems: "center", marginTop: 12 }} color={"#a9a9a9"} name="list" size={33} />}
                            renderSelectedIcon={() => <Icon color={theme.backgroundColor} name="list" size={30} />}
                            onPress={() => this.changeTab("itemList")}>
                            <ItemsList
                                task={this.props.task}
                            />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            titleStyle={{ fontWeight: "bold", fontSize: 10 }}
                            selectedTitleStyle={{ marginTop: -1, marginBottom: 6, color: theme.backgroundColor }}
                            selected={this.state.selectedTab === "itemStats"}
                            title={this.state.selectedTab === "itemStats" ? "Statistics" : null}
                            renderIcon={() => <Icon containerStyle={{ justifyContent: "center", alignItems: "center", marginTop: 12 }} color={"#a9a9a9"} name="equalizer" size={33} />}
                            renderSelectedIcon={() => <Icon color={theme.backgroundColor} name="equalizer" size={30} />}
                            onPress={() => this.changeTab("itemStats")}>
                            <ItemsStats
                                task={this.props.task}
                            />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            titleStyle={{ fontWeight: "bold", fontSize: 10 }}
                            selectedTitleStyle={{ marginTop: -1, marginBottom: 6, color: theme.backgroundColor }}
                            selected={this.state.selectedTab === "itemCharts"}
                            title={this.state.selectedTab === "itemCharts" ? "Charts" : null}
                            renderIcon={() => <Icon containerStyle={{ justifyContent: "center", alignItems: "center", marginTop: 12 }} color={"#a9a9a9"} name="dashboard" size={33} />}
                            renderSelectedIcon={() => <Icon color={theme.backgroundColor} name="dashboard" size={30} />}
                            onPress={() => this.changeTab("itemCharts")}>
                            <ItemsChart
                                task={this.props.task}
                            />
                        </TabNavigator.Item>
                    </TabNavigator>
                </View>
            </View>
        );
    }

}
