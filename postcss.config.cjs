module.exports = {
  plugins: [
    require('@tailwindcss/postcss'), // Thay vì require('tailwindcss')
    require('autoprefixer') // Đảm bảo autoprefixer được cài đặt nếu cần
  ]
};
