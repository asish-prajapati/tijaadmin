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
import {
  getBranchAndCat,
  getBranchAndCatForEditProduct,
  onBranchChange,
} from '../helpers/addFromHelpers';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CreateScreenStyle} from '../globalStyles';
import {Picker} from '@react-native-picker/picker';
import theme from '../theme/theme';
import { baseUrl } from '../apiConfig';

export default function EditProduct({navigation, route}) {
  const {item} = route.params;

  const [branch, setBranch] = useState(item.branch_id);
  const [name, setName] = useState(item.name);
  const [branchList, setBranchList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [category, setCategory] = useState(item.category_id);
  const [price, setPrice] = useState(item.price.toString());
  const [description, setDescription] = useState(item.description);
  const [utype, setUtype] = useState('');
  const [image, setImage] = useState(item.image);
  const [imagefile, setImagefile] = useState(null);
  const [alertA, setAlert] = useState(false);

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
    } else if (!price > 0) {
      alert('Enter Valid Price');
    } else if (!description.length > 5) {
      alert('Enter Valid Description');
    } else if (!branch) {
      alert('something went wrong');
    } else if (!category) {
      alert('something went wrong');
    } else {
      let userToken;
      userToken = await AsyncStorage.getItem('token');
      console.log(userToken);
      axios({
        method: 'POST',
        url: `${baseUrl}edit_product`,
        data: createFormData(imagefile, {
          branch_id: branch,
          id: item.id,
          category_id: category,
          name: name,
          price: price,
          description: description,
        }),

        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }).then(response => {
        console.log(response.data);
        if (response.data[0].success == true) {
          setName('');
          setBranch('');
          setCategory('');
          setPrice('');
          setDescription('');
          setImage('');
          setImagefile(null);
          setAlert(true);
        }
      });
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await getBranchAndCatForEditProduct(
        setUtype,
        setBranchList,
        setBranch,
        setCategory,
        setCatList,
        item.category_id,
        item.branch_id,
      );
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setName(item.name);
      setBranch(item.branch_id);
      setImage(item.image);
      setCategory(item.category_id);
      setPrice(item.price.toString());
      setDescription(item.description);
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
            message="Product Updated"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
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
            <Text style={CreateScreenStyle.title}>Edit Product</Text>
          </View>
          <View style={CreateScreenStyle.form}>
            {utype === 'ADM' && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'grey',
                  borderRadius: 3,
                  marginBottom: 10,
                }}>
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
              label="Enter Price"
              id="price"
              keyboardType="number-pad"
              name="price"
              onChangeText={value => {
                setPrice(value);
              }}
              value={price}
              type="text"
              theme={theme}
              mode="outlined"
              style={CreateScreenStyle.textInput}
            />
            <TextInput
              multiline
              label="Enter Description"
              id="description"
              name="description"
              onChangeText={value => {
                setDescription(value);
              }}
              value={description}
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
