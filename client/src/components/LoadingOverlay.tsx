import { useState, useEffect } from "react";

interface LoadingOverlayProps {
  visible: boolean;
  title: string;
  subtitle: string;
  duration: number;
  testId?: string;
}

export default function LoadingOverlay({ visible, title, subtitle, duration, testId = "loading-overlay" }: LoadingOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 50);

    document.body.style.overflow = "hidden";

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "auto";
    };
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #EC008C, #D10078)", minHeight: "100dvh" }}
      data-testid={testId}
    >
      <div className="w-[85%] max-w-[350px] text-center text-white">
        <div
          className="w-[55px] h-[55px] rounded-full mx-auto mb-4"
          style={{
            border: "4px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            animation: "loading-spin 1s linear infinite",
          }}
        />

        <h3 className="text-lg font-bold mb-1" data-testid="text-loading-title">
          {title}
        </h3>

        <p className="text-sm opacity-80 mb-4" data-testid="text-loading-subtitle">
          {subtitle}
        </p>

        <div className="w-full h-[6px] rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.3)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "#fff",
              transition: "width 0.3s",
            }}
            data-testid="loading-progress-bar"
          />
        </div>

        <span className="text-[13px] opacity-90" data-testid="text-loading-percent">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
