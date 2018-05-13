import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle, TextStyle, ScrollView } from "react-native";
import { Header, List } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import * as moment from "moment";

import { IFullTask } from "../../state/taskStore";
import { theme } from "../../shared/styles";
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
    },
    metricTextHeader: {
        color: theme.textColor,
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 15
    },
    metricText: {
        color: theme.inputTextColor,
        fontSize: 14,
        marginLeft: 15
    },
});

interface State {
    task: IFullTask;
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
        };
    }

    renderEntryStatictics(entries) {
        const metrices = [];
        let timespan: any = null;
        entries.forEach(entry => {
            const ms = entry.duration * 1000;

            if (timespan !== null) {
                timespan.totalValue += ms;
                timespan.minValue = ms < timespan.minValue ? ms : timespan.minValue;
                timespan.maxValue = ms > timespan.maxValue ? ms : timespan.maxValue;
            } else {
                timespan = {
                    metricKey: "duration",
                    metricName: "Duration",
                    totalValue: ms,
                    metricUnit: "ms",
                    minValue: ms,
                    maxValue: ms
                };
            }

            if (entry.metricQuantities.length > 0) {
                entry.metricQuantities.forEach(metric => {
                    const metricObject = metrices.filter(metricOb => metricOb.metricName === metric.metric.name);
                    if (metricObject.length > 0) {
                        metricObject[0].totalValue += parseFloat(metric.quantity);
                        metricObject[0].minValue = parseFloat(metric.quantity) < metricObject[0].minValue ? parseFloat(metric.quantity) : metricObject[0].minValue;
                        metricObject[0].maxValue = parseFloat(metric.quantity) > metricObject[0].maxValue ? parseFloat(metric.quantity) : metricObject[0].maxValue;
                    } else {
                        metrices.push({
                            metricKey: metric.uid,
                            metricName: metric.metric.name,
                            totalValue: parseFloat(metric.quantity),
                            metricUnit: metric.metric.unit,
                            minValue: parseFloat(metric.quantity),
                            maxValue: parseFloat(metric.quantity),
                        });
                    }
                });
            }
        });

        const renderedMetrices = metrices.map(metric => (
            <View key={metric.metricKey} style={styles.listElement}>
                <Text style={styles.metricTextHeader}>{metric.metricName}</Text>
                <Text style={styles.metricText}>Total: {metric.totalValue} {metric.metricUnit}</Text>
                <Text style={styles.metricText}>Average: {(metric.totalValue / entries.length).toFixed(2)} {metric.metricUnit}</Text>
                <Text style={styles.metricText}>Min:  {metric.minValue} {metric.metricUnit}</Text>
                <Text style={styles.metricText}>Max:  {metric.maxValue} {metric.metricUnit}</Text>
            </View>
        ));

        renderedMetrices.unshift(
            <View key={"duration"} style={styles.listElement}>
                <Text style={styles.metricTextHeader}>{timespan.metricName}</Text>
                <Text style={styles.metricText}>Total: {Math.floor(moment.duration(timespan.totalValue).asHours()) + moment.utc(timespan.totalValue).format("[h] mm[m] ss[s]")}</Text>
                <Text style={styles.metricText}>Average: {Math.floor(moment.duration(timespan.totalValue / entries.length).asHours()) + moment.utc(timespan.totalValue / entries.length).format("[h] mm[m] ss[s]")}</Text>
                <Text style={styles.metricText}>Min:  {Math.floor(moment.duration(timespan.minValue).asHours()) + moment.utc(timespan.minValue).format("[h] mm[m] ss[s]")}</Text>
                <Text style={styles.metricText}>Max:  {Math.floor(moment.duration(timespan.maxValue).asHours()) + moment.utc(timespan.maxValue).format("[h] mm[m] ss[s]")}</Text>
            </View>);

        renderedMetrices.unshift(
            <View key={"count"} style={styles.listElement}>
                <Text style={styles.metricTextHeader}>Einheiten</Text>
                <Text style={styles.metricText}>Total: {entries.length}</Text>
            </View>);

        return renderedMetrices;
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
                        rightComponent={{
                            icon: "add",
                            color: "#fff",
                            underlayColor: "transparent",
                            onPress: () => { this.props.handleOnAddIconClick(); }
                        }}
                        statusBarProps={{ translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 2, height: 80, borderBottomColor: "#222222" }}
                    />
                </View>

                <ScrollView style={styles.scrollViewContainer}>
                    <List containerStyle={{ marginBottom: 20, borderTopWidth: 0, marginLeft: 0, paddingLeft: 0, marginTop: 0 }}>
                        {this.renderEntryStatictics(this.state.task.items)}
                    </List>
                </ScrollView>
            </View>
        );
    }

}
