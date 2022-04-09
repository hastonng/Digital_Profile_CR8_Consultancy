import React,{PureComponent} from 'react';
import {StyleSheet,KeyboardAvoidingView,TextInput, View, Image, AsyncStorage, StatusBar, Platform  } from 'react-native';
import { NavigationActions, StackActions  } from 'react-navigation';
import {Text, Button} from 'react-native-elements';
import Modal from 'react-native-modal';

import Connection from '../Connection';
import {getAsyncStorage} from '../AppNavigator';

export default class LoginPage extends PureComponent
{
    static navigationOptions = {
        header: null
    }

    constructor(props)
    {
        super(props);
        Obj = new Connection();

        this.state ={
            Email: '',
            Password: '',
            buttonLoading: false,
            loginFailedPrompt:false,
            loadPage:false,
            apiStr: Obj.getAPI(), 
        }

        this.initialState = this.state;
        this.checkUserID();
    }

    login = async () =>
    {
        this.setState({buttonLoading: true});
        return fetch(this.state.apiStr+'/api/dp/MobileLogin?Email='+this.state.Email+'&Password='+this.state.Password, {
            method: 'POST',
            headers: 
            {
                'Accept': 'application/json',
              'Content-Type': 'application/json',
            }})
            .then((response) => 
            {
                return response.json();
            })
            .then((data) => 
            {
                if(data.EmployeeID === 0 && data.DomainName === null)
                {
                    this.setState({
                        loginFailedPrompt: true,
                        buttonLoading: false
                    })
                }
                else
                {
                    AsyncStorage.setItem('EmployeeID', data.EmployeeID+'');
                    AsyncStorage.setItem('DomainName',data.DomainName);
                    AsyncStorage.setItem('UserName',data.UserName);
                    AsyncStorage.setItem('Email',data.Email);
                    AsyncStorage.setItem('CompanyInfoID',data.CompanyInfoID+'');
                    AsyncStorage.setItem('Language',data.Language);

                    
                    this.getDigitalProfile()
                    .then(()=>
                    {
                        this.getCompanyProfile()
                        .then(() =>
                        {
                            this.getEmployeeList()
                            .then(() =>
                            {
                                this.props
                                .navigation
                                .dispatch(StackActions.reset({
                                    index: 0,
                                    actions: [
                                    NavigationActions.navigate({
                                        routeName: 'Login'
                                    }),
                                    ],
                                }))
                            })
                        })
                    })
                }
            })
            .catch((error) => 
            {
                console.error(error);
            });

    }

    getDigitalProfile = async () =>
    {
        let UserName = await AsyncStorage.getItem('UserName');
        let CompanyInfoID = await AsyncStorage.getItem('CompanyInfoID');
        let Language = await AsyncStorage.getItem('Language');

        return fetch(this.state.apiStr+'/api/dp/GetDigitalProfile?CompanyInfoID='+CompanyInfoID+'&UserName='+UserName+'&language='+Language)
        .then((response) => response.json())
        .then((responseJson) => {return responseJson;})
        .then(data =>
        {
            AsyncStorage.setItem('digitalProfileData', JSON.stringify(data));
            AsyncStorage.setItem('StylingTable', JSON.stringify(data.StylingTable));
            getAsyncStorage();
        })
        .catch((error) => {
            console.error(error);
        });
    }

    getCompanyProfile = async () =>
    {
        let CompanyInfoID = await AsyncStorage.getItem('CompanyInfoID');
        let Language = await AsyncStorage.getItem('Language');

        return fetch(this.state.apiStr+'/api/dp/GetCompanyProfile?CompanyInfoID='+CompanyInfoID+'&language='+Language)
        .then((response) => response.json())
        .then((responseJson) => {return responseJson;})
        .then(data =>
        {
            AsyncStorage.setItem('companyProfileData', JSON.stringify(data));
            
        })
        .catch((error) => {
            console.error(error);
        });
    }

    getEmployeeList = async () =>
    {
        let CompanyInfoID = await AsyncStorage.getItem('CompanyInfoID');
        let Language = await AsyncStorage.getItem('Language');
        
        return fetch(this.state.apiStr+'/api/dp/GetEmployeeList?CompanyInfoID='+CompanyInfoID+'&language='+Language)
        .then((response) => response.json())
        .then((responseJson) => {return responseJson;})
        .then(data =>
        {
            AsyncStorage.setItem('EmployeeList', JSON.stringify(data));
        })
        .catch((error) => {
            console.error(error);
        });
    }

