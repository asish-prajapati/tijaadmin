import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../apiConfig';
const acceptFromNotification = async order_id => {
  let userToken = await AsyncStorage.getItem('token');
  console.log(userToken, order_id);

  try {
    let response = await axios.get(
      `${baseUrl}acceptorder?order_id=${order_id}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    response = await response.data;
    console.log(response);
    return response;
  } catch (error) {
    if (error.response.status == 401) {
      const clearAll = async () => {
        try {
          await AsyncStorage.clear();
          // refreshToken({token: null});
        } catch (e) {
          // refreshToken({token: null});
          alert(e);
        }
      };
      clearAll();
    }
    if (error.response.status == 500) {
      console.log('500 error');
    }
    alert(error);
  }
};
const acceptCounterFromNotification = async( id,orderid )=> {
  let userToken = await AsyncStorage.getItem('token');
  console.log(id,orderid, userToken);
  try {
    let response = await axios.get(
      `${baseUrl}acceptcounter?id=${id}&order_id=${orderid}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    response = await response.data;

    return response;
  } catch (error) {
    console.log(error)
    if (error.response.status == 401) {
      const clearAll = async () => {
        try {
          await AsyncStorage.clear();
          // refreshToken({token: null});
        } catch (e) {
          // refreshToken({token: null});
          alert(e);
        }
      };
      clearAll();
    }
    if (error.response.status == 500) {
      console.log('500 error');
    }
    alert(error);
  }
};

const cancleFromNotification = async id => {
  let userToken = await AsyncStorage.getItem('token');

  try {
    let response = await axios.get(
      `${baseUrl}cancle_order?order_id=${id}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    response = await response.data;

    return response;
  } catch (error) {
    if (error.response.status == 401) {
      const clearAll = async () => {
        try {
          await AsyncStorage.clear();
          // refreshToken({token: null});
        } catch (e) {
          // refreshToken({token: null});
          alert(e);
        }
      };
      clearAll();
    }
    if (error.response.status == 500) {
      console.log('500 error');
    }
    alert(error);
  }
};

export {
  acceptFromNotification,
  acceptCounterFromNotification,
  cancleFromNotification,
};
