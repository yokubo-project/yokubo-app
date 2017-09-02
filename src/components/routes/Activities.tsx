import React from 'react'
import { StyleSheet, Text, TextStyle, View, ScrollView, ViewStyle, TouchableOpacity } from 'react-native';
import { Header, Button, Icon, List, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import auth from "../../state/auth";
import CustomIcon from "../elements/CustomIcon";

const primaryColor1 = "green";

interface State {
    buttonWasClicked: string
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // justifyContent: 'space-around',
        backgroundColor: '#fff',
    } as ViewStyle,
    headerContainer: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    } as ViewStyle,
    formContainer: {
        flex: 2,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    } as ViewStyle,
    listContainer: {
        flexGrow: 5,
        // justifyContent: 'space-around',
        backgroundColor: '#fff',
    } as ViewStyle,
    signOutText: {
        textAlign: 'center',
        color: primaryColor1,
        marginBottom: 10,
    } as TextStyle,
    button: {
        position: 'absolute',
        bottom: 50,
        right: 50,
    }
})

export default class Component extends React.Component<null, State> {

    constructor(props) {
        super(props);
        this.state = {
            buttonWasClicked: "",
        };
    }

    list = [
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
    ]

    async processSignOut() {
        const signOutResponse = await auth.signOut();
        Actions.home();
    }

    handleOnIconClick() {
        console.log("IN HERE");
        this.setState({
            buttonWasClicked: "yeap"
        });
        Actions.createActivity();
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <View style={styles.headerContainer}>
                    <Header
                        innerContainerStyles={{ flexDirection: 'row' }}
                        backgroundColor={primaryColor1}
                        leftComponent={{
                            icon: 'arrow-back',
                            color: '#fff',
                            underlayColor: 'transparent',
                            onPress: () => { Actions.pop() }
                        }}
                        centerComponent={{ text: 'Activities', style: { color: '#fff', fontSize: 20 } }}
                        statusBarProps={{ barStyle: 'dark-content', translucent: true }}
                        outerContainerStyles={{ borderBottomWidth: 0, height: 75 }}
                    />
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.signOutText}>
                        {`Hi, ${auth.username ? auth.username : "TESTER"}`}
                    </Text>
                    <Button
                        raised
                        buttonStyle={{ backgroundColor: primaryColor1, borderRadius: 0 }}
                        textStyle={{ textAlign: 'center', fontSize: 18 }}
                        title={"SIGN OUT"}
                        onPress={() => { this.processSignOut() }}
                    />
                </View>

                <ScrollView style={styles.listContainer}>
                    <List containerStyle={{ marginBottom: 20 }}>
                        {
                            this.list.map((l, i) => (
                                <ListItem
                                    roundAvatar
                                    avatar={{ uri: l.avatar_url }}
                                    key={i}
                                    title={l.name}
                                />
                            ))
                        }
                    </List>
                </ScrollView>

                <CustomIcon
                    onPress={() => this.handleOnIconClick()}
                />

            </View>
        )
    }

}