import { Google } from "react-bootstrap-icons";
import CustomButton from "../../components/input/customButton";
import CustomInput from "../../components/input/CustomInput";
import CustomLabel from "../../components/input/CustomLabel";
import Divider from "../../components/util/Divider";

export default function SignIn() {
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
        <form action="" className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <CustomLabel forItem="email" label="Email" />
            <CustomInput placeholder="me@example.com" type="text" id="email" />
          </div>
          <div className="flex flex-col">
            <CustomLabel forItem="password" label="Password" />
            <CustomInput type="password" id="password" />
          </div>
          <CustomButton label={"Sign In"} onClick={null} />
        </form>
        <Divider label="or" />
        {/* OAuth */}
        <div className="flex flex-col">
          <CustomButton label={`Sign with Google`} />
        </div>
      </div>
    </div>
  );
}
