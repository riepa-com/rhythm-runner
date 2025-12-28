import { useState } from "react";
import { Users, Search, MapPin, Phone, Mail, Shield, AlertTriangle } from "lucide-react";

interface Personnel {
  id: string;
  name: string;
  role: string;
  clearance: number;
  department: string;
  location: string;
  status: "active" | "offline" | "missing";
  phone: string;
  email: string;
}

export const PersonnelDirectory = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Personnel | null>(null);

  // Get admin from localStorage
  const getAdminPersonnel = (): Personnel => {
    const adminData = localStorage.getItem("urbanshade_admin");
    if (adminData) {
      const admin = JSON.parse(adminData);
      return {
        id: admin.id,
        name: admin.name,
        role: admin.role,
        clearance: admin.clearance,
        department: admin.department,
        location: admin.location,
        status: admin.status,
        phone: admin.phone,
        email: admin.email,
      };
    }
    return { id: "P000", name: "Administrator", role: "System Administrator", clearance: 5, department: "Administration", location: "Control Room", status: "active", phone: "x1000", email: "admin@urbanshade.corp" };
  };

  const personnel: Personnel[] = [
    getAdminPersonnel(),
    { id: "P001", name: "Dr. Sarah Chen", role: "Lead Researcher", clearance: 5, department: "Research", location: "Lab A-3", status: "active", phone: "x2847", email: "s.chen@urbanshade.corp" },
    { id: "P002", name: "Marcus Webb", role: "Security Chief", clearance: 4, department: "Security", location: "Control Room", status: "active", phone: "x1001", email: "m.webb@urbanshade.corp" },
    { id: "P003", name: "Dr. James Liu", role: "Biologist", clearance: 4, department: "Research", location: "Lab B-2", status: "active", phone: "x2851", email: "j.liu@urbanshade.corp" },
    { id: "P004", name: "Elena Rodriguez", role: "Engineer", clearance: 3, department: "Engineering", location: "Maintenance", status: "active", phone: "x3042", email: "e.rodriguez@urbanshade.corp" },
    { id: "P005", name: "Dr. Yuki Tanaka", role: "Medical Officer", clearance: 4, department: "Medical", location: "Med Bay", status: "active", phone: "x4100", email: "y.tanaka@urbanshade.corp" },
    { id: "P006", name: "Robert Hayes", role: "Security Officer", clearance: 2, department: "Security", location: "Zone 3", status: "offline", phone: "x1015", email: "r.hayes@urbanshade.corp" },
    { id: "P007", name: "Dr. Amanda Foster", role: "Xenobiologist", clearance: 5, department: "Research", location: "Lab A-1", status: "active", phone: "x2840", email: "a.foster@urbanshade.corp" },
    { id: "P008", name: "Thomas Park", role: "Systems Admin", clearance: 3, department: "IT", location: "Server Room", status: "active", phone: "x5001", email: "t.park@urbanshade.corp" },
    { id: "P009", name: "Lisa Morrison", role: "Security Officer", clearance: 2, department: "Security", location: "Zone 4", status: "missing", phone: "x1021", email: "l.morrison@urbanshade.corp" },
    // EXR-P (Expendable Rank-Prisoners) and MR-P (Medium Rank-Prisoners)
    { id: "EXR-001", name: "Subject 7-Alpha", role: "EXR-P", clearance: 0, department: "Containment", location: "Cell Block A", status: "active", phone: "N/A", email: "N/A" },
    { id: "EXR-002", name: "Subject 12-Delta", role: "EXR-P", clearance: 0, department: "Containment", location: "Cell Block B", status: "active", phone: "N/A", email: "N/A" },
    { id: "MR-001", name: "Inmate Kovacs", role: "MR-P", clearance: 1, department: "Maintenance", location: "Utility Tunnel 3", status: "active", phone: "N/A", email: "N/A" },
    { id: "MR-002", name: "Inmate Zhang", role: "MR-P", clearance: 1, department: "Sanitation", location: "Waste Processing", status: "active", phone: "N/A", email: "N/A" },
  ];

  const filtered = personnel.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.role.toLowerCase().includes(search.toLowerCase()) ||
    p.department.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-primary";
      case "offline": return "text-yellow-500";
      case "missing": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getClearanceColor = (level: number) => {
    if (level >= 5) return "text-red-500";
    if (level >= 4) return "text-orange-500";
    if (level >= 3) return "text-yellow-500";
    return "text-primary";
  };

  return (
    <div className="flex h-full">
      {/* Personnel List */}
      <div className="flex-1 border-r border-white/5">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Personnel Directory</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search personnel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/30 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="p-2">
          {filtered.map((person) => (
            <div
              key={person.id}
              onClick={() => setSelected(person)}
              className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                selected?.id === person.id ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-bold">{person.name}</div>
                <div className={`text-xs font-bold ${getStatusColor(person.status)}`}>
                  ● {person.status.toUpperCase()}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{person.role}</div>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="text-muted-foreground">{person.department}</span>
                <span className={`font-bold ${getClearanceColor(person.clearance)}`}>
                  CL-{person.clearance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personnel Details */}
      <div className="w-96 p-6 bg-black/10">
        {selected ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{selected.name}</h3>
                  <div className="text-sm text-muted-foreground">{selected.id}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <div className={`font-bold text-lg ${getStatusColor(selected.status)}`}>
                  ● {selected.status.toUpperCase()}
                </div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Role</div>
                <div className="font-bold">{selected.role}</div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Clearance Level</div>
                <div className="flex items-center gap-2">
                  <Shield className={`w-5 h-5 ${getClearanceColor(selected.clearance)}`} />
                  <span className={`font-bold text-lg ${getClearanceColor(selected.clearance)}`}>
                    Level {selected.clearance}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Department</div>
                <div className="font-bold">{selected.department}</div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Current Location
                </div>
                <div className="font-bold">{selected.location}</div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone
                </div>
                <div className="font-mono font-bold text-primary">{selected.phone}</div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email
                </div>
                <div className="font-mono text-sm text-primary">{selected.email}</div>
              </div>

              {selected.status === "missing" && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="text-xs text-destructive font-bold mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    MISSING
                  </div>
                  <div className="text-xs text-destructive/80">Last seen: Zone 4, 3 hours ago</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select personnel to view details
          </div>
        )}
      </div>
    </div>
  );
};
