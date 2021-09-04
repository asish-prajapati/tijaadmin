import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import {enbdsbu, delete_} from '../helpers/dataListHelpers';
import {CategoryContext} from '../Screens/ViewCategory';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';

class ActionMenu extends React.PureComponent {
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  handle_enbdsbu = async (
    enbdsbRoute,
    userId,
    getUserList,
    getCategoryList,
    getCounterList,
    getBranchList,
    getProductList,
  ) => {
    let response = await enbdsbu(enbdsbRoute, userId);
    if (enbdsbRoute == 'enbdisbu') {
      getUserList();
    }
    if (enbdsbRoute == 'enbdisbcategory') {
      getCategoryList();
    }
    if (enbdsbRoute == 'enbdisbcounter') {
      getCounterList();
    }
    if (enbdsbRoute == 'enbdisbbranch') {
      getBranchList();
    }
    if (enbdsbRoute == 'enbdisbproduct') {
      getProductList();
    }
    alert(response[0].message);
  };
  handle_delete_ = async (
    deleteRoute,
    userId,
    getCategoryList,
    getCounterList,
    getBranchList,
  ) => {
    let response = await delete_(deleteRoute, userId);
    if (deleteRoute == 'delete_category') {
      getCategoryList();
    }
    if (deleteRoute == 'delete_counter') {
      getCounterList();
    }
    if (deleteRoute == 'delete_branch') {
      getBranchList();
    }
    alert(response[0].message);
  };
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Menu
          ref={this.setMenuRef}
          button={
            <Button mode="contained" color="coral" onPress={this.showMenu}>
              Action
            </Button>
          }>
          {this.props.showEdit == true ? (
            <MenuItem
              onPress={() => {
                this.hideMenu();
                this.props.navigation.navigate(`${this.props.editRoute}`, {
                  item: this.props.item,
                });
              }}>
              Edit
            </MenuItem>
          ) : null}
          <MenuDivider />
          {this.props.showTrans ? (
            <MenuItem
              onPress={() => {
                this.hideMenu();
                this.props.navigation.navigate(
                  `${this.props.transactionRoute}`,
                  {userId: this.props.item.id},
                );
              }}>
              Transactions
            </MenuItem>
          ) : null}

          <MenuDivider />
          {this.props.showEnbDsb == true ? (
            <MenuItem
              onPress={() => {
                this.hideMenu();
                this.handle_enbdsbu(
                  this.props.enbdsbRoute,
                  this.props.item.id,

                  this.props.getUserList,
                  this.props.getCategoryList,
                  this.props.getCounterList,
                  this.props.getBranchList,
                  this.props.getProductList,
                );
              }}>
              {this.props.status == 0 ? 'enable' : 'disable'}
            </MenuItem>
          ) : null}
          {this.props.showDelete ? (
            <MenuItem
              onPress={() => {
                this.hideMenu();
                this.handle_delete_(
                  this.props.deleteRoute,
                  this.props.item.id,
                  this.props.getCategoryList,
                  this.props.getCounterList,
                  this.props.getBranchList,
                );
              }}>
              Delete
            </MenuItem>
          ) : null}
        </Menu>
      </View>
    );
  }
}

export default ActionMenu;
