import { ChangeEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  CustomButton,
  CustomInput,
  CustomLabel,
  showToast,
} from "../../components";
import Logo from "../../components/tags/logo";
import { SignUpType } from "../../models";
import { signUp } from "../../api";
import { authSignUpSchema } from "../../schemas";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
  handleError,
} from "../../constants";
import { sanitizeInput } from "../../utils";

export default function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignUpType>({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSumit(e: React.FormEvent) {
    e.preventDefault();

    // Validate form with zod
    const result = sanitizeInput(authSignUpSchema, formData);
    if (!result.success) {
      showToast(result.error, "error");
      return;
    }

    setLoading(true);
    const signUpError = await signUp({
      userInfo: {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      },
    });
    setLoading(false);

    if (signUpError) {
      const errorMessage = handleError(
        signUpError,
        GENERIC_ERROR_MESSAGES.AUTH_SIGNUP_FAILED
      );
      showToast(errorMessage, "error");
    } else {
      showToast(GENERIC_SUCCESS_MESSAGES.AUTH_SIGNUP_SUCCESS, "success");
      navigate("/auth/verify-email");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size={120} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">
            Join us to start organizing your projects and tasks
          </p>
        </div>

        {/* Sign Up Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleSumit} className="space-y-6">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <CustomLabel forItem="name" label="First Name" />
                <CustomInput
                  placeholder="John"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <CustomLabel forItem="lastName" label="Last Name" />
                <CustomInput
                  placeholder="Smith"
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <CustomLabel forItem="email" label="Email Address" />
              <CustomInput
                placeholder="you@example.com"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <CustomLabel forItem="password" label="Password" />
              <CustomInput
                placeholder="Create a strong password"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Password should be at least 8 characters long
              </p>
            </div>

            {/* Sign Up Button */}
            <div className="pt-2">
              <CustomButton 
                label={"Create Account"} 
                type="submit" 
                loading={loading}
                textSize="base"
              />
            </div>
          </form>
        </div>

        {/* Sign In Redirect */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <NavLink 
              to={"/auth/login"} 
              className="text-gray-900 font-semibold hover:text-gray-700 transition-colors"
            >
              Sign In
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
