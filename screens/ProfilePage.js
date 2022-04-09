import React from 'react';
import { StyleSheet, View, Image,SafeAreaView, StatusBar,
    ImageBackground, ScrollView, Dimensions, TouchableHighlight, AsyncStorage,
    ActivityIndicator, Linking, RefreshControl, Share, Animated,
    Platform, FlatList } from 'react-native';
import { WebView } from 'react-native-webview';
import { FloatingAction } from 'react-native-floating-action';
import { Text,Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import Menu, {MenuItem, MenuDivider } from 'react-native-material-menu';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import Connection from '../Connection';

var screenWidth = Math.round(Dimensions.get('window').width);
var screenHeight = Math.round(Dimensions.get('window').height);


export default class ProfilePage extends React.PureComponent 
{
    constructor(props)
    {
        super(props);
        Obj = new Connection();

        this.state = {
            companyProfileData:'',
            digitalProfileData: '',
            employeeListData:'',
            StylingTable:'',
            showView:false,
            showLoading:true,
            QRModal:false,
            DPQRModal:false,
            WeChatModal:false,
            OurPeopleModal:false,
            scrollToTopFAB:false,
            EmployeeID:'',
            UserName:'',
            CompanyInfoID:'',
            Language:'',
            DomainName:'',
            apiStr: Obj.getAPI(),
            imageURL:'',
            scrollY: new Animated.Value(0) 
        }
        this.scrollViewRef = React.createRef();
        this.initialState = this.state;

        this.getAsyncStorage();

    }

    getAsyncStorage = async () =>
    {
        let digitalProfileDataASYNC = await AsyncStorage.getItem('digitalProfileData')
        .then(data => {return JSON.parse(data)});

        let companyProfileDataASYNC = await AsyncStorage.getItem('companyProfileData')
        .then(data => {return JSON.parse(data)});

        let employeeListDataASYNC = await AsyncStorage.getItem('EmployeeList')
        .then(data => {return JSON.parse(data)});

        let StylingTableASYNC = await AsyncStorage.getItem('StylingTable')
        .then(data => {return JSON.parse(data)});

        let EmployeeIDASYNC = await AsyncStorage.getItem('EmployeeID');
        let UserNameASYNC = await AsyncStorage.getItem('UserName');
        let CompanyInfoIDASYNC = await AsyncStorage.getItem('CompanyInfoID');
        let LanguageASYNC = await AsyncStorage.getItem('Language');
        let DomainNameASYNC = await AsyncStorage.getItem('DomainName');
        let imageStr = this.state.apiStr+"/Avatars/"+UserNameASYNC+".png";
        imageStr += '?random_number='+new Date().getTime();

        this.setState({
            digitalProfileData: digitalProfileDataASYNC,
            companyProfileData: companyProfileDataASYNC,
            employeeListData: employeeListDataASYNC,
            StylingTable: StylingTableASYNC,
            EmployeeID: EmployeeIDASYNC,
            UserName: UserNameASYNC,
            CompanyInfoID: CompanyInfoIDASYNC,
            Language: LanguageASYNC,
            DomainName: DomainNameASYNC,
            showLoading:false,
            showView:true,
            imageURL: imageStr
        })

        this.getDigitalProfile()
        .then(() => 
        {
            this.getCompanyProfile()
            .then(() => 
            {
                this.getEmployeeList();
            })
        });
    }

    OurPeopleModalController = () =>
    {
        this.setState({
            OurPeopleModal: true
        })
    }
    
    refreshPage = async () =>
    {
        this.setState(this.initialState);

        let EmployeeIDASYNC = await AsyncStorage.getItem('EmployeeID');
        let UserNameASYNC = await AsyncStorage.getItem('UserName');
        let CompanyInfoIDASYNC = await AsyncStorage.getItem('CompanyInfoID');
        let LanguageASYNC = await AsyncStorage.getItem('Language');
        let DomainNameASYNC = await AsyncStorage.getItem('DomainName');

        let imageStr = this.state.apiStr+"/Avatars/"+UserNameASYNC+".png";
        imageStr += '?random_number='+new Date().getTime();


        this.setState({
            EmployeeID: EmployeeIDASYNC,
            UserName: UserNameASYNC,
            CompanyInfoID: CompanyInfoIDASYNC,
            Language: LanguageASYNC,
            DomainName: DomainNameASYNC,
            imageURL: imageStr
        })

        this.getDigitalProfile()
        .then(() => 
        {
            this.getCompanyProfile()
            .then(() => 
            {
                this.getEmployeeList();
            })
        });
    }

    getDigitalProfile = () =>
    {
        return fetch(this.state.apiStr+'/api/dp/GetDigitalProfile?CompanyInfoID='+this.state.CompanyInfoID+'&UserName='+this.state.UserName+'&language='+this.state.Language)
        .then((response) => response.json())
        .then((responseJson) => {return responseJson;})
        .then(data =>
        {
            AsyncStorage.setItem('digitalProfileData', JSON.stringify(data));
            this.setState({
                digitalProfileData: data,
                StylingTable: data.StylingTable
          })
        })
        .catch((error) => {
          console.error(error);
        });
    }

    getCompanyProfile = () =>
    {
        return fetch(this.state.apiStr+'/api/dp/GetCompanyProfile?CompanyInfoID='+this.state.CompanyInfoID+'&language='+this.state.Language)
        .then((response) => response.json())
        .then((responseJson) => {return responseJson;})
        .then(data =>
        {
            AsyncStorage.setItem('companyProfileData', JSON.stringify(data));
            this.setState({
                companyProfileData: data
            })
        })
        .catch((error) => {
          console.error(error);
        });
    }

    getEmployeeList = () =>
    {   
        return fetch(this.state.apiStr+'/api/dp/GetEmployeeList?CompanyInfoID='+this.state.CompanyInfoID+'&language='+this.state.Language)
        .then((response) => response.json())
        .then((responseJson) => {return responseJson;})
        .then(data =>
        {
            this.setState({
                employeeListData: data,
                showView:true,
                showLoading:false,
            })
        })
        .catch((error) => {
            console.error(error);
        });
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
            Email = 'mailto:'+this.state.digitalProfileData.Employee.EmailAddress;
        }
        else if(Platform.OS === 'ios')
        {
            Email = 'mailto:'+this.state.digitalProfileData.Employee.EmailAddress;
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
            WhatsApp = 'whatsapp://send?text=Hi there i am using Digital Profile!&phone='+this.state.digitalProfileData.Employee.WhatsAppPhoneNumber;

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
            WhatsApp = `whatsapp://send?text=${"Hi There I am using Digital Profile"}&phone=${this.state.digitalProfileData.Employee.WhatsAppPhoneNumber}`;
            
            
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

    launchCompanyWeb = () =>
    {
        let CompanyWeb = this.state.digitalProfileData.CompanyInfo.CompanyWebsiteURL;

        Linking.canOpenURL(CompanyWeb).then(canOpen =>{
            if(canOpen)
            {
                Linking.openURL(CompanyWeb).catch((error) => Promise.reject(error));
            }
            else
            {
                alert('Invalid Web Url');
            }
        })
    }

    launchFacebookWeb = () =>
    {
        let FacebookWeb = this.state.digitalProfileData.CompanyInfo.CompanyFacebookURL;

        Linking.canOpenURL(FacebookWeb).then(canOpen =>{
            if(canOpen)
            {
                Linking.openURL(FacebookWeb).catch((error) => Promise.reject(error));
            }
            else
            {
                alert('Invalid Web Url');
            }
        })
    }

    launchInstagramWeb = () =>
    {
        let InstagramWeb = this.state.digitalProfileData.CompanyInfo.CompanyInstagramURL;

        Linking.canOpenURL(InstagramWeb).then(canOpen =>{
            if(canOpen)
            {
                Linking.openURL(InstagramWeb).catch((error) => Promise.reject(error));
            }
            else
            {
                alert('Invalid Web Url');
            }
        })
    }

    launchMaps = () =>
    {
        let Maps;
        if(Platform.OS === 'android')
        {
            Maps = "geo:,?q="+this.state.digitalProfileData.CompanyInfo.CompanyAddress;
        }
        else if(Platform.OS === 'ios')
        {
            Maps = "maps:,?q="+this.state.digitalProfileData.CompanyInfo.CompanyAddress;
        }

        Linking.canOpenURL(Maps).then(canOpen => {
            if(canOpen)
            {
                Linking.openURL(Maps).catch((error) => Promise.reject(error));
            }
            else
            {
                Linking.openURL("market://details?id=com.whatsapp").catch((error) => Promise.reject(error));
            }
        })
    }

    downloadContact = () =>
    {
        
        let downloadURL = this.state.apiStr+'/api/dp/DownloadVCF?Domain='+this.state.digitalProfileData.CompanyInfo.Domain+'&EmployeeID='+this.state.EmployeeID;

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

    share = () =>
    {
        try
        {
           Share.share({
            ...Platform.select({
                ios:{
                    message:'Hi there! This is my Digital Profile! \nPlease visit my profile and have a nice day.',
                    url:this.state.apiStr+"/"+this.state.DomainName+"/"+this.state.UserName
                },
                android:{
                    message:'Hi there! This is my Digital Profile! \nPlease visit my profile and have a nice day.:\n'+this.state.apiStr+"/"+this.state.DomainName+"/"+this.state.UserName
                }
            }),
            title: "Digital Profile",
            url:this.state.apiStr+"/"+this.state.DomainName+"/"+this.state.UserName,
            })
        }
        catch(error)
        {
            console.log(error)
        }
    }

    WhatsAppShare = () =>
    {
        this.props.navigation.navigate('WhatsAppShareStack',{
            UserName: this.state.UserName,
            DisplayName: this.state.digitalProfileData.Employee.DisplayName,
            DomainName: this.state.DomainName
        })
    }


    ourTeamNavigation = (data) =>
    {
        this.setState({
            OurPeopleModal: false
        })

        if(this.state.EmployeeID != data.item.EmployeeID)
        {
            setTimeout(()=>{
                this.props.navigation.navigate('TeamPageStack',{
                    teamEmployeeData: data.item,
                    DisplayName: data.item.DisplayName,
                    stylingTable: this.state.digitalProfileData.StylingTable,
                    hostUserName: this.state.UserName
                })
            },300);
        }
    }

    settings = () =>
    {
        this.props.navigation.navigate('SettingStack', {
            DisplayName: this.state.digitalProfileData.Employee.DisplayName,
            RefTeamID: this.state.digitalProfileData.Employee.RefTeamID,
            RefPositionID: this.state.digitalProfileData.Employee.RefPositionID,
            IsCompanyAdmin: this.state.digitalProfileData.Employee.IsCompanyAdmin
        })   
    }

    textAlignment = (text) => 
    {
        var replaceText = text.toString();
        return replaceText = replaceText.replace(/\s/g,"\n");
    }

    handleScrolling = (event) =>
    {
        if(event.nativeEvent.contentOffset.y > 70)
        {
            this.setState({
                scrollToTopFAB: true
            })
        }
        else if(event.nativeEvent.contentOffset.y <= 70)
        {
            this.setState({
                scrollToTopFAB: false
            })
        }
    }


    render()
    {
        return (
             <View style={[styles.RootView,{borderTopColor:this.state.StylingTable.MainTitleColorCode}]}>
                {
                    this.state.showLoading &&
                    <View>
                        <ShimmerPlaceHolder autoRun={true} style={[styles.LoadingPattern2,{marginTop:40}]}/>
                        <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern2}/>
                        <ShimmerPlaceHolder autoRun={true} style={[styles.LoadingPattern6]}/>
                        <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern1}/>
                        <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern3}/>
                        <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern2}/>
                        <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern3}/>
                    </View>    
                }
                {
                    this.state.showView && <SafeAreaView style={[{ backgroundColor:this.state.digitalProfileData.StylingTable.MainTitleColorCode,flexDirection:'row',justifyContent:'space-between'}]}>
                    <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                        <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'}/>
                        <Avatar rounded source={require('../assets/logo.png')} size='small' overlayContainerStyle={{backgroundColor:this.state.digitalProfileData.StylingTable.MainTitleColorCode,}} containerStyle={{marginLeft:10}}/>
                        <Text h4 h4Style={{color:'#fff', fontSize:18, paddingHorizontal:5,paddingTop:5}}>Digital Profile</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                        <Avatar rounded source={require('../assets/cr8consultancy.png')} size='small' imageProps={{resizeMode:'contain'}} overlayContainerStyle={{backgroundColor:this.state.digitalProfileData.StylingTable.MainTitleColorCode}} 
                        onPress={() =>{this.launchCompanyProfile()}}/>
                        <Icon name='options-vertical' color={'#fff'} size={20} style={{marginHorizontal:10, marginBottom:15, marginTop:5}} onPress={() => menuRef.show()}/>
                        <Menu ref={(ref) => menuRef = ref} style={{width:150}} button={<Text onPress={() => menuRef.show()}></Text>}>
                            {/* <Ionicons name='md-share-alt' color={'#868686'} size={17} style={{bottom:2}}/> */}
                            <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.share();},500); }}>Share</MenuItem>
                            {/* <Ionicons name='logo-whatsapp' color={'#868686'} size={17} style={{bottom:2}}/> */}
                            <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.WhatsAppShare();},300); }}>WhatsApp Share</MenuItem>
                            {/* <MaterialIcon name='group' color={'#868686'} size={17} style={{bottom:2}}/>    */}
                            <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.OurPeopleModalController();},300); }}>Team</MenuItem>
                            <MenuDivider/>
                            {/* <Icon name='logout' color={'#868686'} size={17} style={{bottom:2}}/>    */}
                            <MenuItem onPress={() => {menuRef.hide(); setTimeout(()=>{this.settings();},300); }}>Settings</MenuItem>
                        </Menu>
                    </View>
                </SafeAreaView> 
                }
                {
                    this.state.showView && 
                    <ScrollView overScrollMode={'never'} ref={this.scrollViewRef} bounces={false} bouncesZoom={false}
                    onScroll={this.handleScrolling}
                    scrollEventThrottle={16} 
                    refreshControl={<RefreshControl tintColor={this.state.digitalProfileData.StylingTable.MainTitleColorCode} 
                    onRefresh={() => this.refreshPage()}/>}>
                    
                    {/* this.state.apiStr+"/Avatars/"+this.state.digitalProfileData.Employee.UserName+".png" */}
                    <ImageBackground source={{uri:this.state.imageURL}} style={{height:400, width:screenWidth , flex:1}}>
                    <TouchableHighlight 
                        style={[styles.RoundButtons40,{marginTop:15,marginLeft:15, backgroundColor:this.state.digitalProfileData.StylingTable.MainTitleColorCode}]} 
                        onPress={() => {this.setState({OurPeopleModal:true})}} 
                        underlayColor={'#181A43'}>
                            <Image source={{uri:this.state.apiStr+"/CompanyLogo/"+this.state.digitalProfileData.DomainName+".png"}} 
                            resizeMode={'contain'} style={styles.RoundImageSize30}/>
                    </TouchableHighlight>
                    <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:300, marginRight:15}}>
                        <TouchableHighlight 
                        style={[styles.RoundButtons, {backgroundColor:this.state.digitalProfileData.StylingTable.QRContanctBackgroundColorCode}]} 
                        onPress={() => {this.setState({DPQRModal:true})}} 
                        underlayColor={'#181A43'}>
                            <Image source={{uri:this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/dp-scan.png" : this.state.apiStr+"/Content/EContact/img/white-dp-scan.png"}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </TouchableHighlight>
                        <TouchableHighlight 
                        style={[styles.RoundButtons, {backgroundColor:this.state.digitalProfileData.StylingTable.QRContanctBackgroundColorCode}]} 
                        onPress={() => {this.setState({QRModal:true})}} 
                        underlayColor={'#181A43'}>
                            <Image source={{uri:this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/p-scan.png" : this.state.apiStr+"/Content/EContact/img/white-p-scan.png"}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </TouchableHighlight>
                        <TouchableHighlight 
                        style={[styles.RoundButtons, {backgroundColor:this.state.digitalProfileData.StylingTable.QRContanctBackgroundColorCode}]} 
                        onPress={() => {this.downloadContact()}} 
                        underlayColor={'#181A43'}>
                            <Image source={{uri: this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/DP_Contact.png" : this.state.apiStr+"/Content/EContact/img/Contact-White.png"}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </TouchableHighlight>
                    </View>
                    </ImageBackground>
                    
                    <Text style={{color:this.state.digitalProfileData.StylingTable.MainTitleColorCode, fontSize:25, marginLeft:20,marginTop:20}}>{this.state.digitalProfileData.Employee.DisplayName}</Text>
                    <Text style={{color:'#868686', fontSize:15, marginLeft:20,marginTop:5,marginBottom:20}}>{this.state.digitalProfileData.Employee.JobTitle}</Text>

                    <View style={{flexDirection:'row', justifyContent:'center', marginBottom:10}}>
                        <TouchableHighlight 
                        style={[styles.RoundButtons50, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]} 
                        onPress={() => {this.launchePhoneCall(this.state.digitalProfileData.Employee.PhoneNo)}} 
                        underlayColor={'#181A43'}>
                            <Image source={{uri:this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/icon_bottom_1_call@3x.png" : this.state.apiStr+"/Content/EContact/img/Call-white.png"}}
                            resizeMode={'contain'} style={this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? styles.RoundImageSize50 : styles.RoundImageSize40}/>
                        </TouchableHighlight>
                        <TouchableHighlight 
                        style={[styles.RoundButtons50, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]} 
                        onPress={() => {this.launchEmail()}} 
                        underlayColor={'#181A43'}>
                            <Image source={{uri:this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/icon_bottom_2_email@3x.png" : this.state.apiStr+"/Content/EContact/img/Email-white.png"}}
                            resizeMode={'contain'} style={this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? styles.RoundImageSize50 : styles.RoundImageSize40}/>
                        </TouchableHighlight>
                        {
                            this.state.digitalProfileData.Employee.IsWeChatExist &&
                            <TouchableHighlight 
                            style={[styles.RoundButtons50, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]} 
                            onPress={() => {this.setState({WeChatModal:true})}} 
                            underlayColor={'#181A43'}>
                                <Image source={{uri:this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? 
                                this.state.apiStr+"/Content/EContact/img/icon_bottom_3_wechat@3x.png" : this.state.apiStr+"/Content/EContact/img/WeChat-white.png"}}
                                resizeMode={'contain'} style={this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? styles.RoundImageSize50 : styles.RoundImageSize40}/>
                            </TouchableHighlight>
                        }
                        <TouchableHighlight 
                        style={[styles.RoundButtons50, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]} 
                        onPress={() => {this.launchWhatsApp()}} 
                        underlayColor={'#181A43'}>
                            <Image source={{uri:this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? 
                            this.state.apiStr+"/Content/EContact/img/icon_bottom_4_whatsapp@3x.png" : this.state.apiStr+"/Content/EContact/img/Whatsapp-white.png"}} 
                            resizeMode={'contain'} style={this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" ? styles.RoundImageSize50 : styles.RoundImageSize40}/>
                        </TouchableHighlight>
                    </View>

                    <Image source={{uri: this.state.apiStr+"/Content/EContact/"+this.state.digitalProfileData.AppThemeFolderName+"/img/about.jpg"}} style={{height:200, width:screenWidth, alignSelf:'center',marginTop:20}}/>

                    <Text h4 h4Style={{color:this.state.digitalProfileData.StylingTable.MainTitleColorCode, fontSize:20, margin:20}}>About {this.state.digitalProfileData.CompanyInfo.CompanyName}</Text>

                    <WebView 
                    scalesPageToFit={true}
                    scrollEnabled={false}
                    originWhitelist={['*']}
                    source={{ html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div style="font-family:sans-serif, SimHei; color:#5b5b5b; margin:10;">'+this.state.digitalProfileData.AboutCompanyDescription+'</div></body></html>' }}
                    style={{width:screenWidth - 30, height:400, margin:13}}/>

                    <Image source={{uri: this.state.apiStr+"/Content/EContact/"+this.state.digitalProfileData.AppThemeFolderName+"/img/services.jpg"}}  style={{height:200,width:screenWidth, alignSelf:'center'}}/>
                    
                    <View style={{backgroundColor:'#F3F3F3'}}>
                        <Text h4 h4Style={{color:this.state.digitalProfileData.StylingTable.MainTitleColorCode, fontSize:20, margin:20}}>What We Deliver</Text>
                        <View style={{flexDirection:'row', justifyContent:'center', marginVertical:20}}>
                            {this.renderWhatWeDeliver1()}
                            {this.renderWhatWeDeliver2()}
                            {this.renderWhatWeDeliver3()}
                        </View>

                        <View style={{flexDirection:'row', justifyContent:'center', marginVertical:20}}>
                            {this.renderWhatWeDeliver4()}
                            {this.renderWhatWeDeliver5()}
                            {this.renderWhatWeDeliver6()}
                        </View>

                        <View style={{flexDirection:'row', justifyContent:'center', marginVertical:20}}>
                            {this.renderWhatWeDeliver7()}
                            {this.renderWhatWeDeliver8()}
                            {this.renderWhatWeDeliver9()}
                        </View>
                    </View>

                    <ImageBackground source={{uri:this.state.apiStr+"/Content/EContact/"+this.state.digitalProfileData.AppThemeFolderName+"/img/bg1.jpg"}} style={{ width:screenWidth}}>
                        <View style={{flexDirection:'row', justifyContent:'center', flex:1,marginTop:50}}>
                            <View style={{flexDirection:'column', justifyContent:'center'}}>
                                <View style={[styles.RoundButtons80, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                                    <Image source={{uri:this.state.apiStr+"/Content/EContact/img/icons/"+this.state.digitalProfileData.MainServiceIcon1}} 
                                    resizeMode={'contain'} style={[styles.RoundImageSize40]}/>
                                </View>
                                <View style={{flexDirection:'column', justifyContent:'center',  flex:1}}>
                                    <Text style={[styles.MainServicesTextView, {fontWeight:'bold', color:this.state.digitalProfileData.StylingTable.MainTitleColorCode}]}>{this.state.digitalProfileData.MainServiceTitle1}</Text>
                                    <WebView scalesPageToFit={true}
                                        scrollEnabled={false}
                                        originWhitelist={['*']}
                                        source={{ html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div style="font-family:sans-serif, SimHei; color:#5b5b5b; margin:15; text-align:center;">'+this.state.digitalProfileData.MainServiceDesctription1+'</div></body></html>' }}
                                        style={styles.MainServiceWebView}/>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>

                    <ImageBackground source={{uri:this.state.apiStr+"/Content/EContact/"+this.state.digitalProfileData.AppThemeFolderName+"/img/bg2.jpg"}} style={{width:screenWidth}}>
                        <View style={{flexDirection:'row', justifyContent:'center',marginTop:50}}>
                            <View style={{flexDirection:'column', justifyContent:'center'}}>
                                <View style={[styles.RoundButtons80, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                                    <Image source={{uri:this.state.apiStr+"/Content/EContact/img/icons/"+this.state.digitalProfileData.MainServiceIcon2}} 
                                    resizeMode={'contain'} style={[styles.RoundImageSize40]}/>
                                </View>
                                <View style={{flexDirection:'column', justifyContent:'center'}}>
                                    <Text style={[styles.MainServicesTextView, {fontWeight:'bold', color:this.state.digitalProfileData.StylingTable.MainTitleColorCode }]}>{this.state.digitalProfileData.MainServiceTitle2}</Text>
                                    <WebView scalesPageToFit={true}
                                        scrollEnabled={false}
                                        originWhitelist={['*']}
                                        source={{ html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div style="font-family:sans-serif, SimHei; color:#5b5b5b; margin:15; text-align:center;">'+this.state.digitalProfileData.MainServiceDesctription2+'</div></body></html>' }}
                                        style={styles.MainServiceWebView}/>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>

                    <ImageBackground source={{uri:this.state.apiStr+"/Content/EContact/"+this.state.digitalProfileData.AppThemeFolderName+"/img/bg3.jpg"}} style={{width:screenWidth}}>
                        <View style={{flexDirection:'row', justifyContent:'center',marginTop:50}}>
                            <View style={{flexDirection:'column', justifyContent:'center'}}>
                                <View style={[styles.RoundButtons80, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                                    <Image source={{uri:this.state.apiStr+"/Content/EContact/img/icons/"+this.state.digitalProfileData.MainServiceIcon3}} 
                                    resizeMode={'contain'} style={[styles.RoundImageSize40]}/>
                                </View>
                                <View style={{flexDirection:'column', justifyContent:'center'}}>
                                    <Text style={[styles.MainServicesTextView, {fontWeight:'bold', color:this.state.digitalProfileData.StylingTable.MainTitleColorCode}]}>{this.state.digitalProfileData.MainServiceTitle3}</Text>
                                    <WebView scalesPageToFit={true}
                                        scrollEnabled={false}
                                        originWhitelist={['*']}
                                        source={{ html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div style="font-family:sans-serif, SimHei; color:#5b5b5b; margin:15; text-align:center;">'+this.state.digitalProfileData.MainServiceDesctription3+'</div></body></html>' }}
                                        style={styles.MainServiceWebView}/>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>

                    <View style={{backgroundColor:this.state.digitalProfileData.StylingTable.MainTitleColorCode, width:screenWidth, paddingHorizontal:15}}>
                        <Image source={{uri:this.state.apiStr+"/CompanyLogo/"+this.state.digitalProfileData.DomainName+".png"}} 
                        resizeMode={'contain'} style={[{width:150,height:100,marginTop:20, alignSelf:'center'}]}/>
                        {
                            this.state.digitalProfileData.CompanyInfo.Domain === "cr8consultancy" && 
                            <Image source={{uri:this.state.apiStr+"/Content/EContact/img/contact_page_brandnergy_logo@3x.png"}} 
                            resizeMode={'contain'} style={[{width:200 ,height:100,alignSelf:'center'}]}/>
                        }

                        <View style={{flexDirection:'row', justifyContent:'center', margin:10}}>
                            {this.renderFacebook()}
                            {this.renderWebSite()}
                            {this.renderInstagram()}
                        </View>

                        <Text style={{fontSize:15, marginLeft:20,marginTop:10,marginBottom:10, color:'#fff'}}>{this.state.digitalProfileData.CompanyInfo.CompanyName}</Text>
                        <TouchableHighlight 
                        onPress={() => {this.launchMaps()}} 
                        underlayColor={this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}>
                            <Text style={{fontSize:15, marginLeft:20,marginTop:10,marginRight:20,marginBottom:10, color:'#fff'}}>{this.state.digitalProfileData.CompanyInfo.CompanyAddress}</Text>
                        </TouchableHighlight>

                         <TouchableHighlight 
                            style={{ marginBottom:30}}
                            onPress={() => {this.launchePhoneCall(this.state.digitalProfileData.CompanyInfo.CompanyTel)}} 
                            underlayColor={this.state.digitalProfileData.StylingTable.MainTitleColorCode}>
                                <View style={[{flexDirection:'row',marginHorizontal:10,}]}>
                                    <View style={[styles.PhoneSquircle,{backgroundColor:this.state.digitalProfileData.StylingTable.FacebookWebsiteBackgroundColorCode}]}>
                                        <Image source={{uri:this.state.apiStr+"/Content/EContact/img/phone.png"}}
                                        resizeMode={'contain'} style={{width:15,height:15,alignSelf:'center'}}/>
                                    </View>
                                    <Text style={{fontSize:15, margin:5, color:'#fff'}}>{this.state.digitalProfileData.CompanyInfo.CompanyTel}</Text>
                                </View>
                        </TouchableHighlight>
                    </View>

                    <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.QRModal}>
                        <View style={styles.ModalView}>    
                            <Text h4 h4Style={{alignSelf:'center'}}>Scan Me!</Text>
                            <Text style={{alignSelf:'center',fontSize:13, color:'#5B5B5B', fontStyle:'italic',margin:5}}>View Profile</Text>
                            <Image source={{uri:this.state.apiStr+"/QR/"+this.state.digitalProfileData.Employee.UserName+".png"}} resizeMode={'contain'} style={{width:'100%', height:300, alignSelf:'center'}} />
                            <Button type='clear' containerStyle={{marginTop:10}} title={"Close"} titleStyle={{color:this.state.digitalProfileData.StylingTable.MainTitleColorCode}} onPress={() => {this.setState({QRModal:false})}}/>
                        </View>
                    </Modal>
                    <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.DPQRModal}>
                        <View style={styles.ModalView}>    
                            <Text h4 h4Style={{alignSelf:'center'}}>Scan Me!</Text>
                            <Text style={{alignSelf:'center',fontSize:13, color:'#5B5B5B', fontStyle:'italic',margin:5}}>Digital Book</Text>
                            <Image source={{uri:this.state.apiStr+"/DPQR/"+this.state.digitalProfileData.Employee.UserName+".png"}} resizeMode={'contain'} style={{width:'100%', height:300, alignSelf:'center'}} />
                            <Button type='clear' containerStyle={{marginTop:10}} title={"Close"} titleStyle={{color:this.state.digitalProfileData.StylingTable.MainTitleColorCode}} onPress={() => {this.setState({DPQRModal:false})}}/>
                        </View>
                    </Modal>
                    <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.WeChatModal}>
                        <View style={styles.ModalView}>    
                            <Text h4 h4Style={{alignSelf:'center'}}>Scan Me!</Text>
                            <Image source={{uri:this.state.apiStr+"/Wechat/"+this.state.digitalProfileData.Employee.UserName+".png"}} resizeMode={'contain'} style={{width:'100%', height:300, alignSelf:'center'}} />
                            <Button type='clear' containerStyle={{marginTop:10}} title={"Close"} titleStyle={{color:this.state.digitalProfileData.StylingTable.MainTitleColorCode}} onPress={() => {this.setState({WeChatModal:false})}}/>
                        </View>
                    </Modal>
                    <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.OurPeopleModal}>
                        <View style={[styles.ModalView,{borderTopWidth:15, borderTopColor:this.state.digitalProfileData.StylingTable.MainActionsBackgroundColorCode}]}>
                            <Text h4 h4Style={{alignSelf:'center',marginBottom:10}}>Team</Text>
                            <ScrollView style={{height:'70%', alignSelf:'center'}} showsVerticalScrollIndicator={false}>
                                <FlatList
                                showsVerticalScrollIndicator={false}
                                data={this.state.employeeListData}
                                keyExtractor={(item, key) => item.key = key.toString()}
                                renderItem={this.renderOurPeople} //method to render the data in the way you want using styling u need
                                horizontal={false}
                                numColumns={2}/> 
                            </ScrollView>
                            <View style={{borderTopWidth:1, borderTopColor:'#DFDFDF'}}>
                                <Button type='clear' containerStyle={{ marginVertical:3}} title={"Close"} titleStyle={{color:this.state.digitalProfileData.StylingTable.MainTitleColorCode}} onPress={() => {this.setState({OurPeopleModal:false})}}/>
                            </View>
                        </View>
                    </Modal>
                    </ScrollView>
                }
                <FloatingAction visible={this.state.scrollToTopFAB} buttonSize={40} color={'#181A43'}
                showBackground={false} distanceToEdge={{horizontal:screenWidth/2.2, vertical:10}}
                onPressMain={() => {this.scrollViewRef.current.scrollTo({animated:true, x:0,y:0})}}
                floatingIcon={<IconAntDesign name="arrowup" size={23} color={'#fff'}/>}/>
            </View>
        );  
    }

    renderOurPeople = (data) =>
    {
        return(
            <View style={{flexDirection:'column', justifyContent:'center', margin:5}}>
                <Avatar rounded size='xlarge' source={{uri:this.state.apiStr+"/Avatars/"+data.item.UserName+".png"}} 
                containerStyle={{alignSelf:'center'}} overlayContainerStyle={{margin:10}}
                onPress={() => {this.ourTeamNavigation(data)}}/>
                <Text style={{fontStyle:'italic', marginVertical:5,alignSelf:'center', color:'#868686'}}>{data.item.DisplayName}</Text>
            </View>
        )
    }

    renderFacebook = () =>
    {
        if(this.state.digitalProfileData.CompanyFacebookURL != "")
        {
            return(
                <TouchableHighlight 
                onPress={() => {this.launchFacebookWeb()}}
                style={[styles.Squircle, {backgroundColor:this.state.digitalProfileData.StylingTable.FacebookWebsiteBackgroundColorCode}]}
                underlayColor={this.state.digitalProfileData.StylingTable.MainActionsBackgroundColorCode}>
                    <Image source={{uri:this.state.apiStr+"/Content/EContact/img/fb.png"}}
                    resizeMode={'contain'} style={styles.RoundImageSize20}/>
                </TouchableHighlight>
            )
        }
    }

    renderWebSite = () =>
    {
        if(this.state.digitalProfileData.CompanyWebsiteURL != "")
        {
            return(
                <TouchableHighlight 
                style={[styles.Squircle, {backgroundColor:this.state.digitalProfileData.StylingTable.FacebookWebsiteBackgroundColorCode}]} 
                onPress={()=>{this.launchCompanyWeb()}}
                underlayColor={this.state.digitalProfileData.StylingTable.MainActionsBackgroundColorCode}>
                    <Image source={{uri:this.state.apiStr+"/Content/EContact/img/earth.png"}}
                    resizeMode={'contain'} style={styles.RoundImageSize20}/>
                </TouchableHighlight>
            )
        }
    }

    renderInstagram = () =>
    {
        if(this.state.digitalProfileData.CompanyInstagramURL != "")
        {
            return(
                <TouchableHighlight
                onPress={() => {this.launchInstagramWeb()}} 
                style={[styles.Squircle, {backgroundColor:this.state.digitalProfileData.StylingTable.FacebookWebsiteBackgroundColorCode}]} 
                underlayColor={this.state.digitalProfileData.StylingTable.MainActionsBackgroundColorCode}>
                    <Image source={{uri:this.state.apiStr+"/Content/EContact/img/insta_1.png"}}
                    resizeMode={'contain'} style={styles.RoundImageSize20}/>
                </TouchableHighlight>
            )
        }
    }

    renderWhatWeDeliver1 = () =>
    {   
        if(this.state.digitalProfileData.WhatWeDeliverIcon1 != '')
        {
            return(
                <TouchableHighlight>
                    <View style={{flexDirection:'column', justifyContent:'center'}}>
                        <View style={[styles.WhatWeDeliverRoundButtonsView, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                            <Image source={{uri:this.state.apiStr+'/Content/EContact/img/icons/'+this.state.digitalProfileData.WhatWeDeliverIcon1}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </View>
                        <Text style={styles.WhatWeDeliverTextView}>{this.state.digitalProfileData.WhatWeDeliverTitle1}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }
    renderWhatWeDeliver2 = () =>
    {   
        if(this.state.digitalProfileData.WhatWeDeliverIcon2 != '')
        {
            return(
                <TouchableHighlight>
                    <View style={{flexDirection:'column', justifyContent:'center'}}>
                        <View style={[styles.WhatWeDeliverRoundButtonsView, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                            <Image source={{uri:this.state.apiStr+'/Content/EContact/img/icons/'+this.state.digitalProfileData.WhatWeDeliverIcon2}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </View>
                        <Text style={styles.WhatWeDeliverTextView}>{this.textAlignment(this.state.digitalProfileData.WhatWeDeliverTitle2)}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }
    renderWhatWeDeliver3 = () =>
    {   
        if(this.state.digitalProfileData.WhatWeDeliverIcon3 != '')
        {
            return(
                <TouchableHighlight>
                    <View style={{flexDirection:'column', justifyContent:'center'}}>
                        <View style={[styles.WhatWeDeliverRoundButtonsView, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                            <Image source={{uri:this.state.apiStr+'/Content/EContact/img/icons/'+this.state.digitalProfileData.WhatWeDeliverIcon3}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </View>
                        <Text style={styles.WhatWeDeliverTextView}>{this.textAlignment(this.state.digitalProfileData.WhatWeDeliverTitle3)}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }

    renderWhatWeDeliver4= () =>
    {   
        if(this.state.digitalProfileData.WhatWeDeliverIcon4 != '')
        {
            return(
                <TouchableHighlight>
                    <View style={{flexDirection:'column', justifyContent:'center'}}>
                        <View style={[styles.WhatWeDeliverRoundButtonsView, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                            <Image source={{uri:this.state.apiStr+'/Content/EContact/img/icons/'+this.state.digitalProfileData.WhatWeDeliverIcon4}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </View>
                        <Text style={styles.WhatWeDeliverTextView}>{this.textAlignment(this.state.digitalProfileData.WhatWeDeliverTitle4)}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }

    renderWhatWeDeliver5 = () =>
    {   
        if(this.state.digitalProfileData.WhatWeDeliverIcon5 != '')
        {
            return(
                <TouchableHighlight>
                    <View style={{flexDirection:'column', justifyContent:'center'}}>
                        <View style={[styles.WhatWeDeliverRoundButtonsView, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                            <Image source={{uri:this.state.apiStr+'/Content/EContact/img/icons/'+this.state.digitalProfileData.WhatWeDeliverIcon5}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </View>
                        <Text style={styles.WhatWeDeliverTextView}>{this.textAlignment(this.state.digitalProfileData.WhatWeDeliverTitle5)}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }

    renderWhatWeDeliver6 = () =>
    {   
        if(this.state.digitalProfileData.WhatWeDeliverIcon6 != '')
        {
            return(
                <TouchableHighlight>
                    <View style={{flexDirection:'column', justifyContent:'center'}}>
                        <View style={[styles.WhatWeDeliverRoundButtonsView, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                            <Image source={{uri:this.state.apiStr+'/Content/EContact/img/icons/'+this.state.digitalProfileData.WhatWeDeliverIcon6}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </View>
                        <Text style={styles.WhatWeDeliverTextView}>{this.textAlignment(this.state.digitalProfileData.WhatWeDeliverTitle6)}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }

    renderWhatWeDeliver7 = () =>
    {   
        if(this.state.digitalProfileData.WhatWeDeliverIcon7 != '')
        {
            return(
                <TouchableHighlight>
                    <View style={{flexDirection:'column', justifyContent:'center'}}>
                        <View style={[styles.WhatWeDeliverRoundButtonsView, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                            <Image source={{uri:this.state.apiStr+'/Content/EContact/img/icons/'+this.state.digitalProfileData.WhatWeDeliverIcon7}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </View>
                        <Text style={styles.WhatWeDeliverTextView}>{this.textAlignment(this.state.digitalProfileData.WhatWeDeliverTitle7)}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }

    renderWhatWeDeliver8 = () =>
    {   
        if(this.state.digitalProfileData.WhatWeDeliverIcon8 != '')
        {
            return(
                <TouchableHighlight>
                    <View style={{flexDirection:'column', justifyContent:'center'}}>
                        <View style={[styles.WhatWeDeliverRoundButtonsView, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                            <Image source={{uri:this.state.apiStr+'/Content/EContact/img/icons/'+this.state.digitalProfileData.WhatWeDeliverIcon8}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </View>
                        <Text style={styles.WhatWeDeliverTextView}>{this.textAlignment(this.state.digitalProfileData.WhatWeDeliverTitle8)}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }

    renderWhatWeDeliver9 = () =>
    {   
        if(this.state.digitalProfileData.WhatWeDeliverIcon9 != '')
        {
            return(
                <TouchableHighlight>
                    <View style={{flexDirection:'column', justifyContent:'center'}}>
                        <View style={[styles.WhatWeDeliverRoundButtonsView, {backgroundColor:this.state.digitalProfileData.StylingTable.ServicesIconBackgroundColorCode}]}>
                            <Image source={{uri:this.state.apiStr+'/Content/EContact/img/icons/'+this.state.digitalProfileData.WhatWeDeliverIcon9}} 
                            resizeMode={'contain'} style={styles.RoundImageSize40}/>
                        </View>
                        <Text style={styles.WhatWeDeliverTextView}>{this.textAlignment(this.state.digitalProfileData.WhatWeDeliverTitle9)}</Text>
                    </View>
                </TouchableHighlight>
            );
        }
        
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
    backgroundColor: 'transparent',
    width:'100%',
    height:'100%',
    flex:1,
    borderTopWidth: Platform.OS === 'android' ? 30:0
},
header: 
{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
    overflow: 'hidden',
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
RoundButtons50:
{
    borderRadius:40, 
    height:50,
    width:50,  
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
    textAlignVertical:'center',
    fontSize:12
},
MainServicesTextView:
{
    alignSelf:'center', 
    textAlign:'center',
    textAlignVertical:'center',
    marginTop:10,
    fontSize:18
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
MainServiceWebView:
{
    width:screenWidth - 50,
    height:600,
    alignSelf:'center',
    margin:25,
    flex:1,
    backgroundColor:'transparent'
},
LoadingPattern1:
{
    width:screenWidth - 40, 
    marginTop:50, 
    marginHorizontal:20, 
    marginRight:20, 
    borderRadius:5
},

LoadingPattern2:
{
    width:screenWidth - 80, 
    marginTop:30, 
    marginLeft:20, 
    marginRight:20, 
    borderRadius:5
},
LoadingPattern3:
{
    width:screenWidth - 40, 
    height:100, 
    marginTop:30, 
    marginLeft:20, 
    marginRight:20, 
    borderRadius:5
},
LoadingPattern4:
{
    width:200,
    marginTop:50, 
    marginLeft:20, 
    marginRight:20, 
    borderRadius:5
},
LoadingPattern5:
{
    width:200,
    marginTop:30, 
    marginLeft:20, 
    marginRight:20, 
    borderRadius:5
},
LoadingPattern6:
{
    width:screenWidth - 40, 
    height:200, 
    marginTop:30, 
    marginLeft:20, 
    marginRight:20, 
    borderRadius:5
},
LoadingRoundPattern1:
{
    width:80, 
    height:80, 
    marginTop:40, 
    marginLeft:20, 
    borderRadius:70
},
LoadingRoundPattern2:
{
    width:60, 
    height:60, 
    marginTop:40, 
    marginLeft:20, 
    borderRadius:50
},
elevationShadow10: elevationShadowStyle(10),
elevationShadow5: elevationShadowStyle(5),
});
