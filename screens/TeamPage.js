import React from 'react';
import { StyleSheet, View, Image, SafeAreaView, StatusBar, AsyncStorage,
    ImageBackground, ScrollView, Dimensions, TouchableHighlight,
    ActivityIndicator, Linking, Share,Platform } from 'react-native';
import { Text,Avatar, Button } from 'react-native-elements';
import { NavigationActions, StackActions  } from 'react-navigation';
import Modal from 'react-native-modal';
import Menu, {MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import Connection from '../Connection';

var screenWidth = Math.round(Dimensions.get('window').width);
var screenHeight = Math.round(Dimensions.get('window').height);


export default class TeamPage extends React.PureComponent
{

    constructor(props)
    {
        super(props);
        Obj = new Connection();

        const { navigation } = this.props;

        this.state={
            teamProfileData: navigation.getParam('teamEmployeeData','NO-ID'),
            StylingTable: navigation.getParam('stylingTable','NO-ID'),
            hostUserName: navigation.getParam('hostUserName','NO-ID'),
            showView:false,
            showLoading:true,
            QRModal:false,
            WeChatModal:false,
            apiStr: Obj.getAPI(), 
        }

        this.initialState = this.state;

        setTimeout(()=>{
            this.setState({
                showLoading:false,
                showView:true
            })
        },1000);
    }

    static navigationOptions = ({navigation}) => ({
        header:null

    })

    downloadContact = () =>
    {
        let EmployeeID = this.state.teamProfileData.EmployeeID
        let downloadURL = this.state.apiStr+'/api/dp/DownloadVCF?Domain='+this.state.teamProfileData.DomainName+'&EmployeeID='+EmployeeID;


        Linking.canOpenURL(downloadURL).then(canOpen =>{
            if(canOpen)
            {
                Linking.openURL(downloadURL).catch((error) => Promise.reject(error));
            }
            else
            {
                alert('Invalid Web Url');
            }
        })
        
    }

    launchePhoneCall = (number) =>
    {
        let phoneNumber
        if(Platform.OS === 'android')
        {
            phoneNumber = 'tel:${'+number+'}';
        }
        else if(Platform.OS === 'ios')
        {
            phoneNumber = `telprompt:${number}`;
            console.log(phoneNumber);
        }

        Linking.canOpenURL(phoneNumber).then(canOpen =>{
            if(canOpen)
            {
                Linking.openURL(phoneNumber).catch((error) => Promise.reject(error));
            }
            else
            {
                alert('Invalid Phone Number');
            }
        })
    }

    launchEmail = () =>
    {
        let Email;
        if(Platform.OS === 'android')
        {
            Email = 'mailto:'+this.state.teamProfileData.EmailAddress;
        }
        else if(Platform.OS === 'ios')
        {
            Email = 'mailto:'+this.state.teamProfileData.EmailAddress;
        }

        Linking.canOpenURL(Email).then(canOpen =>{
            if(canOpen)
            {
                Linking.openURL(Email).catch((error) => Promise.reject(error));
            }
            else
            {
                alert('Invalid Email');
            }
        })
    }

    launchWhatsApp = () =>
    {
        let WhatsApp;
        if(Platform.OS === 'android')
        {
            WhatsApp = 'whatsapp://send?text=Hi there i am using Digital Profile!&phone='+this.state.teamProfileData.WhatsAppPhoneNumber;

                Linking.canOpenURL(WhatsApp).then(canOpen => {
                if(canOpen)
                {
                    Linking.openURL(WhatsApp).catch((error) => Promise.reject(error));
                }
                else
                {
                    if(Platform.OS === 'android')
                    {
                        Linking.openURL("market://details?id=com.whatsapp").catch((error) => Promise.reject(error));
                    }
                }
            })
        }
        else if(Platform.OS === 'ios')
        {
            WhatsApp = `whatsapp://send?text=${"Hi There I am using Digital Profile"}`;
            
            
            Linking.openURL(WhatsApp)
            Linking.canOpenURL(WhatsApp).then(canOpen => {
                if(canOpen)
                {
                    Linking.openURL(WhatsApp).catch((error) => Promise.reject(error));
                }
                else
                {
                    console.log(canOpen)
                    Linking.openURL("https://itunes.apple.com/in/app/whatsapp-messenger/id310633997").catch((error) => Promise.reject(error));
                
                }
            })
        }
    }

    share = () =>
    {
        try
        {
           Share.share({
            ...Platform.select({
                ios:{
                    message:'Hi there! This is my Digital Profile! \nPlease visit my profile and have a nice day.',
                    url:this.state.apiStr+"/"+this.state.teamProfileData.DomainName+"/"+this.state.teamProfileData.UserName
                },
                android:{
                    message:'Hi there! This is my Digital Profile! \nPlease visit my profile and have a nice day.:\n'+this.state.apiStr+"/"+this.state.teamProfileData.DomainName+"/"+this.state.teamProfileData.UserName
                }
            }),
            title: "Digital Profile",
            url:this.state.apiStr+"/"+this.state.teamProfileData.DomainName+"/"+this.state.teamProfileData.UserName
            })
        }
        catch(error)
        {
            console.log(error)
        }
    }

    WhatsAppShare =  () =>
    {
        this.props.navigation.navigate('WhatsAppShareStack',{
            UserName: this.state.teamProfileData.UserName,
            DisplayName: this.state.teamProfileData.DisplayName,
            DomainName: this.state.teamProfileData.DomainName
        })
    }

    logout = () =>
    {
        this.setState(this.initialState);

        AsyncStorage.clear();

        this.props.navigation
        .dispatch(StackActions.reset({
            index: 0,
            actions: [
            NavigationActions.navigate({
                routeName: 'Login'
            }),
            ],
            }))
    }

    render()
    {
        return(
            <View style={styles.RootView}>
                 { this.state.showView && 
                    <SafeAreaView style={[{ backgroundColor:this.state.StylingTable.MainTitleColorCode,flexDirection:'row',justifyContent:'space-between',paddingTop:35},styles.elevationShadow10]}>
                        <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                            <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'}/> 
                            <MaterialIcon name='arrow-back' color={'#fff'} size={25} style={{marginHorizontal:10, marginTop:5}} onPress={() => this.props.navigation.pop()}/>
                            {/* <Avatar rounded source={require('../assets/logo.png')} size='small' overlayContainerStyle={{backgroundColor:this.state.StylingTable.MainTitleColorCode,}} containerStyle={{marginLeft:10}}/> */}
                            <Text h4 h4Style={{color:'#fff', fontSize:18, paddingHorizontal:5,paddingTop:5}}>{this.state.teamProfileData.DisplayName}</Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                            <Avatar rounded source={require('../assets/cr8consultancy.png')} size='small' imageProps={{resizeMode:'contain'}} overlayContainerStyle={{backgroundColor:this.state.StylingTable.MainTitleColorCode}} 
                            onPress={() =>{this.launchCompanyProfile()}}/>
                            <Icon name='options-vertical' color={'#fff'} size={20} style={{marginHorizontal:10, marginBottom:15, marginTop:5}} onPress={() => TeamPageMenuRef.show()}/>
                            <Menu ref={(ref) => TeamPageMenuRef = ref} style={{width:150}} button={<Text onPress={() => TeamPageMenuRef.show()}></Text>}>
                                <MenuItem onPress={() => {TeamPageMenuRef.hide(); setTimeout(()=>{this.share();},500); }}>Share</MenuItem>
                                <MenuDivider/>
                                <MenuItem onPress={() => {TeamPageMenuRef.hide(); setTimeout(()=>{this.WhatsAppShare();},300); }}>WhatsApp Share</MenuItem>
                            </Menu>
                        </View>
                    </SafeAreaView>
                }
                {this.state.showLoading && <ActivityIndicator size='large' color='#181A43' style={{flex:1, alignSelf:'center'}}/>}        
                {this.state.showView && <ScrollView >
                    <ImageBackground source={{uri:this.state.apiStr+"/Avatars/"+this.state.teamProfileData.UserName+".png"}} style={{height:400, width:screenWidth , flex:1}}>
                    {/* <Avatar rounded size='small' 
                    imageProps={{resizeMode:'contain'}} 
                    source={{uri:this.state.apiStr+"/Avatars/"+this.state.hostUserName+".png"}} 
                    containerStyle={{marginTop:15, marginLeft:15}}
                    onPress={() => {this.props.navigation.goBack()}}/> */}
                    <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:350, marginRight:15}}>
                        <TouchableHighlight 
                        style={[styles.RoundButtons, {backgroundColor:this.state.StylingTable.QRContanctBackgroundColorCode}]} 
                        onPress={() => {this.setState({QRModal:true})}} 
                        underlayColor={this.state.StylingTable.MainActionsBackgroundColorCode}>
                            <Image source={{uri:this.state.teamProfileData.DomainName === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/E-Contact-QR.png" : this.state.apiStr+"/Content/EContact/img/Contact-Qr-White.png"}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </TouchableHighlight>
                        <TouchableHighlight 
                        style={[styles.RoundButtons, {backgroundColor:this.state.StylingTable.QRContanctBackgroundColorCode}]} 
                        onPress={() => {this.downloadContact()}} 
                        underlayColor={this.state.StylingTable.MainActionsBackgroundColorCode}>
                            <Image source={{uri: this.state.teamProfileData.DomainName === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/DP_Contact.png" : this.state.apiStr+"/Content/EContact/img/Contact-White.png"}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </TouchableHighlight>
                    </View>
                    </ImageBackground>
                    
                    <Text style={{color:this.state.StylingTable.MainTitleColorCode, fontSize:25, marginLeft:20,marginTop:20}}>{this.state.teamProfileData.DisplayName}</Text>
                    <Text style={{color:'#868686', fontSize:15, marginLeft:20,marginTop:5,marginBottom:20}}>{this.state.teamProfileData.JobTitle}</Text>

                    <View style={{flexDirection:'row', justifyContent:'center', marginBottom:10}}>
                        <TouchableHighlight 
                        style={[styles.RoundButtons, {backgroundColor:this.state.StylingTable.ServicesIconBackgroundColorCode}]} 
                        onPress={() => {this.launchePhoneCall(this.state.teamProfileData.PhoneNo)}} 
                        underlayColor={this.state.StylingTable.QRContanctBackgroundColorCode}>
                            <Image source={{uri:this.state.teamProfileData.DomainName === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/icon_bottom_1_call@3x.png" : this.state.apiStr+"/Content/EContact/img/Call-white.png"}}
                            resizeMode={'contain'} style={this.state.teamProfileData.DomainName === "cr8consultancy" ? styles.RoundImageSize50 : styles.RoundImageSize40}/>
                        </TouchableHighlight>
                        <TouchableHighlight 
                        style={[styles.RoundButtons, {backgroundColor:this.state.StylingTable.ServicesIconBackgroundColorCode}]} 
                        onPress={() => {this.launchEmail()}} 
                        underlayColor={this.state.StylingTable.QRContanctBackgroundColorCode}>
                            <Image source={{uri:this.state.teamProfileData.DomainName === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/icon_bottom_2_email@3x.png" : this.state.apiStr+"/Content/EContact/img/Email-white.png"}}
                            resizeMode={'contain'} style={this.state.teamProfileData.DomainName === "cr8consultancy" ? styles.RoundImageSize50 : styles.RoundImageSize40}/>
                        </TouchableHighlight>
                        {
                            this.state.teamProfileData.IsWeChatExist &&
                            <TouchableHighlight 
                            style={[styles.RoundButtons, {backgroundColor:this.state.StylingTable.ServicesIconBackgroundColorCode}]} 
                            onPress={() => {this.setState({WeChatModal:true})}} 
                            underlayColor={this.state.StylingTable.QRContanctBackgroundColorCode}>
                                <Image source={{uri:this.state.teamProfileData.DomainName === "cr8consultancy" ? 
                                this.state.apiStr+"/Content/EContact/img/icon_bottom_3_wechat@3x.png" : this.state.apiStr+"/Content/EContact/img/WeChat-white.png"}}
                                resizeMode={'contain'} style={this.state.teamProfileData.DomainName === "cr8consultancy" ? styles.RoundImageSize50 : styles.RoundImageSize40}/>
                            </TouchableHighlight>
                        }
                        <TouchableHighlight 
                        style={[styles.RoundButtons, {backgroundColor:this.state.StylingTable.ServicesIconBackgroundColorCode}]} 
                        onPress={() => {this.launchWhatsApp()}} 
                        underlayColor={this.state.StylingTable.QRContanctBackgroundColorCode}>
                            <Image source={{uri:this.state.teamProfileData.DomainName === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/icon_bottom_4_whatsapp@3x.png" : this.state.apiStr+"/Content/EContact/img/Whatsapp-white.png"}} 
                            resizeMode={'contain'} style={this.state.teamProfileData.DomainName === "cr8consultancy" ? styles.RoundImageSize50 : styles.RoundImageSize40}/>
                        </TouchableHighlight>
                    </View>
                    <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.QRModal}>
                        <View style={styles.ModalView}>    
                            <Text h4 h4Style={{alignSelf:'center'}}>Scan Me!</Text>
                            <Image source={{uri:this.state.apiStr+"/QR/"+this.state.teamProfileData.UserName+".png"}} resizeMode={'contain'} style={{width:'100%', height:300, alignSelf:'center'}} />
                            <Button type='clear' containerStyle={{marginTop:10}} title={"Close"} titleStyle={{color:this.state.StylingTable.MainTitleColorCode}} onPress={() => {this.setState({QRModal:false})}}/>
                        </View>
                    </Modal>
                    <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.WeChatModal}>
                        <View style={styles.ModalView}>    
                            <Text h4 h4Style={{alignSelf:'center'}}>Scan Me!</Text>
                            <Image source={{uri:this.state.apiStr+"/Wechat/"+this.state.teamProfileData.UserName+".png"}} resizeMode={'contain'} style={{width:'100%', height:300, alignSelf:'center'}} />
                            <Button type='clear' containerStyle={{marginTop:10}} title={"Close"} titleStyle={{color:this.state.StylingTable.MainTitleColorCode}} onPress={() => {this.setState({WeChatModal:false})}}/>
                        </View>
                    </Modal>
                </ScrollView>
            }
            </View>
        )
    }
}

function elevationShadowStyle(elevation) {
    return {
      elevation,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0.5 * elevation },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation
    };
}

const styles = StyleSheet.create({
    
    RootView: 
    {
        backgroundColor: '#fff',
        position: 'absolute',
        width:'100%',
        height:'100%',
        flex:1,
    },
    LoadingContainer:
    {
        position: 'absolute',
        height:'100%',
        width:'100%',
        justifyContent:'center'
    },
    LoadingInnerContainer:
    {
        width:100,
        backgroundColor:'#000',
        opacity:0.7,
        alignSelf:'center',
        borderRadius:5,
        padding:10
    },
    UpgradeModalView:
    {
        width: '100%',
        backgroundColor:'#fff',
        alignSelf:'center',
        justifyContent:'center',
        paddingTop:10,
        borderRadius:5,
        borderTopColor:'#00EFC2',
        borderTopWidth:10
    },
    ModalView:
    {
        width: '100%',
        backgroundColor:'#fff',
        alignSelf:'center',
        paddingTop:10,
        borderRadius:5,
    },
    ModalTextView:
    {
        alignSelf:'center',
        margin:10
    },
    Squircle:
    {
        borderRadius:10, 
        height:30,
        width:30,  
        justifyContent:'center',
        marginHorizontal:20
    },
    PhoneSquircle:
    {
        width:20,
        height:20,
        borderRadius:5,
        marginTop:5,
        justifyContent:'center',
    },
    RoundButtons:
    {
        borderRadius:40, 
        height:60,
        width:60,  
        justifyContent:'center',
        marginHorizontal:10
    },
    RoundButtons40:
    {
        borderRadius:40, 
        height:40,
        width:40,  
        justifyContent:'center',
        marginHorizontal:10
    },
    RoundButtons80:
    {
        borderRadius:40, 
        height:80,
        width:80,  
        justifyContent:'center',
        alignSelf:'center',
        marginHorizontal:5
    },
    WhatWeDeliverRoundButtonsView:
    {
        borderRadius:40, 
        height:60,
        width:60,  
        justifyContent:'center',
        marginHorizontal:20
    },
    WhatWeDeliverTextView:
    {
        alignSelf:'center', 
        color:'#868686',
        textAlign:'center',
        textAlignVertical:'center'
    },
    MainServicesTextView:
    {
        alignSelf:'center', 
        textAlign:'center',
        textAlignVertical:'center',
        marginTop:10
    },
    RoundImageSize20:
    {
        height:20, 
        width:20, 
        alignSelf:'center'
    },
    RoundImageSize30:
    {
        height:30, 
        width:30, 
        alignSelf:'center'
    },
    RoundImageSize35:
    {
        height:35, 
        width:35, 
        alignSelf:'center'
    },
    RoundImageSize40:
    {
        height:40, 
        width:40, 
        alignSelf:'center'
    },
    RoundImageSize50:
    {
        height:60,
        width:60,
        alignSelf:'center',
    },
    elevationShadow10: elevationShadowStyle(10),
    elevationShadow5: elevationShadowStyle(5),
    });
    