export default function Logo({ size }: { size: number }) {
  return (
    <img
      src="/logo.png"
      alt="NeverShio Logo"
      width={size}
      height={size}
      className="object-contain"
    ></img>
  );
}
