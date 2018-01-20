import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

const backgroundColor = "#333333";
const textColor = "#00F2D2";
const errorTextColor = "#00F2D2";
const inputTextColor = "#DDD";

interface Props {
    onPress: () => void;
}

export default class Component extends React.Component<Props, null> {

    render() {
        return (

            <TouchableOpacity
                activeOpacity={0.9}
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 55,
                    height: 55,
                    backgroundColor: backgroundColor,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: textColor,
                    position: "absolute",
                    bottom: 60,
                    right: 30,
                }}
                onPress={() => this.props.onPress()}
            >
                <Icon
                    name={"add"}
                    size={25}
                    color={textColor}
                />
            </TouchableOpacity>

        );
    }

}
