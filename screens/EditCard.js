import React from 'react';
import { StyleSheet, View, TextInput, SafeAreaView, StatusBar,
    AsyncStorage, ScrollView, Dimensions, KeyboardAvoidingView,
    ActivityIndicator, Linking, Share,Platform } from 'react-native';
import { Text, Avatar ,Button } from 'react-native-elements';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import LottieView from 'lottie-react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

import Connection from '../Connection';


var screenWidth = Math.round(Dimensions.get('window').width);
var screenHeight = Math.round(Dimensions.get('window').height);


export default class EditCard extends React.PureComponent
{

    constructor(props)
    {
        super(props);
        Obj = new Connection();

        const { navigation } = this.props;

        this.state = {
            apiStr: Obj.getAPI(),
            showLoading:true,
            showView:false,
            successModal:false,
            loadingModal:false,
            emptyFieldModal:false,
            StylingTable:'',
            UserName:'',
            CompanyInfoID:'',
            DigitalNameCardPeopleID: navigation.getParam('editCardItem','NO-ID').DigitalNameCardPeopleID,
            BusinessType: navigation.getParam('editCardItem','NO-ID').BusinessType,
            Name: navigation.getParam('editCardItem','NO-ID').Name,
            Gender: this.getGenderFromParam(navigation.getParam('editCardItem','NO-ID').Gender),
            PhoneNum: navigation.getParam('editCardItem','NO-ID').Tel,
            WhatsappNum: navigation.getParam('editCardItem','NO-ID').WhatsappNo,
            CompanyName: navigation.getParam('editCardItem','NO-ID').CompanyName,
            EmailAddress: navigation.getParam('editCardItem','NO-ID').Email,
            WebSite: navigation.getParam('editCardItem','NO-ID').WebSite,
            FromEvent: navigation.getParam('editCardItem','NO-ID').FromEvent,
            Tags: navigation.getParam('editCardItem','NO-ID').Tags,
            Description: navigation.getParam('editCardItem','NO-ID').Description,
        }

        this.initialState = this.state;

        this.getAsyncStorage();
    }

    static navigationOptions = ({navigation}) => ({
        header:null
    })

