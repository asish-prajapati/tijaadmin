import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../apiConfig';

const get_transaction = async (userId, refreshToken) => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios.get(
      `${baseUrl}view_user_transaction`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
        params: {id: userId},
      },
    );
    response = await response.data;
    console.log(response);
    return response;
  } catch (error) {
    if (error.response.status != undefined) {
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
      } else {
        alert('Something Went Wrong...');
      }
    } else {
      alert('Something Went Wrong...');
    }
  }
};

const enbdsbu = async (enbdsbRoute, userId) => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios.get(
      `${baseUrl}${enbdsbRoute}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
        params: {id: userId},
      },
    );
    response = await response.data;
    return response;
  } catch (error) {
    if (error.response.status != undefined) {
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
      } else {
        alert('Something Went Wrong...');
      }
    } else {
      alert('Something Went Wrong...');
    }
  }
};
const delete_ = async (deleteRoute, userId) => {
  let userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios.get(
      `${baseUrl}${deleteRoute}/${userId}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    response = await response.data;

    return response;
  } catch (error) {
    if (error.response.status != undefined) {
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
      } else {
        alert('Something Went Wrong...');
      }
    } else {
      alert('Something Went Wrong...');
    }
  }
};

const getUser = async (setUsers, refreshToken) => {
  let userToken;
  let userType;
  userToken = await AsyncStorage.getItem('token');
  userType = await AsyncStorage.getItem('type');

  axios
    .get(
      `${baseUrl}viewusers?type=${userType}`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].users;
      console.log(dataObj);
      // var slicedData = dataObj.slice(trimStart, trimEnd);
      setUsers(dataObj);
      // setData(slicedData);
    })
    .catch(error => {
      if (error.response.status != undefined) {
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
        } else {
          alert('Something Went Wrong...');
        }
      } else {
        alert('Something Went Wrong...');
      }
    });
};
const getCategory = async (
  setCategory,
  // setData,
  // trimStart,
  // trimEnd,
  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');
  axios
    .get(
      `${baseUrl}viewcategory`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].category;
      // setCategory(dataObj);
      if (userType == 'ADM') {
        // var slicedData = dataObj.slice(trimStart, trimEnd);
        setCategory(dataObj);
        // setData(slicedData);
      }
      if (userType == 'branch') {
        let dataObjCategory = dataObj.filter(item => item.branch_id == userID);
        // var slicedData = dataObjCategory.slice(trimStart, trimEnd);
        setCategory(dataObjCategory);
        // setData(slicedData);
      }
    })
    .catch(error => {
      if (error.response.status != undefined) {
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
        } else {
          alert('Something Went Wrong...');
        }
      } else {
        alert('Something Went Wrong...');
      }
    });
};
const getCounters = async (
  setCounters,

  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');
  axios
    .get(
      `${baseUrl}viewcounter`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].counter;
      // setCounters(dataObj);
      if (userType == 'ADM') {
        // var slicedData = dataObj.slice(trimStart, trimEnd);
        setCounters(dataObj);
        // setData(slicedData);
      }
      if (userType == 'branch') {
        let dataObjCounter = dataObj.filter(item => item.branch_id == userID);
        // var slicedData = dataObjCounter.slice(trimStart, trimEnd);
        setCounters(dataObjCounter);
        // setData(slicedData);
      }
    })
    .catch(error => {
      if (error.response.status != undefined) {
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
        } else {
          alert('Something Went Wrong...');
        }
      } else {
        alert('Something Went Wrong...');
      }
    });
};
const getProducts = async (
  setProducts,

  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');

  axios
    .get(
      `${baseUrl}viewproduct`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].product;
      // setProducts(dataObj);
      if (userType == 'ADM') {
        setProducts(dataObj);
        // var slicedData = dataObj.slice(trimStart, trimEnd);
        // setData(slicedData);
      }
      if (userType == 'branch') {
        let dataObjProducts = dataObj.filter(item => item.branch_id == userID);

        setProducts(dataObjProducts);
        // var slicedData = dataObjProducts.slice(trimStart, trimEnd);
        // setData(slicedData);
      }
    })
    .catch(error => {
      if (error.response.status != undefined) {
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
        } else {
          alert('Something Went Wrong...');
        }
      } else {
        alert('Something Went Wrong...');
      }
    });
};
const getBranch = async (
  setBranches,

  refreshToken,
) => {
  let userToken;
  let userType;
  userToken = await AsyncStorage.getItem('token');
  userType = await AsyncStorage.getItem('type');
  console.log(userToken);
  axios
    .get(
      `${baseUrl}viewbranch`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].branch;
      // var slicedData = dataObj.slice(trimStart, trimEnd);
      setBranches(dataObj);
      // setData(slicedData);
    })
    .catch(error => {
      if (error.response.status != undefined) {
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
        } else {
          alert('Something Went Wrong...');
        }
      } else {
        alert('Something Went Wrong...');
      }
    });
};

