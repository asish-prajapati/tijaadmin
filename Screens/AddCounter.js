import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {TextInput, Button} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  getBranch,
  getBranchAndCat,
  onBranchChange,
} from '../helpers/addFromHelpers';
import {CreateScreenStyle} from '../globalStyles';
import {Picker} from '@react-native-picker/picker';
import theme from '../theme/theme';
import {create_counter} from '../helpers/addFromHelpers';

export default function AddCounter({navigation}) {
  const [branch, setBranch] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, SetPassword] = useState('');
  const [image, setImage] = useState('');
  const [imagefile, setImagefile] = useState(null);
  const [alertA, setAlert] = useState(false);
  const [utype, setUtype] = useState('');

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
    } else if (!password) {
      alert('password can not be Empty');
    } else if (!image) {
      alert('Please select Image');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Enter Valid Email');
    } else if (!/^[6789]\d{9}$/.test(mobile)) {
      alert('Enter Valid Mobile No');
    } else if (!branch) {
      alert('something went wrong');
    } else {
      const body = {
        branch_id: branch,
        category_id: category,
        email: email,
        password: password,
        name: name,
        mobile: mobile,
      };

      let response = await create_counter(imagefile, body);
      console.log(response);
      if (response[0].success == true) {
        setName('');
        setBranch('');
        setCategory();
        setEmail('');
        setMobile('');
        setImage('');
        SetPassword('');
        setImagefile(null);
        setAlert(true);
      } else {
        alert(response[0].message);
      }
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBranchAndCat(setUtype, setBranchList, setBranch, setCatList);
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
            message="New Counter Added"
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
            <Text style={CreateScreenStyle.title}>Add Counter</Text>
          </View>
          <View style={CreateScreenStyle.form}>
            {utype === 'ADM' && (
              <View style={CreateScreenStyle.picker}>
                <Picker
                  mode="dropdown"
                  selectedValue={branch}
                  onValueChange={(itemValue, itemIndex) => {
                    onBranchChange(itemValue, setBranch, setCatList);
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
            {(utype === 'branch' || utype === 'ADM') && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'grey',
                  borderRadius: 3,
                  marginBottom: 10,
                }}>
                <Picker
                  mode="dropdown"
                  selectedValue={category}
                  onValueChange={(itemValue, itemIndex) => {
                    setCategory(itemValue);
                  }}>
                  <Picker.Item label="Select Category" value="" color="grey" />
                  {catList?.map(item => (
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
            <TextInput
              id="password"
              name="password"
              label="Enter Password"
              onChangeText={value => {
                SetPassword(value);
              }}
              value={password}
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
