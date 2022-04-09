import React from 'react';
import { StyleSheet, TextInput, StatusBar, View, Dimensions, Linking, Platform, SafeAreaView,
 KeyboardAvoidingView, ScrollView, AsyncStorage } from 'react-native';
import { Picker } from 'native-base';
import { Text, Avatar, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions, StackActions  } from 'react-navigation';
import { FloatingAction } from 'react-native-floating-action';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

import Connection from '../Connection';

var screenWidth = Math.round(Dimensions.get('window').width);
var screenHeight = Math.round(Dimensions.get('window').height);


export default class EditProfile extends React.PureComponent
{

    constructor(props)
    {
        super(props);
        Obj = new Connection();

        const { navigation } = this.props;

        this.state = {
            digitalProfileData:'',
            StylingTable:'',
            UserName:'',
            CompanyInfoID:'',
            DomainName:'',
            EmployeeID:'',
            EmployeeNo:'',
            FirstName:'',
            LastName:'',
            DisplayName:'',
            ChineseName:'',
            IdentificationC:'',
            DOB:'',
            Email:'',
            PhoneNo:'',
            RefTeamID: navigation.getParam('RefTeamID','NO-ID'),
            RefPositionID: navigation.getParam('RefPositionID','NO-ID'),
            WhatsAppNo:'',
            Add1:'',
            Add2:'',
            Add3:'',
            Postcode:'',
            State:'',
            Country:'',
            Team:'',
            Position:'',
            JobTitle:'',
            JoinedDate:'',
            LinkedInURL:'',
            PersonalURL:'',
            IsCompanyAdmin: navigation.getParam('IsCompanyAdmin','NO-ID'),
            uploaded_photo:null,
            apiStr: Obj.getAPI(),
            imageURI:'',
            successModal:false,
        }

        this.initialState = this.state;
        
        this.getAsyncStorage();
    }

    static navigationOptions = () => ({
        header:null
    })

    componentDidMount()
    {
        this.getPermissionAsync();
    }

    getAsyncStorage = async() =>
    {
        let StylingTableASYNC = await AsyncStorage.getItem('StylingTable')
        .then(data => {return JSON.parse(data)});

        let digitalProfileDataASYNC = await AsyncStorage.getItem('digitalProfileData')
        .then(data => {return JSON.parse(data)});

        let UserNameASYNC = await AsyncStorage.getItem('UserName');
        let CompanyInfoIDASYNC = await AsyncStorage.getItem('CompanyInfoID');
        let DomainNameASYNC = await AsyncStorage.getItem('DomainName');
        let EmployeeIDASYNC = await AsyncStorage.getItem('EmployeeID');

        let imageStr = this.state.apiStr+"/Avatars/"+UserNameASYNC+".png";
        imageStr += '?random_number='+new Date().getTime();
        
        this.setState({
            digitalProfileData: digitalProfileDataASYNC,
            StylingTable: StylingTableASYNC,
            UserName: UserNameASYNC,
            CompanyInfoID: CompanyInfoIDASYNC,
            DomainName: DomainNameASYNC,
            EmployeeID: EmployeeIDASYNC,
            EmployeeNo: digitalProfileDataASYNC.Employee.EmployeeNo,
            FirstName: digitalProfileDataASYNC.Employee.FirstName,
            LastName: digitalProfileDataASYNC.Employee.LastName,
            DisplayName: digitalProfileDataASYNC.Employee.DisplayName,
            ChineseName: digitalProfileDataASYNC.Employee.ChineseName,
            IdentificationC: digitalProfileDataASYNC.Employee.IC,
            DOB: digitalProfileDataASYNC.Employee.DOB,
            Email: digitalProfileDataASYNC.Employee.EmailAddress,
            PhoneNo: digitalProfileDataASYNC.Employee.PhoneNo,
            WhatsAppNo: digitalProfileDataASYNC.Employee.WhatsAppPhoneNumber,
            Add1: digitalProfileDataASYNC.Employee.AddressLine1,
            Add2: digitalProfileDataASYNC.Employee.AddressLine2,
            Add3: digitalProfileDataASYNC.Employee.AddressLine3,
            Postcode: digitalProfileDataASYNC.Employee.PostCode,
            State: digitalProfileDataASYNC.Employee.State,
            Country: digitalProfileDataASYNC.Employee.Country,
            Team: digitalProfileDataASYNC.Employee.Team,
            Position: digitalProfileDataASYNC.Employee.Position,
            JobTitle: digitalProfileDataASYNC.Employee.JobTitle,
            JoinedDate: digitalProfileDataASYNC.Employee.JoinDate,
            LinkedInURL: digitalProfileDataASYNC.Employee.LinkedInURL,
            PersonalURL: digitalProfileDataASYNC.Employee.WebsiteURL,
            imageURI:imageStr
        })
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
    }

