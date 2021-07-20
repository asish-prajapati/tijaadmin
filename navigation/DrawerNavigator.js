import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from '../Screens/DrawerContent';
import Dashboard from '../Screens/Dashboard';
import ViewUser from '../Screens/ViewUser';
import Demo from '../Screens/Demo';
import AddBranch from '../Screens/AddBranch';
import ViewBranch from '../Screens/ViewBranch';
import EditBranch from '../Screens/EditBranch';
import AddCounter from '../Screens/AddCounter';
import ViewCounter from '../Screens/ViewCounter';
import EditCounter from '../Screens/EditCounter';
import AddCategory from '../Screens/AddCategory';
import ViewCategory from '../Screens/ViewCategory';
import EditCategory from '../Screens/EditCategory';
import AddProduct from '../Screens/AddProduct';
import ViewProduct from '../Screens/ViewProduct';
import EditProduct from '../Screens/EditProduct';
import ViewOrder from '../Screens/ViewOrder';
import CounterOrder from '../Screens/CounterOrder';
import SellProduct from '../Screens/SellProduct';
import ViewGuestSell from '../Screens/ViewGuestSell';

const DrawerN = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <DrawerN.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <DrawerN.Screen name="Dashboard" component={Dashboard} />
      <DrawerN.Screen name="ViewUser" component={ViewUser} />
      <DrawerN.Screen name="AddBranch" component={AddBranch} />
      <DrawerN.Screen name="ViewBranch" component={ViewBranch} />
      <DrawerN.Screen name="EditBranch" component={EditBranch} />
      <DrawerN.Screen name="AddCounter" component={AddCounter} />
      <DrawerN.Screen name="ViewCounter" component={ViewCounter} />
      <DrawerN.Screen name="EditCounter" component={EditCounter} />
      <DrawerN.Screen name="AddCategory" component={AddCategory} />
      <DrawerN.Screen name="ViewCategory" component={ViewCategory} />
      <DrawerN.Screen name="EditCategory" component={EditCategory} />
      <DrawerN.Screen name="AddProduct" component={AddProduct} />
      <DrawerN.Screen name="ViewProduct" component={ViewProduct} />
      <DrawerN.Screen name="EditProduct" component={EditProduct} />
      <DrawerN.Screen name="ViewOrder" component={ViewOrder} />
      <DrawerN.Screen name="CounterOrder" component={CounterOrder} />
      <DrawerN.Screen name="SellProduct" component={SellProduct} />
      <DrawerN.Screen name="ViewGuestSell" component={ViewGuestSell} />
    </DrawerN.Navigator>
  );
}