    getAsyncStorage = async() =>
    {
        let StylingTableASYNC = await AsyncStorage.getItem('StylingTable')
        .then(data => {return JSON.parse(data)});

        let UserNameASYNC = await AsyncStorage.getItem('UserName');
        let CompanyInfoIDASYNC = await AsyncStorage.getItem('CompanyInfoID');

        this.setState({
            StylingTable: StylingTableASYNC,
            UserName: UserNameASYNC,
            CompanyInfoID: CompanyInfoIDASYNC ,
            showLoading:false,
            showView:true
        })
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

    updateCard = () =>
    {
        var cardBody = {
            DigitalNameCardPeopleID: this.state.DigitalNameCardPeopleID,
            Name: this.state.Name,
            Tel: this.state.PhoneNum,
            WhatsappNo: this.state.WhatsappNum,
            CompanyName: this.state.CompanyName,
            Email: this.state.EmailAddress,
            WebSite: this.state.WebSite,
            FromEvent: this.state.FromEvent,
            Description: this.state.Description,
            Gender: this.getGender(),
            BusinessType: this.state.BusinessType,
            Tags: "#"+this.tagReformatting(this.state.Tags),
            ModifiedBy: this.state.UserName,
            CompanyInfoID: this.state.CompanyInfoID,
        };

        if( this.state.BusinessType != '' || this.state.Name != '' || this.state.PhoneNum != '', this.state.Tags != '')
        {
            this.setState({
                loadingModal:true
            });

            // https://digitalprofile.app/api/dp/EditCards?model=model&UserName=kaharng&CompanyInfoID=1
            return fetch(this.state.apiStr+'/api/dp/EditCards?model=[model]&UserName='+this.state.UserName+'&CompanyInfoID='+this.state.CompanyInfoID, {
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
        else
        {
            this.setState({
                emptyFieldModal:true
            })
        }
    }

    getGenderFromParam = (param) =>
    {
        if(param === "M")
        {
            return 0;
        }
        else if(param === "F")
        {
            return 1;
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

    doneSubmitting = () =>
    {
        this.setState(this.initialState);
        
        this.getAsyncStorage().then(() =>
        {
            this.props.navigation.pop()
        })
    }

    tagReformatting = (text) =>
    {
        var replaceText = text.toString();
        return replaceText.replace(/\s/g," #");
    }

    render()
    {
        return(
            <View style={[styles.RootView,{borderTopColor:this.state.StylingTable.MainTitleColorCode}]}>
                {
                    this.state.showView && 
                    <KeyboardAvoidingView behavior='height' enabled >
                        <ScrollView style={{backgroundColor:'#fff'}} overScrollMode={'never'} bounces={false} bouncesZoom={false} >
                            <SafeAreaView style={[{backgroundColor:this.state.StylingTable.MainTitleColorCode,flexDirection:'row',justifyContent:'space-between', paddingBottom:10},styles.elevationShadow5]}>
                                <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                                    <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'}/>
                                    <MaterialIcon name='arrow-back' color={'#fff'} size={25} style={{marginHorizontal:10, marginTop:5}} onPress={() => this.props.navigation.pop()}/>
                                    <Text h4 h4Style={{color:'#fff', fontSize:18, paddingHorizontal:5,paddingTop:5}}>Edit Card</Text>
                                </View>
                            </SafeAreaView>

                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>Business Type (*):</Text>
                                <TextInput placeholder="Enter Business Type" value={this.state.BusinessType} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({BusinessType: text})}/>
                            </View>
                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>Name (*):</Text>
                                <TextInput placeholder="Enter Name" value={this.state.Name} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({ Name: text})}/>
                            </View>
                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>Gender:</Text>
                                <SegmentedControlTab 
                                tabsContainerStyle={{width:150, height:25, marginLeft:30, marginTop:15, marginBottom: 10}}
                                borderRadius={20}
                                tabStyle={{borderColor:this.state.StylingTable.MainTitleColorCode}}
                                tabTextStyle={{color:this.state.StylingTable.MainTitleColorCode}}
                                activeTabStyle={{backgroundColor:this.state.StylingTable.MainTitleColorCode}}
                                values={["Male","Female"]}
                                selectedIndex={this.state.Gender}
                                onTabPress={(index) => {this.setState({Gender:index})}}/>
                            </View>
                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>Tel (*):</Text>
                                <TextInput placeholder="Enter Phone Number" value={this.state.PhoneNum} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'number-pad'} onChangeText={(text) => this.setState({PhoneNum: text, WhatsappNum: text})}/>
                            </View>
                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>Whatsapp No:</Text>
                                <TextInput placeholder="Enter WhatsApp Number" value={this.state.WhatsappNum} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'number-pad'} onChangeText={(text) => this.setState({WhatsappNum: text})}/>
                            </View>
                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>Company:</Text>
                                <TextInput placeholder="Enter Company Name" value={this.state.CompanyName} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'}  onChangeText={(text) => this.setState({CompanyName: text})}/>
                            </View>
                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>Email Address:</Text>
                                <TextInput placeholder="Enter Email Address" value={this.state.EmailAddress} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'}  onChangeText={(text) => this.setState({ EmailAddress: text})}/>
                            </View>
                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>Website:</Text>
                                <TextInput placeholder="Enter Company Website" value={this.state.WebSite} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'}  onChangeText={(text) => this.setState({Website:text})}/>
                            </View>
                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>From Event:</Text>
                                <TextInput placeholder="From Which Event" value={this.state.FromEvent} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'}  onChangeText={(text) => this.setState({FromEvent:text})}/>
                            </View>
                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>Tags (*):</Text>
                                <TextInput placeholder="#people #food #music" value={this.state.Tags} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'}  onChangeText={(text) => this.setState({Tags: text})}/>
                            </View>
                            <View style={{justifyContent:'center', flexDirection:'column'}}>
                                <Text style={styles.TextView}>Description:</Text>
                                <TextInput placeholder="Enter Description" value={this.state.Description} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode, height:100}]} placeholderTextColor={'#868686'} keyboardType={'default'} multiline={true}
                                textAlignVertical={'top'} onChangeText={(text) => this.setState({Description: text})}/>
                            </View>
                            <View style={styles.SubmitBtnView}> 
                                <Button 
                                loading={this.state.isLoading} 
                                loadingStyle={{width:20,height:20}} 
                                loadingProps={{color:this.state.StylingTable.MainTitleColorCode}} 
                                type="solid" 
                                titleStyle={{color:'#fff', fontSize:15}} 
                                title="Update" 
                                disabled={this.state.submitBtnDisabled} 
                                buttonStyle={{backgroundColor:this.state.StylingTable.MainTitleColorCode}} onPress={() =>{ this.updateCard(); }} /> 
                            </View>
                            
                            <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.loadingModal}>
                                <View style={styles.ModalView}>    
                                    <Text h4 h4Style={{alignSelf:'center', margin:10}}>One moment</Text>
                                    <LottieView style={[styles.LottieAnimationView,{marginBottom:25}]} source={require('../assets/loading.json')} autoPlay/>
                                    <Text style={{alignSelf:'center', color:'#5B5B5B', margin:15}}>Updating card...</Text>
                                </View>
                            </Modal>

                            <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.successModal}>
                                <View style={styles.ModalView}>    
                                    <Text h4 h4Style={{alignSelf:'center', margin:10}}>Sucessful!</Text>
                                    <LottieView style={styles.LottieAnimationView} source={require('../assets/success.json')} autoPlay loop={false}/>
                                    <Text style={{alignSelf:'center', color:'#5B5B5B', margin:15}}>Card has successfully updated!</Text>
                                    <View style={{borderTopWidth:1, borderTopColor:'#DFDFDF'}}>
                                        <Button type='clear' title={"Done"} titleStyle={{color:this.state.StylingTable.MainTitleColorCode}} onPress={() => {this.doneSubmitting()}}/>
                                    </View>
                                </View>
                            </Modal>

