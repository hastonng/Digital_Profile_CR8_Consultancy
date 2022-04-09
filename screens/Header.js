import React from 'react';
import { SafeAreaView, StatusBar, View,AsyncStorage,Linking, Share,Platform } from 'react-native';
import { NavigationActions, StackActions  } from 'react-navigation';
import { Text,Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Menu, {MenuItem, MenuDivider } from 'react-native-material-menu';

import Connection from '../Connection';

export default class Header extends React.Component{

    constructor()
    {
        super();
        Obj = new Connection();
        
        this.initialState = this.state

        this.getAsyncStorage()
    }

    state = {
        headerStyle:'',
        apiStr: Obj.getAPI(),
    }

    getAsyncStorage = async () =>
    {
        let digitalProfileDataASYNC = await AsyncStorage.getItem('digitalProfileData')
        .then(data => {return JSON.parse(data)});

        this.setState({
            headerStyle: digitalProfileDataASYNC.StylingTable.MainTitleColorCode,
        })
    }

    render()
    {
        const {navigation} = this.props.navigation;
        return(
            <SafeAreaView style={{ backgroundColor:this.state.headerStyle,flexDirection:'row',justifyContent:'space-between'}}>
                <View style={{flexDirection:'row',justifyContent:'flex-start', paddingTop:Platform.OS === 'ios'? 15:30,paddingBottom:10,}}>
                    <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'}/>
                    <Avatar rounded source={require('../assets/logo.png')} size='small' overlayContainerStyle={{backgroundColor:this.state.headerStyle}} containerStyle={{marginLeft:10}}/>
                    <Text h4 h4Style={{color:'#fff', fontSize:18, paddingHorizontal:5,paddingTop:5}}>{this.props.setHeaderTitle}</Text>
                </View>
                <View style={{flexDirection:'row', justifyContent:'flex-end', paddingTop:Platform.OS === 'ios'? 15:30}}>
                    <Avatar rounded source={require('../assets/cr8consultancy.png')} size='small' imageProps={{resizeMode:'contain'}} overlayContainerStyle={{backgroundColor:this.state.headerStyle}} 
                    onPress={() =>{this.launchCompanyProfile()}}/>
                    <Icon name='options-vertical' color={'#fff'} size={20} style={{marginHorizontal:10, marginBottom:15, marginTop:5}} onPress={() => menuRef.show()}/>
                    <Menu ref={(ref) => menuRef = ref} button={<Text onPress={() => menuRef.show()}></Text>}>
                        <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.share();},500); }}><Ionicons name='md-share-alt' color={'#868686'} size={17} style={{bottom:2}}/>   Share</MenuItem>
                        <MenuDivider/>
                        <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.WhatsAppShare();},300); }}><Ionicons name='logo-whatsapp' color={'#868686'} size={17} style={{bottom:2}}/>   Forward</MenuItem>
                        <MenuDivider/>
                        <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.logout(navigation);},300); }}><Icon name='logout' color={'#868686'} size={17} style={{bottom:2}}/>   Logout</MenuItem>
                    </Menu>
                </View>
            </SafeAreaView>
        )
    }

    menuOptions = (navigation) =>
    {
     
        let menuOptions = this.props.menuOptions
        if(menuOptions === 1)
        {
            return(
                <View>
                    <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.share();},500); }}><Ionicons name='md-share-alt' color={'#868686'} size={17} style={{bottom:2}}/>   Share</MenuItem>
                    <MenuDivider/>
                    <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.WhatsAppShare();},300); }}><Ionicons name='logo-whatsapp' color={'#868686'} size={17} style={{bottom:2}}/>   Forward</MenuItem>
                    <MenuDivider/>
                    <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.OurTeamModal();},300); }}><MaterialIcon name='group' color={'#868686'} size={17} style={{bottom:2}}/>   Team</MenuItem>
                    <MenuDivider/>
                    <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.logout(navigation);},300); }}><Icon name='logout' color={'#868686'} size={17} style={{bottom:2}}/>   Logout</MenuItem>
                </View>
                    
            )
        }
        else if(menuOptions === 2)
        {
            return(
                <View>
                    <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.share();},500); }}><Ionicons name='md-share-alt' color={'#868686'} size={17} style={{bottom:2}}/>   Share</MenuItem>
                    <MenuDivider/>
                    <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.WhatsAppShare();},300); }}><Ionicons name='logo-whatsapp' color={'#868686'} size={17} style={{bottom:2}}/>   Forward</MenuItem>
                    <MenuDivider/>
                    <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.logout(navigation);},300); }}><Icon name='logout' color={'#868686'} size={17} style={{bottom:2}}/>   Logout</MenuItem>
                </View>
            )
        }
        else if(menuOptions === 3)
        {
            return(
                <View>
                    <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.share();},500); }}><Ionicons name='md-share-alt' color={'#868686'} size={17} style={{bottom:2}}/>   Share</MenuItem>
                    {/* <MenuDivider/>
                    <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.WhatsAppShare();},300); }}><Ionicons name='logo-whatsapp' color={'#868686'} size={17} style={{bottom:2}}/>   Forward</MenuItem> */}
                    <MenuDivider/>
                    <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.logout(navigation);},300); }}><Icon name='logout' color={'#868686'} size={17} style={{bottom:2}}/>   Logout</MenuItem>
                </View>
            )
        }
    }


    launchCompanyProfile = () =>
    {
        let websiteURL = "https://digitalprofile.app/cr8consultancy";
        
        Linking.canOpenURL(websiteURL).then(canOpen =>{
            if(canOpen)
            {
                Linking.openURL(websiteURL).catch((error) => Promise.reject(error));
            }
            else
            {
                alert('Invalid Web Url');
            }
        })
    }
    
    logout = (navigation) =>
    {
        this.setState(this.initialState);

        AsyncStorage.clear();
        // AsyncStorage.setItem('EmployeeID','');
        // AsyncStorage.setItem('DomainName','');
        // AsyncStorage.setItem('UserName','');
        // AsyncStorage.setItem('CompanyInfoID','');
        // AsyncStorage.setItem('Language','');
        // AsyncStorage.setItem('MainTitleColorCode', '');
        // AsyncStorage.setItem('SelectedTabColorCode', '');

        navigation
        .dispatch(StackActions.reset({
            index: 0,
            actions: [
            NavigationActions.navigate({
                routeName: 'Login'
            }),
            ],
            }))
    }

    share = () =>
    {
        this.props.share();
    }
    
    WhatsAppShare = () =>
    {
        this.props.WhatsAppShare();
    }

    setHeaderTitle = () =>
    {
        this.props.setHeaderTitle();
    }

    OurTeamModal = () =>
    {
        this.props.OurPeopleModalController();
    }
}