import { NavLink } from "react-router";
import CustomButton from "../../components/input/customButton";
import CustomInput from "../../components/input/CustomInput";
import CustomLabel from "../../components/input/CustomLabel";
import Divider from "../../components/util/Divider";
import { ChangeEvent, FormEvent, useState } from "react";
import { signIn } from "../../api/auth/authRequests";
import { SignInType } from "../../models/auth/authType";

export default function SignIn() {
  const [signInData, setSignInData] = useState<SignInType>({
    email: "",
    password: "",
  });

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setSignInData({ ...signInData, [name]: value });
  }

  function handleSublit(e: FormEvent) {
    e.preventDefault();
    signIn(signInData);
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="flex flex-col gap-5 outline outline-secondary p-5 rounded-md">
        {/* Header */}
        <div>
          <h1 className="text-accent font-bold text-2xl">Login</h1>
          <p className="text-gray-500 text-sm">
            Enter your email below to login to your account
          </p>
        </div>
        {/* Sign In Form */}
        <form onSubmit={handleSublit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <CustomLabel forItem="email" label="Email" />
            <CustomInput
              placeholder="me@example.com"
              name="email"
              type="text"
              id="email"
              value={signInData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <CustomLabel forItem="password" label="Password" />
            <CustomInput
              name="password"
              type="password"
              id="password"
              placeholder="password"
              onChange={handleInputChange}
            />
          </div>
          <CustomButton label={"Sign In"} onClick={null} type="submit" />
        </form>
        <Divider label="or" />
        {/* OAuth */}
        <div className="flex flex-col">
          <CustomButton label={`Sign with Google`} />
        </div>
        {/* Messages */}
        <div></div>

        {/* Sign In Redirect */}
        <div className="flex flex-row gap-2 justify-center">
          <p className="text-gray-500 text-sm">Don't have an account? </p>
          <NavLink to={"/auth/sign-up"}>
            <p className="text-accent text-sm font-semibold">Sign Up</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
