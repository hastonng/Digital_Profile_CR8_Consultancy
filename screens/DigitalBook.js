import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar,RefreshControl,
     Dimensions, AsyncStorage, Platform, FlatList, Linking, ScrollView } from 'react-native';
import { ListItem, Text,Avatar, Button } from 'react-native-elements';
import { NavigationActions, StackActions  } from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import Menu, {MenuItem, MenuDivider } from 'react-native-material-menu';
import LottieView from 'lottie-react-native';

import Connection from '../Connection';


var screenWidth = Math.round(Dimensions.get('window').width);
var screenHeight = Math.round(Dimensions.get('window').height);

export default class DigitalBook extends React.PureComponent
{

    constructor(props)
    {
        super(props);
        Obj = new Connection();

        this.state = {
            showLoading:true,
            showView:false,
            StylingTable:'',
            dataFavoriteDP:[],
            EmployeeID:'',
            Email:'',
            UserName:'',
            DomainName:'',
            apiStr: Obj.getAPI(),
        }

        this.initialState = this.state;        
    }

    componentDidMount()
    {
        const { navigation } = this.props;

        this.focusListener = navigation.addListener('didFocus',() =>{
            this.refreshList();
        })
    }


    getAsyncStorage = async () =>
    {
        let StylingTableASYNC = await AsyncStorage.getItem('StylingTable')
        .then(data => {return JSON.parse(data)});

        let EmployeeIDASYNC = await AsyncStorage.getItem('EmployeeID');
        let emailASYNC = await AsyncStorage.getItem('Email');
        let UserNameASYNC = await AsyncStorage.getItem('UserName');
        let DomainNameASYNC = await AsyncStorage.getItem('DomainName');
        

        this.setState({
            EmployeeID: EmployeeIDASYNC,
            Email: emailASYNC,
            UserName: UserNameASYNC,
            DomainName: DomainNameASYNC,
            StylingTable: StylingTableASYNC
        })
    }

    getFavoriteDP = () =>
    {
        // https://digitalprofile.app/api/dp/GetFavouriteDP?UserEmail=kaharng.chin@cr8consultancy.com
        return fetch(this.state.apiStr+'/api/dp/GetFavouriteDP?UserEmail='+this.state.Email)
        .then((response) => response.json())
        .then((responseJson) => {return responseJson;})
        .then(data => 
        {
            this.setState({
                dataFavoriteDP: data,
                showView:true,
                showLoading:false,
            }) 
        })
        .catch((error) => {
          console.error(error);
        });
    }

