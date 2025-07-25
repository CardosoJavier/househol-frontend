import { FormEvent, useState } from "react";
import { NavLink } from "react-router";
import { CustomInput, CustomLabel, CustomButton } from "../../components";
import { useAuth } from "../../context";
import landingImage from "../../assets/imgs/landing.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { logIn, isFetching } = useAuth();

  function handleSublit(e: FormEvent) {
    e.preventDefault();
    logIn(email, password);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Image Section */}
      <div className="hidden lg:flex lg:w-1/2">
        <div className="bg-gradient-to-br from-purple-50 to-violet-100 w-full p-8 flex flex-col">
          {/* Top Section - Text Content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Streamline Your Project Management
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Househol empowers teams to organize tasks, track progress, and
                collaborate seamlessly. Build better workflows with intuitive
                project boards and real-time updates.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>— Your productivity, reimagined</span>
              </div>
            </div>
          </div>

          {/* Bottom Right - Image */}
          <div className="flex justify-end">
            <div className="w-80 h-64 rounded-xl overflow-hidden shadow-lg">
              <img
                src={landingImage}
                alt="Househol Dashboard"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-4">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <p className="text-gray-500 text-sm">© Househol 2025</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-accent mb-2">
                Welcome back
              </h2>
              <p className="text-gray-500 text-sm">
                Please enter your details.
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSublit} className="space-y-4">
              {/* Email */}
              <div>
                <CustomLabel forItem="email" label="Email" />
                <CustomInput
                  placeholder="Enter your email"
                  name="email"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              {/* Password */}
              <div>
                <CustomLabel forItem="password" label="Password" />
                <CustomInput
                  name="password"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              {/* Sign In Button */}
              <div className="mt-6">
                <CustomButton
                  type="submit"
                  isDisabled={isFetching}
                  loading={isFetching}
                  label={isFetching ? "Signing in..." : "Sign in"}
                  textSize="base"
                />
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Don't have an account?{" "}
                <NavLink
                  to="/auth/sign-up"
                  className="text-accent font-medium hover:text-gray-500"
                >
                  Sign up
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