    checkUserID = async ()=>
    {
        const EmployeeID = await AsyncStorage.getItem('EmployeeID');
        const CompanyInfoID = await AsyncStorage.getItem('CompanyInfoID');
        const Language = await AsyncStorage.getItem('Language');

        if(EmployeeID === null || CompanyInfoID === null || Language === null)
        {
            this.setState({
                loadPage:true
            })
        }
        else
        {
            // return(<AppNavigator/>)
            this.props
            .navigation
            .dispatch(StackActions.reset({
                index: 0,
                actions: [
                NavigationActions.navigate({
                    routeName: 'BottomNavigationStack'
                }),
                ],
                }))
        }
    }

    render()
    {
        return(
            
            this.state.loadPage && <View style={styles.RootView}>
            <KeyboardAvoidingView  behavior='position' enabled keyboardVerticalOffset={Platform.select({ios:0,android:64})}>
                <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'}/>
                <View style={{margin:10}}>
                    <Image source={{uri:this.state.apiStr+'/Content/EContact/img/logo.png'}} style={styles.imageLogoView} />
                    <Text h4 h4Style={styles.H4View}>Digital Profile</Text>
                    <TextInput placeholder="Email" style={styles.TextInput} placeholderTextColor={'#fff'} keyboardType={'email-address'} onChangeText={(text) => this.setState({Email:text})}/>
                    <TextInput placeholder="Password" style={styles.TextInput} placeholderTextColor={'#fff'} secureTextEntry={true} onChangeText={(text) => this.setState({Password:text})}/>
                </View>

                {/* <View style={styles.forgotBtnView}> 
                        <View style={{borderRightWidth:1, borderRightColor:'#fff'}}>
                            <Button title='Login as guest' type="clear" titleStyle={[styles.SecondLayerButtonView,{color:'#F3F303'}]} containerStyle={{height:20}} buttonStyle={{height:20}}/>
                        </View>
                        <View style={{marginTop:1}}>
                            <Button title='Forgot Password?'  type="clear" titleStyle={[styles.SecondLayerButtonView,{color:'#fff'}]} containerStyle={{height:20}} buttonStyle={{height:20}} /> 
                        </View>                
                </View> */}

                <View>
                    <Button title="Login" type='outline' loading={this.state.buttonLoading} containerStyle={styles.loginButton} buttonStyle={{borderColor:'#00EFC2'}} titleStyle={{color:'#00EFC2'}} onPress={() => this.login()}/>
                </View>
               
           </KeyboardAvoidingView>

           <Modal coverScreen={true} backdropColor={'black'} animationIn={'slideInUp'} isVisible={this.state.loginFailedPrompt}>
               <View style={styles.ModalRootView}>    
                   <Text h4 h4Style={styles.SuccessTextView}>Oops...</Text>
                   <Text style={[styles.SuccessTextView]}>Email and Password entered is incorrect</Text>
                   <View style={styles.ButtonView}>
                       <Button containerStyle={{alignSelf:'center'}} titleStyle={{alignSelf:'center'}} type='clear' title={"OK"} onPress={() => this.setState({loginFailedPrompt:false})}/>
                   </View>
               </View>
           </Modal>
       </View>
        )
    }   
}

const styles = StyleSheet.create({
    
    RootView: {
      backgroundColor: '#181A43',
      justifyContent:'center',
      flex: 1,
      position: 'absolute',
      width:'100%',
      height:'100%',
    },
    imageLogoView:
    {
        width: 100, 
        height: 100, 
        alignSelf:'center'
    },
    H4View:
    {
        color:'#fff', 
        alignSelf:'center',
        margin:10
    },
    loginButton:
    {
        marginTop:5,
        marginEnd:60,
        marginStart:60,
        marginBottom: 20
        
    },
    forgotBtnView:
    {
        flexDirection: 'row',
        justifyContent:'center',
        marginVertical:15,
        
    },
    TextInput:
    {
        color:'#00EFC2',
        marginTop: 10,
        marginRight: 30,
        marginLeft: 30,
        marginBottom: 10,
        padding: 8,
        height:40,
        borderWidth: 1,
        borderColor:'#00EFC2',
        borderRadius: 5
        
    },
    ModalRootView:
    {
        width: '100%', 
        backgroundColor:'#fff', 
        alignSelf:'center',
        justifyContent:'center',
        paddingTop:10, 
        borderRadius:5, 
     },
     SuccessImageView:
     {
        width:100, 
        height:100, 
        alignSelf:'center'
     },
     SuccessTextView:
     {
        alignSelf:'center',
        margin:10
     },
    ButtonView:
    {
      flexDirection:'row',
      justifyContent:'center',
      width:'100%'
    },
    SecondLayerButtonView:
    {
        height:20, 
        fontSize:13, 
        textAlignVertical:'center'
    }
});
  