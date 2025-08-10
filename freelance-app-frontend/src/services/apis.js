const BASE_URL = import.meta.env.PROD
  ? 'https://freelance-zglx.onrender.com'  // your deployed backend URL
  : 'http://localhost:5001';

export const AUTH_API = {
  REGISTER_API: `${BASE_URL}/api/auth/register`,
  VERIFY_OTP_API: `${BASE_URL}/api/auth/verify-otp`,
  LOGIN_API: `${BASE_URL}/api/auth/login`,
};

export const GIG_API = {
  CREATE_GIG: `${BASE_URL}/api/gigs`,
  GET_ALL_GIGS: `${BASE_URL}/api/gigs`,
  GET_MY_GIGS: `${BASE_URL}/api/gigs/my-gigs`,
  GET_GIG_BY_ID: (id) => `${BASE_URL}/api/gigs/${id}`,
  UPDATE_GIG: (id) => `${BASE_URL}/api/gigs/${id}`,
  DELETE_GIG: (id) => `${BASE_URL}/api/gigs/${id}`,
  SEARCH_BY_CATEGORY: `${BASE_URL}/api/gigs/search`,
};

export const UPLOAD_API = {
  UPLOAD_IMAGES: `${BASE_URL}/api/upload`,
  DELETE_IMAGE: (publicId) => `${BASE_URL}/api/upload?public_id=${publicId}`,
};

export const ORDER_API = {
  CREATE_ORDER: `${BASE_URL}/api/orders`,
  GET_MY_ORDERS: `${BASE_URL}/api/orders/my-orders`,
  GET_SELLER_ORDERS: `${BASE_URL}/api/orders/seller-orders`,
  UPDATE_ORDER_STATUS: (id) => `${BASE_URL}/api/orders/${id}`,
};

export const PAYMENT_API = {
  CREATE_ORDER: `${BASE_URL}/api/payment/create-order`,
  WEBHOOK: `${BASE_URL}/api/payment/webhook`,
};

export const CHAT_API = {
  CREATE_MESSAGE: `${BASE_URL}/api/chat/message`,
  GET_MESSAGES: (conversationId) => `${BASE_URL}/api/chat/messages/${conversationId}`,
  GET_CONVERSATIONS: (userId) => `${BASE_URL}/api/chat/conversations/${userId}`,
  CREATE_CONVERSATION: `${BASE_URL}/api/chat/conversation`,
};

export const REVIEW_API = {
  CREATE_REVIEW: `${BASE_URL}/api/reviews`,
  GET_REVIEWS_FOR_GIG: `${BASE_URL}/api/reviews/gig`,
};

export const SAVED_GIGS_API = {
  SAVE_GIG: (gigId) => `${BASE_URL}/api/saved-gigs/save/${gigId}`,
  REMOVE_GIG: (gigId) => `${BASE_URL}/api/saved-gigs/save/${gigId}`,
  GET_SAVED_GIGS: `${BASE_URL}/api/saved-gigs`,
};