                            <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.emptyFieldModal}>
                                <View style={styles.ModalView}>    
                                    <Text h4 h4Style={{alignSelf:'center',fontWeight:'bold', margin:10}}>Empty Field(s)</Text>
                                    <MaterialIcon name='error-outline' color={'#FF9494'}  size={50} style={{alignSelf:'center', marginTop:10}}/>    
                                    <Text style={{alignSelf:'center', color:'#5B5B5B', margin:15}}>Please fill up the required field(s) with  *</Text>
                                    <View style={{borderTopWidth:1, borderTopColor:'#DFDFDF'}}>
                                        <Button type='clear' title={"Done"} titleStyle={{color:this.state.StylingTable.MainTitleColorCode}} onPress={() => {this.setState({emptyFieldModal:false})}}/>
                                    </View>
                                </View>
                            </Modal>
                            
                        </ScrollView>
                    </KeyboardAvoidingView> 
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
RootView: 
{
    position:'absolute',
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
TextInputView:
{
    marginTop: 15,
    marginRight: 30,
    marginLeft: 30,
    marginBottom: 10,
    padding: 8,
    height:40,
    borderWidth: 1,
    borderRadius: 5
    
},
SubmitBtnView:
{
    justifyContent:'center',
    marginTop:15,
    marginBottom:80,
    marginHorizontal:30,
},
ModalView:
{
    width: '100%',
    backgroundColor:'#fff',
    alignSelf:'center',
    borderRadius:5,
},
ModalTextView:
{
    alignSelf:'center',
    margin:10
},
LottieAnimationView:
{
    width:80, 
    height:80, 
    alignSelf:'center', 
    margin:10
},

});