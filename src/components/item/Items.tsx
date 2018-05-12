import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, View, Text, ViewStyle, TextStyle } from "react-native";
import { Icon } from "react-native-elements";
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
    welcomeScreenContainer: {
        flexGrow: 1,
        backgroundColor: theme.backgroundColor,
        justifyContent: "center",
        alignItems: "center"
    } as ViewStyle,
    welcomeScreen: {
        flex: 1,
        color: theme.textColor,
        textAlign: "center",
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 20
    } as TextStyle,
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

    renderTabNavigation() {
        const headerText = this.props.task.name.length > 12 ? `${this.props.task.name.slice(0, 12)}...` : this.props.task.name;

        return (
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
                        headerText={headerText}
                        handleOnAddIconClick={() => this.handleOnAddIconClick()}
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
                        headerText={headerText}
                        handleOnAddIconClick={() => this.handleOnAddIconClick()}
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
                        headerText={headerText}
                        handleOnAddIconClick={() => this.handleOnAddIconClick()}
                    />
                </TabNavigator.Item>
            </TabNavigator>
        );
    }

    renderWelcomeScreen() {
        return (
            <View style={styles.welcomeScreenContainer}>
                <Text style={styles.welcomeScreen}>
                    {this.props.task.name} sounds like an awesome task! {"\n"}
                    Add your first items to it by clicking on the + sign on the top right corner.
                </Text>
            </View>
        );
    }

    render() {
        const content = this.props.task.items.length > 0 ? this.renderTabNavigation() : this.renderWelcomeScreen();

        return (
            <View style={styles.mainContainer}>
                {content}
            </View>
        );
    }

}
