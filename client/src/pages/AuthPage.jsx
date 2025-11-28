import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext.jsx";

// All required fields for backend
const initialState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "farmer",
  region: "",
  farmingType: "",
};

const GRASS_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB-WhLhXWyTQAygmNmlve80_OkPEQQYK8W_htMjPjEO-W85o9eF_IaH9oARo_P0HlFYcMhlGIOycvd3hpGzLld982WwZqhDMEYNr1U_oDBrwTIZV-5V2cWSrimZWgiY9zxDhHZA9DxxCGdJERwetXsiw9F7br9EYx8ssmCD1PsWj5udOtOdnBJVuYjMZM_W8-Ec9_f2RHQRtiQIvYjN9J8DsYnBUz0kNhN2zRYC_T3_TkYwfN7gh1m92fvYfYCePH6QxWMf-7CmhFRj";

const AuthPage = () => {
  const { axios, navigate, setUser } = useAppContext();
  const [state, setState] = useState("login");
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const updateField = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return false;
    }
    if (
      state === "register" &&
      (!form.name ||
        !form.phone ||
        !form.role ||
        !form.region ||
        !form.farmingType)
    ) {
      toast.error("All registration fields are required");
      return false;
    }
    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (state === "login") {
        const { data } = await axios.post("/api/auth/login", {
          email: form.email,
          password: form.password,
        });
        if (data.success) {
          setUser(data.user);
          navigate("/dashboard");
          toast.success("Login Successful");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        const { data } = await axios.post("/api/auth/register", form);
        if (data.success) {
          setUser(data.user);
          navigate("/dashboard");
          toast.success("Registration Successful");
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f7f8f7]">
      {/* Leftside grass for login only */}
      {state === "login" && (
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
          <div
            className="absolute inset-0 w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url('${GRASS_IMAGE}')` }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Right-side card */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-0 md:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10 m-8 transition-all duration-200">
          {/* Branding */}
          <div className="flex items-center gap-3 mb-10 justify-center">
            <div className="h-7 w-7 text-[#27b171]">
              <svg fill="currentColor" viewBox="0 0 48 48">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-wide text-[#27b171]">
              KrishiSathi
            </h2>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              {state === "login"
                ? "Welcome Back"
                : "Get Started with KrishiSathi"}
            </h1>
            <p className="text-[#707070]">
              {state === "login"
                ? "Login to your KrishiSathi account"
                : "Create your account and join the farmers community."}
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex rounded-full bg-gray-100 overflow-hidden mb-7">
            <button
              type="button"
              onClick={() => setState("login")}
              className={`w-1/2 py-2 font-semibold transition duration-150 ${
                state === "login"
                  ? "bg-[#27b171] text-white"
                  : "text-[#27b171] hover:bg-green-50"
              }`}>
              Login
            </button>
            <button
              type="button"
              onClick={() => setState("register")}
              className={`w-1/2 py-2 font-semibold transition duration-150 ${
                state === "register"
                  ? "bg-[#27b171] text-white"
                  : "text-[#27b171] hover:bg-green-50"
              }`}>
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
            {state === "register" && (
              <>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  autoComplete="name"
                  value={form.name}
                  onChange={updateField}
                  className="form-input w-full rounded-lg border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                />
                <input
                  name="phone"
                  type="text"
                  placeholder="Phone Number"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={updateField}
                  className="form-input w-full rounded-lg border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                />
                <select
                  name="role"
                  value={form.role}
                  onChange={updateField}
                  className="form-select w-full rounded-lg border border-gray-300 bg-gray-50 h-12 px-4 text-base">
                  <option value="farmer">Farmer</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  name="region"
                  type="text"
                  placeholder="Region"
                  value={form.region}
                  onChange={updateField}
                  className="form-input w-full rounded-lg border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                />
                <input
                  name="farmingType"
                  type="text"
                  placeholder="Farming Type"
                  value={form.farmingType}
                  onChange={updateField}
                  className="form-input w-full rounded-lg border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                />
              </>
            )}

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              value={form.email}
              onChange={updateField}
              className="form-input w-full rounded-lg border border-gray-300 bg-gray-50 h-12 px-4 text-base"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete={
                state === "login" ? "current-password" : "new-password"
              }
              value={form.password}
              onChange={updateField}
              className="form-input w-full rounded-lg border border-gray-300 bg-gray-50 h-12 px-4 text-base"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#27b171] hover:bg-[#23975f] text-white font-bold text-lg shadow-lg transition duration-200 disabled:opacity-50">
              {loading
                ? "Processing..."
                : state === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          {/* Divider and Google Button */}
          {state === "login" && (
            <>
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-4 text-sm text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              <button className="flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white h-14 text-base font-medium transition-colors hover:bg-gray-100 w-full">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M22.5777 12.2715C22.5777 11.4163 22.5085 10.5843 22.3783 9.77539H12V14.502H18.0427C17.7699 15.9319 17.0212 17.1652 15.9056 17.9252V20.742H19.7579C21.5993 19.0827 22.5777 16.0352 22.5777 12.2715Z"
                    fill="#4285F4"></path>
                  <path
                    d="M12 23C14.9439 23 17.4796 22.0124 19.2548 20.742L15.9056 17.9252C14.9515 18.5869 13.5857 18.9996 12 18.9996C9.07345 18.9996 6.5989 17.0212 5.6262 14.2495H1.76812V17.1412C3.55591 20.5912 7.47295 23 12 23Z"
                    fill="#34A853"></path>
                  <path
                    d="M5.62622 14.2495C5.41103 13.623 5.28821 12.9556 5.28821 12.2747C5.28821 11.5939 5.41103 10.9265 5.62622 10.3L1.76814 7.40816C0.957545 9.04898 0.5 10.8931 0.5 12.2747C0.5 13.6564 0.957545 15.5005 1.76814 17.1413L5.62622 14.2495Z"
                    fill="#FBBC05"></path>
                  <path
                    d="M12 5.5498C13.7201 5.5498 15.1134 6.16665 16.229 7.229L19.3204 4.23725C17.4727 2.48825 14.937 1 12 1C7.47295 1 3.55591 3.40875 1.76812 6.85875L5.6262 9.7505C6.5989 6.97875 9.07345 5.5498 12 5.5498Z"
                    fill="#EA4335"></path>
                </svg>
                <span>Login with Google</span>
              </button>
            </>
          )}

          {/* Switch link */}
          <p className="mt-8 text-center text-base text-gray-500">
            {state === "login" ? (
              <>
                Don&apos;t have an account?
                <button
                  type="button"
                  onClick={() => setState("register")}
                  className="font-bold text-[#27b171] hover:underline ml-1">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button
                  type="button"
                  onClick={() => setState("login")}
                  className="font-bold text-[#27b171] hover:underline ml-1">
                  Log In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
