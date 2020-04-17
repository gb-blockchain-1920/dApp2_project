const address = "https://35.193.103.180:3000/";

const getToken = () => {
  const token = window.sessionStorage.getItem("jwt");
  return token;
};

const postHeader = () => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  };
};

const maxAttempts = 3;

const fetchLoop = async (endpoint, info = {}) => {
  let res;
  for (let i = 0; i < maxAttempts; i++) {
    res = await fetch(endpoint, info);
    if (res.status === 200) {
      break;
    }
    await new Promise(r => setTimeout(r, 1000)); //delay
  }
  return res;
};

export const getCompanies = async () => {
  const res = await fetchLoop(address);
  const data = await res.json();
  return data;
};

export const getUser = async (postType, params) => {
  params.postType = postType;
  const res = await fetchLoop(address + "login", {
    method: "POST",
    headers: postHeader(),
    body: JSON.stringify(params)
  });
  console.log(res);

  if (postType === "login") {
    const output = await res.json();
    return output;
  } else {
    return res.status === 200;
  }
};

export const getAircraft = async id => {
  try {
    const res = await fetchLoop(address + `aircraft?id=${id}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getPart = async id => {
  try {
    const res = await fetchLoop(address + `part?id=${id}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getMaintainers = async () => {
  try {
    const res = await fetchLoop(address + "admin", {
      method: "GET",
      headers: postHeader()
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const callAPI = async (endpoint, method, data) => {
  try {
    const res = await fetchLoop(address + endpoint, {
      method,
      headers: postHeader(),
      body: JSON.stringify(data)
    });
    return res.status === 200;
  } catch (e) {
    console.log(e);
  }
};

export default getCompanies;
