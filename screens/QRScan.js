import React from 'react';
import { StyleSheet, View, Image, AsyncStorage,
    ImageBackground, ScrollView, Dimensions, TouchableHighlight,
    ActivityIndicator, Linking, Share,Platform } from 'react-native';
import { Text,Avatar, Button } from 'react-native-elements';
import { NavigationActions, StackActions  } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Modal from 'react-native-modal';

import Connection from '../Connection';
import Header from './Header';


var screenWidth = Math.round(Dimensions.get('window').width);
var screenHeight = Math.round(Dimensions.get('window').height);


export default class QRScan extends React.PureComponent
{
    constructor(props)
    {
        super(props);
        Obj = new Connection();

        this.state = {
            hasCameraPermission: null,
            scanned:false,
            PermissionModal: false,
            DPCode:'',
            apiStr: Obj.getAPI(), 
        }

        this.initialState = this.state;
    }

    componentDidMount()
    {
        this.getPermissionsAsync();

        const { navigation } = this.props;

        this.focusListener = navigation.addListener('didFocus',() =>{
            this.setState({
                scanned:false
            })
        })
        
    }

    getPermissionsAsync = async () => 
    {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);

        this.setState({ 
            hasCameraPermission: status === 'granted' 
        });

        if( status != 'granted' )
        {
            this.setState({
                PermissionModal: true,
            })
        }
    };

    getDigitalProfileCode = (data) =>
    {
        return fetch(data)
        .then((response) => response.json())
        .then((responseJson) => {return responseJson;})
        .then(data =>
        {
            this.setState({
                DPCode: data
            })
        })
        .catch((error) => {
          console.error(error);
        });
    }

    addDigitalProfile = async () =>
    {
        // http://localhost:53511/api/dp/AddDigitalProfile?CurrentUserEmail=kaharng.chin@cr8consultancy.com&ProfileCode=DP01

        let EmailASYNC = await AsyncStorage.getItem('Email');

        return fetch(this.state.apiStr+"/api/dp/AddDigitalProfile?CurrentUserEmail="+EmailASYNC+"&ProfileCode="+this.state.DPCode)
        .then((response) => response.json())
        .then((responseJson) => {return responseJson;})
        .then(data =>
        {
            this.props.navigation.navigate('DigitalBook')
        })
        .catch((error) => {
          console.error(error);
        });
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.setState({ scanned: true });

        this.getDigitalProfileCode(data)
        .then(() =>
        {
            this.addDigitalProfile();
        })

    };   

    permissioDenied = () =>
    {
        this.setState({
            PermissionModal:false
        })

        this.props.navigation
            .dispatch(StackActions.reset({
                index: 0,
                actions: [
                NavigationActions.navigate({
                    routeName: 'BottomNavigationStack'
                }),
                ],
                }))
    }


    render()
    {
        return(
            <View style={styles.RootView}>
                { this.state.hasCameraPermission &&
                    <BarCodeScanner
                        onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
                        style={[{width:screenWidth,height:screenHeight}]}>
                            <View style={{width:screenWidth, height:130, backgroundColor:'rgba(0,0,0,0.5)',alignSelf:'center'}}>
                                <Text style={{alignSelf:'center',textAlign:'center', marginTop:40, marginHorizontal:40, color:'#fff', fontSize:15}}>Open Digital Profile QR Code to Scan</Text>
                                <Ionicons name='ios-qr-scanner' color={'#fff'}  size={50} style={{alignSelf:'center', margin:10}}/>               
                            </View>
                            <Button type='clear' title={'Tap Here to Scan Again'} titleStyle={{color:'#fff', margin:20}} 
                            onPress={() => this.setState({ scanned: false })} 
                            containerStyle={{width:screenWidth,paddingBottom:80,backgroundColor:'rgba(0,0,0,0.5)', marginHorizontal:30, position:'absolute', bottom:0, alignSelf:'center'}}/>
                            {/* <View style={{width:screenWidth, justifyContent:'center'}}>
                                <Ionicons name='ios-qr-scanner' color={'#fff'}  size={200} style={{alignSelf:'center',marginTop:100}}/>               
                            </View> */}
                    </BarCodeScanner>
                }
                <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.PermissionModal}>
                    <View style={styles.ModalView}>    
                        <Text h4 h4Style={{alignSelf:'center',fontWeight:'bold'}}>Permission Denied</Text>
                        <MaterialIcon name='error-outline' color={'#FF9494'}  size={50} style={{alignSelf:'center', marginTop:10}}/>               
                        <Text style={{alignSelf:'center',textAlign:'center', margin:10, color:'#5B5B5B', fontSize:15}}>Please allow Camera permission to use this feature</Text>
                        <Button type='clear' containerStyle={{marginTop:10}} title={"Close"}  onPress={() => this.permissioDenied()}/>
                    </View>
                </Modal>
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
imageLogoView:
{
    width: 150, 
    height: 150, 
    alignSelf:'center'
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

});
