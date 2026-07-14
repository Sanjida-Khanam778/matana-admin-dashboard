import { useState } from "react";
import loginImg from "../../assets/images/login.png";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { useLoginMutation } from "../../Api/authApi";
import { setCredentials } from "../../features/authSlice";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res));
      toast.success("Login successful!");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      toast.error(error.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex font-nunito">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#F7F5F0]">
        <div className="w-full max-w-sm">
          {/* Ober Logo */}
          <div className="mb-12 flex justify-center">
            <div className="flex items-center justify-center">
              <img src={'/logo.png'} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Your Email
              </label>
              <input
                type="email"
                placeholder="Example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 Character"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-black" />
                  ) : (
                    <Eye className="h-5 w-5 text-black" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <CgSpinner className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>{" "}
        </div>
      </div>
      {/* Right side - Hero Image */}
      <div className="hidden lg:flex w-1/2 bg-primary">
        <img src={loginImg} alt="A1c Boost" className="my-auto w-full" />
      </div>
    </div>
  );
};

export default SignIn;
