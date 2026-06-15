import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      // LOGIN
      if (isLogin) {
        response = await axios.post("http://localhost:8000/api/login/", {
          email: form.email,
          password: form.password,
          role: role
        });
      }

      // SIGNUP
      else {
        if (form.password !== form.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        response = await axios.post("http://localhost:8000/api/signup/", {
          name: form.name,
          email: form.email,
          password: form.password,
          role: role,

           // extra fields
          dept: form.dept,
          register_number: form.registerNumber
        });
      }

      console.log("Response:", response.data);

      // Store token (important for backend auth later)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Role-based navigation
      if (role === "student") {
        navigate("/student-dashboard");
      } else if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/admin-dashboard");
      }

    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Authentication failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full grid md:grid-cols-2">

        {/* LEFT SECTION */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">
            CareerGuide AI
          </h1>

          <h2 className="text-2xl font-semibold mb-4">
            Smart Student Prediction System
          </h2>

          <p className="text-md opacity-90">
            AI-powered platform for student performance prediction,
            career guidance, and academic analytics.
          </p>

          <div className="mt-10">
            <img
              src="https://illustrations.popsy.co/violet/studying.svg"
              alt="learning"
              className="w-full max-w-md"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="p-10 flex flex-col justify-center">

          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            {isLogin ? "Login" : "Create Account"}
          </h2>

          {/* ROLE SELECTION */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {["student", "teacher", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-3 rounded-lg font-medium transition ${
                  role === r
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            )}

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            {!isLogin && (
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            )}


            {/* DEPT for student + teacher */}
    {(role === "student" || role === "teacher") && (
      <input
        name="dept"
        placeholder="Department (e.g. CSE, IT)"
        onChange={handleChange}
        className="w-full border rounded-xl p-3"
      />
    )}

    {/* Register Number ONLY for student */}
    {role === "student" && (
      <input
        name="registerNumber"
        placeholder="Register Number"
        onChange={handleChange}
        className="w-full border rounded-xl p-3"
      />
    )}
  

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
            >
              {isLogin
                ? `${role.toUpperCase()} LOGIN`
                : `${role.toUpperCase()} SIGN UP`}
            </button>
          </form>

          {/* SWITCH LOGIN/SIGNUP */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 font-medium hover:underline"
              type="button"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </div>

          {/* CURRENT ROLE DISPLAY */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Selected Role:{" "}
            <span className="font-bold text-purple-600 capitalize">
              {role}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}