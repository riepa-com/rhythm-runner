import { useState } from "react";
import { AlertTriangle, Terminal as TerminalIcon, Power, RefreshCw, Shield, Bug, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { systemBus } from "@/lib/systemBus";

interface AdminPanelProps {
  onExit: () => void;
  onChaos?: () => void;
  onCrash?: (crashType: string) => void;
  onCustomCrash?: (title: string, message: string, type: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload") => void;
}

export const AdminPanel = ({ onExit, onChaos, onCrash, onCustomCrash }: AdminPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  
  const [glitchMode, setGlitchMode] = useState(false);
  const [rainbowMode, setRainbowMode] = useState(false);
  const [funMode, setFunMode] = useState(false);
  
  // Custom crash builder
  const [customCrashType, setCustomCrashType] = useState<"kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload">("kernel");
  const [customCrashTitle, setCustomCrashTitle] = useState("CUSTOM SYSTEM ERROR");
  const [customCrashMessage, setCustomCrashMessage] = useState("This is a custom crash message.\nYou can write anything here.\n\nMultiple lines supported!");

  const correctPassword = "HereIsThePassword";

  const handleAuth = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setAuthError(false);
      toast.success("Authentication successful");
    } else {
      setAuthError(true);
      toast.error("Invalid password");
    }
  };

  // Auth screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-8 font-mono">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
            <div className="text-primary font-bold text-xl mb-2">ADMIN AUTHENTICATION</div>
            <div className="text-xs text-muted-foreground">Level 5 clearance required</div>
          </div>

          <div className="border border-primary/30 bg-primary/5 p-6 space-y-4">
            <div>
              <label className="text-xs text-primary mb-2 block">ADMIN PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                placeholder="Enter password..."
                className={`w-full bg-black border ${authError ? "border-red-500" : "border-primary/30"} px-4 py-3 text-primary focus:outline-none focus:border-primary`}
                autoFocus
              />
              {authError && (
                <div className="text-red-500 text-xs mt-2">Access denied. Invalid credentials.</div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAuth}
                className="flex-1 bg-primary text-black hover:bg-primary/90"
              >
                AUTHENTICATE
              </Button>
              <Button
                onClick={onExit}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                EXIT
              </Button>
            </div>

            <div className="text-[10px] text-muted-foreground text-center pt-4 border-t border-primary/20">
              Hint: Check the HTML source or docs for the password
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleGlitchMode = () => {
    setGlitchMode(!glitchMode);
    toast.success(glitchMode ? "Glitch mode disabled" : "Glitch mode enabled");
    if (!glitchMode) {
      document.body.classList.add("animate-pulse");
    } else {
      document.body.classList.remove("animate-pulse");
    }
  };

  const handleRainbowMode = () => {
    setRainbowMode(!rainbowMode);
    toast.success(rainbowMode ? "Rainbow mode disabled" : "🌈 RAINBOW MODE ACTIVATED");
  };

  const handleSpawnIcons = () => {
    toast.success("Spawning random icons everywhere!");
    onChaos?.();
  };

  const handleFunMode = () => {
    setFunMode(!funMode);
    toast.success(funMode ? "Fun mode disabled" : "🎉 FUN MODE ACTIVATED!");
    if (!funMode) {
      document.body.style.transform = "rotate(0.5deg)";
    } else {
      document.body.style.transform = "";
    }
  };

  const handleSecretFunction = () => {
    toast.success("🔓 ADMIN ACCESS CONFIRMED", {
      description: "Full system privileges enabled",
      duration: 5000,
    });
  };

  const handleFlashScreen = () => {
    document.body.style.background = "#fff";
    setTimeout(() => {
      document.body.style.background = "";
    }, 100);
    toast.success("⚡ Flash bang!");
  };

  const handleGlitchText = () => {
    const elements = document.querySelectorAll('div, p, span, button');
    elements.forEach(el => {
      if (el.textContent && Math.random() > 0.7) {
        const original = el.textContent;
        el.textContent = original.split('').map(c => Math.random() > 0.5 ? String.fromCharCode(Math.random() * 93 + 33) : c).join('');
        setTimeout(() => {
          el.textContent = original;
        }, 2000);
      }
    });
    toast.success("📝 Text corruption initiated");
  };

  const handleZoomMode = () => {
    const current = document.body.style.zoom;
    if (current === "1.5") {
      document.body.style.zoom = "1";
      toast.success("🔍 Zoom reset");
    } else {
      document.body.style.zoom = "1.5";
      toast.success("🔍 Zoomed in!");
    }
  };

  const handleGrayscale = () => {
    const current = document.body.style.filter;
    if (current.includes("grayscale")) {
      document.body.style.filter = current.replace("grayscale(1)", "");
      toast.success("🎨 Colors restored");
    } else {
      document.body.style.filter = (current || "") + " grayscale(1)";
      toast.success("⚫ Grayscale enabled");
    }
  };

  const handleBlur = () => {
    const current = document.body.style.filter;
    if (current.includes("blur")) {
      document.body.style.filter = current.replace(/blur\([^)]*\)/g, "");
      toast.success("👁️ Focus restored");
    } else {
      document.body.style.filter = (current || "") + " blur(3px)";
      toast.success("🌫️ Blur effect applied");
    }
  };

  const handlePixelate = () => {
    document.body.style.imageRendering = document.body.style.imageRendering === "pixelated" ? "" : "pixelated";
    toast.success("🎮 Retro mode toggled");
  };

  const handleNuke = () => {
    toast.error("🚨 INITIATING SYSTEM PURGE...", {
      description: "Just kidding! But imagine if this actually worked...",
    });
  };

  const handleMatrixMode = () => {
    toast.success("Entering the Matrix... 01010101");
    document.body.style.fontFamily = "monospace";
    setTimeout(() => {
      document.body.style.fontFamily = "";
    }, 5000);
  };

  const handleShakeScreen = () => {
    toast.success("🎢 Hold on tight!");
    document.body.style.animation = "shake 0.5s";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 500);
  };

  const handleInvertColors = () => {
    toast.success("Inverting reality...");
    document.body.style.filter = document.body.style.filter === "invert(1)" ? "" : "invert(1)";
  };

  const handleRotateScreen = () => {
    const current = document.body.style.transform;
    if (current.includes("rotate")) {
      document.body.style.transform = "";
      toast.success("Back to normal... or is it?");
    } else {
      document.body.style.transform = "rotate(180deg)";
      toast.success("🙃 Everything is upside down now!");
    }
  };

  const handleSlowMotion = () => {
    toast.success("⏱️ Entering slow motion mode...");
    document.body.style.transition = "all 2s ease";
    setTimeout(() => {
      document.body.style.transition = "";
    }, 5000);
  };

  const handleKonamiCode = () => {
    toast.success("🎮 KONAMI CODE ACTIVATED!", {
      description: "You are now a true gamer!",
      duration: 5000,
    });
    document.body.classList.add("animate-bounce");
    setTimeout(() => {
      document.body.classList.remove("animate-bounce");
    }, 3000);
  };

  const handleRandomChaos = () => {
    const chaosActions = [
      handleShakeScreen,
      handleMatrixMode,
      handleGlitchMode,
      handleRainbowMode,
    ];
    const randomAction = chaosActions[Math.floor(Math.random() * chaosActions.length)];
    randomAction();
    toast.error("🎲 Random chaos initiated!");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-8 font-mono">
      {/* Easter egg comment - password visible in HTML */}
      {/* ADMIN_PASSWORD: HereIsThePassword */}
      <div 
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
          glitchMode ? "animate-pulse" : ""
        }`}
        style={rainbowMode ? {
          background: "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
          backgroundSize: "400% 400%",
          animation: "gradient 3s ease infinite"
        } : undefined}
        data-admin-password="HereIsThePassword"
      >
        {/* Header */}
        <div className="mb-6">
          <pre className="text-primary text-sm mb-4">
{`███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
 █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗
