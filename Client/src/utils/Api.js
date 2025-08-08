import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (url, data) => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        let json = {};
        const text = await response.text();
        try {
            json = text ? JSON.parse(text) : {};
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            return { success: false, message: "Invalid JSON response from server" };
        }

        return response.ok
            ? json
            : { success: false, message: json?.message || "Request failed", ...json };

    } catch (error) {
        console.error("Network error:", error);
        return { success: false, message: "Network error" };
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
        const { data } = await axios.get(apiUrl + url, params);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const putData = async (url, data, isFormData = false) => {
  try {
    const token = localStorage.getItem("accessToken");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await axios.put(apiUrl + url, data, { headers });

    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Request failed",
      ...error.response?.data,
    };
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

