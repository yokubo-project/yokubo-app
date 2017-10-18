import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Actions } from "react-native-router-flux";
import { VictoryBar, VictoryScatter } from "victory-native";

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
    button: {
        position: "absolute",
        bottom: 50,
        right: 50,
    },
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

    renderEntryStatictics(entries) {

        const metrices = [];
        entries.forEach(entry => {
            if (entry.metrices.length > 0) {
                entry.metrices.forEach(metric => {
                    const metricObject = metrices.filter(metricOb => metricOb.metricName === metric.metricName);
                    console.log("metricObject: ", JSON.stringify(metricObject));
                    if (metricObject.length > 0) {
                        metricObject[0].totalValue += parseFloat(metric.metricValue);
                    } else {
                        metrices.push({
                            metricKey: metric.key,
                            metricName: metric.metricName,
                            totalValue: parseFloat(metric.metricValue),
                            metricUnity: metric.metricUnity
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
                    {this.renderEntryStatictics(activities.entries)}
                </View>

                <VictoryBar />
                <VictoryScatter
                    size={7}
                    data={[
                        { x: 1, y: 1, label: "first", symbol: "star", opacity: 0.5, fill: "blue" },
                        { x: 2, y: 2, label: "second", symbol: "circle", opacity: 0.8, fill: "red" },
                        { x: 3, y: 3, label: "third", symbol: "square", fill: "white", stroke: "black", strokeWidth: 2 },
                        { x: 4, y: 4, label: "fourth", symbol: "diamond", fill: "green" }
                    ]}
                />
                <AddIcon
                    onPress={() => this.handleOnIconClick()}
                />

            </View>
        );
    }

}
