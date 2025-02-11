import { NavLink } from "react-router";
import CustomButton from "../../components/input/customButton";
import CustomInput from "../../components/input/CustomInput";
import CustomLabel from "../../components/input/CustomLabel";
import { ChangeEvent, FormEvent, useState } from "react";
import { SignUpType } from "../../api/auth/authType.type";
import { signUp } from "../../api/auth/authRequests";

export default function SignUp() {
  const [formData, setFormData] = useState<SignUpType>({
    name: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSumit(e: React.FormEvent) {
    // prevent reload
    e.preventDefault();

    // sign user
    signUp(formData);
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex flex-col gap-5 outline outline-secondary p-5 rounded-md">
        {/* Header */}
        <div>
          <h1 className="text-accent font-bold text-2xl">Login</h1>
          <p className="text-gray-500 text-sm">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSumit} className="flex flex-col gap-3">
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
          <div className="flex flex-col">
            <CustomLabel forItem="password" label="Password" />
            <CustomInput
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col">
            <CustomLabel forItem="role" label="Role" />
            <select
              name="role"
              onChange={handleInputChange}
              className="bg-transparent border-2 rounded-md px-3 py-2 focus:outline-accent"
            >
              <option value={""}>Select role</option>
              <option value={"HEAD"}>House Head</option>
              <option value={"MEMBER"}>House Member</option>
            </select>
          </div>

          <CustomButton label={"Sign In"} type="submit" />
        </form>

        {/* Sign In Redirect */}
        <div className="flex flex-row gap-2 justify-center">
          <p className="text-gray-500 text-sm">Already have an account? </p>
          <NavLink to={"/auth/sign-in"}>
            <p className="text-accent text-sm font-semibold">Sign In</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
