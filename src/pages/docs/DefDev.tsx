import { ArrowLeft, Bug, Terminal, Database, HardDrive, AlertTriangle, Info, Eye, Download, Trash2, Copy, RefreshCw, Shield, Zap, Activity, Code, FileWarning, Server, Cpu, Network } from "lucide-react";
import { Link } from "react-router-dom";

const DefDevDocs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-amber-400">DEF-DEV Documentation</h1>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Title */}
        <section className="text-center space-y-4">
          <p className="text-sm text-gray-500 italic">(No jokes unfortunately)</p>
          <div className="flex items-center justify-center gap-3">
            <Bug className="w-12 h-12 text-amber-400" />
            <h2 className="text-4xl font-bold text-amber-400">DEF-DEV Console</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Developer Environment and Debugging Tool for UrbanShade OS v2.0
          </p>
        </section>

        {/* Overview */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Overview</h3>
          <p className="text-muted-foreground">
            DEF-DEV is a comprehensive debugging and development console for UrbanShade OS. It provides real-time logging, 
            localStorage inspection, recovery image management, action monitoring, and system diagnostics. This tool is intended for 
            developers and advanced users performing troubleshooting or system analysis.
          </p>
        </section>

        {/* Accessing DEF-DEV */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Accessing DEF-DEV</h3>
          <div className="space-y-3 text-muted-foreground">
            <p>DEF-DEV requires Developer Mode to be enabled. There are two methods to enable it:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>During Installation:</strong> Check the "Enable Developer Mode" option in the configuration step.</li>
              <li><strong>Via Settings:</strong> Navigate to Settings → Developer Options and enable Developer Mode.</li>
            </ol>
            <p>Once enabled, access the console at <code className="px-2 py-1 bg-black/50 rounded text-amber-400">/def-dev</code></p>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 font-semibold">Important:</p>
              <p>Attempting to access /def-dev without Developer Mode enabled will display an error message: 
              "!COULDN'T BIND TO PAGE! (Check if Dev mode is enabled)"</p>
            </div>
          </div>
        </section>

        {/* Error Types */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Error Types & Codes</h3>
          <p className="text-muted-foreground">
            DEF-DEV uses standardized error codes for system issues. These appear in the Action Logger and Console tabs.
          </p>
          
          <div className="grid gap-3">
            {[
              { code: "!COULDN'T FIND BIN/FILE!", desc: "LocalStorage key or file doesn't exist", color: "red" },
              { code: "!LOCALSTORAGE ACCESS DENIED!", desc: "Browser blocked localStorage access", color: "red" },
              { code: "!ACCESS LEVEL INSUFFICIENT!", desc: "User lacks required permissions", color: "orange" },
              { code: "!NETWORK BIND FAILED!", desc: "Failed to establish connection", color: "yellow" },
              { code: "!PROCESS TERMINATED UNEXPECTEDLY!", desc: "Application crashed or was killed", color: "red" },
              { code: "!MEMORY ALLOCATION FAILED!", desc: "System ran out of available memory", color: "purple" },
              { code: "!OPERATION TIMED OUT!", desc: "Request exceeded time limit", color: "yellow" },
              { code: "!INVALID OPERATION REQUESTED!", desc: "Attempted unsupported action", color: "orange" },
              { code: "!DATA CORRUPTION DETECTED!", desc: "Stored data is malformed or damaged", color: "red" },
              { code: "!AUTHENTICATION FAILED!", desc: "Login or security check failed", color: "red" },
            ].map(({ code, desc, color }) => (
              <div key={code} className={`p-3 bg-${color}-500/10 border border-${color}-500/30 rounded-lg flex items-start gap-3`}>
                <FileWarning className={`w-5 h-5 text-${color}-400 mt-0.5 flex-shrink-0`} />
                <div>
                  <code className={`text-${color}-400 font-mono text-sm font-bold`}>{code}</code>
                  <p className="text-muted-foreground text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Features</h3>
          
          {/* Console Tab */}
          <div className="p-6 bg-black/40 border border-white/10 rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <Terminal className="w-6 h-6 text-amber-400" />
              <h4 className="text-xl font-bold">Console Tab</h4>
            </div>
            <p className="text-muted-foreground">
              Captures and displays all console output including logs, warnings, errors, and system messages.
            </p>
            <div className="grid gap-3 text-sm">
              <div className="flex items-start gap-3">
                <Eye className="w-4 h-4 text-cyan-400 mt-1" />
                <div>
                  <strong className="text-foreground">View Modes:</strong>
                  <p className="text-muted-foreground">Toggle between simplified and technical error views.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Copy className="w-4 h-4 text-cyan-400 mt-1" />
                <div>
                  <strong className="text-foreground">Copy Logs:</strong>
                  <p className="text-muted-foreground">Copy all logs to clipboard for sharing or analysis.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-4 h-4 text-cyan-400 mt-1" />
                <div>
                  <strong className="text-foreground">Export:</strong>
                  <p className="text-muted-foreground">Export logs as a .txt file with timestamps.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trash2 className="w-4 h-4 text-red-400 mt-1" />
                <div>
                  <strong className="text-foreground">Clear:</strong>
                  <p className="text-muted-foreground">Clear all captured logs from the current session.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Tab */}
          <div className="p-6 bg-black/40 border border-white/10 rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-purple-400" />
              <h4 className="text-xl font-bold">Actions Tab</h4>
            </div>
            <p className="text-muted-foreground">
              Monitors all system actions and user interactions in real-time. Connected to the OS action bus.
            </p>
            <div className="text-sm space-y-2">
              <p><strong className="text-foreground">Tracked Action Types:</strong></p>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground ml-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-purple-500/50"></span>
                  <span>SYSTEM - Core system events</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-500/50"></span>
                  <span>APP - Application events</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-cyan-500/50"></span>
                  <span>FILE - File system operations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-yellow-500/50"></span>
                  <span>USER - User interactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-orange-500/50"></span>
                  <span>SECURITY - Security events</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-green-500/50"></span>
                  <span>WINDOW - Window management</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-red-500/50"></span>
                  <span>ERROR - System errors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Tab */}
          <div className="p-6 bg-black/40 border border-white/10 rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-cyan-400" />
              <h4 className="text-xl font-bold">Storage Tab</h4>
            </div>
            <p className="text-muted-foreground">
              View and search all localStorage entries used by UrbanShade OS.
            </p>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p>• Search entries by key name</p>
              <p>• View raw values stored in each entry</p>
              <p>• Monitor storage size and entry count</p>
              <p>• Clear all storage (requires confirmation)</p>
            </div>
          </div>

          {/* Recovery Images Tab */}
          <div className="p-6 bg-black/40 border border-white/10 rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <HardDrive className="w-6 h-6 text-green-400" />
              <h4 className="text-xl font-bold">Recovery Images Tab</h4>
            </div>
            <p className="text-muted-foreground">
              Create, edit, import, and export system recovery images (.img files).
            </p>
            <div className="text-sm space-y-2">
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-green-400 mt-1" />
                <div>
                  <strong className="text-foreground">Capture Current State:</strong>
                  <p className="text-muted-foreground">Save the current system state as a recovery image.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-4 h-4 text-green-400 mt-1" />
                <div>
                  <strong className="text-foreground">Import/Export:</strong>
                  <p className="text-muted-foreground">Import .img files or export images for backup.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Database className="w-4 h-4 text-green-400 mt-1" />
                <div>
                  <strong className="text-foreground">Load to Live:</strong>
                  <p className="text-muted-foreground">Restore an image to the current system (replaces all localStorage).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bugcheck Tab */}
          <div className="p-6 bg-black/40 border border-white/10 rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-400" />
              <h4 className="text-xl font-bold">Bugcheck Reports Tab</h4>
            </div>
            <p className="text-muted-foreground">
              View and manage bugcheck reports generated by the system when fatal errors occur.
            </p>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p>• View error codes and descriptions</p>
              <p>• Copy reports to share with developers</p>
              <p>• Export reports as JSON files</p>
              <p>• Clear resolved bugchecks</p>
            </div>
          </div>
        </section>

        {/* Action Dispatcher API */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Action Dispatcher API</h3>
          <p className="text-muted-foreground">
            For developers: The Action Dispatcher allows you to send events from any component to DEF-DEV.
          </p>
          <div className="p-4 bg-black/60 border border-white/10 rounded-lg">
            <pre className="text-sm text-cyan-400 overflow-x-auto">
{`import { actionDispatcher } from "@/lib/actionDispatcher";

// Dispatch different action types
actionDispatcher.system("System initialized");
actionDispatcher.app("Application started");
actionDispatcher.file("File saved: document.txt");
actionDispatcher.user("User clicked button");
actionDispatcher.security("Access granted");
actionDispatcher.window("Window opened: Settings");

// Dispatch errors with standard codes
actionDispatcher.dispatchError("FILE_NOT_FOUND", "config.json");
actionDispatcher.dispatchError("PERMISSION_DENIED", "admin area");
actionDispatcher.dispatchError("STORAGE_ERROR", "quota exceeded");`}
            </pre>
          </div>
        </section>

        {/* Bugcheck System */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Bugcheck System</h3>
          <p className="text-muted-foreground">
            UrbanShade OS includes a bugcheck system that monitors for fatal errors and system anomalies. 
            When detected, the system generates a bugcheck report and may display a crash screen.
          </p>
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Monitored Conditions:</h4>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• <strong>ICON_COLLISION_FATAL:</strong> Multiple desktop icons occupy the same position for extended periods</li>
              <li>• <strong>RENDER_LOOP_DETECTED:</strong> Component enters infinite render cycle</li>
              <li>• <strong>MEMORY_PRESSURE:</strong> Excessive localStorage or state accumulation</li>
              <li>• <strong>UNHANDLED_EXCEPTION:</strong> Critical JavaScript errors that escape error boundaries</li>
              <li>• <strong>KERNEL_PANIC:</strong> System core process terminated unexpectedly</li>
              <li>• <strong>STORAGE_CORRUPTION:</strong> LocalStorage data validation failed</li>
            </ul>
          </div>
        </section>

        {/* Advanced Functions */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Advanced Functions</h3>
          <div className="grid gap-4">
            <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-5 h-5 text-cyan-400" />
                <h4 className="font-semibold">System State Snapshots</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Capture complete system state including all localStorage, settings, and installed apps.
                Use for debugging or creating restore points.
              </p>
            </div>
            <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Network className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold">Event Bus Monitoring</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Monitor all custom events dispatched across the system. Useful for debugging
                inter-component communication.
              </p>
            </div>
            <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold">Performance Metrics</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Track localStorage size, active windows, and event throughput to identify
                performance bottlenecks.
              </p>
            </div>
          </div>
        </section>

        {/* Warning */}
        <section className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-400">Important Warnings</h3>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Modifying localStorage values directly can cause system instability</li>
            <li>• Loading a recovery image will replace ALL current system data</li>
            <li>• In Developer Mode, some persistence features may be bypassed</li>
            <li>• Bugcheck reports may contain sensitive system information</li>
            <li>• Clearing storage will reset the entire OS to initial state</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10 space-y-4">
          <p className="text-sm text-muted-foreground">
            DEF-DEV Console Documentation • UrbanShade OS Developer Tools v2.0
          </p>
          <Link to="/docs" className="inline-block text-amber-400 hover:underline text-sm font-semibold">
            ← Back to Documentation
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default DefDevDocs;
