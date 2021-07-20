import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getDash = async () => {
  let userToken;
  let userType;
  userToken = await AsyncStorage.getItem('token');
  userType = await AsyncStorage.getItem('type');
  try {
    let response = await axios.get(
      `http://143.110.244.110/tija/frontuser/admindashboard?type=${userType}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    return response.data[0];
  } catch (e) {
    alert(e);
  }
};

export {getDash};
