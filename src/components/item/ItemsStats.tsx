import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import * as moment from "moment";

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
    metricTextHeader: {
        color: textColor,
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 15
    },
    metricText: {
        color: inputTextColor,
        fontSize: 14,
        marginLeft: 15
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

    renderEntryStatictics(entries) {
        const metrices = [];
        let timespan: any = null;
        entries.forEach(entry => {
            // Calculate duration
            const start = moment.utc(entry.period[0]);
            const end = moment.utc(entry.period[1]);
            const ms = end.diff(start);
            const duration = moment.duration(ms);
            const time = Math.floor(duration.asHours()) + moment.utc(ms).format(":mm:ss");

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
            <View key={metric.metricKey}>
                <Text style={styles.metricTextHeader}>{metric.metricName}</Text>
                <Text style={styles.metricText}>Total: {metric.totalValue} {metric.metricUnit}</Text>
                <Text style={styles.metricText}>Average: {(metric.totalValue / entries.length).toFixed(2)} {metric.metricUnit}</Text>
                <Text style={styles.metricText}>Min:  {metric.minValue} {metric.metricUnit}</Text>
                <Text style={styles.metricText}>Max:  {metric.maxValue} {metric.metricUnit}</Text>
            </View>
        ));

        renderedMetrices.unshift(
            <View key={"duration"}>
                <Text style={styles.metricTextHeader}>{timespan.metricName}</Text>
                <Text style={styles.metricText}>Total: {Math.floor(moment.duration(timespan.totalValue).asHours()) + moment.utc(timespan.totalValue).format("[h] mm[m] ss[s]")}</Text>
                <Text style={styles.metricText}>Average: {Math.floor(moment.duration(timespan.totalValue / entries.length).asHours()) + moment.utc(timespan.totalValue / entries.length).format("[h] mm[m] ss[s]")}</Text>
                <Text style={styles.metricText}>Min:  {Math.floor(moment.duration(timespan.minValue).asHours()) + moment.utc(timespan.minValue).format("[h] mm[m] ss[s]")}</Text>
                <Text style={styles.metricText}>Max:  {Math.floor(moment.duration(timespan.maxValue).asHours()) + moment.utc(timespan.maxValue).format("[h] mm[m] ss[s]")}</Text>
            </View>);

        renderedMetrices.unshift(
            <View key={"count"}>
                <Text style={styles.metricTextHeader}>Einheiten</Text>
                <Text style={styles.metricText}>Total: {entries.length}</Text>
            </View>);

        return renderedMetrices;
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <View style={styles.formContainer}>
                    {this.renderEntryStatictics(this.state.task.items)}
                </View>

            </View>
        );
    }

}
