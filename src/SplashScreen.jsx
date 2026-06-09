import { useEffect, useRef, useState } from "react";

const NUM_PETALS = 38;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function generatePetal(id) {
  return {
    id,
    x: randomBetween(-5, 105),           // vw %
    delay: randomBetween(0, 7),           // s
    duration: randomBetween(5, 10),       // s
    size: randomBetween(18, 42),          // px
    rotateStart: randomBetween(0, 360),
    rotateEnd: randomBetween(360, 1080),
    swayAmp: randomBetween(60, 140),      // px horizontal sway
    swayFreq: randomBetween(0.4, 1.1),
    opacity: randomBetween(0.55, 0.95),
    hue: randomBetween(-15, 15),          // slight hue variation
    scaleX: randomBetween(0.7, 1.0),      // flatten to look like petal angle
  };
}

// SVG petal shape — realistic rose petal silhouette
const PetalSVG = ({ size, hue, scaleX, style }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 60 80"
    style={{
      filter: `drop-shadow(0 4px 12px rgba(180,30,80,0.35)) hue-rotate(${hue}deg)`,
      transform: `scaleX(${scaleX})`,
      ...style,
    }}
  >
    <defs>
      <radialGradient id={`pg${hue.toFixed(0)}`} cx="45%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#ffe4ef" />
        <stop offset="35%" stopColor="#f9a8c9" />
        <stop offset="70%" stopColor="#e8528a" />
        <stop offset="100%" stopColor="#b5245e" />
      </radialGradient>
      <filter id="petalBlur">
        <feGaussianBlur stdDeviation="0.5" />
      </filter>
    </defs>
    {/* Main petal body */}
    <path
      d="M30 75 C10 60 2 42 5 25 C8 10 20 2 30 4 C40 2 52 10 55 25 C58 42 50 60 30 75Z"
      fill={`url(#pg${hue.toFixed(0)})`}
    />
    {/* Center vein */}
    <path
      d="M30 72 C30 55 30 35 30 8"
      stroke="rgba(220,100,150,0.4)"
      strokeWidth="1"
      fill="none"
    />
    {/* Side veins */}
    <path
      d="M30 55 C22 48 12 44 8 38"
      stroke="rgba(220,100,150,0.25)"
      strokeWidth="0.8"
      fill="none"
    />
    <path
      d="M30 55 C38 48 48 44 52 38"
      stroke="rgba(220,100,150,0.25)"
      strokeWidth="0.8"
      fill="none"
    />
    {/* Highlight sheen */}
    <ellipse
      cx="22"
      cy="22"
      rx="9"
      ry="14"
      fill="rgba(255,255,255,0.18)"
      transform="rotate(-15 22 22)"
    />
  </svg>
);

