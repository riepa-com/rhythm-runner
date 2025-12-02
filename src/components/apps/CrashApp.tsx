import { useState } from "react";
import { CrashType } from "@/components/CrashScreen";

const CRASH_OPTIONS: { type: CrashType; label: string; description: string }[] = [
  { type: "CRITICAL_PROCESS_DIED", label: "Critical Process Died", description: "A critical system process has terminated" },
  { type: "KERNEL_PANIC", label: "Kernel Panic", description: "Core system failure" },
  { type: "MEMORY_MANAGEMENT", label: "Memory Management", description: "Memory allocation error" },
  { type: "SYSTEM_SERVICE_EXCEPTION", label: "System Service Exception", description: "Exception in system service" },
  { type: "IRQL_NOT_LESS_OR_EQUAL", label: "IRQL Not Less Or Equal", description: "Invalid memory access" },
  { type: "PAGE_FAULT_IN_NONPAGED_AREA", label: "Page Fault", description: "Invalid system memory reference" },
  { type: "DRIVER_IRQL_NOT_LESS_OR_EQUAL", label: "Driver IRQL Error", description: "Driver accessed invalid memory" },
  { type: "VIDEO_TDR_FAILURE", label: "Video TDR Failure", description: "Display driver timeout" },
  { type: "WHEA_UNCORRECTABLE_ERROR", label: "Hardware Error", description: "Fatal hardware error" },
  { type: "DPC_WATCHDOG_VIOLATION", label: "DPC Watchdog Violation", description: "System watchdog timeout" },
  { type: "CLOCK_WATCHDOG_TIMEOUT", label: "Clock Watchdog Timeout", description: "Processor clock interrupt timeout" },
];

interface CrashAppProps {
  onCrash?: (crashType: CrashType, process?: string) => void;
}

export const CrashApp = ({ onCrash }: CrashAppProps) => {
  const [selectedCrash, setSelectedCrash] = useState<CrashType>("CRITICAL_PROCESS_DIED");
  const [customProcess, setCustomProcess] = useState("system.core");

  const handleCrash = () => {
    if (window.confirm(`Trigger ${selectedCrash.replace(/_/g, ' ')} crash?\n\nThis will restart the system.`)) {
      onCrash?.(selectedCrash, customProcess);
    }
  };

  return (
    <div className="h-full bg-background p-4 overflow-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-4">
          <h2 className="text-xl font-semibold text-foreground">System Crash Utility</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Test crash recovery and blue screen handlers
          </p>
        </div>

        {/* Crash Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Stop Code</label>
          <div className="grid gap-2 max-h-64 overflow-y-auto pr-2">
            {CRASH_OPTIONS.map((option) => (
              <button
                key={option.type}
                onClick={() => setSelectedCrash(option.type)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  selectedCrash === option.type
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <div className="font-mono text-sm text-foreground">{option.type}</div>
                <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Process Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Failed Process</label>
          <input
            type="text"
            value={customProcess}
            onChange={(e) => setCustomProcess(e.target.value)}
            placeholder="ntoskrnl.exe"
            className="w-full px-3 py-2 rounded-lg bg-card border border-border focus:border-primary focus:outline-none text-foreground font-mono text-sm"
          />
        </div>

        {/* Preview */}
        <div className="p-4 rounded-lg bg-[#0078d4] text-white font-mono text-xs space-y-1">
          <div className="text-2xl mb-2">:(</div>
          <div>Stop code: {selectedCrash.replace(/_/g, ' ')}</div>
          <div>What failed: {customProcess}</div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            onClick={handleCrash}
            className="flex-1 px-4 py-3 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 transition-colors"
          >
            Trigger Crash
          </button>
        </div>

        {/* Warning */}
        <p className="text-xs text-muted-foreground text-center">
          System will restart after crash screen is dismissed
        </p>
      </div>
    </div>
  );
};
