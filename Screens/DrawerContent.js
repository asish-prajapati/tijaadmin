import React, {useState, useContext, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {getProfile, getType} from '../helpers/drawerHelpers';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMat from 'react-native-vector-icons/MaterialIcons';
import IconEnt from 'react-native-vector-icons/Entypo';
import {List} from 'react-native-paper';
import {AuthContext} from '../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../apiConfig';
import {
  Provider as PaperProvider,
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';

const DrawerContent = props => {
  const [userExpended, setUserExpended] = useState(false);
  const [branchExpended, setBranchExpended] = useState(false);
  const [counterExpended, setCounterExpended] = useState(false);
  const [categoryExpended, setCategoryExpended] = useState(false);
  const [productExpended, setProductExpended] = useState(false);
  const [orderExpended, setOrderExpended] = useState(false);
  const [counterOrderExpended, setCounterOrderExpended] = useState(false);
  const [sellExpended, setSellExpended] = useState(false);
  const [permissionExpended, setPermissionExpended] = useState(false);

  const [utype, setUtype] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');

  const {signOut, refreshToken} = useContext(AuthContext);
  const handleLogOut = async () => {
    // signOut();
    let userToken = await AsyncStorage.getItem('token');

    try {
      let response = await axios.get(
        `${baseUrl}logoutadmin`,

        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      response = await response.data;
      if(response[0].success==true) {
        signOut();
      }
      console.log(response);
    } catch (e) {
      console.log(e)
      alert(e);
    }
  };
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getType(setUtype);
      getProfile(setName, setEmail, setImage, refreshToken);
    });
    return unsubscribe;
  }, [props.navigation]);

  const handleExpend = type => {
    switch (type) {
      case 'user':
        setUserExpended(!userExpended);
        branchExpended && setBranchExpended(false);
        counterExpended && setCounterExpended(false);
        categoryExpended && setCategoryExpended(false);
        productExpended && setProductExpended(false);
        orderExpended && setOrderExpended(false);
        counterOrderExpended && setCounterOrderExpended(false);
        sellExpended && setSellExpended(false);
        permissionExpended && setPermissionExpended(false);
        break;
      case 'branch':
        setBranchExpended(!branchExpended);
        userExpended && setUserExpended(false);
        counterExpended && setCounterExpended(false);
        categoryExpended && setCategoryExpended(false);
        productExpended && setProductExpended(false);
        orderExpended && setOrderExpended(false);
        counterOrderExpended && setCounterOrderExpended(false);
        sellExpended && setSellExpended(false);
        permissionExpended && setPermissionExpended(false);
        break;
      case 'counter':
        setCounterExpended(!counterExpended);
        branchExpended && setBranchExpended(false);
        counterExpended && setCounterExpended(false);
        categoryExpended && setCategoryExpended(false);
        productExpended && setProductExpended(false);
        orderExpended && setOrderExpended(false);
        userExpended && setUserExpended(false);
        sellExpended && setSellExpended(false);
        permissionExpended && setPermissionExpended(false);
        break;
      case 'category':
        setCategoryExpended(!categoryExpended);
        branchExpended && setBranchExpended(false);
        counterExpended && setCounterExpended(false);
        userExpended && setUserExpended(false);
        productExpended && setProductExpended(false);
        orderExpended && setOrderExpended(false);
        counterOrderExpended && setCounterOrderExpended(false);
        sellExpended && setSellExpended(false);
        permissionExpended && setPermissionExpended(false);
        break;
      case 'product':
        setProductExpended(!productExpended);
        branchExpended && setBranchExpended(false);
        counterExpended && setCounterExpended(false);
        categoryExpended && setCategoryExpended(false);
        userExpended && setUserExpended(false);
        orderExpended && setOrderExpended(false);
        counterOrderExpended && setCounterOrderExpended(false);
        sellExpended && setSellExpended(false);
        permissionExpended && setPermissionExpended(false);
        break;
      case 'order':
        setOrderExpended(!orderExpended);
        branchExpended && setBranchExpended(false);
        counterExpended && setCounterExpended(false);
        categoryExpended && setCategoryExpended(false);
        productExpended && setProductExpended(false);
        userExpended && setUserExpended(false);
        counterOrderExpended && setCounterOrderExpended(false);
        sellExpended && setSellExpended(false);
        permissionExpended && setPermissionExpended(false);
        break;
      case 'counterOrder':
        setCounterOrderExpended(!counterOrderExpended);
        branchExpended && setBranchExpended(false);
        counterExpended && setCounterExpended(false);
        categoryExpended && setCategoryExpended(false);
        productExpended && setProductExpended(false);
        orderExpended && setOrderExpended(false);
        userExpended && setUserExpended(false);
        sellExpended && setSellExpended(false);
        permissionExpended && setPermissionExpended(false);
        break;
      case 'sell':
        userExpended && setUserExpended(false);
        branchExpended && setBranchExpended(false);
        counterExpended && setCounterExpended(false);
        categoryExpended && setCategoryExpended(false);
        productExpended && setProductExpended(false);
        orderExpended && setOrderExpended(false);
        counterOrderExpended && setCounterOrderExpended(false);
        setSellExpended(!sellExpended);
        permissionExpended && setPermissionExpended(false);
        break;
      case 'permission':
        userExpended && setUserExpended(false);
        branchExpended && setBranchExpended(false);
        counterExpended && setCounterExpended(false);
        categoryExpended && setCategoryExpended(false);
        productExpended && setProductExpended(false);
        orderExpended && setOrderExpended(false);
        counterOrderExpended && setCounterOrderExpended(false);
        sellExpended && setSellExpended(false);
        setPermissionExpended(!permissionExpended);
        break;
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          {image ? (
            <Avatar.Image
              source={{
                uri: image,
              }}
              size={50}
            />
          ) : null}
          <Title style={styles.title}>{name}</Title>
          <Caption style={styles.caption}>{email}</Caption>
          {/* <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Following</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Followers</Caption>
            </View>
          </View> */}
        </View>

        <Drawer.Section style={styles.drawerSection}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Dashboard');
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 20,
              paddingVertical: 5,
            }}>
            <IconAnt name="home" size={20} />
            <Title style={{fontSize: 18, marginLeft: 15}}>DashBoard</Title>
          </TouchableOpacity>
          {utype === 'ADM' && (
            <List.Accordion
              title="User Manager "
              left={props => (
                <List.Icon
                  {...props}
                  color={userExpended ? 'coral' : 'black'}
                  icon="folder"
                />
              )}
              titleStyle={{color: userExpended ? 'coral' : 'black'}}
              expanded={userExpended}
              onPress={() => {
                handleExpend('user');
              }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('ViewUser')}>
                <View style={{flexDirection: 'row', paddingVertical: 15}}>
                  <IconAnt name="user" size={18} />
                  <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                    View User
                  </Paragraph>
                </View>
              </TouchableOpacity>
            </List.Accordion>
          )}
          {utype === 'ADM' && (
            <List.Accordion
              title="Branch Manager "
              left={props => (
                <List.Icon
                  {...props}
                  color={branchExpended ? 'coral' : 'black'}
                  icon="folder"
                />
              )}
              titleStyle={{color: branchExpended ? 'coral' : 'black'}}
              expanded={branchExpended}
              onPress={() => {
                handleExpend('branch');
              }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('AddBranch')}>
                <View style={{flexDirection: 'row', paddingVertical: 15}}>
                  <IconEnt name="add-to-list" size={18} />
                  <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                    Add Branch
                  </Paragraph>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('ViewBranch')}>
                <View style={{flexDirection: 'row', paddingVertical: 15}}>
                  <IconMat name="preview" size={18} />
                  <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                    View Branch
                  </Paragraph>
                </View>
              </TouchableOpacity>
            </List.Accordion>
          )}
          {(utype === 'ADM' || utype === 'branch') && (
            <>
              <List.Accordion
                title="Counter Manager "
                left={props => (
                  <List.Icon
                    {...props}
                    color={counterExpended ? 'coral' : 'black'}
                    icon="folder"
                  />
                )}
                titleStyle={{color: counterExpended ? 'coral' : 'black'}}
                expanded={counterExpended}
                onPress={() => {
                  handleExpend('counter');
                }}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('AddCounter')}>
                  <View style={{flexDirection: 'row', paddingVertical: 15}}>
                    <IconEnt name="add-to-list" size={18} />
                    <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                      Add Counter
                    </Paragraph>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('ViewCounter')}>
                  <View style={{flexDirection: 'row', paddingVertical: 15}}>
                    <IconMat name="preview" size={18} />
                    <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                      View Counter
                    </Paragraph>
                  </View>
                </TouchableOpacity>
              </List.Accordion>
              <List.Accordion
                title="Category Manager "
                left={props => (
                  <List.Icon
                    {...props}
                    color={categoryExpended ? 'coral' : 'black'}
                    icon="folder"
                  />
                )}
                titleStyle={{color: categoryExpended ? 'coral' : 'black'}}
                expanded={categoryExpended}
                onPress={() => {
                  handleExpend('category');
                }}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('AddCategory')}>
                  <View style={{flexDirection: 'row', paddingVertical: 15}}>
                    <IconEnt name="add-to-list" size={18} />
                    <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                      Add Category
                    </Paragraph>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('ViewCategory')}>
                  <View style={{flexDirection: 'row', paddingVertical: 15}}>
                    <IconMat name="preview" size={18} />
                    <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                      View Category
                    </Paragraph>
                  </View>
                </TouchableOpacity>
              </List.Accordion>
              <List.Accordion
                title="Product Manager "
                left={props => (
                  <List.Icon
                    {...props}
                    color={productExpended ? 'coral' : 'black'}
                    icon="folder"
                  />
                )}
                titleStyle={{color: productExpended ? 'coral' : 'black'}}
                expanded={productExpended}
                onPress={() => {
                  handleExpend('product');
                }}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('AddProduct')}>
                  <View style={{flexDirection: 'row', paddingVertical: 15}}>
                    <IconEnt name="add-to-list" size={18} />
                    <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                      Add Product
                    </Paragraph>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('ViewProduct')}>
                  <View style={{flexDirection: 'row', paddingVertical: 15}}>
                    <IconMat name="preview" size={18} />
                    <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                      View Product
                    </Paragraph>
                  </View>
                </TouchableOpacity>
              </List.Accordion>
              <List.Accordion
                title="Order Manager "
                left={props => (
                  <List.Icon
                    {...props}
                    color={orderExpended ? 'coral' : 'black'}
                    icon="folder"
                  />
                )}
                titleStyle={{color: orderExpended ? 'coral' : 'black'}}
                expanded={orderExpended}
                onPress={() => {
                  handleExpend('order');
                }}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('ViewOrder')}>
                  <View style={{flexDirection: 'row', paddingVertical: 15}}>
                    <IconMat name="preview" size={18} />
                    <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                      View Order
                    </Paragraph>
                  </View>
                </TouchableOpacity>
              </List.Accordion>
            </>
          )}
          {(utype === 'ADM' || utype === 'branch' || utype === 'counter') && (
            <List.Accordion
              title="Counter Order Manager "
              left={props => (
                <List.Icon
                  {...props}
                  color={counterOrderExpended ? 'coral' : 'black'}
                  icon="folder"
                />
              )}
              titleStyle={{color: counterOrderExpended ? 'coral' : 'black'}}
              expanded={counterOrderExpended}
              onPress={() => {
                handleExpend('counterOrder');
              }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('CounterOrder')}>
                <View style={{flexDirection: 'row', paddingVertical: 15}}>
                  <IconMat name="preview" size={18} />
                  <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                    Counter Order
                  </Paragraph>
                </View>
              </TouchableOpacity>
            </List.Accordion>
          )}
          {(utype === 'ADM' || utype === 'branch') && (
            <List.Accordion
              title="Guest Sell Manager "
              left={props => (
                <List.Icon
                  {...props}
                  color={sellExpended ? 'coral' : 'black'}
                  icon="folder"
                />
              )}
              titleStyle={{color: sellExpended ? 'coral' : 'black'}}
              expanded={sellExpended}
              onPress={() => {
                handleExpend('sell');
              }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('SellProduct')}>
                <View style={{flexDirection: 'row', paddingVertical: 15}}>
                  <IconEnt name="add-to-list" size={18} />
                  <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                    Sell Product
                  </Paragraph>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('ViewGuestSell')}>
                <View style={{flexDirection: 'row', paddingVertical: 15}}>
                  <IconMat name="preview" size={18} />
                  <Paragraph style={{paddingLeft: 10, fontSize: 15}}>
                    View Guest Sell
                  </Paragraph>
                </View>
              </TouchableOpacity>
            </List.Accordion>
          )}
        </Drawer.Section>
        <Drawer.Section>
          <TouchableRipple onPress={handleLogOut}>
            <View style={styles.preference}>
              <IconAnt name="logout" size={20} />
              <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 10}}>
                Logout
              </Text>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
};

export {DrawerContent as default};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 25,
  },
});
