import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { VictoryChart, VictoryBar } from "victory-native";
import moment from "moment";

import { IFullTask } from "../../state/taskStore";

const primaryColor1 = "green";

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
        let counter = 0;

        entries.forEach(entry => {
            const startDate = entry.period[0];
            const endDate = entry.period[1];
            const diff = moment.duration(moment(endDate).diff(moment(startDate)));
            const diffInMinutes = diff.asMinutes();

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
                        data={this.renderEntryStatictics(this.state.task.items)}
                        x="entity"
                        y="value"
                    />
                </VictoryChart>

            </View>
        );
    }

}
