import { Ionicons } from "@expo/vector-icons";
import * as _ from "lodash";
import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Button, Header, Icon, ListItem } from "react-native-elements";
import { material } from "react-native-typography";
import { HeaderBackButton, NavigationScreenProp, NavigationScreenProps } from "react-navigation";

import ModalButton from "../../shared/components/ModalButton";
import NavigationButton from "../../shared/components/NavigationButton";
import { formatDuration } from "../../shared/helpers";
import i18n from "../../shared/i18n";
import { theme } from "../../shared/styles";
import taskStore, { IFullTask, IItem } from "../../state/taskStore";
import ShowDetailsModal from "./modals/ShowDetailsModal";
import SortItemsModal from "./modals/SortItemsModal";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    } as ViewStyle,
    listElement: {
        backgroundColor: theme.backgroundColor,
        paddingTop: 12,
        paddingBottom: 12,
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderColor: theme.listItem.borderColor,
        borderBottomColor: theme.listItem.borderColor, // needs to be explicitly defined
        marginLeft: 0
    },
    listText: {
        // ...material.body1,
        color: theme.text.primaryColor,
        fontSize: 14,
        marginLeft: 10
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

interface IState {
    task: IFullTask;
    sortKey: string;
    sortDirection: string;
    previousItemLength: number;
    selectedItem: IItem;
    isShowDetailsModalVisible: boolean;
    isSortItemsModalVisible: boolean;
}

interface IProps {
    navigation: NavigationScreenProp<any, any>;
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
            sortKey: "period",
            sortDirection: "asc",
            previousItemLength: activeTask.items.length,
            selectedItem: null,
            isShowDetailsModalVisible: false,
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
                <Text style={styles.listText}>{i18n.t("itemList.date")}: {moment(entry.period[0]).format("DD.MM.YYYY")}</Text>
                <Text style={styles.listText}>{i18n.t("itemList.duration")}: {formatDuration(entry.duration)}</Text>
                {metrices}
            </View>
        );
    }

    handleOnEditItemClick(item: IItem) {
        this.props.navigation.navigate("PatchItem", {
            taskUid: this.state.task.uid,
            item
        });
    }

    showDetailsModal = (item: IItem) => this.setState({
        selectedItem: item,
        isShowDetailsModalVisible: true
    })
    hideDetailsModal = () => this.setState({
        isShowDetailsModalVisible: false
    })

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
        if (this.state.task.items.length === 0) {
            return (
                <View style={styles.mainContainer}>
                    <Text style={styles.welcomeScreen}>
                        {i18n.t("items.welcome", { taskName: this.state.task.name })} {"\n"}
                        {i18n.t("items.getStarted")}
                    </Text>

                    <SortItemsModal
                        isVisible={this.state.isSortItemsModalVisible}
                        hide={() => this.hideSortItemsModal()}
                        metrics={this.state.task.metrics}
                        sortItemsAndHide={(sortKey, sortDirection) => this.sortItemsAndHideSortItemsModal(sortKey, sortDirection)}
                    />
                </View>
            );
        }

        return (
            <View style={styles.mainContainer}>
                <FlatList
                    data={this.state.task.items}
                    keyExtractor={(item: any) => item.uid.toString()}
                    renderItem={({ item }: any) => (
                        <ListItem
                            containerStyle={styles.listElement}
                            title={item.name}
                            titleStyle={{ color: theme.text.linkColor, fontSize: 18 }}
                            subtitle={this.renderMetrices(item)}
                            underlayColor={theme.listItem.underlayColor}
                            onLongPress={() => this.handleOnEditItemClick(item)}
                            onPress={() => this.showDetailsModal(item)}
                            rightIcon={item.desc ? <View style={{ marginRight: 20 }}><Ionicons
                                name="md-book"
                                size={25}
                                color={theme.listItem.primaryColor}
                            /></View> : <View />}
                        />
                    )}
                />

                <SortItemsModal
                    isVisible={this.state.isSortItemsModalVisible}
                    hide={() => this.hideSortItemsModal()}
                    metrics={this.state.task.metrics}
                    sortItemsAndHide={(sortKey, sortDirection) => this.sortItemsAndHideSortItemsModal(sortKey, sortDirection)}
                />
                <ShowDetailsModal
                    isVisible={this.state.isShowDetailsModalVisible}
                    hide={() => this.hideDetailsModal()}
                    item={this.state.selectedItem}
                />
            </View>
        );
    }

}
