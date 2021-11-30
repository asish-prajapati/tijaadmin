import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../apiConfig';
const accept = async order_id => {
  let userToken = await AsyncStorage.getItem('token');
  console.log("hii")
  console.log(order_id, userToken);
  try {
    let response = await axios.get(
      `${baseUrl}acceptorder?order_id=${order_id}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    response = await response.data;
    console.log(response)
    

    return response;
  } catch (error) {
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
      console.log('500 error');
    }
    alert(error);
  }
};
const acceptCounter = async (order_id,id) => {
  let userToken = await AsyncStorage.getItem('token');
  console.log(order_id, userToken);
  try {
    let response = await axios.get(
      `${baseUrl}acceptcounter?order_id=${order_id}&id=${id}`,

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
          refreshToken({token: null});
        } catch (e) {
          refreshToken({token: null});
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
const readyCounter = async (order_id,id) => {
  let userToken = await AsyncStorage.getItem('token');
  console.log(order_id, userToken);
  try {
    let response = await axios.get(
      `${baseUrl}readycounter?order_id=${order_id}&id=${id}`,

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
          refreshToken({token: null});
        } catch (e) {
          refreshToken({token: null});
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
const cancle = async id => {
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
          refreshToken({token: null});
        } catch (e) {
          refreshToken({token: null});
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
const preparing = async order_id => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios.get(
      `${baseUrl}preparing?order_id=${order_id}`,

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
          refreshToken({token: null});
        } catch (e) {
          refreshToken({token: null});
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
const ready = async order_id => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios.get(
      `${baseUrl}ready?order_id=${order_id}`,

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
          refreshToken({token: null});
        } catch (e) {
          refreshToken({token: null});
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
const delivered = async order_id => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios.get(
      `${baseUrl}deliverd?order_id=${order_id}`,

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
          refreshToken({token: null});
        } catch (e) {
          refreshToken({token: null});
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
  accept,
  acceptCounter,
  cancle,
  preparing,
  ready,
  delivered,
  readyCounter,
};
