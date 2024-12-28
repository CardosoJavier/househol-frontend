import logo from "../../assets/imgs/logo.png";

export default function Logo({ size }: { size: number }) {
  return <img src={logo} alt="logo" width={size} height={size}></img>;
}