    _pickImage = async () => {

        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { onStartUpload } = this.props;
        //if status not granted it will guide to grant permission from settings
        if (status !== 'granted') {
            if (Platform.OS === 'ios') this.showAlert();
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [20, 20],
          quality: 1
        });
    
        // console.log(result);
    
        if (!result.cancelled) 
        {
            this.setState({ imageURI: result.uri });
            setTimeout(()=>{
                this.updateProfilePicture();
            },1000);
        }
    }


    showAlert() 
    {
        Alert.alert(
            'Please Allow Access',
            [
                'This applicaton needs access to your photo library to upload images.',
                '\n\n',
                'Please go to Settings of your device and grant permissions to Photos.',
            ].join(''),
            [
                { text: 'Not Now', style: 'cancel' },
                { text: 'Settings', onPress: () => Linking.openURL('app-settings:') },
            ],
        );
    }

    updateProfilePicture = async() =>
    {
        // https://digitalprofile.app/api/dp/UploadProfilePicture?userName=aaa&file1

        // ImagePicker saves the taken photo to disk and returns a local URI to it
        // let localUri = result.uri;
        let filename = this.state.imageURI.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
        // Assume "photo" is the name of the form field the server expects
        formData.append('file1', { uri: this.state.imageURI, name: filename, type });

        return await fetch('https://digitalprofile.app/api/dp/UploadProfilePicture?userName='+this.state.UserName+'&file1', {
            method: 'POST',
            body: formData,
            header: {
                'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            }
        }).then((response) => 
        {
            return response;
        }).then((data) =>
        {
            console.log(JSON.stringify(data.json()))
        })
        .catch((error) => 
        {
            console.error(error);
        });
    }

    async updateProfile() 
    {
        this.setState({
            successModal:true
        })

        const url = 'http://digitalprofile.app/api/dp/UpdateProfile';
        const data = {
            CompanyInfoID: this.state.CompanyInfoID, 
            UserName: this.state.UserName, 
            ChineseName:this.state.ChineseName,
            DomainName: this.state.DomainName,
            EmployeeID: this.state.EmployeeID,
            EmployeeNo: this.state.EmployeeNo,
            FirstName: this.state.FirstName,
            LastName: this.state.LastName,
            DisplayName: this.state.DisplayName,
            IC: this.state.IdentificationC,
            DOB: this.state.DOB,
            EmailAddress: this.state.Email,
            WhatsAppPhoneNumber: this.state.WhatsAppNo,
            AddressLine1: this.state.Add1,
            AddressLine2: this.state.Add2,
            AddressLine3: this.state.Add3,
            PostCode: this.state.Postcode,
            State: this.state.State,
            Country: this.state.Country,
            PhoneNo: this.state.PhoneNo,
            RefTeamID: this.state.RefTeamID,
            RefPositionID: this.state.RefPositionID,
            JobTitle: this.state.JobTitle,
            JoinDate: this.state.JoinedDate,
            LinkedInURL: this.state.LinkedInURL,
            PersonalURL: this.state.PersonalURL,
            IsCompanyAdmin: this.state.IsCompanyAdmin 
        };
        
        try {
            const response = await fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
            'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        console.log('Success:', JSON.stringify(json));
        } catch (error) {
        console.error('Error:', error);
        }
    }

    doneSubmitting = () =>
    {
        this.setState(this.initialState);
        
        this.getAsyncStorage().then(() =>
        {
            this.props.navigation
            .dispatch(StackActions.reset({
                index: 0,
                actions: [
                NavigationActions.navigate({
                    routeName: 'BottomNavigationStack'
                }),
                ],
                }))
        })
    }

    render()
    {
        return(
            <View style={[styles.RootView,{borderTopColor:this.state.StylingTable.MainTitleColorCode}]}>
                <KeyboardAvoidingView behavior='position' enabled>
                <ScrollView style={{backgroundColor:'#fff'}} overScrollMode={'never'} bounces={false} bouncesZoom={false} >
                <SafeAreaView style={[{backgroundColor:this.state.StylingTable.MainTitleColorCode,flexDirection:'row',justifyContent:'space-between', paddingBottom:10},styles.elevationShadow5]}>
                    <View style={{flexDirection:'row',justifyContent:'flex-start', marginBottom: Platform.OS === 'ios' ? 10:0}}>
                        <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'}/>
                        <MaterialIcon name='arrow-back' color={'#fff'} size={25} style={{marginHorizontal:10, marginTop:5}} onPress={() => this.props.navigation.pop()}/>
                        <Text h4 h4Style={{color:'#fff', fontSize:18, paddingHorizontal:5,paddingTop:5}}>Edit Profile</Text>
                    </View>
                </SafeAreaView>

                <Avatar rounded showEditButton editButton={{size:30}} source={{uri:this.state.imageURI}} size='xlarge' 
                overlayContainerStyle={{backgroundColor:this.state.StylingTable.MainTitleColorCode}} 
                containerStyle={{marginLeft:10 ,alignSelf:'center', margin:20}}
                onPress={()=>{this._pickImage()}}/>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Username:" value={this.state.UserName} editable={false} style={[styles.TextInputView,{color:'#5B5B5B', borderColor:'#5B5B5B', backgroundColor:'#DFDFDF'}]} placeholderTextColor={'#868686'} keyboardType={'default'} />
                </View>
 
                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Employee No:" value={this.state.EmployeeNo} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'decimal-pad'} onChangeText={(text) => this.setState({EmployeeNo: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="First Name:" value={this.state.FirstName} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({FirstName: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Last Name:" value={this.state.LastName} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({LastName: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Display Name:" value={this.state.DisplayName} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({DisplayName: text})}/>
                </View>
                
                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Chinese Name:" value={this.state.ChineseName} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({ChineseName: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Identification Card:" value={this.state.IdentificationC} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({IdentificationC: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <DatePicker
                        style={{width: screenWidth - 80, alignSelf:'center',margin:20}}
                        date={this.state.DOB}
                        mode="date"
                        placeholder="Select Date of Birth"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(date) => {this.setState({DOB: date})}}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Email:" value={this.state.Email} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'email-address'} onChangeText={(text) => this.setState({Email: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Phone No:" value={this.state.PhoneNo} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'decimal-pad'} onChangeText={(text) => this.setState({PhoneNo: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="WhatsApp No:" value={this.state.WhatsAppNo} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'decimal-pad'} onChangeText={(text) => this.setState({WhatsAppNo: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Address Line 1:" value={this.state.Add1} spellCheck={true} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({Add1: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Address Line 2:" value={this.state.Add2} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({Add2: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Address Line 3:" value={this.state.Add3} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({Add3: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Postcode:" value={this.state.Postcode} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({Postcode: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column', marginVertical: 8 , marginHorizontal:30, borderWidth:1, borderRadius:5, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}}>
                    <Picker
                        selectedValue={this.state.State}
                        mode="dropdown"
                        itemStyle={{color:'#7B827A'}}
                        onValueChange={(value, index) => {this.setState({State: value})}}
                        style={{height: 40, width: screenWidth - 60, alignSelf:'center'}}>
            
                        <Picker.Item value={'Johor'} label={'Johor'} />
                        <Picker.Item value={'Kedah'} label={'Kedah'} />
                        <Picker.Item value={'Kelantan'} label={'Kelantan'} />
                        <Picker.Item value={'Melaka'} label={'Melaka'} />
                        <Picker.Item value={'Kuala Lumpur'} label={'Kuala Lumpur'} />
                        <Picker.Item value={'Negeri Sembilan'} label={'Negeri Sembilan'} />
                        <Picker.Item value={'Pahang'} label={'Pahang'} />
                        <Picker.Item value={'Perlis'} label={'Perlis'} />
                        <Picker.Item value={'Penang'} label={'Penang'} />
                        <Picker.Item value={'Selangor'} label={'Selangor'} />
                        <Picker.Item value={'Sabah'} label={'Sabah'} />
                        <Picker.Item value={'Sarawak'} label={'Sarawak'} />
                        <Picker.Item value={'Terengganu'} label={'Terengganu'} />
                    </Picker>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column', marginVertical: 8 , marginHorizontal:30, borderWidth:1, borderRadius:5, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}}>
                    <Picker
                        selectedValue={this.state.Country}
                        mode="dropdown"
                        itemStyle={{color:'#7B827A'}}
                        onValueChange={(value, index) => {this.setState({Country: value})}}
                        style={{height: 40, width: screenWidth - 60, alignSelf:'center'}}>
        
                        <Picker.Item value={'Malaysia'} label={'Malaysia'} />
                        
                    </Picker>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column', marginVertical: 8 , marginHorizontal:30, borderWidth:1, borderRadius:5, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}}>
                    <Picker
                        selectedValue={this.state.Team}
                        mode="dropdown"
                        itemStyle={{color:'#7B827A'}}
                        onValueChange={(value, index) => {this.setState({Team: value})}}
                        style={{height: 40, width: screenWidth - 60, alignSelf:'center'}}>
        
                        <Picker.Item value={'Admin'} label={'Admin'} />
                        <Picker.Item value={'Consultancy'} label={'Consultancy'} />
                        <Picker.Item value={'Customer Service'} label={'Customer Service'} />
                        <Picker.Item value={'Design'} label={'Design'} />
                        <Picker.Item value={'Distribution'} label={'Distribution'} />
                        <Picker.Item value={'Export'} label={'Export'} />
                        <Picker.Item value={'Financial'} label={'Financial'} />
                        <Picker.Item value={'Human Resources'} label={'Human Resources'} />
                        <Picker.Item value={'IT'} label={'IT'} />
                        <Picker.Item value={'Legal'} label={'Legal'} />
                        <Picker.Item value={'Logistic'} label={'Logistic'} />
                        <Picker.Item value={'Marketing'} label={'Marketing'} />
                        <Picker.Item value={'Network'} label={'Network'} />
                        <Picker.Item value={'Operations'} label={'Operations'} />
                        <Picker.Item value={'PR'} label={'PR'} />
                        <Picker.Item value={'Production'} label={'Production'} />
                        <Picker.Item value={'Purchasing'} label={'Purchasing'} />
                    </Picker>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column', marginVertical: 8 , marginHorizontal:30, borderWidth:1, borderRadius:5, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}}>
                    <Picker
                        selectedValue={this.state.Position}
                        mode="dropdown"
                        onValueChange={(value, index) => {this.setState({Position: value})}}
                        style={{height: 40, width: screenWidth - 60, alignSelf:'center'}}>
        
                        <Picker.Item value={'Admin'} label={'Admin'}/>
                        <Picker.Item value={'CEO'} label={'CEO'} />
                        <Picker.Item value={'CFO'} label={'CFO'} />
                        <Picker.Item value={'Chairman'} label={'Chairman'} />
                        <Picker.Item value={'COO'} label={'COO'} />
                        <Picker.Item value={'CTO'} label={'CTO'} />
                        <Picker.Item value={'Employee'} label={'Employee'} />
                        <Picker.Item value={'Founder'} label={'Founder'} />
                        <Picker.Item value={'Head'} label={'Head'} />
                        <Picker.Item value={'Manager'} label={'Manager'} />
                        <Picker.Item value={'President'} label={'President'} />
                        <Picker.Item value={'Receptionist'} label={'Receptionist'} />
                        <Picker.Item value={'Staff'} label={'Staff'} />
                        <Picker.Item value={'Vice President'} label={'Vice President'} />
                    </Picker>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Job Title:" value={this.state.JobTitle} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({JobTitle: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <DatePicker
                        style={{width: screenWidth - 80, alignSelf:'center',margin:20}}
                        date={this.state.JoinedDate}
                        mode="date"
                        placeholder="Select Joined Date:"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(date) => {this.setState({JoinedDate: date})}}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="LinkedIn URL:" value={this.state.LinkedInURL} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({LinkedInURL: text})}/>
                </View>

                <View style={{justifyContent:'center', flexDirection:'column'}}>
                    <TextInput placeholder="Personal Web URL:" value={this.state.PersonalURL} style={[styles.TextInputView,{color:this.state.StylingTable.ServicesIconBackgroundCode, borderColor:this.state.StylingTable.ServicesIconBackgroundCode}]} placeholderTextColor={'#868686'} keyboardType={'default'} onChangeText={(text) => this.setState({PersonalURL: text})}/>
                </View>
                </ScrollView>

                <FloatingAction visible={this.state.scrollToTopFAB} buttonSize={50} position={'right'} color={this.state.StylingTable.MainTitleColorCode}
                showBackground={false} onPressMain={() => {this.updateProfile()}}
                floatingIcon={<MaterialIcon name="done" size={25} color={'#fff'}/>}/>
                </KeyboardAvoidingView>

                <Modal backdropColor={'black'} animationIn={'slideInDown'} isVisible={this.state.successModal}>
                    <View style={styles.ModalView}>    
                        <Text h4 h4Style={{alignSelf:'center', margin:10}}>Sucessful!</Text>
                        <LottieView style={styles.LottieAnimationView} source={require('../assets/success.json')} autoPlay loop={false}/>
                        <Text style={{alignSelf:'center', color:'#5B5B5B', margin:15}}>Profile has successfully updated!</Text>
                        <View style={{borderTopWidth:1, borderTopColor:'#DFDFDF'}}>
                            <Button type='clear' title={"Done"} titleStyle={{color:this.state.StylingTable.MainTitleColorCode}} onPress={() => {this.doneSubmitting()}}/>
                        </View>
                    </View>
                </Modal>
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
    });
