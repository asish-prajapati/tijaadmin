import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {configureFonts, TextInput, Button} from 'react-native-paper';

import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getBranch} from '../helpers/addFromHelpers';
import {CreateScreenStyle} from '../globalStyles';
import {Picker} from '@react-native-picker/picker';
import theme from '../theme/theme';
import {baseUrl} from '../apiConfig';

export default function EditCounter({navigation, route}) {
  const {item} = route.params;
  const [branch, setBranch] = useState(item.branch_id);
  const [branchList, setBranchList] = useState([]);
  const [name, setName] = useState(item.name);
  const [email, setEmail] = useState(item.email);
  const [mobile, setMobile] = useState(item.mobile);

  const [image, setImage] = useState(item.image);
  const [imagefile, setImagefile] = useState(null);
  const [alertA, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const [utype, setUtype] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setName(item.name);
      setEmail(item.email);
      setMobile(item.mobile);
      setBranch(item.branch_id);
      setImage(item.image);
    });
    return unsubscribe;
  }, [navigation, item]);

  const createFormData = (photo, body = {}) => {
    const data = new FormData();
    if (imagefile) {
      data.append('image', {
        name: photo.assets[0].fileName,
        type: photo.assets[0].type,
        uri: photo.assets[0].uri,
      });
    }

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };
  const selectImage = () => {
    launchImageLibrary({quality: 0.4}, fileObj => {
      if (fileObj.assets) {
        setImage(fileObj.assets[0].uri);
        setImagefile(fileObj);
      }
    });
  };

  const handleSubmit = async () => {
    if (!name) {
      alert('Name can not be Empty');
    } else if (!email) {
      alert('email can not be Empty');
    } else if (!mobile) {
      alert('mobile can not be Empty');
    } else if (!image) {
      alert('Please select Image');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Enter Valid Email');
    } else if (!/^[6789]\d{9}$/.test(mobile)) {
      alert('Enter Valid Mobile No');
    } else if (!branch) {
      alert('something went wrong');
    } else {
      setLoading(true);

      let userToken;
      userToken = await AsyncStorage.getItem('token');
      console.log(userToken)
       console.log(branch)
       console.log(email)
       console.log(item.id)
       console.log(name)
       console.log(mobile)
      axios({
        method: 'POST',
        url: `${baseUrl}edit_counter`,
        data: createFormData(imagefile, {
          branch_id: branch,
          email: email,
          id: item.id,
          name: name,
          mobile: mobile,
        }),

        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then(response => {
          if (response.data[0].success == true) {
            setLoading(false);

            setName('');
            setBranch('');
            setEmail('');
            setMobile('');
            setImage('');

            setImagefile(null);
            setAlert(true);
          } else {
            setLoading(false);

            Alert.alert('Edit Counter Failed', response.data[0].message);
          }
        })
        .catch(err => {
          setLoading(false);
          Alert.alert('something went wrong', err.message);
        });
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBranch(setUtype, setBranchList, setBranch);
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={CreateScreenStyle.container}>
          <AwesomeAlert
            show={alertA}
            showProgress={false}
            title="Wohooo!"
            message="Counter Updated"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="OK!"
            cancelButtonColor="#DD6B55"
            onCancelPressed={() => setAlert(false)}
          />
          <View style={CreateScreenStyle.header}>
            <IconAnt
              name="menu-unfold"
              size={25}
              onPress={() => {
                navigation.openDrawer();
              }}
            />
            <Text style={CreateScreenStyle.title}>Edit Counter</Text>
          </View>
          <View style={CreateScreenStyle.form}>
            {utype === 'ADM' && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'grey',
                  borderRadius: 3,
                }}>
                <Picker
                  mode="dropdown"
                  selectedValue={branch}
                  onValueChange={(itemValue, itemIndex) => {
                    setBranch(itemValue);
                  }}>
                  <Picker.Item label="Select Branch" value="" color="grey" />
                  {branchList?.map(item => (
                    <Picker.Item
                      label={item.name}
                      value={item.id}
                      key={item.id}
                    />
                  ))}
                </Picker>
              </View>
            )}

            <TextInput
              label="Enter Name"
              id="name"
              name="name"
              onChangeText={value => {
                setName(value);
              }}
              value={name}
              type="text"
              theme={theme}
              mode="outlined"
              style={CreateScreenStyle.textInput}
            />
            <TextInput
              label="Enter Email"
              id="email"
              name="email"
              onChangeText={value => {
                setEmail(value);
              }}
              value={email}
              type="text"
              theme={theme}
              mode="outlined"
              style={CreateScreenStyle.textInput}
            />
            <TextInput
              label="Enter Mobile"
              id="mobile"
              name="mobile"
              onChangeText={value => {
                setMobile(value);
              }}
              value={mobile}
              type="text"
              theme={theme}
              mode="outlined"
              style={CreateScreenStyle.textInput}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Button color="coral" mode="outlined" onPress={selectImage}>
              Select Image
            </Button>
            <View style={{marginTop: 10, alignItems: 'center'}}>
              {image ? (
                <Image source={{uri: image}} style={CreateScreenStyle.image} />
              ) : null}
            </View>
            <KeyboardAvoidingView style={CreateScreenStyle.btnWrapper}>
              <ActivityIndicator
                animating={loading}
                size="large"
                color="0000ff"
              />
              {loading ? null : (
                <Button
                  type="submit"
                  mode="contained"
                  onPress={handleSubmit}
                  style={{
                    width: 200,
                  }}>
                  Submit
                </Button>
              )}
            </KeyboardAvoidingView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
