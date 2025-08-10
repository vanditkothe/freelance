// Detect backend base URL based on environment
const BASE_URL = import.meta.env.PROD
  ? 'https://your-backend-deployed-url.com'  // <-- REPLACE with your deployed backend URL
  : 'http://localhost:5001';

export const AUTH_API = {
  REGISTER_API: `${BASE_URL}/api/auth/register`,
  VERIFY_OTP_API: `${BASE_URL}/api/auth/verify-otp`,
  LOGIN_API: `${BASE_URL}/api/auth/login`,
};

export const GIG_API = {
  CREATE_GIG: `${BASE_URL}/gigs`,
  GET_ALL_GIGS: `${BASE_URL}/gigs`,
  GET_MY_GIGS: `${BASE_URL}/gigs/my-gigs`,
  GET_GIG_BY_ID: (id) => `${BASE_URL}/gigs/${id}`,
  UPDATE_GIG: (id) => `${BASE_URL}/gigs/${id}`,
  DELETE_GIG: (id) => `${BASE_URL}/gigs/${id}`,
  SEARCH_BY_CATEGORY: `${BASE_URL}/gigs/search`,
};

export const UPLOAD_API = {
  UPLOAD_IMAGES: `${BASE_URL}/upload`,
  DELETE_IMAGE: (publicId) => `${BASE_URL}/upload?public_id=${publicId}`,
};

export const ORDER_API = {
  CREATE_ORDER: `${BASE_URL}/orders`,
  GET_MY_ORDERS: `${BASE_URL}/orders/my-orders`,
  GET_SELLER_ORDERS: `${BASE_URL}/orders/seller-orders`,
  UPDATE_ORDER_STATUS: (id) => `${BASE_URL}/orders/${id}`,
};

export const PAYMENT_API = {
  CREATE_ORDER: `${BASE_URL}/payment/create-order`,
  WEBHOOK: `${BASE_URL}/payment/webhook`,
};

export const CHAT_API = {
  CREATE_MESSAGE: `${BASE_URL}/chat/message`,
  GET_MESSAGES: (conversationId) => `${BASE_URL}/chat/messages/${conversationId}`,
  GET_CONVERSATIONS: (userId) => `${BASE_URL}/chat/conversations/${userId}`,
  CREATE_CONVERSATION: `${BASE_URL}/chat/conversation`,
};

export const REVIEW_API = {
  CREATE_REVIEW: `${BASE_URL}/reviews`,
  GET_REVIEWS_FOR_GIG: `${BASE_URL}/reviews/gig`,
};

export const SAVED_GIGS_API = {
  SAVE_GIG: (gigId) => `${BASE_URL}/saved-gigs/save/${gigId}`,
  REMOVE_GIG: (gigId) => `${BASE_URL}/saved-gigs/save/${gigId}`,
  GET_SAVED_GIGS: `${BASE_URL}/saved-gigs`,
};
