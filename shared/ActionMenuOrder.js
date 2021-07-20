import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import {
  accept,
  cancle,
  preparing,
  ready,
  delivered,
} from '../helpers/orderHelpers';

import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';

class ActionMenuOrder extends React.PureComponent {
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

  handle_accept = async (order_id, getOrdersList) => {
    let response = await accept(order_id);
    alert(response[0].message);
    getOrdersList();
  };
  handle_cancle = async (order_id, getOrdersList) => {
    let response = await cancle(order_id);
    alert(response[0].message);
    getOrdersList();
  };
  handle_preparing = async (order_id, getOrdersList) => {
    let response = await preparing(order_id);
    alert(response[0].message);
    getOrdersList();
  };
  handle_ready = async (order_id, getOrdersList) => {
    let response = await ready(order_id);
    alert(response[0].message);
    getOrdersList();
  };
  handle_delivered = async (order_id, getOrdersList) => {
    let response = await delivered(order_id);
    alert(response[0].message);
    getOrdersList();
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
          <MenuItem
            onPress={() => {
              this.hideMenu();
              this.handle_accept(this.props.order_id, this.props.getOrdersList);
            }}>
            Accept
          </MenuItem>

          <MenuDivider />

          <MenuItem
            onPress={() => {
              this.hideMenu();
              this.handle_cancle(this.props.order_id, this.props.getOrdersList);
            }}>
            Cancle
          </MenuItem>
          <MenuItem
            onPress={() => {
              this.hideMenu();
              this.handle_preparing(
                this.props.order_id,
                this.props.getOrdersList,
              );
            }}>
            Preparing
          </MenuItem>
          <MenuItem
            onPress={() => {
              this.hideMenu();
              this.handle_ready(this.props.order_id, this.props.getOrdersList);
            }}>
            Ready
          </MenuItem>
          <MenuItem
            onPress={() => {
              this.hideMenu();
              this.handle_delivered(
                this.props.order_id,
                this.props.getOrdersList,
              );
            }}>
            Delivered
          </MenuItem>
        </Menu>
      </View>
    );
  }
}

export default ActionMenuOrder;
