import * as _ from "lodash";
import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Button, Header, Icon, List, ListItem } from "react-native-elements";
import { material } from "react-native-typography";
import { HeaderBackButton } from "react-navigation";

import ModalButton from "../../shared/components/ModalButton";
import NavigationButton from "../../shared/components/NavigationButton";
import { formatDuration } from "../../shared/helpers";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import taskStore, { IFullTask, IItem } from "../../state/taskStore";
import SortItemsModal from "./modals/SortItemsModal";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    headerContainer: {
        height: 90,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    formContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    scrollViewContainer: {
        flexGrow: 6,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    listElement: {
        backgroundColor: theme.backgroundColor,
        paddingTop: 12,
        paddingBottom: 12,
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderColor: "gray",
        marginLeft: 0
    },
    listText: {
        // ...material.body1,
        color: theme.inputTextColor,
        fontSize: 14,
        marginLeft: 10
    }
});

interface IState {
    task: IFullTask;
    sortKey: string;
    sortDirection: string;
    previousItemLength: number;
    isSortItemsModalVisible: boolean;
}

interface IProps {
    task: IFullTask;
    headerText: string;
    navigation: any;
}
@observer
export default class ItemsList extends React.Component<any, IState> {

    static navigationOptions = ({ navigation }: any) => {
        const taskName = navigation.getParam("taskName");
        const task = navigation.getParam("task");

        return {
            headerLeft: (
                <HeaderBackButton
                    tintColor="white"
                    onPress={() => { navigation.navigate("Tasks"); }}
                />
            ),
            title: taskName,
            headerRight: (
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <ModalButton
                        navigation={navigation}
                        getParameter="showSortItemsModal"
                        ioniconName="md-reorder"
                        ioniconColor="white"
                    />
                    <NavigationButton
                        navigation={navigation}
                        additionalProps={{ task }}
                        navigateToScreen="CreateItem"
                        ioniconName="md-add"
                        ioniconColor="white"
                    />
                </View>
            )
        };
    }

    // tslint:disable-next-line:member-ordering
    constructor(props: IProps) {
        super(props);

        const activeTask = taskStore.getActiveTask();
        this.state = {
            task: activeTask,
            sortKey: "createdAt",
            sortDirection: "asc",
            previousItemLength: activeTask.items.length,
            isSortItemsModalVisible: false
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            taskName: this.getHeaderText(),
            task: this.state.task,
            showSortItemsModal: this.showSortItemsModal
        });
    }

    getHeaderText() {
        return this.state.task.name.length > 12 ?
            `${this.state.task.name.slice(0, 12)}...` :
            this.state.task.name;
    }

    componentWillReceiveProps(nextProps: IProps) {
        this.resortEntries();
    }

    renderDate(duration: string) {
        return Math.floor(moment.duration(duration).asHours()) + moment.utc(duration).format("[h] mm[m] ss[s]");
    }

    resortEntries() {
        const task = this.state.task;

        if (this.state.task.items.length > this.state.previousItemLength) {
            task.items = _.orderBy(task.items, this.state.sortKey, this.state.sortDirection);
            this.setState({
                task,
                previousItemLength: this.state.task.items.length
            });
        }
    }

    sortEntries(sortKey: string, sortDirection: string) {
        const task = this.state.task;
        task.items = _.orderBy(task.items, sortKey, sortDirection);
        this.setState({ task, sortKey: sortKey, sortDirection: sortDirection });
    }

    renderMetrices(entry: any) {
        const metrices = entry.metricQuantities.map(metric => {
            return (
                <Text style={styles.listText} key={metric.uid}>
                    {metric.metric.name}: {metric.quantity} {metric.metric.unit}
                </Text>
            );
        });

        return (
            <View>
                <Text style={styles.listText}>{i18n.t("itemList.date")}: {moment(entry.createdAt).format("DD.MM.YYYY")}</Text>
                {metrices}
                <Text style={styles.listText}>{i18n.t("itemList.duration")}: {formatDuration(entry.duration)}</Text>
            </View>
        );
    }

    handleOnEditItemClick(item: IItem) {
        this.props.navigation.navigate("PatchItem", {
            taskUid: this.state.task.uid,
            item
        });
    }

    showSortItemsModal = () => this.setState({
        isSortItemsModalVisible: true
    })
    hideSortItemsModal = () => this.setState({
        isSortItemsModalVisible: false
    })
    sortItemsAndHideSortItemsModal = (sortKey: string, sortDirection: string) => {
        this.sortEntries(sortKey, sortDirection);
        this.setState({
            isSortItemsModalVisible: false
        });
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {/* <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: "row" }}
                        backgroundColor={theme.backgroundColor}
                        leftComponent={{
                            icon: "arrow-back",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { Actions.pop(); }
                        } as any}
                        centerComponent={{ text: this.props.headerText, style: { color: "#fff", fontSize: 20, fontWeight: "bold" } } as any}
                        rightComponent={
                            <View style={{ flex: 1, flexDirection: "row", marginTop: 23 }}>
                                <Icon
                                    name="sort"
                                    color="#fff"
                                    underlayColor="transparent"
                                    iconStyle={{ marginRight: 16 }}
                                    onPress={() => { this.showSortItemsModal(); }}
                                />
                                <Icon
                                    name="add"
                                    color="#fff"
                                    underlayColor="transparent"
                                    onPress={() => { this.props.handleOnAddIconClick(); }}
                                />
                            </View>}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View> */}

                <ScrollView style={styles.scrollViewContainer}>
                    <List containerStyle={{ marginBottom: 20, borderTopWidth: 0, marginLeft: 0, paddingLeft: 0, marginTop: 0 }}>
                        <FlatList
                            data={this.state.task.items}
                            keyExtractor={(item: any) => item.uid.toString()}
                            renderItem={({ item }: any) => (
                                <ListItem
                                    containerStyle={styles.listElement}
                                    title={item.name}
                                    titleStyle={{ color: theme.textColor, fontSize: 18, fontWeight: "bold" }}
                                    subtitle={this.renderMetrices(item)}
                                    hideChevron={true}
                                    underlayColor={theme.underlayColor}
                                    onLongPress={() => this.handleOnEditItemClick(item)}
                                />
                            )}
                        />
                    </List>
                </ScrollView>

                <SortItemsModal
                    isVisible={this.state.isSortItemsModalVisible}
                    hide={() => this.hideSortItemsModal()}
                    metrics={this.state.task.metrics}
                    sortItemsAndHide={(sortKey, sortDirection) => this.sortItemsAndHideSortItemsModal(sortKey, sortDirection)}
                />
            </View>
        );
    }

}
