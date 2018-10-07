import * as Moment from "moment";
import React from "react";
import { Dimensions, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";

import { theme } from "../../shared/styles";

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
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

// tslint:disable-next-line:no-empty-interface
interface IState { }

interface IProps {
    chartTitle: string;
    values: {
        date: string;
        count: number;
    }[];
    endDate: Moment.Moment;
    numDays: number;
    backgroundColor?: string;
}

export default class ContributionChart extends React.Component<IProps, IState> {

    render() {
        const backgroundColor = this.props.backgroundColor ? this.props.backgroundColor : theme.headerBackgroundColor;

        return (
            <View
                style={{
                    backgroundColor,
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    borderRadius: 16
                }}
            >
                <Text style={styles.chartTitle}>{this.props.chartTitle}</Text>
                <View>
                    <ContributionGraph
                        values={this.props.values}
                        endDate={this.props.endDate}
                        numDays={this.props.numDays}
                        // tslint:disable-next-line:no-backbone-get-set-outside-model
                        width={Dimensions.get("window").width}
                        height={220}
                        // tslint:disable-next-line:no-backbone-get-set-outside-model
                        squareSize={Dimensions.get("window").width / 19}
                        chartConfig={{
                            backgroundColor,
                            backgroundGradientFrom: backgroundColor,
                            backgroundGradientTo: backgroundColor,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                                paddingLeft: 0
                            }
                        }}
                    />
                </View>
            </View>
        );
    }

}
