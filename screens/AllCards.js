import React from 'react';
import { StyleSheet, View, FlatList, AsyncStorage, StatusBar, TouchableHighlight, Image, Platform,
    RefreshControl, ScrollView, Dimensions, SafeAreaView, Linking } from 'react-native';
import { Text, Avatar, ListItem, Button, SearchBar,  } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import Menu, {MenuItem, MenuDivider } from 'react-native-material-menu';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LottieView from 'lottie-react-native';

import Connection from '../Connection';

var screenWidth = Math.round(Dimensions.get('window').width);
var screenHeight = Math.round(Dimensions.get('window').height);


export default class AllCards extends React.PureComponent
{
    constructor(props)
    {
        super(props);
        Obj = new Connection();

        this.state = {
            showLoading:true,
            showView:false,
            cardModal:false,
            successModal:false,
            loadingModal:false,
            searchListResult:false,
            renderFlatlist: true,
            showSearchCancelBtn: false,
            searchBarWidth:'100%',
            searchText:'',
            allCardsData:'',
            StylingTable:'',
            UserName:'',
            CompanyInfoID:'',
            selectedItem:'',
            searchData:[],
            apiStr: Obj.getAPI(),
        }

        this.initialState = this.state;
    }

    componentDidMount()
    {
        const { navigation } = this.props;

        this.focusListener = navigation.addListener('didFocus',() => {
            this.refreshList();
        })
    }

    getAsyncStorage = async() =>
    {
        let StylingTableASYNC = await AsyncStorage.getItem('StylingTable')
        .then(data => {return JSON.parse(data)});


        let UserNameASYNC = await AsyncStorage.getItem('UserName');
        let CompanyInfoIDASYNC = await AsyncStorage.getItem('CompanyInfoID');

        this.setState({
            StylingTable: StylingTableASYNC,
            UserName: UserNameASYNC,
            CompanyInfoID: CompanyInfoIDASYNC 
        })
    }

    getAllCards = () =>
    {
        // https://digitalprofile.app/api/dp/GetAllCards?UserName=kaharng&CompanyInfoID=1
        return fetch(this.state.apiStr+'/api/dp/GetAllCards?UserName='+this.state.UserName+'&CompanyInfoID='+this.state.CompanyInfoID)
        .then((response) => response.json())
        .then((responseJson) => {return responseJson;})
        .then(data =>
        {
            this.setState({
                allCardsData: data,
                showView:true,
                showLoading:false
            })
        })
        .catch((error) => {
          console.error(error);
        });
    }

