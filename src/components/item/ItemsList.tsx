import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle, TextStyle, ScrollView, FlatList } from "react-native";
import { Header, List, ListItem, Button, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { material } from "react-native-typography";
import * as _ from "lodash";
import moment from "moment";

import { IFullTask } from "../../state/taskStore";
import { theme } from "../../shared/styles";
import SortItemsModal from "./modals/SortItemsModal";
import { formatDuration } from "../../shared/helpers";

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
        flex: 2,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    scrollViewContainer: {
        flexGrow: 6,
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
    listElement: {
        backgroundColor: theme.backgroundColor,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: "gray",
        marginLeft: 0,
    },
    listText: {
        // ...material.body1, 
        color: theme.inputTextColor,
        fontSize: 14,
        marginLeft: 10
    }
});

interface State {
    task: IFullTask;
    sortKey: string;
    sortDirection: string;
    previousItemLength: number;
    isSortItemsModalVisible: boolean;
}

interface Props {
    task: IFullTask;
    headerText: string;
    handleOnAddIconClick: () => void;
}
@observer
export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            task: this.props.task,
            sortKey: "createdAt",
            sortDirection: "asc",
            previousItemLength: this.props.task.items.length,
            isSortItemsModalVisible: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.resortEntries();
    }

    renderDate(duration) {
        return Math.floor(moment.duration(duration).asHours()) + moment.utc(duration).format("[h] mm[m] ss[s]");
    }

    resortEntries() {
        const task = this.state.task;

        if (this.state.task.items.length > this.state.previousItemLength) {
            task.items = _.orderBy(task.items, this.state.sortKey, this.state.sortDirection);
            this.setState({
                task,
                previousItemLength: this.state.task.items.length,
            });
        }
    }

    sortEntries(sortKey, sortDirection) {
        const task = this.state.task;
        task.items = _.orderBy(task.items, sortKey, sortDirection);
        this.setState({ task, sortKey: sortKey, sortDirection: sortDirection });
    }

    renderMetrices(entry) {
        const metrices = entry.metricQuantities.map(metric => {
            return (
                <Text style={styles.listText} key={metric.uid}>
                    {metric.metric.name}: {metric.quantity} {metric.metric.unit}
                </Text>
            );
        });

        return (
            <View>
                <Text style={styles.listText}>Datum: {moment(entry.createdAt).format("DD.MM.YYYY")}</Text>
                {metrices}
                <Text style={styles.listText}>Duration: {formatDuration(entry.duration)}</Text>
            </View>
        );
    }

    handleOnEditItemClick(item) {
        Actions.patchItem({
            taskUid: this.state.task.uid,
            item
        });
    }

    _showSortItemsModal = () => this.setState({
        isSortItemsModalVisible: true,
    })
    _hideSortItemsModal = () => this.setState({
        isSortItemsModalVisible: false,
    })
    _sortItemsAndHideSortItemsModal = (sortKey: string, sortDirection: string) => {
        this.sortEntries(sortKey, sortDirection);
        this.setState({
            isSortItemsModalVisible: false
        });
    }

    render() {
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
                        centerComponent={{ text: this.props.headerText, style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
                        rightComponent={
                            <View style={{ flex: 1, flexDirection: "row", marginTop: 23 }}>
                                <Icon
                                    name="sort"
                                    color="#fff"
                                    underlayColor="transparent"
                                    style={{ marginRight: 16 }}
                                    onPress={() => { this._showSortItemsModal(); }}
                                />
                                <Icon
                                    name="add"
                                    color="#fff"
                                    underlayColor="transparent"
                                    onPress={() => { this.props.handleOnAddIconClick(); }}
                                />
                            </View>
                        }
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>

                <ScrollView style={styles.scrollViewContainer}>
                    <List containerStyle={{ marginBottom: 20, borderTopWidth: 0, marginLeft: 0, paddingLeft: 0, marginTop: 0 }}>
                        <FlatList
                            data={this.state.task.items}
                            keyExtractor={item => item.uid.toString()}
                            renderItem={({ item }) => (
                                <ListItem
                                    style={styles.listElement}
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
                    hide={() => this._hideSortItemsModal()}
                    metrics={this.state.task.metrics}
                    sortItemsAndHide={(sortKey, sortDirection) => this._sortItemsAndHideSortItemsModal(sortKey, sortDirection)}
                />
            </View>
        );
    }

}
