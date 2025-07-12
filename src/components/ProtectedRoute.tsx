import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Thay thế logic này bằng cách kiểm tra xác thực của bạn
  const isAuthenticated = localStorage.getItem('authToken'); // Ví dụ: kiểm tra token

  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, chuyển hướng đến trang sign-in
    return <Navigate to="/signin" />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return children;
};

export default ProtectedRoute;