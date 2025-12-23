import { useState, useEffect, useRef } from "react";

interface BootScreenProps {
  onComplete: () => void;
  onSafeMode?: () => void;
}

export const BootScreen = ({ onComplete, onSafeMode }: BootScreenProps) => {
  const [lines, setLines] = useState<{ text: string; type: "command" | "output" | "success" | "warn" | "error" | "system" }[]>([]);
  const [showSafeModePrompt, setShowSafeModePrompt] = useState(true);
  const [safeModeCountdown, setSafeModeCountdown] = useState(3);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [flickerOpacity, setFlickerOpacity] = useState(1);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Boot sequence - mix of cryptic + technical
  const bootSequence = [
    { text: "> start pcu_res_res.s", type: "command" as const, delay: 200 },
    { text: "No usr detected. Supply=DC Freq=1/s Stbl=yes.", type: "output" as const, delay: 150 },
    { text: "Ready to receive.", type: "success" as const, delay: 100 },
    { text: "", type: "output" as const, delay: 50 },
    { text: "> port 21", type: "command" as const, delay: 200 },
    { text: "Port 21 is currently closed.", type: "warn" as const, delay: 150 },
    { text: "> port 80", type: "command" as const, delay: 200 },
    { text: "Port 80 [OK] - HTTP ready", type: "success" as const, delay: 100 },
    { text: "> port 443", type: "command" as const, delay: 200 },
    { text: "Port 443 [OK] - HTTPS ready", type: "success" as const, delay: 100 },
    { text: "", type: "output" as const, delay: 50 },
    { text: "> init hadal_core", type: "command" as const, delay: 300 },
    { text: "Urbanshade Hadal Blacksite BIOS v3.7.2-HADAL", type: "system" as const, delay: 150 },
    { text: "Copyright (C) 2025 Urbanshade Corporation", type: "output" as const, delay: 100 },
    { text: "", type: "output" as const, delay: 50 },
    { text: "> load_modules --all", type: "command" as const, delay: 250 },
    { text: "  * containment_core.ko [OK]", type: "success" as const, delay: 120 },
    { text: "  * pressure_monitor.ko [OK]", type: "success" as const, delay: 100 },
    { text: "  * specimen_tracking.ko [OK]", type: "success" as const, delay: 150 },
    { text: "  * emergency_protocols.ko [OK]", type: "success" as const, delay: 100 },
    { text: "  * life_support.ko [OK]", type: "success" as const, delay: 120 },
    { text: "", type: "output" as const, delay: 50 },
    { text: "> chk_hardware", type: "command" as const, delay: 200 },
    { text: "CPU: HPU-8000 @ 8 cores [OK]", type: "success" as const, delay: 100 },
    { text: "RAM: 64GB ECC DDR5 @ 8247m [OK]", type: "success" as const, delay: 150 },
    { text: "STOR: 2TB NVMe RAID-10 [OK]", type: "success" as const, delay: 120 },
    { text: "HULL: 24/24 sensors online [OK]", type: "success" as const, delay: 100 },
    { text: "", type: "output" as const, delay: 50 },
    { text: "> svc --start-all", type: "command" as const, delay: 200 },
    { text: "[ OK ] systemd-udevd.service", type: "success" as const, delay: 80 },
    { text: "[ OK ] network.service", type: "success" as const, delay: 100 },
    { text: "[ OK ] containment.service", type: "success" as const, delay: 90 },
    { text: "[WARN] pressure-zone4.service - elevated readings", type: "warn" as const, delay: 150 },
    { text: "[ OK ] life-support.service", type: "success" as const, delay: 80 },
    { text: "[WARN] specimen-z13.service - increased activity", type: "warn" as const, delay: 200 },
    { text: "[FAIL] terminal-t07.service - connection timeout", type: "error" as const, delay: 150 },
    { text: "[ OK ] auth.service", type: "success" as const, delay: 80 },
    { text: "", type: "output" as const, delay: 50 },
    { text: "> env_status", type: "command" as const, delay: 200 },
    { text: "Depth: 8,247m [NOMINAL]", type: "output" as const, delay: 100 },
    { text: "Pressure: 8,247 PSI [STABLE]", type: "output" as const, delay: 100 },
    { text: "Hull: 98.7% [ACCEPTABLE]", type: "output" as const, delay: 100 },
    { text: "O2: 21% | Temp: 4.1°C [OPTIMAL]", type: "success" as const, delay: 100 },
    { text: "", type: "output" as const, delay: 50 },
    { text: "> start urbanshade_desktop --version 2.9", type: "command" as const, delay: 300 },
    { text: "Loading display manager...", type: "output" as const, delay: 200 },
    { text: "Urbanshade Desktop Environment v2.9 starting...", type: "system" as const, delay: 300 },
  ];

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Random flicker effect
  useEffect(() => {
    const flicker = () => {
      if (Math.random() < 0.1) {
        setFlickerOpacity(0.7 + Math.random() * 0.3);
        setTimeout(() => setFlickerOpacity(1), 50 + Math.random() * 100);
      }
    };
    const interval = setInterval(flicker, 200);
    return () => clearInterval(interval);
  }, []);

  // Safe mode countdown
  useEffect(() => {
    if (!showSafeModePrompt) return;
    
    const interval = setInterval(() => {
      setSafeModeCountdown(prev => {
        if (prev <= 1) {
          setShowSafeModePrompt(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F8' && showSafeModePrompt) {
        setShowSafeModePrompt(false);
        onSafeMode?.();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showSafeModePrompt, onSafeMode]);

  // Boot sequence runner
  useEffect(() => {
    if (showSafeModePrompt) return;

    let currentIndex = 0;
    
    const showNextLine = () => {
      if (currentIndex < bootSequence.length) {
        const item = bootSequence[currentIndex];
        setLines(prev => [...prev, { text: item.text, type: item.type }]);
        currentIndex++;
        
        // Auto-scroll
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
        
        setTimeout(showNextLine, item.delay);
      } else {
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    };

    showNextLine();
  }, [onComplete, showSafeModePrompt]);

  const getLineColor = (type: string) => {
    switch (type) {
      case "command": return "text-[#33ff33]";
      case "success": return "text-[#33ff33]";
      case "warn": return "text-[#ffcc00]";
      case "error": return "text-[#ff3333]";
      case "system": return "text-[#33ff33] font-bold";
      default: return "text-[#33ff33]/70";
    }
  };

  if (showSafeModePrompt) {
    return (
      <div className="fixed inset-0 bg-black font-mono flex items-center justify-center overflow-hidden">
        {/* CRT effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Scanlines */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)'
            }}
          />
          {/* Vignette */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
            }}
          />
        </div>

        <div className="text-center space-y-4 z-10">
          <div className="text-[#33ff33] text-2xl font-bold animate-pulse tracking-widest">
            URBANSHADE OS
          </div>
          <div className="text-[#33ff33]/80 text-sm">
            Press <kbd className="px-3 py-1 bg-[#33ff33]/20 rounded text-[#33ff33] font-bold border border-[#33ff33]/40">F8</kbd> for Safe Mode
          </div>
          <div className="text-[#33ff33]/50 text-xs">
            Booting normally in {safeModeCountdown}...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black font-mono overflow-hidden"
      style={{ opacity: flickerOpacity }}
    >
      {/* CRT effects layer */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Scanlines */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)'
          }}
        />
        {/* Horizontal scan bar */}
        <div 
          className="absolute left-0 right-0 h-[2px] bg-[#33ff33]/20 animate-scan"
          style={{
            animation: 'scan 8s linear infinite'
          }}
        />
        {/* Vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)'
          }}
        />
        {/* Screen curvature effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.8) 100%)'
          }}
        />
      </div>

      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="h-full p-6 overflow-y-auto text-xs leading-relaxed z-0"
        style={{
          textShadow: '0 0 5px rgba(51, 255, 51, 0.5), 0 0 10px rgba(51, 255, 51, 0.3)'
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={`${getLineColor(line.type)} ${line.text === "" ? "h-3" : ""}`}
          >
            {line.text}
          </div>
        ))}
        
        {/* Blinking cursor */}
        <span 
          className="text-[#33ff33] inline-block"
          style={{ 
            opacity: cursorVisible ? 1 : 0,
            textShadow: '0 0 5px rgba(51, 255, 51, 0.8)'
          }}
        >
          ▌
        </span>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#33ff33]/20 bg-black/80 z-20">
        <div className="flex items-center justify-between text-[10px] text-[#33ff33]/60">
          <span>URBANSHADE HADAL BLACKSITE</span>
          <span>DEPTH: 8,247m | HULL: 98.7%</span>
          <span className="font-mono">{new Date().toISOString()}</span>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};