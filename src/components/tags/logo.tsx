export default function Logo({ size = 120 }: { size: number }) {
  return (
    <div className="flex items-center justify-center flex-shrink-0 w-36 h-12 max-h-12 max-w-36">
      <img
        src="/logo.png"
        alt="NeverShip Logo"
        width={size}
        height={size}
        className="object-contain max-w-full max-h-full"
        loading="eager"
      />
    </div>
  );
}
