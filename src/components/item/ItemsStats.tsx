import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Actions } from "react-native-router-flux";

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
        entries.forEach(entry => {
            if (entry.metricQuantities.length > 0) {
                entry.metricQuantities.forEach(metric => {
                    const metricObject = metrices.filter(metricOb => metricOb.metricName === metric.metric.name);
                    if (metricObject.length > 0) {
                        metricObject[0].totalValue += parseFloat(metric.quantity);
                    } else {
                        metrices.push({
                            metricKey: metric.uid,
                            metricName: metric.metric.name,
                            totalValue: parseFloat(metric.quantity),
                            metricUnity: metric.unit
                        });
                    }
                });
            }
        });

        const renderedMetrices = metrices.map(metric => (
            <View key={metric.metricKey}>
                <Text>Metricname: {metric.metricName}</Text>
                <Text>Total: {metric.totalValue} {metric.metricUnity}</Text>
                <Text>Average: {metric.totalValue / entries.length} {metric.metricUnity}</Text>
            </View>
        ));

        renderedMetrices.push(<View key={"count"}><Text>Metricname: Einheiten</Text><Text>Total: {entries.length}</Text></View>);

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
