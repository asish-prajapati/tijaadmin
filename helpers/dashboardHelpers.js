import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {baseUrl} from '../apiConfig';

const getDash = async refreshToken => {
  let userToken;
  let userType;
  userToken = await AsyncStorage.getItem('token');
  userType = await AsyncStorage.getItem('type');
  try {
    let response = await axios.get(
      `${baseUrl}admindashboard?type=${userType}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    return response.data[0];
  } catch (error) {
    if (error.response == undefined) {
      alert('Something went wrong');
    } else {
      if (error.response.status == 401) {
        const clearAll = async () => {
          try {
            await AsyncStorage.clear();

            refreshToken({token: null});
          } catch (e) {
            refreshToken({token: null});
            alert(e);
          }
        };

        clearAll();
      }
      if (error.response.status == 500) {
        alert('Something Went Wrong , Code:500');
      }
    }

    // alert(error);
  }
  // .then(response => {
  //   console.log(response);
  //   return response.data[0];
  // })
  // .catch(error => {
  //   // if (error.response.status == 401) {
  //   //   const clearAll = async () => {
  //   //     try {
  //   //       await AsyncStorage.clear();

  //   //       refreshToken({token: null});
  //   //     } catch (e) {
  //   //       refreshToken({token: null});
  //   //       alert(e);
  //   //     }
  //   //   };

  //   //   clearAll();
  //   // }
  //   // if (error.response.status == 500) {
  //   //   console.log('500 error');
  //   // }
  //   alert(error);
  // });

  // try {
  //   let response = await axios.get(
  //     `http://143.110.244.110/tija/frontuser/admindashboard?type=${userType}`,

  //     {
  //       headers: {Authorization: `Bearer ${userToken}`},
  //     },
  //   );
  //   return response.data[0];
  // } catch (response) {
  // if (error.response.status == 401) {
  //   const clearAll = async () => {
  //     try {
  //       await AsyncStorage.clear();

  //       refreshToken({token: null});
  //     } catch (e) {
  //       refreshToken({token: null});
  //       alert(e);
  //     }
  //   };

  //   clearAll();
  // }
  // if (error.response.status == 500) {
  //   console.log('500 error');
  // }
  //   console.log(response);
  // }
};

export {getDash};
