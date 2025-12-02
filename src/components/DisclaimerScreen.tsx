import { useState } from "react";
import { Info, CheckCircle, ShieldCheck, Code, Github, BookOpen } from "lucide-react";

interface DisclaimerScreenProps {
  onAccept: () => void;
}

export const DisclaimerScreen = ({ onAccept }: DisclaimerScreenProps) => {
  const [understood, setUnderstood] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-5xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 mb-6 animate-scale-in">
            <Info className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
            UrbanShade OS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A browser-based operating system simulator inspired by underwater research facilities
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono text-primary">Version 2.2.0 • Simulation Active</span>
          </div>
        </div>

        <div className="grid gap-4 mb-6">
          {/* Main Info Card */}
          <div className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-bold text-foreground">What This Actually Is</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This is a <strong className="text-foreground">fictional operating system simulator</strong> that runs entirely in your web browser. 
                  It mimics the look and feel of a real OS interface, complete with apps, files, and system tools—but everything you see here is simulated. 
                  No actual software installation, no real operating system modifications, no real security risks.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs font-medium">
                    <CheckCircle className="w-3 h-3 inline mr-1.5 text-primary" />
                    Browser-Based Only
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs font-medium">
                    <CheckCircle className="w-3 h-3 inline mr-1.5 text-primary" />
                    No Installation Required
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs font-medium">
                    <CheckCircle className="w-3 h-3 inline mr-1.5 text-primary" />
                    Completely Safe
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Data Storage Card */}
            <div className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Code className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">How Data Storage Works</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>All data is stored in your browser's <strong className="text-foreground">localStorage</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Nothing is uploaded to any server—everything stays on your device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Clearing browser data will reset the entire simulation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Incognito/private mode won't save your progress</span>
                </li>
              </ul>
            </div>

            {/* Privacy & Security Card */}
            <div className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Privacy & Security</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">⚠</span>
                  <span><strong className="text-foreground">Never enter real passwords</strong> or sensitive information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>This is a simulation—use fake credentials only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>No tracking, analytics, or data collection of any kind</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Your privacy is respected; we can't see what you do here</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Open Source Card */}
          <div className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm border border-primary/30 rounded-2xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <Github className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Open Source Project</h3>
                  <p className="text-sm text-muted-foreground">
                    Built by <strong className="text-primary">aswdbatch</strong> and the community. 
                    This project is open source and free to explore, modify, and learn from.
                  </p>
                </div>
              </div>
              <a
                href="https://github.com/aswdBatch/urbanshade-7e993958"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-all font-semibold text-sm hover:scale-105"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-5 text-center animate-fade-in" style={{ animationDelay: "500ms" }}>
            <BookOpen className="w-5 h-5 text-blue-400 inline mr-2" />
            <span className="text-sm text-muted-foreground">
              First time here? Check out the{" "}
              <a 
                href="/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-2 hover:underline-offset-4 transition-all"
              >
                User Guide & Documentation
              </a>
              {" "}to get started
            </span>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <label className="block cursor-pointer group">
            <div className="bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 rounded-2xl p-5 transition-all group-hover:scale-[1.01]">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  className="w-5 h-5 mt-0.5 cursor-pointer accent-primary flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    I understand and agree to the following:
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li>• This is a fictional simulation for entertainment purposes only</li>
                    <li>• I will not enter real passwords or sensitive information</li>
                    <li>• All my data is stored locally in my browser</li>
                    <li>• I understand this is not a real operating system</li>
                  </ul>
                </div>
              </div>
            </div>
          </label>

          <button
            onClick={onAccept}
            disabled={!understood}
            className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-primary-foreground font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-2xl shadow-primary/20 hover:scale-[1.02] disabled:hover:scale-100 disabled:shadow-none"
          >
            {understood ? (
              <>
                <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Enter UrbanShade OS
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 opacity-50" />
                Please accept to continue
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground/60 space-y-1 animate-fade-in" style={{ animationDelay: "700ms" }}>
          <div>By proceeding, you acknowledge this is a simulation and agree to use it responsibly.</div>
          <div>© 2024 UrbanShade OS Project • Not affiliated with any real organization</div>
        </div>
      </div>
    </div>
  );
};
