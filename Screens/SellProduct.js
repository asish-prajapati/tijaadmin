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
import {
  getBranchAndCat,
  sell_product,
  onBranchChange,
  onCatChange,
} from '../helpers/addFromHelpers';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CreateScreenStyle} from '../globalStyles';
import {Picker} from '@react-native-picker/picker';
import theme from '../theme/theme';

export default function SellProduct({navigation}) {
  const [branch, setBranch] = useState('');

  const [branchList, setBranchList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [productList, setProductList] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [utype, setUtype] = useState('');
  const [alertA, setAlert] = useState(false);

  const handleSubmit = async () => {
    if (!branch) {
      alert('Select Branch');
    } else if (!category) {
      alert('Select Category');
    } else {
      const body = {
        branch_id: branch,
        category_id: category,
        product_id: product,
        quantity: quantity,
      };
      console.log(body);

      let response = await sell_product(body);
      console.log(response);
      if (response[0].success == true) {
        setBranch('');
        setCategory('');
        setProduct('');
        setQuantity(1);
        setAlert(true);
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
            message="New Order Placed "
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
            <Text style={CreateScreenStyle.title}>Sell Product</Text>
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
                    onCatChange(itemValue, setCategory, setProductList);
                    // setCategory(itemValue);
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
                  selectedValue={product}
                  onValueChange={(itemValue, itemIndex) => {
                    setProduct(itemValue);
                  }}>
                  <Picker.Item label="Select Product" value="" color="grey" />
                  {productList?.map(item => (
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
              label="Enter Quantity"
              id="quantity"
              name="quanity"
              onChangeText={value => {
                setQuantity(value);
              }}
              type="text"
              value={quantity.toString()}
              theme={theme}
              mode="outlined"
              style={CreateScreenStyle.textInput}
              keyboardType="number-pad"
            />

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
