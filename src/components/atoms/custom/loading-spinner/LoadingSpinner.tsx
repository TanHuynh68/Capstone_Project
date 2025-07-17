interface LoadingSpinnerProps {
  fixed?: boolean;
}

export default function LoadingSpinner({ fixed = false }: LoadingSpinnerProps) {
  return (
    <div
      className={`z-50 fade-in fade-out flex items-center justify-center bg-black/40 backdrop-blur-[2px]
    ${fixed ? "fixed inset-0" : "min-h-screen"}
  `}
    >
      <img
        src="/images/animation_logo.gif"
        alt="Loading..."
        className="w-full max-w-xs object-contain"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
