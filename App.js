import React from 'react';
import { AsyncStorage } from 'react-native';

import AppNavigator from './AppNavigator';
import LoginPage from './screens/LoginPage';
import Connection from './Connection';

export default class App extends React.PureComponent {

  constructor(props)
  {
    super(props);
    Obj = new Connection();

    this.state={
      apiStr:Obj.getAPI(),
      UserName:'',
      CompanyInfoID:'',
      Language:'',

    }

    this.setup();
  }

  setup = async () =>
  {
    let UserNameASYNC = await AsyncStorage.getItem('UserName');
    let CompanyInfoIDASYNC = await AsyncStorage.getItem('CompanyInfoID');
    let LanguageASYNC = await AsyncStorage.getItem('Language');

    this.setState({
      UserName: UserNameASYNC,
      CompanyInfoID: CompanyInfoIDASYNC,
      Language: LanguageASYNC
    })

    if( UserNameASYNC != null 
    && CompanyInfoIDASYNC != null 
    && LanguageASYNC != null)
    {
      this.getDigitalProfile()
      .then(() => 
      {
        this.getCompanyProfile()
        .then(() =>
        {
          this.getEmployeeList();
        })
      })
    }
  }

  getDigitalProfile = () =>
  {
      return fetch(this.state.apiStr+'/api/dp/GetDigitalProfile?CompanyInfoID='+this.state.CompanyInfoID+'&UserName='+this.state.UserName+'&language='+this.state.Language)
      .then((response) => response.json())
      .then((responseJson) => {return responseJson;})
      .then(data =>
      {
        AsyncStorage.setItem('digitalProfileData', JSON.stringify(data));
        AsyncStorage.setItem('StylingTable', JSON.stringify(data.StylingTable));
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
        AsyncStorage.setItem('EmployeeList', JSON.stringify(data));
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  render()
  {
    return (
      <AppNavigator/>
    );
  }
}
