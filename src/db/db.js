import axios from 'axios';

const API_URL = "https://paradox-shop.ru/api";

export function getXPadding() {
    return "1.5rem";
}


export function getUser() {
    const db_user = axios.get(`${API_URL}/profile/`, {
        // headers: {
        //     'Authorization': `${initData}`
        // }
    }).then(r => {
        return r.data;
    })
    return db_user;
}

export async function sendOrder(product_id, additionalData = {}) {
  const response = await axios.post(`${API_URL}/products/${product_id}/purchase`, {
    product_id: product_id,
    additional_data: additionalData
  },
  {
  headers: {
    'Content-Type': 'application/json'
  }
  });
  return response.data;
}

export async function searchProducts(searchTerm) {
  try {
    const response = await axios.get(`${API_URL}/products/search`, {
      params: { search: searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};


export async function getGamesAPI() {
  const response = await axios.get(`${API_URL}/games/`);
  console.log(response.data);
  return response.data;
}


export async function makePayment(amount, method, initData) {
  const response = await axios.post(`${API_URL}/payment/`, {
    params: {
      amount: amount,
      method: method
    },
    headers: {
      'Authorization': initData
    }
  });
  return response.data;
}


export async function getOrders() {
  try {
    const response = await axios.get(`${API_URL}/profile/orders/`, {
      // headers: {
      //   'Authorization': initData
      // }
    });
    if (response.data === null || response.data === undefined) {
      return [];
    }
    return response.data;
  } catch (error) {
    return [];
  }
}


export async function getOneOrder(order_id) {
  const response = await axios.get(`${API_URL}/profile/orders/${order_id}`, {
    params: {
      order_id: order_id
    }
  });
  console.log(response.data)
  return response.data;
}


export async function getTransactions() {
  try {
    const response = await axios.get(`${API_URL}/profile/transactions/`, {
      // headers: {
      //   'Authorization': initData
      // }
    });
    if (response.data === null || response.data === undefined) {
      return [];
    }
    console.log(response.data)
    return response.data;
  } catch (error) {
    return [];
  }
}


export async function getOneTransaction(transaction_id) {
  const response = await axios.get(`${API_URL}/profile/transactions/${transaction_id}`, {
    params: {
      transaction_id: transaction_id
    }
  });
  console.log("transaction", response.data)
  return response.data;
}


export async function PromoAPI(name) {
  const response = await axios.post(`${API_URL}/promo/`, {
    name: name
  }, {
    // headers: {
    //   'Authorization': initData
    // }
  });
  console.log("PromoAPI", response.data)
  return response.data;
}


export async function getPromo(name) {
  try {
    const response = await axios.get(`${API_URL}/promo/`, {
      params: {
        name: name
      }
    });
    if (response.data === null || response.data === undefined) {
      return null;
    }
    console.log(response.data);
    return response.data;
  } catch (error) {
    return null;
  }
}


export async function checkIsUsedPromo(name) {
  try {
    const response = await axios.get(`${API_URL}/promo/check-used`, {
      params: {
        name: name
      },
    });
    if (response.status === 200) {
      return false;
    }
    return true;
  } catch (error) {
    return true;
  }
}


export async function getReferralCode(initData) {
  const response = await axios.get(`${API_URL}/referral/get_code/`, {
    headers: {
      'Authorization': initData
    }
  });
  return response.data;
}


export async function checkCodeAvailability(referral_code) {
  try {
    const response = await axios.get(`${API_URL}/referral/check_code_availability/`, {
      params: {
        referral_code: referral_code
      }
    });
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export async function setReferralCode(referral_code) {
  const response = await axios.post(`${API_URL}/referral/set_code/`, {
    referral_code: referral_code
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
}


export async function postFeedback(product_id, stars, text) {
  const response = await axios.post(`${API_URL}/feedback/post/`, {
    params: {
      product: {id: product_id},
      stars: stars,
      text: text
    },
    // headers: {
    //   'Authorization': initData
    // }
  });
  return response.data;
}


export async function getFeedbacks() {
  const response = await axios.get(`${API_URL}/feedback/`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  console.log(response.data)
  return response.data;
}


export async function getOneFeedback(feedback_id) {
  const response = await axios.get(`${API_URL}/feedback/${feedback_id}`);
  return response.data;
}


export async function removeFeedback(feedback_id, initData) {
  const response = await axios.get(`${API_URL}/feedback/remove/${feedback_id}`, {
    headers: {
      'Authorization': initData
    }
  });
  return response.data;
}


export async function getProducts(sort, game_id) {
  const response = await axios.get(`${API_URL}/products/`, {
    params: {
      sort: sort,
      game_id: game_id
    }
  });
  return response.data;
}


export async function getOneProduct(product_id) {
  const response = await axios.get(`${API_URL}/products/${product_id}`, {
    params: {
      product_id: product_id
    }
  });
  return response.data;
}

export async function isUserPostedFeedback(product_id) {
  try {
    const response = await axios.get(`${API_URL}/feedback/is_user_posted_feedback/${product_id}`, {
      params: {
      product_id: product_id
    },
    headers: {
      'Content-Type': 'application/json'
      }
    });
    if (response.data) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}


export async function getGame(game_id) {
  try {
    const response = await axios.get(`${API_URL}/games/${game_id}`, {
      params: {
      game_id: game_id
    }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return <div>Game not found</div>;
    }
  }
}


export async function makeDeposit(amount, method) {
  try {
    const response = await axios.post(`${API_URL}/payment/`, {
      amount: amount,
      method: method
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error making deposit:', error);
    throw error;
  }
}