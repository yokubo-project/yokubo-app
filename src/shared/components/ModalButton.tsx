import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";

interface IProps {
    navigation: NavigationScreenProp<any, any>;
    getParameter: string;
    ioniconName: string;
    ioniconColor: string;
    marginLeft?: number;
    marginRight?: number;
}

// tslint:disable-next-line:variable-name
const MultiFontFamilyHeaderButton = props => (
    <HeaderButton {...props} IconComponent={props.MyIconComponent} iconSize={28} color={props.ioniconColor} />
);

export default class Component extends React.Component<IProps, null> {

    marginLeft: number = this.props.marginLeft ? this.props.marginLeft : 0;
    marginRight: number = this.props.marginRight ? this.props.marginRight : 0;

    render() {
        return (
            <View
                style={{ marginLeft: this.marginLeft, marginRight: this.marginRight }}
            >
                <HeaderButtons HeaderButtonComponent={MultiFontFamilyHeaderButton}>
                    <HeaderButtons.Item
                        title={this.props.ioniconName}
                        MyIconComponent={Ionicons}
                        iconName={this.props.ioniconName}
                        ioniconColor={this.props.ioniconColor}
                        onPress={this.props.navigation.getParam(this.props.getParameter)}
                    />
                </HeaderButtons>
            </View>
        );
    }

}
