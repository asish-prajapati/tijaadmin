import {configureFonts} from 'react-native-paper';

const theme = {
  colors: {primary: 'tomato'},
  fonts: configureFonts({
    default: {
      regular: {
        fontFamily: 'Montserrat-Regular',
        fontWeight: 'normal',
      },
    },
  }),
};

export default theme;
