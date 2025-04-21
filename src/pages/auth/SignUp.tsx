import { NavLink, useNavigate } from "react-router";
import CustomButton from "../../components/input/customButton";
import CustomInput from "../../components/input/CustomInput";
import CustomLabel from "../../components/input/CustomLabel";
import { SignUpType } from "../../models/auth/SignUp";
import { ChangeEvent, useState } from "react";
import { createClient } from "../../utils/supabase/component";
import { AuthError } from "@supabase/supabase-js";

export default function SignUp() {
  const supabase = createClient();
  const navigate = useNavigate();
  const [error, setError] = useState<AuthError | null>(null);
  const [formData, setFormData] = useState<SignUpType>({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function signUp() {
    let email = formData.email;
    let password = formData.password;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: formData.name,
          last_name: formData.lastName,
        },
      },
    });
    if (error) {
      setError(error);
      console.error(error);
    } else {
      navigate("/auth/verify-email");
    }
  }

  function handleSumit(e: React.FormEvent) {
    // prevent reload
    e.preventDefault();

    // sign user
    signUp();
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
          <CustomButton label={"Sign In"} type="submit" />
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
