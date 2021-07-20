import * as React from 'react';
import {Switch as SwitchButton} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Switch = props => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  React.useEffect(() => {
    setIsSwitchOn(props.status === 0 ? false : true);
  }, [props]);

  const onToggleSwitch = async id => {
    let userToken = await AsyncStorage.getItem('token');
    try {
      let response = await axios.get(
        `http://143.110.244.110/tija/frontuser/stockupdate?product_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      response = response.data[0];
      if (response.success == true) {
        setIsSwitchOn(!isSwitchOn);
        alert(response.msg);
      } else {
        alert(response.msg);
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <SwitchButton
      value={isSwitchOn}
      onValueChange={() => {
        onToggleSwitch(props.id);
      }}
    />
  );
};

export default Switch;
