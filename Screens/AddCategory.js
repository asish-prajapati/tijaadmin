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
import {getBranch, create_category} from '../helpers/addFromHelpers';
import theme from '../theme/theme';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import {CreateScreenStyle} from '../globalStyles';
import {Picker} from '@react-native-picker/picker';

export default function AddCategory({navigation}) {
  const [branch, setBranch] = useState('');
  const [name, setName] = useState('');
  const [branchList, setBranchList] = useState([]);
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
    } else if (!image) {
      alert('Please select Image');
    } else if (!branch) {
      alert('something went wrong try again later');
    } else {
      const body = {branch_id: branch, name: name};
      let response = await create_category(imagefile, body);
      if (response[0].success == true) {
        setName('');
        setBranch('');
        setImage('');
        setImagefile(null);
        setAlert(true);
      } else {
        alert(response.data[0].message);
      }
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
            message="New Category Added"
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
            <Text style={CreateScreenStyle.title}>Add Category</Text>
          </View>
          <View style={CreateScreenStyle.form}>
            {utype === 'ADM' && (
              <View style={CreateScreenStyle.picker}>
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
