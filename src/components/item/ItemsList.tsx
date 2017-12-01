import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import * as _ from "lodash";

import task from "../../state/task";

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
    formContainer: {
        flex: 2,
        justifyContent: "space-around",
        backgroundColor: "#fff",
    } as ViewStyle,
    listContainer: {
        flexGrow: 6,
        // justifyContent: "space-around",
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
    }

    // componentWillMount() {
    //     task.fetchEntries(this.props.uid);
    // }

    sortEntries(sortKey, sortDirection) {
        task.sortTaskItems(sortKey, sortDirection);
    }

    renderMetrices(entry) {
        const metrices = entry.metricQuantities.map(metric => {
            return (
                <Text key={metric.uid}>{metric.metric.name}: {metric.quantity} {metric.metric.unit}</Text>
            );
        });

        return (
            <View>
                <Text>Datum: {entry.createdAt}</Text>
                {metrices}
            </View>
        );
    }

    renderMetricTags(metrics) {

        // TODO: Sort algorithmus not stable if entry is missing some metrics, as key may reference another metric
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
            uid: this.props.uid,
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
                        {this.renderMetricTags(task.taskMetrics)}
                    </View>
                </View>

                <ScrollView style={styles.listContainer}>
                    <List containerStyle={{ marginBottom: 20 }}>
                        {
                            task.taskItems.map((entry) => (
                                <ListItem
                                    key={entry.uid}
                                    title={entry.name}
                                    subtitle={this.renderMetrices(entry)}
                                    rightIcon={{ icon: "delete" }}
                                    onPressRightIcon={() => this.handleOnEditItemClick(entry)}
                                />
                            ))
                        }
                    </List>
                </ScrollView>

            </View>
        );
    }

}