const getOrders = async (
  setOrders,

  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');
  console.log(userToken);
  console.log("hi")

  axios
    .get(
      `${baseUrl}vieworders`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].orderdata;
      console.log("vieworder")
      console.log(dataObj)
     

      setOrders(dataObj);
      // if (userType == 'ADM') {
      //   setOrders(dataObj);
      //   // var slicedData = dataObj.slice(trimStart, trimEnd);
      //   // setData(slicedData);
      // }
      // if (userType == 'branch') {
      //   let dataObjOrders = dataObj.filter(item => item.branch_id == userID);

      //   setOrders(dataObjOrders);
      //   // var slicedData = dataObj.slice(trimStart, trimEnd);
      //   // setData(slicedData);
      // }
    })
    .catch(error => {
      console.log(error)
      // if (error.response.status != undefined) {
      //   if (error.response.status == 401) {
      //     const clearAll = async () => {
      //       try {
      //         await AsyncStorage.clear();

      //         refreshToken({token: null});
      //       } catch (e) {
      //         refreshToken({token: null});
      //         alert(e);
      //       }
      //     };

      //     clearAll();
      //   } else {
      //     alert('Something Went Wrong...');
      //   }
      // } else {
      //   alert('Something Went Wrong...');
      // }
    });
};

const getGuestOrders = async (
  setOrders,

  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');

  axios
    .get(
      `${baseUrl}viewguestsellorders`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].orderdata;
      setOrders(dataObj);
      // if (userType == 'ADM') {
      //   setOrders(dataObj);
      //   // var slicedData = dataObj.slice(trimStart, trimEnd);
      //   // setData(slicedData);
      // }
      // if (userType == 'branch') {
      //   let dataObjOrders = dataObj.filter(item => item.branch_id == userID);

      //   setOrders(dataObjOrders);
      //   // var slicedData = dataObj.slice(trimStart, trimEnd);
      //   // setData(slicedData);
      // }
    })
    .catch(error => {
      if (error.response.status != undefined) {
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
        } else {
          alert('Something Went Wrong...');
        }
      } else {
        alert('Something Went Wrong...');
      }
    });
};
const getCounterOrders = async (
  setOrders,

  refreshToken,
) => {
  let userToken = await AsyncStorage.getItem('token');
  let userType = await AsyncStorage.getItem('type');
  let userID = await AsyncStorage.getItem('ID');
  console.log(userToken);
  console.log("hii")
  axios
    .get(
      `${baseUrl}viewcounterorders`,

      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    )
    .then(res => {
      let dataObj = res.data[0].orderedproduct;
      console.log(dataObj);
      setOrders(dataObj);
      // if (userType == 'ADM') {
      //   setOrders(dataObj);
      //   // var slicedData = dataObj.slice(trimStart, trimEnd);
      //   // setData(slicedData);
      // }
      // if (userType == 'branch') {
      //   let dataObjOrders = dataObj.filter(item => item.branch_id == userID);

      //   setOrders(dataObjOrders);
      //   // var slicedData = dataObj.slice(trimStart, trimEnd);
      //   // setData(slicedData);
      // }
    })
    .catch(error => {
      console.log(error)
      
      if (error.response.status != undefined) {
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
        } else {
          alert('Something Went Wrong...');
        }
      } else {
        alert('Something Went Wrong...');
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
