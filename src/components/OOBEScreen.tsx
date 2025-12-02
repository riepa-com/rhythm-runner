import { useState } from "react";
import { toast } from "sonner";

interface OOBEScreenProps {
  onComplete: () => void;
}

export const OOBEScreen = ({ onComplete }: OOBEScreenProps) => {
  const [step, setStep] = useState<"region" | "keyboard" | "network" | "account" | "privacy" | "services" | "finish">("region");
  
  // Region & Keyboard
  const [region, setRegion] = useState("United States");
  const [keyboardLayout, setKeyboardLayout] = useState("US");
  
  // Account
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountError, setAccountError] = useState("");
  
  // Privacy
  const [locationServices, setLocationServices] = useState(true);
  const [diagnosticData, setDiagnosticData] = useState(true);
  const [personalizedExperience, setPersonalizedExperience] = useState(false);
  
  // Services
  const [cortanaEnabled, setCortanaEnabled] = useState(false);
  const [activityHistory, setActivityHistory] = useState(true);

  const regions = [
    "United States", "United Kingdom", "Canada", "Australia", 
    "Germany", "France", "Japan", "South Korea", "Brazil", "Mexico"
  ];

  const handleAccountSubmit = () => {
    setAccountError("");
    
    if (!username.trim()) {
      setAccountError("Please enter a username");
      return;
    }
    
    if (password.length < 4) {
      setAccountError("Password must be at least 4 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setAccountError("Passwords don't match");
      return;
    }
    
    // Save account
    const accounts = JSON.parse(localStorage.getItem("urbanshade_accounts") || "[]");
    const newAccount = {
      id: Date.now().toString(),
      username: username.trim(),
      password,
      role: "Administrator",
      clearanceLevel: 5,
      avatar: null,
      createdAt: new Date().toISOString()
    };
    accounts.push(newAccount);
    localStorage.setItem("urbanshade_accounts", JSON.stringify(accounts));
    
    setStep("privacy");
  };

  const handleComplete = () => {
    localStorage.setItem("urbanshade_oobe_complete", "true");
    localStorage.setItem("urbanshade_settings", JSON.stringify({
      region,
      keyboardLayout,
      locationServices,
      diagnosticData,
      personalizedExperience,
      cortanaEnabled,
      activityHistory,
      theme: "dark",
      animations: true
    }));
    
    toast.success("Setup complete! Welcome to UrbanShade OS");
    onComplete();
  };

  // Windows 10 style blue gradient background
  const bgStyle = "bg-[#0078d4]";

  return (
    <div className={`fixed inset-0 ${bgStyle} text-white flex flex-col`}>
      {/* Header bar */}
      <div className="h-8 bg-black/20 flex items-center justify-end px-4 text-xs">
        <span className="opacity-70">Account</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xl">
          
          {/* Region Selection */}
          {step === "region" && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-light mb-2">Let's start with region. Is this right?</h1>
              <p className="text-white/70 mb-8 text-sm">
                This helps us give you the right experiences and recommendations.
              </p>
              
              <div className="bg-white/10 backdrop-blur rounded-sm max-h-64 overflow-y-auto mb-8">
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      region === r 
                        ? "bg-white/20 border-l-4 border-white" 
                        : "hover:bg-white/10"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep("keyboard")}
                  className="px-12 py-3 bg-white/20 hover:bg-white/30 transition-colors font-semibold"
                >
                  Yes
                </button>
              </div>
            </div>
          )}

          {/* Keyboard Layout */}
          {step === "keyboard" && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-light mb-2">Is this the right keyboard layout?</h1>
              <p className="text-white/70 mb-8 text-sm">
                You can also add more layouts later.
              </p>
              
              <div className="bg-white/10 backdrop-blur rounded-sm mb-8">
                {["US", "UK", "German (QWERTZ)", "French (AZERTY)", "Japanese"].map((layout) => (
                  <button
                    key={layout}
                    onClick={() => setKeyboardLayout(layout)}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      keyboardLayout === layout 
                        ? "bg-white/20 border-l-4 border-white" 
                        : "hover:bg-white/10"
                    }`}
                  >
                    {layout}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep("region")}
                  className="px-8 py-3 hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("network")}
                  className="px-12 py-3 bg-white/20 hover:bg-white/30 transition-colors font-semibold"
                >
                  Yes
                </button>
              </div>
            </div>
          )}

          {/* Network */}
          {step === "network" && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-light mb-2">Let's connect you to a network</h1>
              <p className="text-white/70 mb-8 text-sm">
                You'll need an internet connection to continue.
              </p>
              
              <div className="bg-white/10 backdrop-blur rounded-sm mb-8 p-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    <span>URBANSHADE-NETWORK</span>
                  </div>
                  <span className="text-white/60 text-sm">Connected</span>
                </div>
                <div className="flex items-center justify-between py-3 opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/10" />
                    <span>FACILITY-GUEST</span>
                  </div>
                  <span className="text-white/60 text-sm">Secured</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep("keyboard")}
                  className="px-8 py-3 hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("account")}
                  className="px-12 py-3 bg-white/20 hover:bg-white/30 transition-colors font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Account Creation */}
          {step === "account" && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-light mb-2">Who's going to use this device?</h1>
              <p className="text-white/70 mb-8 text-sm">
                Create an administrator account to manage this facility.
              </p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-4 py-3 bg-white/10 border-b-2 border-white/30 focus:border-white outline-none placeholder-white/50 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep("network")}
                  className="px-8 py-3 hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => username.trim() && setStep("privacy")}
                  disabled={!username.trim()}
                  className="px-12 py-3 bg-white/20 hover:bg-white/30 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Password */}
          {step === "privacy" && !password && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-light mb-2">Create a password</h1>
              <p className="text-white/70 mb-8 text-sm">
                Enter the password for {username || "your account"}.
              </p>
              
              <div className="space-y-4 mb-8">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white/10 border-b-2 border-white/30 focus:border-white outline-none placeholder-white/50 transition-colors"
                  autoFocus
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 bg-white/10 border-b-2 border-white/30 focus:border-white outline-none placeholder-white/50 transition-colors"
                />
                
                {accountError && (
                  <p className="text-red-300 text-sm">{accountError}</p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep("account")}
                  className="px-8 py-3 hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleAccountSubmit}
                  className="px-12 py-3 bg-white/20 hover:bg-white/30 transition-colors font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {step === "privacy" && password && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-light mb-2">Choose privacy settings</h1>
              <p className="text-white/70 mb-8 text-sm">
                UrbanShade uses diagnostic data to keep your device secure and up to date.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="bg-white/10 p-4 rounded-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-sm text-white/60">Let apps use your location</p>
                    </div>
                    <button
                      onClick={() => setLocationServices(!locationServices)}
                      className={`w-12 h-6 rounded-full transition-colors ${locationServices ? 'bg-white' : 'bg-white/30'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-[#0078d4] transition-transform ${locationServices ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Diagnostic data</p>
                      <p className="text-sm text-white/60">Send diagnostic data to help improve</p>
                    </div>
                    <button
                      onClick={() => setDiagnosticData(!diagnosticData)}
                      className={`w-12 h-6 rounded-full transition-colors ${diagnosticData ? 'bg-white' : 'bg-white/30'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-[#0078d4] transition-transform ${diagnosticData ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Tailored experiences</p>
                      <p className="text-sm text-white/60">Get personalized tips and recommendations</p>
                    </div>
                    <button
                      onClick={() => setPersonalizedExperience(!personalizedExperience)}
                      className={`w-12 h-6 rounded-full transition-colors ${personalizedExperience ? 'bg-white' : 'bg-white/30'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-[#0078d4] transition-transform ${personalizedExperience ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => { setPassword(""); setConfirmPassword(""); }}
                  className="px-8 py-3 hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("services")}
                  className="px-12 py-3 bg-white/20 hover:bg-white/30 transition-colors font-semibold"
                >
                  Accept
                </button>
              </div>
            </div>
          )}

          {/* Services */}
          {step === "services" && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-light mb-2">Customize your device</h1>
              <p className="text-white/70 mb-8 text-sm">
                Select all the ways you plan to use your device to get personalized suggestions.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { id: "gaming", label: "Gaming", desc: "Play and discover games" },
                  { id: "school", label: "Schoolwork", desc: "Write notes, research" },
                  { id: "creativity", label: "Creativity", desc: "Design and create" },
                  { id: "business", label: "Business", desc: "Manage projects, communicate" },
                  { id: "family", label: "Family", desc: "Safety and parental controls" },
                  { id: "entertainment", label: "Entertainment", desc: "Movies, music, streaming" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCortanaEnabled(!cortanaEnabled)}
                    className="p-4 bg-white/10 hover:bg-white/20 transition-colors text-left rounded-sm"
                  >
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-xs text-white/60">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep("privacy")}
                  className="px-8 py-3 hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("finish")}
                  className="px-12 py-3 bg-white/20 hover:bg-white/30 transition-colors font-semibold"
                >
                  Accept
                </button>
              </div>
              
              <button className="mt-4 text-sm text-white/60 hover:text-white transition-colors">
                Skip for now
              </button>
            </div>
          )}

          {/* Finish */}
          {step === "finish" && (
            <div className="animate-fade-in text-center">
              <h1 className="text-4xl font-light mb-4">Hi, {username}</h1>
              <p className="text-white/70 mb-2">
                We're getting everything ready for you
              </p>
              <p className="text-white/50 text-sm mb-12">
                This might take a few minutes. Please don't turn off your PC.
              </p>
              
              <div className="flex justify-center mb-8">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>

              <button
                onClick={handleComplete}
                className="px-12 py-3 bg-white text-[#0078d4] hover:bg-white/90 transition-colors font-semibold"
              >
                Continue to Desktop
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 bg-black/20 flex items-center justify-between px-6 text-xs">
        <div className="flex items-center gap-4">
          <button className="opacity-70 hover:opacity-100 transition-opacity">
            Accessibility
          </button>
        </div>
        <div className="flex items-center gap-2 opacity-70">
          <span>🔊</span>
          <span>🔋</span>
        </div>
      </div>
    </div>
  );
};
