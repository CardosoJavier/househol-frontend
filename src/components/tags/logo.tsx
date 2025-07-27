export default function Logo({ size }: { size: number }) {
  return (
    <div className="flex items-center justify-center flex-shrink-0 w-36 h-12 max-h-12 max-w-36">
      <img
        src="/logo.png"
        alt="NeverShip Logo"
        width={size ?? 120}
        height={size ?? 120}
        className="object-contain max-h-12 max-w-36"
        loading="eager"
      />
    </div>
  );
}
