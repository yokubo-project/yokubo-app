import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import * as _ from "lodash";

import AddIcon from "../elements/AddIcon";
import activities from "../../state/activities";

interface State {
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
    button: {
        position: "absolute",
        bottom: 50,
        right: 50,
    },
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

    componentWillMount() {
        activities.fetchEntries(this.props.uid);
    }

    handleOnIconClick() {
        Actions.createEntry({
            uid: this.props.uid,
            inputMetrics: this.props.inputMetrics
        });
    }

    sortEntries(sortKey, sortDirection) {
        activities.sortEntries(sortKey, sortDirection);
    }

    renderMetrices(entry) {
        const metrices = entry.metrices.map(metric => {
            return (
                <Text key={metric.key}>{metric.metricName}: {metric.metricValue} {metric.metricUnity}</Text>
            );
        });

        return (
            <View>
                <Text>Datum: {entry.datum}</Text>
                {metrices}
            </View>
        );
    }

    renderMetricTags(entries) {

        // TODO: Sort algorithmus not stable if entry is missing some metrics, as key may reference another metric
        const metrices = [];
        entries.forEach(entry => {
            if (entry.metrices.length > 0) {
                entry.metrices.forEach(metric => {
                    metrices.push({
                        metricName: metric.metricName,
                        key: metric.key,
                    });
                });
            }
        });
        const uniqMetricNames = _.uniqWith(metrices, _.isEqual);

        const renderedMetricTagsAsc = uniqMetricNames.map(metric => {
            return (
                <Text
                    key={`${metric.key}asc`}
                    style={styles.tagElement}
                    onPress={() => { this.sortEntries(`metrices[${metric.key}].metricValue`, "asc"); }}
                >
                    {`${metric.metricName} asc`}
                </Text>
            );
        });

        const renderedMetricTagsDesc = uniqMetricNames.map(metric => {
            return (
                <Text
                    key={`${metric.key}desc`}
                    style={styles.tagElement}
                    onPress={() => { this.sortEntries(`metrices[${metric.key}].metricValue`, "desc"); }}
                >
                    {`${metric.metricName} desc`}
                </Text>
            );
        });

        const renderedMetricTags = renderedMetricTagsAsc.concat(renderedMetricTagsDesc);

        return renderedMetricTags;
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
                            onPress={() => { this.sortEntries("datum", "asc"); }}
                        >
                            {"datum asc"}
                        </Text>
                        <Text
                            style={styles.tagElement}
                            onPress={() => { this.sortEntries("datum", "desc"); }}
                        >
                            {"datum desc"}
                        </Text>
                        {this.renderMetricTags(activities.entries)}
                    </View>
                </View>

                <ScrollView style={styles.listContainer}>
                    <List containerStyle={{ marginBottom: 20 }}>
                        {
                            activities.entries.map((entry) => (
                                <ListItem
                                    key={entry.uid}
                                    title={entry.name}
                                    subtitle={this.renderMetrices(entry)}
                                />
                            ))
                        }
                    </List>
                </ScrollView>

                <AddIcon
                    onPress={() => this.handleOnIconClick()}
                />

            </View>
        );
    }

}
