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
} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {TextInput, Button} from 'react-native-paper';
import {editBranch} from '../helpers/addFromHelpers';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme/theme';

export default function EditBranch({navigation, route}) {
  const {item} = route.params;
  const [name, setName] = useState(item.name);
  const [email, setEmail] = useState(item.email);
  const [mobile, setMobile] = useState(item.mobile);
  const [address, setAddress] = useState(item.address);
  const [image, setImage] = useState(item.image);
  const [imagefile, setImagefile] = useState(null);
  const [alertA, setAlert] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setName(item.name);
      setEmail(item.email);
      setMobile(item.mobile);
      setAddress(item.address);
      setImage(item.image);
    });
    return unsubscribe;
  }, [navigation, item]);

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
    } else if (!address) {
      alert('Address can not be Empty');
    } else if (!image) {
      alert('Please select Image');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Enter Valid Email');
    } else if (!/^[6789]\d{9}$/.test(mobile)) {
      alert('Enter Valid Mobile No');
    } else {
      const body = {
        name: name,
        email: email,
        mobile: mobile,
        address: address,
      };
      let response = await editBranch(item.id, imagefile, body);

      if (response[0].success == true) {
        setName('');
        setEmail('');
        setMobile('');
        setAddress('');
        setImage('');
        setImagefile(null);
        setAlert(true);
      } else {
        alert(response[0].message);
      }
    }
  };

  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <AwesomeAlert
            show={alertA}
            showProgress={false}
            title="Wohooo!"
            message="Branch Updated"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="OK!"
            cancelButtonColor="#DD6B55"
            onCancelPressed={() => setAlert(false)}
          />
          <View style={styles.header}>
            <IconAnt
              name="menu-unfold"
              size={25}
              onPress={() => {
                navigation.openDrawer();
              }}
            />
            <Text style={{fontSize: 20, marginLeft: 30, fontWeight: 'bold'}}>
              Edit Branch
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Enter Name"
              id="name"
              name="name"
              onChangeText={value => setName(value)}
              value={name}
              type="text"
              theme={theme}
              mode="outlined"
              style={styles.textInput}
            />
            <TextInput
              label="Enter Email"
              id="email"
              name="email"
              onChangeText={value => setEmail(value)}
              value={email}
              type="text"
              theme={theme}
              mode="outlined"
              style={styles.textInput}
            />
            <TextInput
              label="Enter Mobile"
              id="mobile"
              name="mobile"
              onChangeText={value => setMobile(value)}
              value={mobile}
              type="text"
              theme={theme}
              mode="outlined"
              style={styles.textInput}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <TextInput
              label="Enter Address"
              id="address"
              name="address"
              onChangeText={value => setAddress(value)}
              value={address}
              type="text"
              theme={theme}
              mode="outlined"
              style={styles.textInput}
            />
            <Button color="coral" mode="outlined" onPress={selectImage}>
              Select Image
            </Button>
            <View style={{marginTop: 10, alignItems: 'center'}}>
              {image ? (
                <Image
                  source={{uri: image}}
                  style={{
                    height: 150,
                    width: 150,
                    marginBottom: 5,
                    borderRadius: 75,
                    borderWidth: 1,
                    borderColor: 'coral',
                  }}
                />
              ) : null}
            </View>
            <KeyboardAvoidingView
              style={{
                position: 'absolute',
                bottom: 20,
                alignSelf: 'center',
              }}>
              <Button
                type="submit"
                mode="contained"
                onPress={handleSubmit}
                style={{
                  width: 200,
                }}>
                Submit
              </Button>
            </KeyboardAvoidingView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 10,
    flex: 1,
  },
  textInput: {
    marginBottom: 10,
  },
});
