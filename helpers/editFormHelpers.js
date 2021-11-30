import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../apiConfig';
const initialBranchDetail = async id => {
  let userToken = await AsyncStorage.getItem('token');
  let res = await axios.get(`${baseUrl}edit_branch/${id}`, {
    headers: {Authorization: `Bearer ${userToken}`},
  });

  return res.data[0];
};

const initialCounterDetail = async id => {
  let userToken = await AsyncStorage.getItem('token');
  let res = await axios.get(
    `${baseUrl}edit_branch/${id}`,
    {
      headers: {Authorization: `Bearer ${userToken}`},
    },
  );

  return res.data[0];
};

export {initialBranchDetail};
