import React from 'react';
import {View} from 'react-native';
import {baseUrl} from '../apiConfig';
import {Button, Text} from 'react-native-paper';
import IconAD from 'react-native-vector-icons/AntDesign';
// import IconMi from 'react-native-vector-icons/MaterialIcons';

import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';

import {_printReciept} from '../helpers/printReciept';
import {
  accept,
  cancle,
  preparing,
  ready,
  delivered,
} from '../helpers/orderHelpers';
import RNFetchBlob from 'rn-fetch-blob';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';

class ActionMenuCOrder extends React.PureComponent {
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
  downloadInvoice = id => {
    // Get today's date to add the time suffix in filename

    let date = new Date();
    // File URL which we want to download
    let FILE_URL = `${baseUrl}downloadinvoiceadmin/${id}.pdf`;
    const getFileExtention = fileUrl => {
      // To get the file extension
      return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
    };
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir + '/invoice' + file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
      })
      .catch(e => console.log(e));
  };

  handle_accept = async (order_id, getGuestOrdersList) => {
    let response = await acceptCounter(order_id);
    alert(response[0].message);
    getGuestOrdersList();
  };
  handle_cancle = async (order_id, getGuestOrdersList) => {
    let response = await cancle(order_id);
    alert(response[0].message);
    getGuestOrdersList();
  };
  handle_preparing = async (order_id, getGuestOrdersList) => {
    let response = await preparing(order_id);
    alert(response[0].message);
    getGuestOrdersList();
  };
  handle_ready = async (order_id, getGuestOrdersList) => {
    let response = await ready(order_id);
    alert(response[0].message);
    getGuestOrdersList();
  };
  handle_delivered = async (order_id, getGuestOrdersList) => {
    let response = await delivered(order_id);
    alert(response[0].message);
    getGuestOrdersList();
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: 250,
          alignItems: 'center',
        }}>
        {this.props.status == 0 && (
          <View style={{marginVertical: 10}}>
            <Button
              mode="contained"
              color="green"
              onPress={() => {
                this.handle_accept(
                  this.props.id,
                  this.props.getGuestOrdersList,
                );
              }}
              labelStyle={{color: 'white'}}>
              Accept
            </Button>
          </View>
        )}
        {this.props.status == 1 && (
          <View style={{marginVertical: 10}}>
            <Button
              mode="contained"
              color="green"
              onPress={() => {
                this.handle_ready(this.props.id, this.props.getGuestOrdersList);
              }}
              labelStyle={{color: 'white'}}>
              Ready
            </Button>
          </View>
        )}
        {this.props.status == 2 && (
          <View style={{marginVertical: 10}}>
            <Button
              mode="contained"
              color="green"
              onPress={() => {
                this.handle_delivered(
                  this.props.id,
                  this.props.getGuestOrdersList,
                );
              }}
              labelStyle={{color: 'white'}}>
              Deliver
            </Button>
          </View>
        )}
        {this.props.status == 3 && (
          <View
            style={{
              marginVertical: 10,
              borderRightColor: 'white',
              borderRightWidth: 1,
            }}>
            <Button
              mode="contained"
              color="green"
              onPress={() => {
                this.downloadInvoice(this.props.id);
                console.log('ggglg');
              }}
              icon="download"
              labelStyle={{color: 'white', fontSize: 10}}>
              Invoice
            </Button>
          </View>
        )}
        {this.props.status == 3 && (
          <View
            style={{
              marginVertical: 10,
              borderLeftColor: 'white',
              borderLeftWidth: 1,
            }}>
            <Button
              mode="contained"
              color="green"
              icon="receipt"
              onPress={() => {
                _printReciept(this.props.item);
              }}
              labelStyle={{color: 'white', fontSize: 10}}>
              Print
            </Button>
          </View>
        )}
        {this.props.status == -1 && (
          <View style={{marginVertical: 10}}>
            <Text style={{color: 'red'}}>CANCELLED</Text>
            {/* <Button mode="contained" color="red" labelStyle={{color: 'white'}}>
            Canclled
          </Button> */}
          </View>
        )}
        {(this.props.status == 0 ||
          this.props.status == 1 ||
          this.props.status == 2) && (
          <View style={{marginVertical: 10}}>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                this.handle_cancle(
                  this.props.id,
                  this.props.getGuestOrdersList,
                );
              }}>
              Cancel
            </Button>
          </View>
        )}
      </View>
      // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      //   <Menu
      //     ref={this.setMenuRef}
      //     button={
      //       <Button mode="contained" color="coral" onPress={this.showMenu}>
      //         Action
      //       </Button>
      //     }>
      //     {/* <MenuItem
      //       onPress={() => {
      //         this.hideMenu();
      //         this.handle_accept(
      //           this.props.order_id,
      //           this.props.getCOrdersList,
      //         );
      //       }}>
      //       Accept
      //     </MenuItem> */}

      //     {/* <MenuItem
      //       onPress={() => {
      //         this.hideMenu();
      //         this.handle_preparing(
      //           this.props.order_id,
      //           this.props.getGuestOrdersList,
      //         );
      //       }}>
      //       Preparing
      //     </MenuItem> */}

      //     {this.props.status == 'Accepted' && (
      //       <MenuItem
      //         onPress={() => {
      //           this.hideMenu();
      //           this.handle_ready(
      //             this.props.order_id,
      //             this.props.getGuestOrdersList,
      //           );
      //         }}>
      //         Ready
      //       </MenuItem>
      //     )}

      //     {this.props.status == 'Ready For Delivery' && (
      //       <MenuItem
      //         onPress={() => {
      //           this.hideMenu();
      //           this.handle_delivered(
      //             this.props.order_id,
      //             this.props.getGuestOrdersList,
      //           );
      //         }}>
      //         Delivered
      //       </MenuItem>
      //     )}

      //     {this.props.status == 'Delivered' && (
      //       <MenuItem
      //         onPress={() => {
      //           this.hideMenu();
      //         }}>
      //         Already Delivered
      //       </MenuItem>
      //     )}
      //     <MenuDivider />
      //     {this.props.status == 'Delivered' ||
      //     this.props.status == 'Cancelled' ? null : (
      //       <MenuItem
      //         onPress={() => {
      //           this.hideMenu();
      //           this.handle_cancle(
      //             this.props.order_id,
      //             this.props.getGuestOrdersList,
      //           );
      //         }}>
      //         Cancle
      //       </MenuItem>
      //     )}

      //     {this.props.status == 'Cancelled' && (
      //       <MenuItem
      //         onPress={() => {
      //           this.hideMenu();
      //         }}>
      //         Already Cancelled
      //       </MenuItem>
      //     )}
      //   </Menu>
      // </View>
    );
  }
}

export default ActionMenuCOrder;