██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║
███████║██║  ██║██╔████╔██║██║██╔██╗ ██║
██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║
██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║
╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝`}
          </pre>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-primary font-bold text-lg">ADMINISTRATOR CONTROL PANEL</div>
              <div className="text-xs text-yellow-500">⚠ LEVEL 5 CLEARANCE - UNRESTRICTED ACCESS</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onExit}
              className="border-primary text-primary hover:bg-primary hover:text-black"
            >
              [ EXIT ]
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="border border-primary/30 bg-primary/5 p-4">
            <p className="text-sm text-primary">
              <span className="text-yellow-500">[SYSTEM]</span> Administrator access granted. Full system control enabled.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Status: OPERATIONAL | User: ROOT | Clearance: MAXIMUM
            </p>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visual Effects */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-wider border-b border-yellow-500/30 pb-1">
                Visual Effects
              </h3>
              <div className="space-y-1.5">
                <Button
                  onClick={handleGlitchMode}
                  variant="outline"
                  className={`w-full justify-start text-xs h-8 ${glitchMode ? "bg-primary/20 border-primary" : "border-primary/30"}`}
                  size="sm"
                >
                  {glitchMode ? "■" : "□"} Glitch Mode
                </Button>
                <Button
                  onClick={handleRainbowMode}
                  variant="outline"
                  className={`w-full justify-start text-xs h-8 ${rainbowMode ? "bg-primary/20 border-primary" : "border-primary/30"}`}
                  size="sm"
                >
                  {rainbowMode ? "■" : "□"} Rainbow Mode
                </Button>
                <Button
                  onClick={handleMatrixMode}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Matrix Mode
                </Button>
                <Button
                  onClick={handleInvertColors}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Invert Colors
                </Button>
                <Button
                  onClick={handleGrayscale}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Grayscale
                </Button>
                <Button
                  onClick={handleBlur}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Blur Effect
                </Button>
                <Button
                  onClick={handlePixelate}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Pixelate
                </Button>
              </div>
            </div>

            {/* System Modifications */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-wider border-b border-yellow-500/30 pb-1">
                System Modifications
              </h3>
              <div className="space-y-1.5">
                <Button
                  onClick={handleFunMode}
                  variant="outline"
                  className={`w-full justify-start text-xs h-8 ${funMode ? "bg-primary/20 border-primary" : "border-primary/30"}`}
                  size="sm"
                >
                  {funMode ? "■" : "□"} Tilt Mode
                </Button>
                <Button
                  onClick={handleRotateScreen}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Rotate 180°
                </Button>
                <Button
                  onClick={handleZoomMode}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Zoom 1.5x
                </Button>
                <Button
                  onClick={handleShakeScreen}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Shake Screen
                </Button>
                <Button
                  onClick={handleSlowMotion}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Slow Motion
                </Button>
                <Button
                  onClick={handleFlashScreen}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Flash Bang
                </Button>
                <Button
                  onClick={handleGlitchText}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Corrupt Text
                </Button>
              </div>
            </div>

            {/* Security Controls */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider border-b border-red-500/30 pb-1">
                Security Controls
              </h3>
              <div className="space-y-1.5">
                <Button
                  onClick={() => {
                    const current = localStorage.getItem('bios_security_enabled') !== 'false';
                    localStorage.setItem('bios_security_enabled', String(!current));
                    systemBus.emit("CUSTOM_COMMAND", { command: "security_toggle", enabled: !current });
                    toast.success(!current ? "✓ Security Enabled" : "⚠ Security DISABLED", {
                      description: !current ? "All security features restored" : "System is now vulnerable"
                    });
                  }}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-yellow-500/50 text-yellow-500"
                  size="sm"
                >
                  □ Toggle System Security
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem('urbanshade_admin');
                    localStorage.removeItem('urbanshade_accounts');
                    systemBus.emit("CUSTOM_COMMAND", { command: "auth_disable" });
                    toast.warning("🔓 Authentication Disabled");
                  }}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-red-500/50 text-red-500"
                  size="sm"
                >
                  □ Disable Authentication
                </Button>
                <Button
                  onClick={() => {
                    localStorage.setItem('bios_password', '');
                    systemBus.emit("CUSTOM_COMMAND", { command: "bios_password_clear" });
                    toast.success("BIOS password removed");
                  }}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-orange-500/50 text-orange-500"
                  size="sm"
                >
                  □ Clear BIOS Password
                </Button>
              </div>
            </div>

            {/* SystemBus Controls */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-wider border-b border-cyan-500/30 pb-1">
                SystemBus Controls
              </h3>
              <div className="space-y-1.5">
                <Button
                  onClick={() => {
                    systemBus.triggerReboot();
                    toast.info("Reboot signal sent via SystemBus");
                  }}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-cyan-500/50 text-cyan-400"
                  size="sm"
                >
                  <RefreshCw className="w-3 h-3 mr-2" /> Trigger Reboot
                </Button>
                <Button
                  onClick={() => {
                    systemBus.triggerShutdown();
                    toast.info("Shutdown signal sent via SystemBus");
                  }}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-cyan-500/50 text-cyan-400"
                  size="sm"
                >
                  <Power className="w-3 h-3 mr-2" /> Trigger Shutdown
                </Button>
                <Button
                  onClick={() => {
                    systemBus.enterRecovery();
                    toast.info("Recovery mode signal sent via SystemBus");
                  }}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-cyan-500/50 text-cyan-400"
                  size="sm"
                >
                  <Shield className="w-3 h-3 mr-2" /> Enter Recovery
                </Button>
                <Button
                  onClick={() => {
                    systemBus.openDevMode();
                    toast.info("DEF-DEV signal sent via SystemBus");
                  }}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-cyan-500/50 text-cyan-400"
                  size="sm"
                >
                  <Bug className="w-3 h-3 mr-2" /> Open DEF-DEV
                </Button>
              </div>
            </div>

            {/* Fun Actions */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-wider border-b border-yellow-500/30 pb-1">
                Actions
              </h3>
              <div className="space-y-1.5">
                <Button
                  onClick={handleSpawnIcons}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Spawn Icons
                </Button>
                <Button
                  onClick={handleSecretFunction}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Secret Function
                </Button>
                <Button
                  onClick={handleKonamiCode}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-primary/30"
                  size="sm"
                >
                  □ Konami Code
                </Button>
                <Button
                  onClick={handleRandomChaos}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-orange-500/50 text-orange-500"
                  size="sm"
                >
                  □ Random Chaos
                </Button>
                <Button
                  onClick={handleNuke}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-red-500/50 text-red-500"
                  size="sm"
                >
                  □ System Purge
                </Button>
                <Button
                  onClick={() => toast.info("Security bypassed", { description: "Just kidding!" })}
                  variant="outline"
                  className="w-full justify-start text-xs h-8 border-red-500/50 text-red-500"
                  size="sm"
                >
                  □ Bypass Security
                </Button>
              </div>
            </div>

            {/* Crash Triggers */}
            <div className="space-y-3 md:col-span-3">
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider border-b border-red-500/30 pb-1 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                System Crash Testing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Button
                  onClick={() => onCrash?.("kernel")}
                  variant="outline"
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10 text-xs h-8"
                  size="sm"
                >
                  Kernel Panic
                </Button>
                <Button
                  onClick={() => onCrash?.("bluescreen")}
                  variant="outline"
                  className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10 text-xs h-8"
                  size="sm"
                >
                  Blue Screen
                </Button>
                <Button
                  onClick={() => onCrash?.("memory")}
                  variant="outline"
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10 text-xs h-8"
                  size="sm"
                >
                  Memory Dump
                </Button>
                <Button
                  onClick={() => onCrash?.("corruption")}
                  variant="outline"
                  className="border-purple-500/50 text-purple-500 hover:bg-purple-500/10 text-xs h-8"
                  size="sm"
                >
                  Corruption
                </Button>
                <Button
                  onClick={() => onCrash?.("overload")}
                  variant="outline"
                  className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 text-xs h-8"
                  size="sm"
                >
                  Overload
                </Button>
                <Button
                  onClick={() => onCrash?.("virus")}
                  variant="outline"
                  className="border-green-500/50 text-green-500 hover:bg-green-500/10 text-xs h-8"
                  size="sm"
                >
                  Virus Attack
                </Button>
              </div>
            </div>

            {/* Custom Crash Builder */}
            <div className="space-y-3 md:col-span-3 p-4 border border-primary/30 bg-black/50">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                Custom Crash Builder
              </h3>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-yellow-500 mb-1 block uppercase tracking-wider">Crash Type</label>
                  <select
                    value={customCrashType}
                    onChange={(e) => setCustomCrashType(e.target.value as any)}
                    className="w-full bg-black border border-primary/30 px-3 py-1.5 text-xs text-primary"
                  >
                    <option value="kernel">Kernel Panic</option>
                    <option value="bluescreen">Blue Screen</option>
                    <option value="memory">Memory Dump</option>
                    <option value="corruption">Corruption</option>
                    <option value="overload">System Overload</option>
                    <option value="virus">Virus Attack (Glitch FX)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-yellow-500 mb-1 block uppercase tracking-wider">Crash Title</label>
                  <input
                    type="text"
                    value={customCrashTitle}
                    onChange={(e) => setCustomCrashTitle(e.target.value)}
                    className="w-full bg-black border border-primary/30 px-3 py-1.5 text-xs text-primary"
                    placeholder="Enter crash title..."
                    maxLength={100}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-yellow-500 mb-1 block uppercase tracking-wider">Crash Message</label>
                  <textarea
                    value={customCrashMessage}
                    onChange={(e) => setCustomCrashMessage(e.target.value)}
                    className="w-full bg-black border border-primary/30 px-3 py-2 text-xs resize-none"
                    placeholder="Enter custom crash message (multiline supported)..."
                    rows={4}
                    maxLength={1000}
                  />
                </div>

                <Button
                  onClick={() => {
                    onCustomCrash?.(customCrashTitle, customCrashMessage, customCrashType);
                    toast.success("Custom crash triggered!");
                  }}
                  variant="outline"
                  className="md:col-span-2 bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500 hover:text-black text-xs h-8"
                  size="sm"
                >
                  [ TRIGGER CUSTOM CRASH ]
                </Button>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-2 md:col-span-3">
              <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-wider border-b border-yellow-500/30 pb-1">
                System Information
              </h3>
              <div className="border border-primary/30 bg-black/50 p-3 space-y-1 text-xs">
                <p><span className="text-yellow-500">[STATUS]</span> <span className="text-primary">Level 5 Clearance Active</span></p>
                <p><span className="text-yellow-500">[ACCESS]</span> <span className="text-primary">Unrestricted Administrative Rights</span></p>
                <p><span className="text-yellow-500">[USER]</span> <span className="text-primary">ROOT@urbanshade.local</span></p>
                <p><span className="text-yellow-500">[TIME]</span> <span className="text-primary">{new Date().toISOString()}</span></p>
                <p className="text-muted-foreground pt-2 text-[10px]">
                  Console access granted via password authentication. HTML source inspection confirmed.
                </p>
              </div>
            </div>
          </div>

          {/* Console Commands Reference */}
          <div className="space-y-2 border-t border-primary/30 pt-4">
            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-2">
              <TerminalIcon className="w-3 h-3" />
              Terminal Command Reference
            </h3>
            <div className="bg-black/80 border border-primary/30 p-3 space-y-2 text-[10px]">
              <div className="text-muted-foreground mb-2">
                Available console commands for system control:
              </div>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-1">
                <div><span className="text-primary">admin [password]</span> <span className="text-muted-foreground">- Access admin panel</span></div>
                <div><span className="text-primary">crash [type]</span> <span className="text-muted-foreground">- Trigger crash simulation</span></div>
                <div><span className="text-primary">glitch</span> <span className="text-muted-foreground">- Enable glitch mode</span></div>
                <div><span className="text-primary">matrix</span> <span className="text-muted-foreground">- Activate Matrix mode</span></div>
                <div><span className="text-primary">chaos</span> <span className="text-muted-foreground">- Spawn random icons</span></div>
                <div><span className="text-primary">help</span> <span className="text-muted-foreground">- Display all commands</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-10px, 0); }
          20%, 40%, 60%, 80% { transform: translate(10px, 0); }
        }
      `}</style>
    </div>
  );
};
