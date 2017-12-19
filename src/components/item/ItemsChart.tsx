import React from "react";
import { observer } from "mobx-react";
import { Text, StyleSheet, View, ViewStyle } from "react-native";
import { Actions } from "react-native-router-flux";
import { VictoryChart, VictoryTheme, VictoryBar } from "victory-native";
import moment from "moment";
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

    renderEntryStatictics(entries) {

        const metrices = [];
        let counter = 0;

        entries.forEach(entry => {
            const startDate = entry.period[0];
            const endDate = entry.period[1];
            const diff = moment.duration(moment(endDate).diff(moment(startDate)));
            const diffInMinutes = diff.asMinutes();

            console.log("Start Time: ", startDate);
            console.log("End Time: ", endDate);
            console.log("Minutes Diff: ", diffInMinutes);

            metrices.push({
                entity: ++counter,
                value: parseFloat(diffInMinutes.toString())
            });

        });

        return metrices;
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <VictoryChart
                    domainPadding={10}
                >
                    <VictoryBar
                        style={{
                            data: { 
                                fill: primaryColor1,
                                stroke: primaryColor1,
                                fillOpacity: 0.7,
                                strokeWidth: 3                                
                            }
                        }}
                        animate={{
                            duration: 2000,
                            onLoad: { duration: 1000 }
                        }}
                        data={this.renderEntryStatictics(task.taskItems)}
                        x="entity"
                        y="value"
                    />
                </VictoryChart>

            </View>
        );
    }

}