    deleteCard = (item) =>
    {
        this.setState({
            loadingModal:true
        })

        // https://digitalprofile.app/api/dp/DeleteCard?DigitalNameCardPeopleID=1&UserName=kaharng&CompanyInfoID=1

        return fetch(this.state.apiStr+'/api/dp/DeleteCard?DigitalNameCardPeopleID='+item.item.DigitalNameCardPeopleID+"&UserName="+this.state.UserName+"&CompanyInfoID="+this.state.CompanyInfoID, {
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

    refreshList = () =>
    {
        this.setState(this.initialState);

        this.getAsyncStorage()
        .then(() => 
        {
            this.getAllCards();
        })
    }

   searchItem = (text) =>
   {
        const newData = this.state.allCardsData.filter(item => 
        {      
            const itemData = `${item.Name.toUpperCase()} ${item.CompanyName.toUpperCase()} ${item.Tags.toUpperCase()} ${item.BusinessType.toUpperCase()}`;
            
            const textData = text.toUpperCase();
            
            return itemData.indexOf(textData) > -1;    
        });
        
        if(text === '')
        {
            let clear = [];
            this.setState({ 
                searchText: text,
                searchData: clear,
            });  
        }
        else
        {
            this.setState({ 
                searchText: text,
                searchData: newData,
            }); 
        }
   }

   animatication = () =>
   {
        if(this.state.searchData.length === 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    render()
    {
        return(
            <View style={[styles.RootView,{borderTopColor:this.state.StylingTable.MainTitleColorCode}]}>
                {this.state.showLoading &&
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
                    <ScrollView overScrollMode={'never'} bounces={false} bouncesZoom={false} >
                        <SafeAreaView style={[{backgroundColor:this.state.StylingTable.MainTitleColorCode,flexDirection:'row',justifyContent:'space-between', paddingBottom:10},styles.elevationShadow5]}>
                            <View style={{flexDirection:'row',justifyContent:'flex-start', marginBottom: Platform.OS === 'ios' ? 10:0}}>
                                <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'}/>
                                <Avatar rounded source={require('../assets/logo.png')} size='small' imageProps={{resizeMode:'contain'}} overlayContainerStyle={{backgroundColor:this.state.StylingTable.MainTitleColorCode,}} containerStyle={{marginLeft:10}}/>
                                <Text h4 h4Style={{color:'#fff', fontSize:18, paddingHorizontal:5,paddingTop:5}}>All Cards</Text>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'flex-end', paddingRight:20}}>
                                <Avatar rounded source={require('../assets/cr8consultancy.png')} size='small' imageProps={{resizeMode:'contain'}} overlayContainerStyle={{backgroundColor:this.state.StylingTable.MainTitleColorCode}} 
                                onPress={() =>{this.launchCompanyProfile()}}/>
                            </View>
                        </SafeAreaView>

                        <View style={{ flexDirection:'row', width:screenWidth}}>
                            {
                                this.state.showSearchCancelBtn && 
                                <Ionicons name='md-arrow-back' color={'#5b5b5b'} size={30} style={{marginVertical:10, marginLeft:10, marginRight:5}}
                                onPress={() => {this.setState({searchListResult: false, renderFlatlist:true, showSearchCancelBtn:false, searchBarWidth:'100%'})}}/>
                            }
                            <SearchBar placeholder="Search" lightTheme={true} round={true} 
                                containerStyle={{backgroundColor:'transparent', height:50, width:'100%', borderTopColor:'transparent'}} 
                                inputContainerStyle={{borderRadius:20, height:30, width: this.state.searchBarWidth }} 
                                onFocus={() => {this.setState({searchListResult: true, renderFlatlist:false, showSearchCancelBtn:true, searchBarWidth:'90%'})}}
                                value={this.state.searchText}
                                onCancel={() => {let clearArray = []; this.setState({searchData:clearArray})}}
                                onClear={() => {let clearArray = []; this.setState({searchData:clearArray})}}
                                onChangeText={(text) => {this.searchItem(text)}}/>
                        </View>
                        {
                            this.state.searchListResult && 
                            <View style={{width:screenWidth, height:screenHeight}}>
                                {
                                    this.animatication() && <View style={{justifyContent:'center'}}>
                                        <LottieView style={[styles.LottieAnimationView120]} source={require('../assets/search.json')} autoPlay loop={false}/>
                                        <Text style={styles.LottieAnimationTextView15}>Enter a few words to search in Digital Profile.</Text>
                                    </View>
                                }

                                <FlatList          
                                data={this.state.searchData}
                                keyExtractor={item => item.Email}  
                                ItemSeparatorComponent={this.renderSeparator} 
                                ListHeaderComponent={this.renderHeader}                                       
                                renderItem={({ item }) => {
                                    return(
                                        <ListItem              
                                            roundAvatar              
                                            title={`${item.Name}`}  
                                            subtitle={`${item.CompanyName}`}
                                            leftAvatar={<Ionicons name='ios-contact' color={'#868686'} size={30}/>}   
                                            containerStyle={{ borderBottomWidth: 0 }}
                                            bottomDivider={true} 
                                            onPress={() =>{this.setState({searchListResult: false, renderFlatlist: true, showSearchCancelBtn:false, searchBarWidth:'100%', cardModal:true, selectedItem:item})}}/>
                                    )
                                }}                                              
                                />
                            </View>
                        }
                         

                        {this.state.renderFlatlist && this.renderFlatList() }

                        <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.cardModal} 
                        onBackdropPress={() =>{this.setState({cardModal:false})}}
                        onBackButtonPress={() => {this.setState({cardModal:false})}}>
                            <View style={[styles.ModalView,{borderTopColor:this.state.StylingTable.MainTitleColorCode}]}>
                                <ScrollView overScrollMode={'never'}>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', paddingBottom:5, backgroundColor:this.state.StylingTable.MainTitleColorCode}}>
                                        <View style={{justifyContent:'flex-start', flexDirection:'row'}}>
                                            <Ionicons name='ios-contact' color={'#fff'} size={35} style={{marginLeft:10}}/>
                                            <Text h4 h4Style={{marginLeft:10, marginTop:5, fontSize:20, fontWeight:'bold', color:'#fff'}}>{this.state.selectedItem.Name}</Text>
                                        </View>
                                        <View style={{justifyContent:'flex-end'}}>
                                            <TouchableHighlight style={[styles.RoundButtons,{marginRight:10, marginBottom:5}]}
                                            underlayColor={this.state.StylingTable.SelectedTabColorCode}
                                            onPress={() =>{ this.setState({cardModal:false}); setTimeout(()=> {this.props.navigation.navigate('EditCard',{ editCardItem: this.state.selectedItem})},500); }}>
                                                <IconFeather name='edit-2' color={'#fff'} size={15} style={{alignSelf:'center'}}/>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row',margin:10}}>
                                        <IconFontAwesome name='tag' color={'#868686'} size={20} style={{marginLeft:5}}/>
                                        <Text style={{marginLeft:10, fontWeight:'bold'}}>{this.state.selectedItem.BusinessType}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',margin:10}}>
                                        <IconFontAwesome name='tag' color={'#868686'} size={20} style={{marginLeft:5}}/>
                                        <Text style={{marginLeft:10, fontWeight:'bold'}}>{this.state.selectedItem.Tags}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',margin:10}}>
                                        <MaterialCommunityIcon name='cellphone' color={'#868686'} size={20} style={{marginLeft:5}}/>
                                        <Text style={{marginLeft:10, fontWeight:'bold'}}>{this.state.selectedItem.Tel}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',margin:10}}>
                                        <MaterialCommunityIcon name='whatsapp' color={'#868686'} size={20} style={{marginLeft:5}}/>
                                        <Text style={{marginLeft:10, fontWeight:'bold'}}>{this.state.selectedItem.WhatsappNo}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',margin:10}}>
                                        <MaterialIcon name='business-center' color={'#868686'} size={20} style={{marginLeft:5}}/>
                                        <Text style={{marginLeft:10, fontWeight:'bold'}}>{this.state.selectedItem.CompanyName}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',margin:10}}>
                                        <MaterialCommunityIcon name='email-outline' color={'#868686'} size={20} style={{marginLeft:5}}/>
                                        <Text style={{marginLeft:10, fontWeight:'bold'}}>{this.state.selectedItem.Email}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',margin:10}}>
                                        <MaterialCommunityIcon name='web' color={'#868686'} size={20} style={{marginLeft:5}}/>
                                        <Text style={{marginLeft:10, fontWeight:'bold'}}>{this.state.selectedItem.WebSite}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',margin:10}}>
                                        <Ionicons name='ios-flag' color={'#868686'} size={20} style={{marginLeft:5}}/>
                                        <Text style={{marginLeft:10, fontWeight:'bold'}}>{this.state.selectedItem.FromEvent}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',margin:10}}>
                                        <MaterialIcon name='description' color={'#868686'} size={20} style={{marginLeft:5}}/>
                                        <Text style={{marginLeft:10, fontWeight:'bold'}}>{this.state.selectedItem.Description}</Text>
                                    </View>
                                    <View style={{borderTopWidth:1, borderTopColor:'#DFDFDF'}}>
                                        <Button type='clear' containerStyle={{ marginVertical:3}} title={"Close"} titleStyle={{color:this.state.StylingTable.MainTitleColorCode}} onPress={() => {this.setState({cardModal:false})}}/>
                                    </View>
                                </ScrollView>
                            </View>
                        </Modal>

                        <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.loadingModal}>
                            <View style={styles.ModalView2}>    
                                <Text h4 h4Style={{alignSelf:'center', margin:10}}>One moment</Text>
                                <LottieView style={[styles.LottieAnimationView,{marginBottom:25}]} source={require('../assets/loading.json')} autoPlay/>
                                <Text style={{alignSelf:'center', color:'#5B5B5B', margin:15}}>Deleting card...</Text>
                            </View>
                        </Modal>

                        <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.successModal}>
                            <View style={styles.ModalView2}>    
                                <Text h4 h4Style={{alignSelf:'center', margin:10}}>Sucessful!</Text>
                                <LottieView style={styles.LottieAnimationView} source={require('../assets/success.json')} autoPlay loop={false}/>
                                <Text style={{alignSelf:'center', color:'#5B5B5B', margin:15}}>Card has successfully deleted!</Text>
                                <View style={{borderTopWidth:1, borderTopColor:'#DFDFDF'}}>
                                    <Button type='clear' title={"Done"} titleStyle={{color:this.state.StylingTable.MainTitleColorCode}} onPress={() => {this.refreshList()}}/>
                                </View>
                            </View>
                        </Modal>
                    </ScrollView>
                } 
            </View>
        )
    }

