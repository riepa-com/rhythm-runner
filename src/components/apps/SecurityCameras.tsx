import { useState, useEffect } from "react";
import { Camera, Video, AlertTriangle, Power, Radio, Shield, Users, FlaskConical, HardHat, Skull, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ZoneId = "surface" | "light" | "entrance" | "heavy";
type TeamId = "classD" | "scientists" | "foundation" | "chaos";

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "warning";
  zone: ZoneId;
}

interface ScanResult {
  zone: ZoneId;
  team: TeamId;
  count: number;
  location: string;
}

export const SecurityCameras = () => {
  const cameras: CameraFeed[] = [
    { id: "CAM-HCZ-01", name: "SCP-049 Entrance", location: "Heavy Containment", status: "online", zone: "heavy" },
    { id: "CAM-HCZ-02", name: "SCP-106 Chamber", location: "Heavy Containment", status: "warning", zone: "heavy" },
    { id: "CAM-HCZ-03", name: "Tesla Gate", location: "Heavy Containment", status: "online", zone: "heavy" },
    { id: "CAM-LCZ-01", name: "SCP-173 Containment", location: "Light Containment", status: "online", zone: "light" },
    { id: "CAM-LCZ-02", name: "SCP-914 Room", location: "Light Containment", status: "online", zone: "light" },
    { id: "CAM-EZ-01", name: "Gate A Checkpoint", location: "Entrance Zone", status: "online", zone: "entrance" },
    { id: "CAM-EZ-02", name: "Gate B Checkpoint", location: "Entrance Zone", status: "offline", zone: "entrance" },
    { id: "CAM-SURF-01", name: "Surface Helipad", location: "Surface", status: "online", zone: "surface" },
  ];

  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);
  const [viewMode, setViewMode] = useState<"cameras" | "scanner">("cameras");
  const [scanLines, setScanLines] = useState(0);
  
  // Breach Scanner State
  const [zoneEnabled, setZoneEnabled] = useState<Record<ZoneId, boolean>>({
    surface: true,
    light: true,
    entrance: true,
    heavy: true,
  });
  const [teamDetection, setTeamDetection] = useState<Record<TeamId, boolean>>({
    classD: true,
    scientists: true,
    foundation: false,
    chaos: true,
  });
  const [scannerPower, setScannerPower] = useState(200);
  const [scannerTier, setScannerTier] = useState(5);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLines(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const runScan = () => {
    if (scannerPower < 50) {
      toast.error("Insufficient power for scan");
      return;
    }
    
    setIsScanning(true);
    setScannerPower(p => Math.max(0, p - 50));
    
    setTimeout(() => {
      const results: ScanResult[] = [];
      const enabledZones = Object.entries(zoneEnabled).filter(([_, v]) => v).map(([k]) => k as ZoneId);
      const enabledTeams = Object.entries(teamDetection).filter(([_, v]) => v).map(([k]) => k as TeamId);
      
      enabledZones.forEach(zone => {
        enabledTeams.forEach(team => {
          if (Math.random() > 0.6) {
            results.push({
              zone,
              team,
              count: Math.floor(Math.random() * 3) + 1,
              location: zone === "heavy" ? "Near Tesla Gate" : zone === "light" ? "LCZ Corridor" : zone === "entrance" ? "Checkpoint" : "Helipad Area"
            });
          }
        });
      });
      
      setScanResults(results);
      setIsScanning(false);
      toast.success(`Scan complete: ${results.length} targets detected`);
    }, 2000);
  };

  // Recharge power slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setScannerPower(p => Math.min(200, p + 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getTeamColor = (team: TeamId) => {
    switch (team) {
      case "classD": return "text-orange-400";
      case "scientists": return "text-white";
      case "foundation": return "text-blue-400";
      case "chaos": return "text-green-400";
    }
  };

  const getTeamIcon = (team: TeamId) => {
    switch (team) {
      case "classD": return <HardHat className="w-3 h-3" />;
      case "scientists": return <FlaskConical className="w-3 h-3" />;
      case "foundation": return <Shield className="w-3 h-3" />;
      case "chaos": return <Skull className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex h-full bg-[#0a0a12]">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-[#1a1a2e] flex flex-col bg-[#0d0d18]">
        <div className="p-4 border-b border-[#1a1a2e]">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-sm">SECURITY SYSTEM</h2>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("cameras")}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                viewMode === "cameras" ? "bg-primary text-primary-foreground" : "bg-[#1a1a2e] hover:bg-[#252536]"
              }`}
            >
              CAMERAS
            </button>
            <button
              onClick={() => setViewMode("scanner")}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                viewMode === "scanner" ? "bg-primary text-primary-foreground" : "bg-[#1a1a2e] hover:bg-[#252536]"
              }`}
            >
              SCANNER
            </button>
          </div>
        </div>

        {viewMode === "cameras" ? (
          <div className="flex-1 overflow-y-auto">
            {cameras.map(cam => (
              <button
                key={cam.id}
                onClick={() => setSelectedCamera(cam)}
                className={`w-full text-left p-3 border-b border-[#1a1a2e] transition-colors ${
                  selectedCamera.id === cam.id ? "bg-primary/20" : "hover:bg-[#1a1a2e]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Video className={`w-4 h-4 ${
                    cam.status === "online" ? "text-primary" :
                    cam.status === "warning" ? "text-yellow-500" : "text-red-500"
                  }`} />
                  <span className="text-xs font-bold">{cam.name}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">{cam.location}</div>
                <div className={`text-[10px] font-bold mt-1 ${
                  cam.status === "online" ? "text-primary" :
                  cam.status === "warning" ? "text-yellow-500" : "text-red-500"
                }`}>
                  ● {cam.status.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Zone Toggles */}
            <div>
              <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Zones</div>
              {(["surface", "light", "entrance", "heavy"] as ZoneId[]).map(zone => (
                <button
                  key={zone}
                  onClick={() => setZoneEnabled(z => ({ ...z, [zone]: !z[zone] }))}
                  className={`w-full flex items-center justify-between p-2 mb-1 rounded text-xs transition-colors ${
                    zoneEnabled[zone] ? "bg-primary/20 text-primary" : "bg-[#1a1a2e] text-muted-foreground"
                  }`}
                >
                  <span className="uppercase">{zone}</span>
                  <span className="font-bold">{zoneEnabled[zone] ? "ON" : "OFF"}</span>
                </button>
              ))}
            </div>

            {/* Team Detection */}
            <div>
              <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Detect Teams</div>
              {(["classD", "scientists", "foundation", "chaos"] as TeamId[]).map(team => (
                <label
                  key={team}
                  className="flex items-center gap-2 p-2 mb-1 rounded bg-[#1a1a2e] cursor-pointer hover:bg-[#252536]"
                >
                  <input
                    type="checkbox"
                    checked={teamDetection[team]}
                    onChange={() => setTeamDetection(t => ({ ...t, [team]: !t[team] }))}
                    className="w-3 h-3"
                  />
                  <span className={`text-xs ${getTeamColor(team)}`}>
                    {team === "classD" ? "Class-D Personnel" :
                     team === "scientists" ? "Scientists" :
                     team === "foundation" ? "Foundation" : "Chaos Insurgency"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main View */}
      <div className="flex-1 flex flex-col">
        {viewMode === "cameras" ? (
          <>
            <div className="p-4 border-b border-[#1a1a2e] bg-[#0d0d18]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">{selectedCamera.name}</div>
                  <div className="text-xs text-muted-foreground">{selectedCamera.id}</div>
                </div>
                <div className={`flex items-center gap-2 text-xs font-bold ${
                  selectedCamera.status === "online" ? "text-primary" :
                  selectedCamera.status === "warning" ? "text-yellow-500" : "text-red-500"
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {selectedCamera.status.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-black relative overflow-hidden">
              {selectedCamera.status === "offline" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <div className="text-red-500 font-bold">SIGNAL LOST</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,255,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.05) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                      }}
                    />
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        background: `linear-gradient(180deg, transparent ${scanLines}%, rgba(0,255,136,0.1) ${scanLines + 1}%, transparent ${scanLines + 2}%)`
                      }}
                    />
                  </div>

                  <div className="absolute top-4 left-4 font-mono text-xs text-primary space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span>REC</span>
                    </div>
                    <div>{selectedCamera.id}</div>
                    <div>{new Date().toLocaleTimeString()}</div>
                  </div>

                  {selectedCamera.status === "warning" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center animate-pulse">
                        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
                        <div className="text-yellow-500 font-bold">ANOMALY DETECTED</div>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 border border-[#1a1a2e] p-3">
                    <div className="font-bold text-sm">{selectedCamera.location}</div>
                    <div className="text-xs text-muted-foreground">Zone: {selectedCamera.zone.toUpperCase()}</div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <Radio className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-xl font-bold mb-1">BREACH SCANNER</h2>
                <p className="text-xs text-muted-foreground">
                  Detects targets that remain in the same area for an extended period
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0d0d18] border border-[#1a1a2e] rounded">
                <div>
                  <div className="text-[10px] text-muted-foreground">TIER</div>
                  <div className="font-bold text-primary">TIER {scannerTier} - MAX TIER REACHED</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">POWER</div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold">{scannerPower} / 200</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={runScan}
                disabled={isScanning || scannerPower < 50}
                className="w-full py-6 text-lg font-bold"
              >
                {isScanning ? "SCANNING..." : "INITIATE SCAN"}
              </Button>

              {scanResults.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Scan Results</div>
                  {scanResults.map((result, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#0d0d18] border border-[#1a1a2e] rounded">
                      <div className={getTeamColor(result.team)}>
                        {getTeamIcon(result.team)}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-bold ${getTeamColor(result.team)}`}>
                          {result.count}x {result.team === "classD" ? "Class-D" : result.team === "scientists" ? "Scientist" : result.team === "foundation" ? "MTF" : "Chaos"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{result.location} ({result.zone.toUpperCase()})</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};