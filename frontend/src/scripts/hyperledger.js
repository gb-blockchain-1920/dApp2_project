const address = "https://35.193.103.180:3000/";

export const getCompanies = async () => {
  const res = await fetch(address);
  const data = await res.json();
  return data;
};

export const getUser = async (postType, params) => {
  params.postType = postType;
  const res = await fetch(address + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
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

export default getCompanies;
