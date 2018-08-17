import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableNativeFeedback, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";

interface IProps {
    navigation: NavigationScreenProp<any, any>;
    getParameter: string;
    ioniconName: string;
    ioniconColor: string;
}

export default class Component extends React.Component<IProps, null> {

    render() {
        return (
            <View
                style={{ borderRadius: 100, width: 50, height: 50 }}
            >
                <TouchableNativeFeedback
                    onPress={this.props.navigation.getParam(this.props.getParameter)}
                    background={TouchableNativeFeedback.Ripple("rgba(0, 0, 0, .32)", true)}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
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
            </View>
        );
    }

}
