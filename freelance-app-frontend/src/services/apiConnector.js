import axiosInstance from "../utils/axios";

export const apiConnector = async (method, url, data = {}, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const { headers: customHeaders = {}, ...restOptions } = options;

    const headers = {
      ...customHeaders,
      ...(token && !customHeaders.Authorization
        ? { Authorization: `Bearer ${token}` }
        : {}),
    };

    const config = {
      method,
      url,
      data,
      withCredentials: true,
      headers,
      ...restOptions,
    };

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
