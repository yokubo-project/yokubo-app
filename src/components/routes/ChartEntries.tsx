import React from "react";
import { observer } from "mobx-react";
import { Text, StyleSheet, View, ViewStyle } from "react-native";
import { Actions } from "react-native-router-flux";
import { VictoryChart, VictoryTheme, VictoryBar } from "victory-native";
import AddIcon from "../elements/AddIcon";
import activities from "../../state/activities";

const primaryColor1 = "green";

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
                <Text>Showing Bar for {activities.entries[0].metrices[0].metricName ? activities.entries[0].metrices[0].metricName : "unknown"} in {activities.entries[0].metrices[0].metricName ? activities.entries[0].metrices[0].metricUnity : "unknown"}</Text>
                <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={10}
                >
                    <VictoryBar
                        style={{
                            data: { fill: primaryColor1 }
                        }}
                        data={this.renderEntryStatictics(activities.entries)}
                        x="entity"
                        y="value"
                    />
                </VictoryChart>
                <AddIcon
                    onPress={() => this.handleOnIconClick()}
                />

            </View>
        );
    }

}
