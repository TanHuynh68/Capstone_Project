const ENV = {
  PAYMENT_REDIRECT_URL: import.meta.env.VITE_PAYMENT_RETURN_URL,
  BASE_URL: import.meta.env.VITE_API_URL,
  GHN_URL: import.meta.env.VITE_GHN_URL,
  GHN_TOKEN: import.meta.env.VITE_GHN_TOKEN,
  GHN_SHOP_ID: import.meta.env.VITE_GHN_SHOP_ID,
  CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_NAME: import.meta.env.VITE_CLOUDINARY_NAME,
};


export default ENV;