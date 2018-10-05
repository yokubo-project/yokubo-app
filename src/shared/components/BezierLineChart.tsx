import React from "react";
import { Dimensions, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { theme } from "../../shared/styles";

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: theme.headerBackgroundColor,
        borderRadius: 16
    } as ViewStyle,
    chartTitle: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
        marginTop: 10
    } as TextStyle,
    yAxisTitle: {
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: 12,
        marginLeft: 26
    } as TextStyle,
    xAxisTitle: {
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10
    } as TextStyle,
    noDataWarning: {
        textAlign: "center",
        color: "white",
        fontSize: 15,
        margin: 10
    } as TextStyle
});

interface IState {
    totalValue: number;
}

interface IProps {
    chartTitle: string;
    xAxisTitle: string;
    yAxisTitle: string;
    noDataInfoText: string;
    labels: string[];
    data: number[];
}

export default class BezierLineChart extends React.Component<IProps, IState> {

    state: IState = {
        totalValue: this.props.data.reduce(
            (acc, currentValue) => {
                return acc + currentValue;
            },
            0
        )
    };

    componentWillReceiveProps(newProps: IProps) {
        if (newProps !== this.props) {
            this.setState({
                totalValue: newProps.data.reduce(
                    (acc, currentValue) => {
                        return acc + currentValue;
                    },
                    0
                )
            });
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <Text style={styles.chartTitle}>{this.props.chartTitle}</Text>
                {this.state.totalValue !== 0 &&
                    <View>
                        <Text style={styles.yAxisTitle}>{this.props.yAxisTitle}</Text>
                        <LineChart
                            data={{
                                labels: this.props.labels,
                                datasets: [{ data: this.props.data }]
                            }}
                            // tslint:disable-next-line:no-backbone-get-set-outside-model
                            width={Dimensions.get("window").width - 20} // from react-native
                            height={220}
                            chartConfig={{
                                backgroundColor: theme.headerBackgroundColor,
                                backgroundGradientFrom: theme.headerBackgroundColor,
                                backgroundGradientTo: theme.headerBackgroundColor,
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: { borderRadius: 16 }
                            }}
                            bezier={true}
                            style={{ marginVertical: 8, borderRadius: 16 }}
                        />
                        <Text style={styles.xAxisTitle}>{this.props.xAxisTitle}</Text>
                    </View>
                }
                {this.state.totalValue === 0 &&
                    <Text style={styles.noDataWarning}>{this.props.noDataInfoText}</Text>
                }
            </View>
        );
    }

}
