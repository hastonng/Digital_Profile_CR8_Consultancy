import React from 'react';
import { StyleSheet, TextInput, StatusBar, View, Dimensions, Linking, Platform,
 KeyboardAvoidingView, ScrollView, Switch, AsyncStorage } from 'react-native';
import { Text,Avatar, Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

import Connection from '../Connection';

var screenWidth = Math.round(Dimensions.get('window').width);
var screenHeight = Math.round(Dimensions.get('window').height);

export default class WhatsAppShare extends React.PureComponent 
{
    constructor(props)
    {
        super(props);
        Obj = new Connection();

        const { navigation } = this.props;

        this.state = {
            UserName: navigation.getParam('UserName','NO-ID'),
            DisplayName: navigation.getParam('DisplayName','NO-ID'),
            DomainName: navigation.getParam('DomainName','NO-ID'),
            emptyFieldModal: false,
            loadingModal:false,
            successModal:false,
            HostUserName:'',
            HostCompanyInfoID:'',
            textInputBorderCode:'#DFDFDF',
            phoneNum:'',
            BusinessType:'',
            Name:'',
            Gender:0,
            CompanyName:'',
            EmailAddress:'',
            saveContactSwitch:false,
            apiStr: Obj.getAPI(), 
        }

        this.initialState = this.state;
        
        this.getAsyncStorage();
    }
     
    static navigationOptions = () => ({
        header:null
    })

    getAsyncStorage = async() =>
    {
        let UserNameASYNC = await AsyncStorage.getItem('UserName');
        let CompanyInfoIDASYNC = await AsyncStorage.getItem('CompanyInfoID');

        this.setState({
            HostUserName: UserNameASYNC,
            HostCompanyInfoID: CompanyInfoIDASYNC ,
        })
    }

    addNewCard = () =>
    {
        this.setState({
            loadingModal:true
        });

        var cardBody = {
            DigitalNameCardPeopleID: 0,
            Name: this.state.Name,
            Tel: this.state.phoneNum,
            WhatsappNo: this.state.phoneNum,
            CompanyName: this.state.CompanyName,
            Email: this.state.EmailAddress,
            WebSite: '-',
            FromEvent: '-',
            Description: '-',
            Gender: this.getGender(),
            BusinessType: this.state.BusinessType,
            Tags: '-',
            ModifiedBy: this.state.HostUserName,
            CompanyInfoID: this.state.HostCompanyInfoID,
        };

        return fetch(this.state.apiStr+'/api/dp/AddCards?model=model&UserName='+this.state.HostUserName+'&CompanyInfoID='+this.state.HostCompanyInfoID, {
        method: 'POST',
        headers: 
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(cardBody)})
        .then((response) => 
        {
            return response.json();
        })
        .then((data) => 
        {
            console.log(data)
            if(data === 'success')
            {
                setTimeout(()=>{
                    this.setState({
                        loadingModal:false,
                        successModal:true
                    })
                },500);
            }
        })
        .catch((error) => 
        {
            console.error(error);
        });
    }

    share = () =>
    {
        if(this.state.saveContactSwitch === false)
        {
            if(this.state.phoneNum != '')
            {
                this.launchWhatsApp();
            }
            else
            {
                this.setState({textInputBorderCode:'red', emptyFieldModal:true})
            }
        }
        else
        {
            if(this.state.BusinessType != '' && this.state.Name != '' && this.state.phoneNum != '')
            {
                this.addNewCard();
            }
            else
            {
                this.setState({textInputBorderCode:'red', emptyFieldModal:true})
            }
        }
        
    }


    launchWhatsApp = () =>
    {
        let WhatsApp;
        if(Platform.OS === 'android')
        {
            WhatsApp = 'whatsapp://send?text=Hi there, my name is '+this.state.DisplayName+', check out my Digital Profile below!\n\n'+this.state.apiStr+'/'+this.state.DomainName+'/'+this.state.UserName+'&phone='+this.state.phoneNum;

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
            WhatsApp = `whatsapp://send?text=${"Hi There, my name is "+this.state.DisplayName+", check out my Digital Profile below!\n\n"+this.state.apiStr+'/'+this.state.DomainName+'/'+this.state.UserName}&phone=${this.state.phoneNum}`;
            
            Linking.openURL(WhatsApp)
            Linking.canOpenURL(WhatsApp).then(canOpen => {
                if(canOpen)
                {
                    Linking.openURL(WhatsApp).catch((error) => Promise.reject(error));
                }
                else
                {
                    Linking.openURL("https://itunes.apple.com/in/app/whatsapp-messenger/id310633997").catch((error) => Promise.reject(error));
                
                }
            })
        }
    }

    getGender = () =>
    {
        if(this.state.Gender === 0)
        {
            return "M";
        }
        else if(this.state.Gender === 1)
        {
            return "F";
        }
    }

    render()
    {
        return(
            <View style={styles.RootView}>
                <KeyboardAvoidingView behavior='position' enabled>
                <ScrollView overScrollMode={'never'} bounces={false} bouncesZoom={false} >
                    <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'}/>
                    <AntDesignIcon name='close' color={'#ffffff'} size={25} style={{marginTop:30, marginLeft:10, marginRight:5}}
                    onPress={() => {this.props.navigation.pop();}}/>
                    <Text h3 h3Style={{fontSize:25,color:'#fff',alignSelf:'center'}}>WhatsApp Share</Text>
                    <Avatar rounded size='xlarge' source={{uri:this.state.apiStr+"/Avatars/"+this.state.UserName+".png"}}
                    imageProps={{resizeMode:'contain'}}  
                    containerStyle={[styles.RoundImageSize200,{marginTop:30}]}/>
                    <Text style={{fontStyle:'italic', marginVertical:5, alignSelf:'center', color:'#fff', fontSize:15}}>{this.state.DisplayName}</Text>
                    <TextInput placeholder="Phone No. Eg: 6012345678" style={[styles.TextInput,{borderColor:this.state.textInputBorderCode}]} placeholderTextColor={'#868686'} keyboardType={'number-pad'} onChangeText={(text) => this.state.phoneNum = text}/>
                    <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'100%'}}>
                        <Text style={{color:'#fff', alignSelf:'center'}}>Save contact after sharing?</Text>
                        <Switch style={{marginHorizontal:10, marginVertical:10}} value={this.state.saveContactSwitch} trackColor={'#ffffff'} thumbColor={'#fff'} onValueChange={() => {this.setState({saveContactSwitch: !this.state.saveContactSwitch, textInputBorderCode:'#DFDFDF'})}}></Switch>
                    </View>

                    {
                        this.state.saveContactSwitch && <View style={{justifyContent:'center'}}>
                            <TextInput placeholder="Enter Business Type" style={[styles.TextInput,{borderColor:this.state.textInputBorderCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.state.BusinessType = text}/>
                            <TextInput placeholder="Enter Name" style={[styles.TextInput,{borderColor:this.state.textInputBorderCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.state.Name = text}/>

                            <SegmentedControlTab 
                                tabsContainerStyle={{width:150, height:25, marginLeft:30, marginTop:15, marginBottom: 10}}
                                borderRadius={20}
                                tabStyle={{borderColor:'#181A43'}}
                                tabTextStyle={{color:'#5B5B5B'}}
                                activeTabStyle={{backgroundColor:'#00E9C3'}}
                                values={["Male","Female"]}
                                selectedIndex={this.state.Gender}
                                onTabPress={(index) => {this.setState({Gender:index})}}/>

                            <TextInput placeholder="Enter Email Address" style={[styles.TextInput,{borderColor:'#DFDFDF'}]} placeholderTextColor={'#868686'} keyboardType={'email-address'}  onChangeText={(text) => this.state.EmailAddress = text}/>
                            <TextInput placeholder="Enter Company Name" style={[styles.TextInput,{ borderColor:'#DFDFDF'}]} placeholderTextColor={'#868686'} keyboardType={'default'}  onChangeText={(text) => this.state.CompanyName = text}/>
                        </View>
                    }

                    <Button title="Share!" type='outline' containerStyle={styles.shareBtnView} 
                        buttonStyle={{borderColor:'#00EFC2'}} 
                        titleStyle={{color:'#00EFC2',fontSize:20}} onPress={() => {this.share()}}/>
                </ScrollView>

                <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.loadingModal}>
                    <View style={styles.ModalView}>    
                        <Text h4 h4Style={{alignSelf:'center', margin:10}}>One moment</Text>
                        <LottieView style={[styles.LottieAnimationView,{marginBottom:25}]} source={require('../assets/loading.json')} autoPlay/>
                        <Text style={{alignSelf:'center', color:'#5B5B5B', margin:15}}>Adding card...</Text>
                    </View>
                </Modal>

                <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.successModal}>
                    <View style={styles.ModalView}>    
                        <Text h4 h4Style={{alignSelf:'center', margin:10}}>Sucessful!</Text>
                        <LottieView style={styles.LottieAnimationView} source={require('../assets/success.json')} autoPlay loop={false}/>
                        <Text style={{alignSelf:'center', color:'#5B5B5B', margin:15}}>Card has successfully added!</Text>
                        <View style={{borderTopWidth:1, borderTopColor:'#DFDFDF'}}>
                            <Button type='clear' title={"Done"} titleStyle={{color:'#181A43'}} onPress={() => {this.launchWhatsApp()}}/>
                        </View>
                    </View>
                </Modal>

                <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.emptyFieldModal}>
                    <View style={styles.ModalView}>    
                        <Text h4 h4Style={{alignSelf:'center',fontWeight:'bold', margin:10}}>Empty Field(s)</Text>
                        <MaterialIcon name='error-outline' color={'#FF9494'}  size={50} style={{alignSelf:'center', marginTop:10}}/>    
                        <Text style={{alignSelf:'center', color:'#5B5B5B', margin:15}}>Please fill up the required field(s)</Text>
                        <View style={{borderTopWidth:1, borderTopColor:'#DFDFDF'}}>
                            <Button type='clear' title={"Done"} titleStyle={{color:'#181A43'}} onPress={() => {this.setState({emptyFieldModal:false})}}/>
                        </View>
                    </View>
                </Modal>

                </KeyboardAvoidingView>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    
    RootView: 
    {
        backgroundColor: '#181A43',
        width:'100%',
        height:'100%',
        flex:1,
    },
    TextView:
    {
        marginLeft:30,
        marginTop:15,
        color:18, 
        fontWeight:'bold', 
        color:'#5B5B5B'
    },
    TextInput:
    {
        color:'#5B5B5B',
        marginTop: 15,
        marginRight: 30,
        marginLeft: 30,
        marginBottom: 10,
        padding: 8,
        height:40,
        borderWidth:2,
        backgroundColor:'#DFDFDF',
        borderRadius: 10
        
    },
    RoundImageSize200:
    {
        height:150,
        width:150,
        alignSelf:'center',
    },
    shareBtnView:
    {
        marginTop:15,
        marginEnd:60,
        marginStart:60,
        marginBottom: 20,
    },
    ModalView:
    {
        width: '100%',
        backgroundColor:'#fff',
        alignSelf:'center',
        borderRadius:5,
    },
    LottieAnimationView:
    {
        width:80, 
        height:80, 
        alignSelf:'center', 
        margin:10
    },

    });