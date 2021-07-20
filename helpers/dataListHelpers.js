import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const get_transaction = async (userId, refreshToken) => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios.get(
      'http://143.110.244.110/tija/frontuser/view_user_transaction',

      {
        headers: {Authorization: `Bearer ${userToken}`},
        params: {id: userId},
      },
    );
    response = await response.data;
    return response;
  } catch (error) {
    if (error.response.status == 401) {
      const clearAll = async () => {
        try {
          await AsyncStorage.clear();
          refreshToken({token: null});
        } catch (e) {
          refreshToken({token: null});
          alert(e);
        }
      };
      clearAll();
    }
    if (error.response.status == 500) {
      console.log('500 error');
    }
  }
};

const enbdsbu = async userId => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios.get(
      'http://143.110.244.110/tija/frontuser/enbdisbu',

      {
        headers: {Authorization: `Bearer ${userToken}`},
        params: {id: userId},
      },
    );
    response = await response.data;
    return response;
  } catch (error) {
    if (error.response.status == 401) {
      const clearAll = async () => {
        try {
          await AsyncStorage.clear();
          refreshToken({token: null});
        } catch (e) {
          refreshToken({token: null});
          alert(e);
        }
      };
      clearAll();
    }
    if (error.response.status == 500) {
      console.log('500 error');
    }
  }
};
const delete_ = async (deleteRoute, userId) => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios.get(
      `http://143.110.244.110/tija/frontuser/${deleteRoute}/${userId}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    response = await response.data;

    return response;
  } catch (error) {
    if (error.response.status == 401) {
      const clearAll = async () => {
        try {
          await AsyncStorage.clear();
          refreshToken({token: null});
        } catch (e) {
          refreshToken({token: null});
          alert(e);
        }
      };
      clearAll();
    }
    if (error.response.status == 500) {
      console.log('500 error');
    }
    alert(error);
  }
};

const getUser = async (setUsers, setData, trimStart, trimEnd, refreshToken) => {
  let userToken;
  let userType;
  userToken = await AsyncStorage.getItem('token');
  userType = await AsyncStorage.getItem('type');

  axios
    .get(
      `http://143.110.244.110/tija/frontuser/viewusers?type=${userType}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].users;
      var slicedData = dataObj.slice(trimStart, trimEnd);
      setUsers(dataObj);
      setData(slicedData);
    })
    .catch(error => {
      if (error.response.status == 401) {
        const clearAll = async () => {
          try {
            await AsyncStorage.clear();

            refreshToken({token: null});
          } catch (e) {
            refreshToken({token: null});
            alert(e);
          }
        };

        clearAll();
      }
      alert(error);
    });
};
const getCategory = async (
  setCategory,
  setData,
  trimStart,
  trimEnd,
  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');
  axios
    .get(
      'http://143.110.244.110/tija/frontuser/viewcategory',

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].category;

      if (userType == 'ADM') {
        var slicedData = dataObj.slice(trimStart, trimEnd);
        setCategory(dataObj);
        setData(slicedData);
      }
      if (userType == 'branch') {
        let dataObjCategory = dataObj.filter(item => item.branch_id == userID);
        var slicedData = dataObjCategory.slice(trimStart, trimEnd);
        setCategory(dataObjCategory);
        setData(slicedData);
      }
    })
    .catch(error => {
      if (error.response.status == 401) {
        const clearAll = async () => {
          try {
            await AsyncStorage.clear();

            refreshToken({token: null});
          } catch (e) {
            refreshToken({token: null});
            alert(e);
          }
        };

        clearAll();
      }
      if (error.response.status == 500) {
        console.log('500 error');
      }
    });
};
const getCounters = async (
  setCounters,
  setData,
  trimStart,
  trimEnd,
  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');
  axios
    .get(
      'http://143.110.244.110/tija/frontuser/viewcounter',

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].counter;

      if (userType == 'ADM') {
        var slicedData = dataObj.slice(trimStart, trimEnd);
        setCounters(dataObj);
        setData(slicedData);
      }
      if (userType == 'branch') {
        let dataObjCounter = dataObj.filter(item => item.branch_id == userID);
        var slicedData = dataObjCounter.slice(trimStart, trimEnd);
        setCounters(dataObjCounter);
        setData(slicedData);
      }
    })
    .catch(error => {
      console.log(error);
      // if (error.response.status == 401) {
      //   const clearAll = async () => {
      //     try {
      //       await AsyncStorage.clear();

      //       refreshToken({token: null});
      //     } catch (e) {
      //       refreshToken({token: null});
      //       alert(e);
      //     }
      //   };

      //   clearAll();
    });
};
const getProducts = async (
  setProducts,
  setData,
  trimStart,
  trimEnd,
  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');

  axios
    .get(
      'http://143.110.244.110/tija/frontuser/viewproduct',

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].product;

      if (userType == 'ADM') {
        setProducts(dataObj);
        var slicedData = dataObj.slice(trimStart, trimEnd);
        setData(slicedData);
      }
      if (userType == 'branch') {
        let dataObjProducts = dataObj.filter(item => item.branch_id == userID);

        setProducts(dataObjProducts);
        var slicedData = dataObjProducts.slice(trimStart, trimEnd);
        setData(slicedData);
      }
    })
    .catch(error => {
      if (error.response.status == 401) {
        const clearAll = async () => {
          try {
            await AsyncStorage.clear();

            refreshToken({token: null});
          } catch (e) {
            refreshToken({token: null});
            alert(e);
          }
        };

        clearAll();
      }
    });
};
const getBranch = async (
  setBranches,
  setData,
  trimStart,
  trimEnd,
  refreshToken,
) => {
  let userToken;
  let userType;
  userToken = await AsyncStorage.getItem('token');
  userType = await AsyncStorage.getItem('type');

  axios
    .get(
      'http://143.110.244.110/tija/frontuser/viewbranch',

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].branch;
      var slicedData = dataObj.slice(trimStart, trimEnd);
      setBranches(dataObj);
      setData(slicedData);
    })
    .catch(error => {
      if (error.response.status == 401) {
        const clearAll = async () => {
          try {
            await AsyncStorage.clear();

            refreshToken({token: null});
          } catch (e) {
            refreshToken({token: null});
            alert(e);
          }
        };

        clearAll();
      }
    });
};

