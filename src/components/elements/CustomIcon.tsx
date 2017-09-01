import React from 'react'
import { StyleSheet, Text, TextStyle, View, ScrollView, ViewStyle, TouchableOpacity } from 'react-native';
import { Header, Button, Icon, List, ListItem } from 'react-native-elements';

const primaryColor1 = "green";

export default class Component extends React.Component<null, null> {

    render() {
        return (

            <TouchableOpacity
                activeOpacity={0.9}
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 55,
                    height: 55,
                    backgroundColor: primaryColor1,
                    borderRadius: 100,
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                }}
                onPress={() => console.log('hello from opac')}
            >
                <Icon
                    name={"add"}
                    size={25}
                    color="#fff"
                />
            </TouchableOpacity>

        )
    }

}