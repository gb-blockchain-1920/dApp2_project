const address = "https://35.193.103.180:3000/";

export const getCompanies = async () => {
  const res = await fetch(address, {
    method: "GET"
  });
  const data = await res.json();
  return data;
};

export const registerUser = async params => {
  const res = await fetch(address + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });
  const data = await res.json();
  return data;
};

export default getCompanies;
