import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableNativeFeedback, View } from "react-native";

interface IProps {
    navigation: any;
    additionalProps?: any;
    navigateToScreen: string;
    ioniconName: string;
    ioniconColor: string;
}

export default class Component extends React.Component<IProps, null> {

    render() {
        return (
            <TouchableNativeFeedback
                onPress={() => setTimeout(
                    () => this.props.navigation.navigate(this.props.navigateToScreen, this.props.additionalProps),
                    80
                )}
                background={TouchableNativeFeedback.Ripple("rgba(0, 0, 0, .32)", true)}
            >
                <View
                    style={{
                        width: 60,
                        height: 60,
                        backgroundColor: "transparent",
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center"
                    }}
                >
                    <Ionicons
                        name={this.props.ioniconName}
                        size={28}
                        color={this.props.ioniconColor}
                    />
                </View>
            </TouchableNativeFeedback>
        );
    }

}
