import React, {useState} from 'react';
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
import {configureFonts, TextInput, Button} from 'react-native-paper';
import {getBranch} from '../helpers/addFromHelpers';

import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CreateScreenStyle} from '../globalStyles';
import {Picker} from '@react-native-picker/picker';
import theme from '../theme/theme';

export default function EditCategory({navigation, route}) {
  const {item} = route.params;
  const [branch, setBranch] = useState(item.branch_id);
  const [name, setName] = useState(item.name);
  const [branchList, setBranchList] = useState([]);
  const [image, setImage] = useState(item.image);
  const [imagefile, setImagefile] = useState(null);
  const [alertA, setAlert] = useState(false);
  const [utype, setUtype] = useState('');

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
    } else if (!image) {
      alert('Please select Image');
    } else if (!branch) {
      alert('something went wrong');
    } else {
      let userToken;
      userToken = await AsyncStorage.getItem('token');
      console.log(item.id, branch, name);
      axios({
        method: 'POST',
        url: 'http://143.110.244.110/tija/frontuser/edit_category',
        data: createFormData(imagefile, {
          id: item.id,
          branch_id: branch,
          name: name,
        }),

        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then(response => {
          console.log(response.data);
          if (response.data[0].success == true) {
            setName('');
            setBranch('');

            setImage('');
            setImagefile(null);
            setAlert(true);
          } else {
            alert(response.data[0].message);
          }
        })
        .catch(err => {
          console.log('something went wrong', err);
        });
    }
  };
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBranch(setUtype, setBranchList, setBranch);
      setName(item.name);
      setBranch(item.branch_id);
      setImage(item.image);
    });
    return unsubscribe;
  }, [navigation, item]);
  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={CreateScreenStyle.container}>
          <AwesomeAlert
            show={alertA}
            showProgress={false}
            title="Wohooo!"
            message="Category Updated"
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
            <Text style={CreateScreenStyle.title}>Edit Category</Text>
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

            <Button color="coral" mode="outlined" onPress={selectImage}>
              Select Image
            </Button>
            <View style={{marginTop: 10, alignItems: 'center'}}>
              {image ? (
                <Image source={{uri: image}} style={CreateScreenStyle.image} />
              ) : null}
            </View>
            <KeyboardAvoidingView style={CreateScreenStyle.btnWrapper}>
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
