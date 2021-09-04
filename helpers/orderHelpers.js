import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const accept = async order_id => {
  let userToken = await AsyncStorage.getItem('token');
  console.log(order_id, userToken);
  try {
    let response = await axios.get(
      `http://143.110.244.110/tija/frontuser/acceptorder?order_id=${order_id}`,

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
const acceptCounter = async order_id => {
  let userToken = await AsyncStorage.getItem('token');
  console.log(order_id, userToken);
  try {
    let response = await axios.get(
      `http://143.110.244.110/tija/frontuser/acceptcounter?order_id=${order_id}`,

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
const readyCounter = async order_id => {
  let userToken = await AsyncStorage.getItem('token');
  console.log(order_id, userToken);
  try {
    let response = await axios.get(
      `http://143.110.244.110/tija/frontuser/readycounter?order_id=${order_id}`,

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
      `http://143.110.244.110/tija/frontuser/cancle_order?order_id=${id}`,

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
      `http://143.110.244.110/tija/frontuser/preparing?order_id=${order_id}`,

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
      `http://143.110.244.110/tija/frontuser/ready?order_id=${order_id}`,

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
      `http://143.110.244.110/tija/frontuser/deliverd?order_id=${order_id}`,

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
