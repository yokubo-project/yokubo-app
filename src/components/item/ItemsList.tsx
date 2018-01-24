import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle, TextStyle, ScrollView, FlatList } from "react-native";
import { List, ListItem } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { material } from "react-native-typography";
import * as _ from "lodash";
import moment from "moment";

import { IFullTask } from "../../state/taskStore";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

interface State {
    task: IFullTask;
}

interface Props {
    task: IFullTask;
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor,
    } as ViewStyle,
    formContainer: {
        flex: 2,
        justifyContent: "space-around",
        backgroundColor,
    } as ViewStyle,
    listContainer: {
        flexGrow: 9,
        backgroundColor,
    } as ViewStyle,
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
    },
    listElement: {
        backgroundColor,
        paddingTop: 5,
        paddingBottom: 10,
    },
    listText: {
        // ...material.body1, 
        color: inputTextColor,
        fontSize: 14,
        marginLeft: 10
    }
});

@observer
export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            task: this.props.task,
        };
    }

    renderDate(duration) {
        return Math.floor(moment.duration(duration).asHours()) + moment.utc(duration).format("[h] mm[m] ss[s]");
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            task: nextProps.task
        });
    }

    sortEntries(sortKey, sortDirection) {
        const task = this.state.task;
        task.items = _.orderBy(task.items, sortKey, sortDirection);
        this.setState({ task });
    }

    renderMetrices(entry) {
        const metrices = entry.metricQuantities.map(metric => {
            return (
                <Text style={styles.listText} key={metric.uid}>{metric.metric.name}: {metric.quantity} {metric.metric.unit}</Text>
            );
        });

        const start = moment.utc(entry.period[0]);
        const end = moment.utc(entry.period[1]);
        const ms = end.diff(start);
        const duration = moment.duration(ms);
        const time = Math.floor(duration.asHours()) + moment.utc(ms).format("[h] mm[m] ss[s]");

        return (
            <View>
                <Text style={styles.listText}>Datum: {moment(entry.createdAt).format("DD.MM.YYYY")}</Text>
                {metrices}
                <Text style={styles.listText}>Duration: {time}</Text>
            </View>
        );
    }

    renderMetricTags(metrics) {

        // TODO: Sort algorithmus not stable if entry is missing some metrics, as key may reference another metric --> Refactore or comment
        const renderedMetricTagsAsc = metrics.map(metric => {
            return (
                <Text
                    key={`${metric.uid}asc`}
                    style={styles.tagElement}
                    onPress={() => {
                        this.sortEntries((item) => {
                            const merticQuanitity = item.metricQuantities.filter((metricQuantity) => metricQuantity.metric.uid === metric.uid)[0];
                            return merticQuanitity.quantity;
                        }, "asc");
                    }}
                >
                    {`${metric.name} `} &#8593;
                </Text>
            );
        });

        const renderedMetricTagsDesc = metrics.map(metric => {
            return (
                <Text
                    key={`${metric.uid}desc`}
                    style={styles.tagElement}
                    onPress={() => {
                        this.sortEntries((item) => {
                            const merticQuanitity = item.metricQuantities.filter((metricQuantity) => metricQuantity.metric.uid === metric.uid)[0];
                            return merticQuanitity.quantity;
                        }, "desc");
                    }}
                >
                    {`${metric.name} `} &#8595;
                </Text>
            );
        });

        const renderedMetricTags = renderedMetricTagsAsc.concat(renderedMetricTagsDesc);

        return renderedMetricTags;
    }

    handleOnEditItemClick(item) {
        Actions.patchItem({
            taskUid: this.state.task.uid,
            item
        });
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <View style={styles.formContainer}>
                    <View style={styles.tagContainer}>
                        <Text
                            style={styles.tagElement}
                            onPress={() => { this.sortEntries("name", "asc"); }}
                        >
                            {"Name"} &#8593;
                        </Text>
                        <Text
                            style={styles.tagElement}
                            onPress={() => { this.sortEntries("name", "desc"); }}
                        >
                            {"Name"} &#8595;
                        </Text>
                        <Text
                            style={styles.tagElement}
                            onPress={() => { this.sortEntries("createdAt", "asc"); }}
                        >
                            {"Datum"} &#8593;
                        </Text>
                        <Text
                            style={styles.tagElement}
                            onPress={() => { this.sortEntries("createdAt", "desc"); }}
                        >
                            {"Datum"} &#8595;
                        </Text>
                        {this.renderMetricTags(this.state.task.metrics)}
                    </View>
                </View>

                <ScrollView style={styles.listContainer}>
                    <List containerStyle={{ marginBottom: 20 }}>
                        <FlatList
                            data={this.state.task.items}
                            keyExtractor={item => item.uid.toString()}
                            renderItem={({ item }) => (
                                <ListItem
                                    style={styles.listElement}
                                    title={item.name}
                                    titleStyle={{ color: textColor, fontSize: 18, fontWeight: "bold" }}
                                    subtitle={this.renderMetrices(item)}
                                    rightIcon={{ icon: "delete" }}
                                    onPressRightIcon={() => this.handleOnEditItemClick(item)}
                                />
                            )}
                        />
                    </List>
                </ScrollView>

            </View>
        );
    }

}
