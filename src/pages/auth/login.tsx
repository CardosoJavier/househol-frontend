import { NavLink, useNavigate } from "react-router";
import CustomButton from "../../components/input/customButton";
import CustomInput from "../../components/input/CustomInput";
import CustomLabel from "../../components/input/CustomLabel";
import Divider from "../../components/util/Divider";
import { FormEvent, useState } from "react";
import { createClient } from "../../utils/supabase/component";
import { AuthError } from "@supabase/supabase-js";

export default function SignIn() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AuthError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function logIn() {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);
      if (error) {
        if (error.message === "Email not confirmed") {
          navigate("/auth/verify-email");
        }
        setError(error);
      }

      if (data.session && data.user) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleSublit(e: FormEvent) {
    e.preventDefault();
    logIn();
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4">
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
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="flex flex-col">
            <CustomLabel forItem="password" label="Password" />
            <CustomInput
              name="password"
              type="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <CustomButton
            label={"Sign In"}
            onClick={null}
            type="submit"
            loading={loading}
          />
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
      {error && <p>{error.message}</p>}
    </div>
  );
}
