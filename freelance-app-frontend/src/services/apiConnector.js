import axiosInstance from "../utils/axios";

export const apiConnector = async (method, url, data = {}, options = {}) => {
  try {
    const config = {
      method,
      url,
      data,
      ...options,
    };

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
