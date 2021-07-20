import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialBranchDetail = async id => {
  let userToken = await AsyncStorage.getItem('token');
  let res = await axios.get(
    `http://143.110.244.110/tija/frontuser/edit_branch/${id}`,
    {
      headers: {Authorization: `Bearer ${userToken}`},
    },
  );

  return res.data[0];
};

const initialCounterDetail = async id => {
  let userToken = await AsyncStorage.getItem('token');
  let res = await axios.get(
    `http://143.110.244.110/tija/frontuser/edit_branch/${id}`,
    {
      headers: {Authorization: `Bearer ${userToken}`},
    },
  );

  return res.data[0];
};

export {initialBranchDetail};