export default function SplashScreen({ onComplete }) {
  const [petals] = useState(() => Array.from({ length: NUM_PETALS }, (_, i) => generatePetal(i)));
  const [visible, setVisible] = useState(true);
  const tickRef = useRef(null);
  const startRef = useRef(null);

  // Petal positions driven by rAF for silky 60fps
  const canvasRef = useRef(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    startRef.current = performance.now();
    const animate = () => {
      setTick(t => t + 1);
      tickRef.current = requestAnimationFrame(animate);
    };
    tickRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(tickRef.current);
  }, []);

  // Auto-dismiss after 3.8s
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 600);
    }, 3800);
    return () => clearTimeout(t);
  }, [onComplete]);

  const elapsed = startRef.current ? (performance.now() - startRef.current) / 1000 : 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        background: "linear-gradient(160deg, #1a0010 0%, #3d0024 30%, #7a1040 60%, #c4487a 85%, #f2a0c0 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
        cursor: "pointer",
      }}
      onClick={() => { setVisible(false); setTimeout(() => onComplete?.(), 600); }}
    >
      {/* Depth bokeh blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[
          { top: "8%", left: "15%", size: 220, opacity: 0.06 },
          { top: "60%", left: "70%", size: 300, opacity: 0.08 },
          { top: "40%", left: "5%", size: 180, opacity: 0.05 },
          { top: "75%", left: "30%", size: 260, opacity: 0.07 },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            top: b.top, left: b.left,
            width: b.size, height: b.size,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,180,210,1) 0%, transparent 70%)",
            opacity: b.opacity,
            filter: "blur(30px)",
          }} />
        ))}
      </div>

      {/* Falling petals */}
      {petals.map(p => {
        const t = Math.max(0, elapsed - p.delay);
        const progress = (t % p.duration) / p.duration;
        const y = progress * 115 - 10;  // -10vh to 115vh
        const sway = Math.sin(progress * Math.PI * 2 * p.swayFreq) * p.swayAmp;
        const rotate = p.rotateStart + progress * (p.rotateEnd - p.rotateStart);
        // Depth effect: petals behind logo have less opacity / smaller
        const depthLayer = p.id % 3; // 0=back, 1=mid, 2=front
        const depthScale = [0.55, 0.8, 1.1][depthLayer];
        const depthOpacity = [0.35, 0.65, p.opacity][depthLayer];
        const depthBlur = ["blur(2.5px)", "blur(0.8px)", "blur(0px)"][depthLayer];
        const depthZ = [1, 2, 3][depthLayer];

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `calc(${p.x}vw + ${sway}px)`,
              top: `${y}vh`,
              zIndex: depthZ,
              opacity: depthOpacity,
              transform: `rotate(${rotate}deg) scale(${depthScale})`,
              filter: depthBlur,
              willChange: "transform, top, left",
              pointerEvents: "none",
            }}
          >
            <PetalSVG size={p.size} hue={p.hue} scaleX={p.scaleX} />
          </div>
        );
      })}

      {/* Logo card — 3D lifted glass */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        animation: "logoRise 1s cubic-bezier(0.22,1,0.36,1) forwards",
      }}>
        {/* Glow halo */}
        <div style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,160,200,0.22) 0%, transparent 70%)",
          filter: "blur(20px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }} />

        {/* Glass card */}
        <div style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(18px) saturate(180%)",
          WebkitBackdropFilter: "blur(18px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 32,
          padding: "44px 52px 36px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          transform: "perspective(800px) rotateX(3deg)",
        }}>
          {/* Flower icon — 3D rose */}
          <div style={{ position: "relative", width: 100, height: 100 }}>
            <svg viewBox="0 0 100 100" width={100} height={100}>
              <defs>
                <radialGradient id="r1" cx="50%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#ffe0ef" />
                  <stop offset="50%" stopColor="#f06fa0" />
                  <stop offset="100%" stopColor="#8b1a4a" />
                </radialGradient>
                <radialGradient id="r2" cx="50%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#ffc8e0" />
                  <stop offset="60%" stopColor="#e0508a" />
                  <stop offset="100%" stopColor="#7a1038" />
                </radialGradient>
                <filter id="roseShadow">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#6a0030" floodOpacity="0.6" />
                </filter>
              </defs>
              {/* Outer petals */}
              {[0,51.4,102.8,154.2,205.7,257.1,308.5].map((angle, i) => (
                <ellipse
                  key={i}
                  cx={50 + 28 * Math.cos((angle * Math.PI) / 180)}
                  cy={50 + 28 * Math.sin((angle * Math.PI) / 180)}
                  rx={13} ry={20}
                  fill="url(#r1)"
                  transform={`rotate(${angle + 90} ${50 + 28 * Math.cos((angle * Math.PI) / 180)} ${50 + 28 * Math.sin((angle * Math.PI) / 180)})`}
                  opacity={0.85}
                  filter="url(#roseShadow)"
                />
              ))}
              {/* Mid petals */}
              {[25,97,169,241,313].map((angle, i) => (
                <ellipse
                  key={i}
                  cx={50 + 16 * Math.cos((angle * Math.PI) / 180)}
                  cy={50 + 16 * Math.sin((angle * Math.PI) / 180)}
                  rx={11} ry={17}
                  fill="url(#r2)"
                  transform={`rotate(${angle + 90} ${50 + 16 * Math.cos((angle * Math.PI) / 180)} ${50 + 16 * Math.sin((angle * Math.PI) / 180)})`}
                  opacity={0.9}
                />
              ))}
              {/* Center */}
              <circle cx="50" cy="50" r="14" fill="#f06fa0" />
              <circle cx="50" cy="50" r="9" fill="#d4437a" />
              <circle cx="46" cy="46" r="4" fill="rgba(255,220,235,0.5)" />
            </svg>
          </div>

          {/* Brand name */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "0.06em",
              background: "linear-gradient(135deg, #fff 0%, #ffd6ea 50%, #ffadd0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              lineHeight: 1.1,
              marginBottom: 4,
            }}>
              Pretty Petals
            </div>
            <div style={{
              fontFamily: "'Georgia', serif",
              fontSize: 12,
              letterSpacing: "0.28em",
              color: "rgba(255,200,225,0.7)",
              textTransform: "uppercase",
            }}>
              Floral Boutique
            </div>
          </div>
        </div>

        {/* Tap hint */}
        <div style={{
          color: "rgba(255,200,225,0.45)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "sans-serif",
          animation: "pulse 2s ease-in-out infinite",
          marginTop: 4,
        }}>
          Tap to enter
        </div>
      </div>

      <style>{`
        @keyframes logoRise {
          from { opacity: 0; transform: perspective(800px) rotateX(3deg) translateY(30px) scale(0.94); }
          to   { opacity: 1; transform: perspective(800px) rotateX(3deg) translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
