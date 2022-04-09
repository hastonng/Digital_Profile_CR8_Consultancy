import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View, Dimensions, Linking, Platform,
 KeyboardAvoidingView, TouchableHighlight, ScrollView, Switch, AsyncStorage } from 'react-native';
import { Text, Avatar, Divider, Button } from 'react-native-elements';
import { NavigationActions, StackActions  } from 'react-navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';


import Connection from '../Connection';

var screenWidth = Math.round(Dimensions.get('window').width);
var screenHeight = Math.round(Dimensions.get('window').height);

export default class Settings extends React.PureComponent 
{
    constructor(props)
    {
        super(props);
        Obj = new Connection();

        const { navigation } = this.props;
        
        this.state = {
            StylingTable:'',
            UserName:'',
            CompanyInfoID:'',
            Email:'',
            DisplayName: navigation.getParam('DisplayName','NO-ID'),
            RefTeamID: navigation.getParam('RefTeamID','NO-ID'),
            RefPositionID: navigation.getParam('RefPositionID','NO-ID'),
            IsCompanyAdmin:  navigation.getParam('IsCompanyAdmin','NO-ID'),
            apiStr: Obj.getAPI(),
            imageURL:'', 
        }

        this.initialState = this.state;
        
        this.getAsyncStorage();
    }
     
    static navigationOptions = () => ({
        header:null
    })

    getAsyncStorage = async() =>
    {
        let StylingTableASYNC = await AsyncStorage.getItem('StylingTable')
        .then(data => {return JSON.parse(data)});

        let UserNameASYNC = await AsyncStorage.getItem('UserName');
        let CompanyInfoIDASYNC = await AsyncStorage.getItem('CompanyInfoID');
        let EmailASYNC = await AsyncStorage.getItem('Email');
        
        let imageStr = this.state.apiStr+"/Avatars/"+UserNameASYNC+".png";
        imageStr += '?random_number='+new Date().getTime();

        this.setState({
            StylingTable: StylingTableASYNC,
            UserName: UserNameASYNC,
            CompanyInfoID: CompanyInfoIDASYNC,
            Email: EmailASYNC,
            imageURL:imageStr
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
            <View style={[styles.RootView,{borderTopColor:this.state.StylingTable.MainTitleColorCode}]}>
                <SafeAreaView style={[{backgroundColor:this.state.StylingTable.MainTitleColorCode,flexDirection:'row',justifyContent:'space-between', paddingBottom:10}]}>
                    <View style={{flexDirection:'row',justifyContent:'flex-start', marginBottom: Platform.OS === 'ios' ? 10:0}}>
                        <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'}/>
                        <MaterialIcon name='arrow-back' color={'#fff'} size={25} style={{marginHorizontal:10, marginTop:5}} onPress={() => this.props.navigation.pop()}/>
                        <Text h4 h4Style={{color:'#fff', fontSize:18, paddingHorizontal:5,paddingTop:5}}>Settings</Text>
                    </View>
                </SafeAreaView>

                <TouchableHighlight 
                onPress={() => {this.props.navigation.navigate('EditProfile', { RefTeamID: this.state.RefTeamID, RefPositionID: this.state.RefPositionID,
                    IsCompanyAdmin: this.state.IsCompanyAdmin, UserName:this.state.UserName})}} 
                underlayColor={'#DFDFDF'}>
                    <View style={{justifyContent:'flex-start', flexDirection:'row'}}>
                        <Avatar rounded size={'large'} source={{uri:this.state.imageURL}} containerStyle={{margin:20}} />
                        <View style={{flexDirection:'column'}}>
                            <Text style={{marginTop:30, fontSize:18, color:'#5B5B5B'}}>{this.state.DisplayName}</Text>
                            <Text style={{marginTop:10, fontSize:13,fontStyle:'italic', color:'#5B5B5B'}}>{this.state.Email}</Text>
                        </View>
                    </View>
                </TouchableHighlight>

                <Divider style={{height:1}}/>

                <TouchableHighlight 
                onPress={() => {}} 
                underlayColor={'#DFDFDF'}
                style={{marginTop:5}}>
                    <View style={{justifyContent:'flex-start', flexDirection:'row'}}>
                        <MaterialIcon name='account-circle' color={'#181A43'} size={25} style={{margin:20}} />
                        <View style={{flexDirection:'column', paddingHorizontal:10, paddingVertical:10}}>
                            <Text style={{marginTop:5, fontSize:15, color:'#5B5B5B'}}>Account</Text>
                            <Text style={{marginTop:5, fontSize:12,fontStyle:'italic', color:'#868686'}}>Privacy, Change password, Change Email</Text>
                        </View>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight 
                onPress={() => {this.logout()}} 
                underlayColor={'#DFDFDF'}>
                    <View style={{justifyContent:'flex-start', flexDirection:'row'}}>
                        <AntDesignIcon name='logout' color={'#181A43'} size={20} style={{margin:23}} />
                        <View style={{flexDirection:'column', paddingHorizontal:10, paddingVertical:10}}>
                            <Text style={{marginTop:5, fontSize:15, color:'#5B5B5B'}}>Logout</Text>
                            <Text style={{marginTop:5, fontSize:12,fontStyle:'italic', color:'#868686'}}>Logout from Digital Profile</Text>
                        </View>
                    </View>
                </TouchableHighlight>

            </View>
        )
    }
}



const styles = StyleSheet.create({
    
    RootView: 
    {
        backgroundColor: '#fff',
        width:'100%',
        height:'100%',
        flex:1,
        borderTopWidth:30,
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