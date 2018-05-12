import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Header } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { VictoryChart, VictoryBar } from "victory-native";
import moment from "moment";

import { IFullTask } from "../../state/taskStore";
import { theme } from "../../shared/styles";

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
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: theme.backgroundColor,
    } as ViewStyle,
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
                <View style={styles.formContainer}>
                    <VictoryChart
                        domainPadding={10}
                    >
                        <VictoryBar
                            style={{
                                data: {
                                    fill: theme.textColor,
                                    stroke: theme.textColor,
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
                </View >
            </View >
        );
    }

}
