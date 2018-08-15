import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableNativeFeedback, View } from "react-native";

interface IProps {
    navigation: any;
    getParameter: string;
    ioniconName: string;
    ioniconColor: string;
}

export default class Component extends React.Component<IProps, null> {

    render() {
        return (
            <TouchableNativeFeedback
                onPress={this.props.navigation.getParam(this.props.getParameter)}
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