    renderFlatList = () =>
    {
        if(this.state.allCardsData.length != 0)
        {
            return(
                <FlatList keyExtractor={(item,index) => {item.id = index.toString()}}
                    refreshControl={<RefreshControl tintColor={this.state.StylingTable.MainTitleColorCode} 
                    onRefresh={() => this.refreshList()}/>}
                    data={this.state.allCardsData}
                    style={{height:'100%'}}
                    renderItem={(item, index)=>
                    {
                        return(
                            <View style={{flex:1}}>
                                <ListItem
                                key={item.item.id}
                                leftAvatar={<Ionicons name='ios-contact' color={'#868686'} size={30}/>}
                                style={{top:0,bottom:0}}
                                title={item.item.Name}
                                subtitle={item.item.BusinessType}
                                onLongPress={()=>{index.show()}}
                                onPress={()=>{this.setState({selectedItem: item.item, cardModal:true})}}
                                chevron   
                                bottomDivider/>

                                <View style={{alignSelf:'flex-end'}}>
                                    <Menu ref={(ref) => {index = ref}} button={<View/>}>
                                        <MenuItem onPress={() => {index.hide(); setTimeout(()=> {this.props.navigation.navigate('EditCard',{ editCardItem: item.item})},300); }}>Edit</MenuItem>
                                        <MenuDivider/>
                                        <MenuItem onPress={() => {index.hide(); setTimeout(()=>{this.deleteCard(item);},300); }}>Delete</MenuItem>
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
                    <LottieView style={styles.LottieAnimationView200} source={require('../assets/empty.json')} autoPlay loop/>
                    <Text style={styles.LottieAnimationTextView}>No Cards</Text>
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
        position:'absolute',
        width:'100%',
        height:'100%',
        flex:1,
        borderTopWidth:30
    },
    ModalView:
    {
        width: '100%',
        height:'60%',
        backgroundColor:'#fff',
        alignSelf:'center',
        borderTopWidth:10,
        borderRadius:5,
    },
    ModalView2:
    {
        width: '100%',
        backgroundColor:'#fff',
        alignSelf:'center',
        borderRadius:5,
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
    LottieAnimationTextView:
    {
        alignSelf:'center',
        textAlign:'center', 
        fontSize:20, 
        color:'#5B5B5B', 
        margin:10 
    },
    LottieAnimationTextView15:
    {
        alignSelf:'center',
        textAlign:'center', 
        fontSize:15, 
        color:'#5B5B5B', 
        margin:15 
    },
    LottieAnimationView200:
    {
        width:200, 
        height:200, 
        alignSelf:'center', 
        margin:20
    },
    LottieAnimationView:
    {
        width:80, 
        height:80, 
        alignSelf:'center', 
        margin:10
    },
    LottieAnimationView120:
    {
        width:120, 
        height:120, 
        alignSelf:'center', 
        margin:30
    },
    RoundButtons:
    {
        borderRadius:24,
        borderWidth:1,
        borderColor:'#fff', 
        height:25,
        width:25,  
        justifyContent:'center',
    },
    elevationShadow10: elevationShadowStyle(10),
    elevationShadow5: elevationShadowStyle(5),
    });