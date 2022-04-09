import React from 'react';
import { Image, AsyncStorage } from 'react-native';
import { Avatar } from 'react-native-elements';
import {createAppContainer, NavigationActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import {createDrawerNavigator} from 'react-navigation-drawer';

import ProfilePage from './screens/ProfilePage';
import LoginPage from './screens/LoginPage';
import TeamPage from './screens/TeamPage';
import WhatsAppShare from './screens/WhatsAppShare';
import DigitalBook from './screens/DigitalBook';
import QRScan from './screens/QRScan';
import AllCards from './screens/AllCards';
import NewCard from './screens/NewCard';
import OtherProfilePage from './screens/OtherProfilePage';
import EditCard from './screens/EditCard';
import Settings from './screens/Settings';
import EditProfile from './screens/EditProfile';

import Connection from './Connection';


var apiStr = new Connection().getAPI();
var digitalProfileData;

getAsyncStorage();
export async function getAsyncStorage()
{
    digitalProfileData = await AsyncStorage.getItem('digitalProfileData')
    .then(data => {return JSON.parse(data)});
}

const loginStack = createStackNavigator({
    LoginPage:{
        screen: LoginPage
    }
},{
    navigationOptions:{
        header:null
    }
});

const TeamPageStack = createStackNavigator({
    TeamPage:{
        screen: TeamPage,
    },
},{
    navigationOptions:{
        header:null
    }
});

const OtherProfilePageStack = createStackNavigator({
    OtherProfilePage:{
        screen: OtherProfilePage
    },
},{
    navigationOptions:{
        header:null
    }
});


const WhatsAppShareStack = createStackNavigator({
    WhatsAppShare:{
        screen: WhatsAppShare
    },
},{
    navigationOptions:{
        header:null
    }
});

const EditCardStack = createStackNavigator({
    EditCard:{
        screen: EditCard
    },
},{
    navigationOptions:{
        header:null
    }
});


const SettingStack = createStackNavigator({
    Settings:
    {
        screen: Settings
    },
    EditProfile:
    {
        screen: EditProfile
    }
},{
    navigationOptions:{
        header:null
    }
});

const TabBarComponent = props => <BottomTabBar {...props} activeBackgroundColor={digitalProfileData.StylingTable.SelectedTabColorCode} inactiveBackgroundColor={digitalProfileData.StylingTable.MainTitleColorCode}/>

const BottomNavigationStack = createBottomTabNavigator({
    ProfilePage: { screen: ProfilePage },
    QRScan: QRScan,
    NewCard: NewCard,
    AllCards : AllCards,
    DigitalBook: { screen: DigitalBook },
},
{
    defaultNavigationOptions: ({ navigation }) =>({
        tabBarIcon:({focused, horizontal, tintColor}) => {
            if(navigation.state.routeName === 'DigitalBook')
            {
                return(<Image source={{uri:apiStr+"/Content/EContact/img/D_Book.png"}} style={{width:40,height:40}}/>);
            }
            else if(navigation.state.routeName === 'QRScan')
            {
                return(<Image source={{uri:apiStr+"/Content/EContact/img/DP_Add.png"}} style={{width:40,height:40}}/>);
            }
            else if(navigation.state.routeName === 'AllCards')
            {
                return(<Image source={{uri:apiStr+"/Content/EContact/img/All_Card.png"}} style={{width:40,height:40}}/>);
            }
            else if(navigation.state.routeName === 'NewCard')
            {
                return(<Image source={{uri:apiStr+"/Content/EContact/img/New_Card.png"}} style={{width:40,height:40}}/>);
            }
            else if(navigation.state.routeName === 'ProfilePage')
            {
                let imageStr = apiStr+"/Avatars/"+digitalProfileData.Employee.UserName+".png";
                imageStr += '?random_number='+new Date().getTime();
                return(<Avatar rounded size='small' source={{uri:imageStr}}/>);
            }
        },

    }),
    tabBarComponent: props => (
        <TabBarComponent {...props} />
    ),
    tabBarOptions: {
        showLabel: false,
        showIcon:true,
    },
    navigationOptions: ({ navigation }) => ({
        header:null
    })
})


const rootStack = createStackNavigator({
    Login: loginStack,
    BottomNavigationStack: BottomNavigationStack,
    TeamPageStack: TeamPageStack,
    OtherProfilePageStack: OtherProfilePageStack,
    WhatsAppShareStack: WhatsAppShareStack,
    EditCardStack: EditCardStack,
    SettingStack: SettingStack
    
})

export default createAppContainer(rootStack);

