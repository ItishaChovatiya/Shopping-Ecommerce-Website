import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (url, data) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await fetch(apiUrl + url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' })
      },
      body: isFormData ? data : JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: "Network error or invalid JSON" };
  }
};


export const getData = async (url) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json',
            }
            }
        const { data } = await axios.get(apiUrl + url,params);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const putData = async (url, data) => {
 try {
  const isFormData = data instanceof FormData;

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  const response = await fetch(apiUrl + url, {
    method: 'PUT',
    headers,
    body: isFormData ? data : JSON.stringify(data),
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  return json;
} catch (error) {
  console.error("API Error:", error);
  return { success: false, message: "Network error or invalid JSON" };
}

};

export const DeleteData = async (url, body = {}) => {
  try {
    const params = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json',
      },
      data: body, 
    };
    const { data } = await axios.delete(apiUrl + url, params);
    return data;
  } catch (error) {
    console.log(error);
    return error.response?.data || { success: false, message: "API error" };
  }
};

export const deleteMultipleData = async (url, body) => {
  try {
    const { data } = await axios.delete(apiUrl + url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json',
      },
      data: body, 
    });
    return data;
  } catch (error) {
    console.error(error);
    return error.response?.data || { success: false, message: "API error" };
  }
};