const getOrders = async (
  setOrders,
  setData,
  trimStart,
  trimEnd,
  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');

  axios
    .get(
      'http://143.110.244.110/tija/frontuser/vieworders',

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].orderdata;

      if (userType == 'ADM') {
        setOrders(dataObj);
        var slicedData = dataObj.slice(trimStart, trimEnd);
        setData(slicedData);
      }
      if (userType == 'branch') {
        let dataObjOrders = dataObj.filter(item => item.branch_id == userID);

        setOrders(dataObjOrders);
        var slicedData = dataObj.slice(trimStart, trimEnd);
        setData(slicedData);
      }
    })
    .catch(error => {
      // if (error.response.status == 401) {
      //   const clearAll = async () => {
      //     try {
      //       await AsyncStorage.clear();

      //       refreshToken({token: null});
      //     } catch (e) {
      //       refreshToken({token: null});
      //       alert(e);
      //     }
      //   };

      //   clearAll();
      // }
      // if (error.response.status == 500) {
      //   console.log('500 error');
      // }
      alert(error);
    });
};

const getGuestOrders = async (
  setOrders,
  setData,
  trimStart,
  trimEnd,
  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');

  axios
    .get(
      'http://143.110.244.110/tija/frontuser/viewguestsellorders',

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].orderdata;

      if (userType == 'ADM') {
        setOrders(dataObj);
        var slicedData = dataObj.slice(trimStart, trimEnd);
        setData(slicedData);
      }
      if (userType == 'branch') {
        let dataObjOrders = dataObj.filter(item => item.branch_id == userID);

        setOrders(dataObjOrders);
        var slicedData = dataObj.slice(trimStart, trimEnd);
        setData(slicedData);
      }
    })
    .catch(error => {
      if (error.response.status == 401) {
        const clearAll = async () => {
          try {
            await AsyncStorage.clear();

            refreshToken({token: null});
          } catch (e) {
            refreshToken({token: null});
            alert(e);
          }
        };

        clearAll();
      }
      if (error.response.status == 500) {
        console.log('500 error');
      }
    });
};
const getCounterOrders = async (setOrders, refreshToken) => {
  let userToken;

  userToken = await AsyncStorage.getItem('token');

  axios
    .get(
      'http://143.110.244.110/tija/frontuser/viewcounterorders',

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].orderdata;

      setOrders(dataObj);
    })
    .catch(error => {
      if (error.response.status == 401) {
        const clearAll = async () => {
          try {
            await AsyncStorage.clear();

            refreshToken({token: null});
          } catch (e) {
            refreshToken({token: null});
            alert(e);
          }
        };

        clearAll();
      }
      if (error.response.status == 500) {
        console.log('500 error');
      }
    });
};

export {
  get_transaction,
  getUser,
  getCategory,
  getCounters,
  getProducts,
  getBranch,
  getOrders,
  getGuestOrders,
  getCounterOrders,
  enbdsbu,
  delete_,
};
