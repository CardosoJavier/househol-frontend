import { ChangeEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthError } from "@supabase/supabase-js";
import { CustomButton, CustomInput, CustomLabel } from "../../components";
import { SignUpType } from "../../models";
import { signUp } from "../../api";

export default function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);
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
    // prevent reload
    e.preventDefault();

    setLoading(true);
    // sign user
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
      setError(signUpError);
    } else {
      navigate("/auth/verify-email");
    }
  }

  return (
    <div className="flex flex-col gap-4 h-screen justify-center items-center">
      <div className="flex flex-col gap-5 outline outline-secondary p-5 rounded-md min-w-80 max-w-96">
        {/* Header */}
        <div>
          <h1 className="text-accent font-bold text-2xl">Create Account</h1>
          <p className="text-gray-500 text-sm">
            Sign up to start organizing your life
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSumit} className="flex flex-col gap-3">
          {/* name */}
          <div className="flex flex-col gap-1">
            <CustomLabel forItem="name" label="Name" />
            <CustomInput
              placeholder="John"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          {/* last name */}
          <div className="flex flex-col gap-1">
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
          {/* email */}
          <div className="flex flex-col gap-1">
            <CustomLabel forItem="email" label="Email" />
            <CustomInput
              placeholder="me@example.com"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          {/* password */}
          <div className="flex flex-col">
            <CustomLabel forItem="password" label="Password" />
            <CustomInput
              placeholder="password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          {/* Sign up btn */}
          <CustomButton label={"Sign In"} type="submit" loading={loading} />
        </form>

        {/* Sign In Redirect */}
        <div className="flex flex-row gap-2 justify-center">
          <p className="text-gray-500 text-sm">Already have an account? </p>
          <NavLink to={"/auth/login"}>
            <p className="text-accent text-sm font-semibold">Sign In</p>
          </NavLink>
        </div>
      </div>
      {error && (
        <div>
          <p className="text-red-500">{error.message}</p>
        </div>
      )}
    </div>
  );
}