    deleteFavorite = (item) =>
    {
        // https://digitalprofile.app/api/dp/DeleteFavoriteDP?DigitalNameCardFavouriteID=100
        return fetch(this.state.apiStr+'/api/dp/DeleteFavoriteDP?DigitalNameCardFavouriteID='+item.item.DigitalNameCardFavouriteID, {
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
                this.refreshList();
            })
            .catch((error) => 
            {
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

    OtherProfilePage = (item) =>
    {
        this.props.navigation.navigate('OtherProfilePageStack',{
            otherProfileUserName: item.item.UserName,
            otherProfileCompanyInfoID: item.item.CompanyInfoID,
            otherProfileLanguage: item.item.Language
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

    refreshList = () =>
    {
        this.setState(this.initialState);

        this.getAsyncStorage()
        .then(() =>
        {
            this.getFavoriteDP();
        });
    }

    render()
    {
        return(
            <View style={[styles.RootView,{borderTopColor:this.state.StylingTable.MainTitleColorCode}]}>
                {
                    this.state.showLoading &&
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <ShimmerPlaceHolder autoRun={true} style={styles.LoadingRoundPattern1}/>
                            <View style={{flexDirection:'column'}}>
                                <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern4}/>
                                <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern5}/>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <ShimmerPlaceHolder autoRun={true} style={styles.LoadingRoundPattern1}/>
                            <View style={{flexDirection:'column'}}>
                                <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern4}/>
                                <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern5}/>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <ShimmerPlaceHolder autoRun={true} style={styles.LoadingRoundPattern1}/>
                            <View style={{flexDirection:'column'}}>
                                <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern4}/>
                                <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern5}/>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <ShimmerPlaceHolder autoRun={true} style={styles.LoadingRoundPattern1}/>
                            <View style={{flexDirection:'column'}}>
                                <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern4}/>
                                <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern5}/>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <ShimmerPlaceHolder autoRun={true} style={styles.LoadingRoundPattern1}/>
                            <View style={{flexDirection:'column'}}>
                                <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern4}/>
                                <ShimmerPlaceHolder autoRun={true} style={styles.LoadingPattern5}/>
                            </View>
                        </View>
                    </View>
                        
                }
                { this.state.showView && 
                    <ScrollView overScrollMode={'never'} bounces={false} bouncesZoom={false}>
                        <SafeAreaView style={[{backgroundColor:this.state.StylingTable.MainTitleColorCode,flexDirection:'row',justifyContent:'space-between', paddingBottom:10},styles.elevationShadow5]}>
                            <View style={{flexDirection:'row',justifyContent:'flex-start', marginBottom: Platform.OS === 'ios' ? 10:0}}>
                                <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'}/>
                                <Avatar rounded source={require('../assets/logo.png')} size='small' imageProps={{resizeMode:'contain'}} overlayContainerStyle={{backgroundColor:this.state.StylingTable.MainTitleColorCode,}} containerStyle={{marginLeft:10}}/>
                                <Text h4 h4Style={{color:'#fff', fontSize:18, paddingHorizontal:5,paddingTop:5}}>Favorite</Text>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'flex-end', paddingRight:20}}>
                                <Avatar rounded source={require('../assets/cr8consultancy.png')} size='small' imageProps={{resizeMode:'contain'}} overlayContainerStyle={{backgroundColor:this.state.StylingTable.MainTitleColorCode}} 
                                onPress={() =>{this.launchCompanyProfile()}}/>
                                {/* <Icon name='options-vertical' color={'#fff'} size={20} style={{marginHorizontal:10, marginBottom:15, marginTop:5}} onPress={() => DigitalBookMenuRef.show()}/>
                                <Menu ref={(ref) => DigitalBookMenuRef = ref} button={<Text onPress={() => DigitalBookMenuRef.show()}></Text>}>
                                    <MenuItem onPress={() => {DigitalBookMenuRef.hide(); setTimeout(()=>{this.logout();},300); }}><Icon name='logout' color={'#868686'} size={17} style={{bottom:2}}/>   Logout</MenuItem>
                                </Menu> */}
                            </View>
                        </SafeAreaView>

                    { this.renderFlatList() }
                    </ScrollView>
                }
            </View>
        )
    }

    renderFlatList = () =>
    {
        if(this.state.dataFavoriteDP.length != 0)
        {
            return(
                <FlatList keyExtractor={(item,index) => {item.id = index.toString()}}
                    refreshControl={<RefreshControl tintColor={this.state.StylingTable.MainTitleColorCode} 
                    onRefresh={() => this.refreshList()}/>}
                    data={this.state.dataFavoriteDP}
                    style={{height:'100%'}}
                    renderItem={(item, index)=>
                    {
                        return(
                            <View style={{flex:1}}>
                                <ListItem
                                key={index}
                                leftAvatar={<Avatar rounded source={{uri:this.state.apiStr+"/Avatars/"+item.item.UserName+".png"}} size='medium' imageProps={{resizeMode:'contain'}} />}
                                style={{top:0,bottom:0,}}
                                title={item.item.DisplayName}
                                subtitle={item.item.CompanyName}
                                onLongPress={()=>{index.show()}}
                                onPress={()=>{this.OtherProfilePage(item)}}
                                chevron   
                                bottomDivider/>

                                <View style={{alignSelf:'flex-end'}}>
                                    <Menu ref={(ref) => index = ref} button={<View/>}>
                                        <MenuItem onPress={() => {index.hide(); setTimeout(()=>{this.deleteFavorite(item);},300);  }}>Delete</MenuItem>
                                    </Menu>
                                </View>
                                
                            </View>
                        )
                    }}
                />
            )
        }
        else
        {
            return(
                <View style={{justifyContent:'center'}}>
                    <LottieView style={styles.EmptyBoxLottieView} source={require('../assets/empty.json')} autoPlay loop/>
                    <Text style={styles.EmptyBoxTextView}>No Favorite</Text>
                </View>
            )
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
        backgroundColor: '#fff',
        width:'100%',
        height:'100%',
        flex:1,
        borderTopWidth:30,
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
        marginTop:40, 
        marginLeft:20, 
        marginRight:20, 
        borderRadius:5
    },
    LoadingPattern5:
    {
        width:200,
        marginTop:20, 
        marginLeft:20, 
        marginRight:20, 
        borderRadius:5
    },
    LoadingRoundPattern1:
    {
        width:80, 
        height:80, 
        marginTop:30, 
        marginLeft:20, 
        borderRadius:70
    },
    EmptyBoxLottieView:
    {
        width:200, 
        height:200, 
        alignSelf:'center', 
        margin:20
    },
    EmptyBoxTextView:
    {
        alignSelf:'center', 
        fontSize:20, 
        color:'#5B5B5B', 
        margin:10 
    },
    elevationShadow10: elevationShadowStyle(10),
    elevationShadow5: elevationShadowStyle(5),
    });