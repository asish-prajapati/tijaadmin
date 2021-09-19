import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {TextInput, Button} from 'react-native-paper';
import {Formik} from 'formik';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import {CreateScreenStyle} from '../globalStyles';
import {create_branch} from '../helpers/addFromHelpers';
import theme from '../theme/theme';

export default function AddBranch({navigation}) {
  const [image, setImage] = useState('');
  const [imagefile, setImagefile] = useState(null);
  const [alertA, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectImage = () => {
    launchImageLibrary({quality: 0.4}, fileObj => {
      if (fileObj.assets) {
        setImage(fileObj.assets[0].uri);
        setImagefile(fileObj);
      }
    });
  };

  const handleSubmit = async (values, resetForm) => {
    const {name, email, mobile, password, address} = values;
    if (!name) {
      alert('Name can not be Empty');
    } else if (!email) {
      alert('email can not be Empty');
    } else if (!mobile) {
      alert('mobile can not be Empty');
    } else if (!password) {
      alert('password can not be Empty');
    } else if (!address) {
      alert('Address can not be Empty');
    } else if (!image) {
      alert('Please select Image');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Enter Valid Email');
    } else if (!/^[6789]\d{9}$/.test(mobile)) {
      alert('Enter Valid Mobile No');
    } else {
      setLoading(true);
      const body = {
        email: email,
        password: password,
        name: name,
        mobile: mobile,
        address: address,
      };
      let response = await create_branch(imagefile, body);
      if (response[0].success == true) {
        setLoading(false);
        resetForm({values: ''});
        setImage('');
        setImagefile(null);
        setAlert(true);
      } else {
        setLoading(false);
        Alert.alert('Add Branch Failed', response[0].message);
      }
    }
  };

  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={CreateScreenStyle.container}>
          <AwesomeAlert
            show={alertA}
            showProgress={false}
            title="Wohooo!"
            message="New Branch Added"
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
            <Text style={CreateScreenStyle.title}>Add Branch</Text>
          </View>
          <Formik
            initialValues={{
              name: '',
              email: '',
              mobile: '',
              password: '',
              address: '',
            }}
            onSubmit={(values, {resetForm}) => {
              handleSubmit(values, resetForm);
            }}>
            {formikProps => (
              <View style={CreateScreenStyle.form}>
                <TextInput
                  label="Enter Name"
                  id="name"
                  name="name"
                  onChangeText={formikProps.handleChange('name')}
                  value={formikProps.values.name}
                  onBlur={formikProps.handleBlur('name')}
                  type="text"
                  theme={theme}
                  mode="outlined"
                  style={CreateScreenStyle.textInput}
                />
                <TextInput
                  label="Enter Email"
                  id="email"
                  name="email"
                  onChangeText={formikProps.handleChange('email')}
                  value={formikProps.values.email}
                  onBlur={formikProps.handleBlur('email')}
                  type="text"
                  theme={theme}
                  mode="outlined"
                  style={CreateScreenStyle.textInput}
                />
                <TextInput
                  label="Enter Mobile"
                  id="mobile"
                  name="mobile"
                  onChangeText={formikProps.handleChange('mobile')}
                  value={formikProps.values.mobile}
                  onBlur={formikProps.handleBlur('mobile')}
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
                  onChangeText={formikProps.handleChange('password')}
                  value={formikProps.values.password}
                  onBlur={formikProps.handleBlur('password')}
                  type="text"
                  theme={theme}
                  mode="outlined"
                  style={CreateScreenStyle.textInput}
                />
                <TextInput
                  label="Enter Address"
                  id="address"
                  name="address"
                  onChangeText={formikProps.handleChange('address')}
                  value={formikProps.values.address}
                  onBlur={formikProps.handleBlur('address')}
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
                    <Image
                      source={{uri: image}}
                      style={CreateScreenStyle.image}
                    />
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
                      onPress={formikProps.handleSubmit}
                      style={{
                        width: 200,
                      }}>
                      Submit
                    </Button>
                  )}
                </KeyboardAvoidingView>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
