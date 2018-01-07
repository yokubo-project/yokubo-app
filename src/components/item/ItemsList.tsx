import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle, ScrollView, FlatList } from "react-native";
import { List, ListItem } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { material } from "react-native-typography";
import * as _ from "lodash";
import moment from "moment";

import { IFullTask } from "../../state/taskStore";

interface State {
    task: IFullTask;
}

interface Props {
    task: IFullTask;
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    } as ViewStyle,
    formContainer: {
        flex: 2,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    listContainer: {
        flexGrow: 6,
        backgroundColor: "#fff",
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
                <Text key={metric.uid}>{metric.metric.name}: {metric.quantity} {metric.metric.unit}</Text>
            );
        });

        const startDate = entry.period[0];
        const endDate = entry.period[1];
        const diff = moment.duration(moment(endDate).diff(moment(startDate)));
        const diffHours = `${(diff.hours().toString() === "1") ? "Stunde" : "Stunden"}`;
        const diffMinutes = `${(diff.minutes().toString() === "1") ? "Minute" : "Minuten"}`;
        const diffSeconds = `${(diff.seconds().toString() === "1") ? "Sekunde" : "Sekunden"}`;
        const diffFormatted = moment.utc(diff.asMilliseconds()).format(`H [${diffHours}] m [${diffMinutes}] s [${diffSeconds}]`);

        return (
            <View>
                <Text style={material.body1}>Datum: {moment(entry.createdAt).toLocaleString()}</Text>
                {metrices}
                <Text style={material.body1}>Duration: {diffFormatted}</Text>
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
                    {`${metric.name} asc`}
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
                    {`${metric.name} desc`}
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
                            onPress={() => { this.sortEntries("createdAt", "asc"); }}
                        >
                            {"datum asc"}
                        </Text>
                        <Text
                            style={styles.tagElement}
                            onPress={() => { this.sortEntries("createdAt", "desc"); }}
                        >
                            {"datum desc"}
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
                                    title={item.name}
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
