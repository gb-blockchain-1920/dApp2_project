const address = "https://35.193.103.180:3000/";

export const getCompanies = async () => {
  const res = await fetch(address, {
    method: "GET"
  });
  const data = await res.json();
  return data;
};

export const user = async (postType, params) => {
  params.postType = postType;
  const res = await fetch(address + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });
  console.log(res);
  return res.status === 200;
};

export default getCompanies;
