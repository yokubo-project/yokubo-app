import React from "react";
import { observer } from "mobx-react";
import { Text, StyleSheet, View, ViewStyle } from "react-native";
import { Actions } from "react-native-router-flux";
import { VictoryChart, VictoryTheme, VictoryBar } from "victory-native";
import task from "../../state/task";

const primaryColor1 = "green";

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
});

@observer
export default class Component extends React.Component<Props, State> {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        // task.fetchEntries(this.props.uid);
    }

    handleOnIconClick() {
        Actions.createEntry({
            uid: this.props.uid,
            // metrics: this.props.metrics
        });
    }

    renderEntryStatictics(entries) {

        const metrices = [];
        let counter = 0;
        entries.forEach(entry => {
            if (entry.metrices.length > 0) {
                metrices.push({
                    entity: ++counter,
                    value: parseFloat(entry.metrices[0].metricValue)
                });
            }
        });

        return metrices;
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {/* <Text>Showing Bar for {task.entries[0].metrices[0].metricName ? task.entries[0].metrices[0].metricName : "unknown"} in {tasks.entries[0].metrices[0].metricName ? tasks.entries[0].metrices[0].metricUnity : "unknown"}</Text>
                <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={10}
                >
                    <VictoryBar
                        style={{
                            data: { fill: primaryColor1 }
                        }}
                        data={this.renderEntryStatictics(task.entries)}
                        x="entity"
                        y="value"
                    />
                </VictoryChart> */}

            </View>
        );
    }

}
