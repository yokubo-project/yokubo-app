import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Header, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import TabNavigator from "react-native-tab-navigator";

import ItemsList from "./ItemsList";
import ItemsStats from "./ItemsStats";
import ItemsChart from "./ItemsChart";
import AddIcon from "../elements/AddIcon";
import DeleteTask from "../task/DeleteTask";

import { IFullTask } from "../../state/taskStore";

const primaryColor1 = "green";

interface State {
    selectedTab: string;
    showDeleteModal: boolean;
}

interface Props {
    task: IFullTask;
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
            selectedTab: "itemList",
            showDeleteModal: false
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

    handleOnUpdateTaskClick(task) {
        Actions.patchTask({ task });
    }

    hideVisibility() {
        this.setState({
            showDeleteModal: false
        });
    }

    showVisibility() {
        this.setState({
            showDeleteModal: true
        });
    }

    render() {

        const headerText = this.props.task.name.length > 20 ? `${this.props.task.name.slice(0, 20)}...` : this.props.task.name;

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
                        rightComponent={
                            <View style={{ flex: 1, flexDirection: "row", marginTop: 23 }}>
                                <Icon
                                    name="delete"
                                    color="#fff"
                                    underlayColor="transparent"
                                    style={{ marginRight: 12 }}
                                    onPress={() => { this.showVisibility(); }}
                                />
                                <Icon
                                    name="edit"
                                    color="#fff"
                                    underlayColor="transparent"
                                    onPress={() => { this.handleOnUpdateTaskClick(this.props.task); }}
                                />
                            </View>
                        }
                        centerComponent={{ text: headerText, style: { color: "#fff", fontSize: 20 } }}
                        statusBarProps={{ barStyle: "dark-content", translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <DeleteTask
                    taskUid={this.props.task.uid}
                    visible={this.state.showDeleteModal}
                    hideVisibility={() => this.hideVisibility()}
                />

                <View style={styles.formContainer}>
                    <TabNavigator>
                        <TabNavigator.Item
                            titleStyle={{ fontWeight: "bold", fontSize: 10 }}
                            selectedTitleStyle={{ marginTop: -1, marginBottom: 6, color: primaryColor1 }}
                            selected={this.state.selectedTab === "itemList"}
                            title={this.state.selectedTab === "itemList" ? "List" : null}
                            renderIcon={() => <Icon containerStyle={{ justifyContent: "center", alignItems: "center", marginTop: 12 }} color={"#a9a9a9"} name="list" size={33} />}
                            renderSelectedIcon={() => <Icon color={primaryColor1} name="list" size={30} />}
                            onPress={() => this.changeTab("itemList")}>
                            <ItemsList
                                task={this.props.task}
                            />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            titleStyle={{ fontWeight: "bold", fontSize: 10 }}
                            selectedTitleStyle={{ marginTop: -1, marginBottom: 6, color: primaryColor1 }}
                            selected={this.state.selectedTab === "itemStats"}
                            title={this.state.selectedTab === "itemStats" ? "Statistics" : null}
                            renderIcon={() => <Icon containerStyle={{ justifyContent: "center", alignItems: "center", marginTop: 12 }} color={"#a9a9a9"} name="equalizer" size={33} />}
                            renderSelectedIcon={() => <Icon color={primaryColor1} name="equalizer" size={30} />}
                            onPress={() => this.changeTab("itemStats")}>
                            <ItemsStats
                                task={this.props.task}
                            />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            titleStyle={{ fontWeight: "bold", fontSize: 10 }}
                            selectedTitleStyle={{ marginTop: -1, marginBottom: 6, color: primaryColor1 }}
                            selected={this.state.selectedTab === "itemCharts"}
                            title={this.state.selectedTab === "itemCharts" ? "Charts" : null}
                            renderIcon={() => <Icon containerStyle={{ justifyContent: "center", alignItems: "center", marginTop: 12 }} color={"#a9a9a9"} name="dashboard" size={33} />}
                            renderSelectedIcon={() => <Icon color={primaryColor1} name="dashboard" size={30} />}
                            onPress={() => this.changeTab("itemCharts")}>
                            <ItemsChart
                                task={this.props.task}
                            />
                        </TabNavigator.Item>
                    </TabNavigator>
                </View>

                <AddIcon
                    onPress={() => this.handleOnAddIconClick()}
                />

            </View>
        );
    }

}
