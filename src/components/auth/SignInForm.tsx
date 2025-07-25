import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Cookie, Eye, EyeOff } from "lucide-react"; // Sử dụng icon từ lucide-react

// Giả sử các component này được import đúng
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  // --- 1. Thêm các state cần thiết ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook để chuyển hướng

  // --- 2. Hàm xử lý khi submit form ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Ngăn trình duyệt tải lại trang
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Nếu API trả về lỗi (ví dụ: 401, 404), throw error
        throw new Error(data.message || "Something went wrong!");
      }
      console.log(data);
      // --- 3. Lưu token và chuyển hướng khi thành công ---
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = "username=" + username + "; path=/; max-age=36000";
      navigate("/document-management"); // Chuyển đến trang document management
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Dừng trạng thái loading dù thành công hay thất bại
    }
  };
  useEffect(() => {
    const isCheckedCookie = getCookie("isChecked");
    if (isCheckedCookie) {
      setIsChecked(isCheckedCookie === "true");
    }
  });
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            {/* Các nút đăng nhập với Google/X giữ nguyên */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              {/* ... button Google ... */}
              {/* ... button X ... */}
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm"></div>
            </div>

            {/* --- 4. Gắn hàm handleSubmit vào sự kiện onSubmit của form --- */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  {/* --- 5. Đổi Email thành Username --- */}
                  <Label>
                    Username <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <Eye className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeOff className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between"></div>

                {/* --- 6. Hiển thị thông báo lỗi nếu có --- */}
                {error && (
                  <p className="text-sm text-center text-error-500">{error}</p>
                )}

                <div>
                  {/* --- 7. Cập nhật trạng thái của Button --- */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
