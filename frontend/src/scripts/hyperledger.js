const address = "https://35.193.103.180:3000/";

const getToken = () => {
  const token = window.sessionStorage.getItem("jwt");
  return token;
};

const postHeader = () => {
  return {
    "Content-Type" : "application/json",
    "Authorization": `Bearer ${getToken()}`
  }
}

export const getCompanies = async () => {
  const res = await fetch(address);
  const data = await res.json();
  return data;
};

export const getUser = async (postType, params) => {
  params.postType = postType;
  const res = await fetch(address + "login", {
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
  const res = await fetch(address + `aircraft?id=${id}`);
  const data = await res.json();
  return data;
};

export const getPart = async id => {
  const res = await fetch(address + `part?id=${id}`);
  const data = await res.json();
  return data;
};

export const updateHours = async (tailNumber, hours) => {
  const data = { tailNumber, hours };
  await fetch(address+'flight', {
    method: "POST",
    headers: postHeader(),
    body: JSON.stringify(data)
  })
};

export default getCompanies;
