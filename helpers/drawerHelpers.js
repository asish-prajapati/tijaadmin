import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getProfile = async (setName, setEmail, setImage, refreshToken) => {
  let userToken = await AsyncStorage.getItem('token');
  axios
    .get('http://143.110.244.110/tija/frontuser/adminprofile', {
      headers: {Authorization: `Bearer ${userToken}`},
    })
    .then(res => {
      res = res.data[0];
      setName(res.name);
      setEmail(res.email);
      setImage(res.image);
    })
    .catch(error => {
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
    });
};

const getType = async setUtype => {
  let userType = await AsyncStorage.getItem('type');
  setUtype(userType);
};

export {getProfile, getType};
