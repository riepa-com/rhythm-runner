import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";

export const ChangelogDialog = () => {
  const [open, setOpen] = useState(false);
  const currentVersion = "2.0.0";

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem("urbanshade_last_seen_version");
    if (lastSeenVersion !== currentVersion) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("urbanshade_last_seen_version", currentVersion);
    setOpen(false);
  };

  const changelog = {
    "Major Features": [
      "Enhanced Facility Planner",
      "Urbanshade Installer: actually does stuff that an installer would do",
      "About System: Github stuff and what not",
      "Working Updates: System can now update i hope (only visual :D)"
    ],
    "OOBE Improvements": [
      "Extended to 18 bcuz yes",
      "Configure OEM unlock, works i hope"
    ],
    "Account & Recovery": [
      "New accounts are now existing i think",
      "Recovery mode options now perform actual system operations (Should've fixed years ago-)"
    ],
    "UI/UX Enhancements": [
      "Enhanced animations throughout the system",
      "Improved visual feedback and transitions"
    ],
    "Settings": [
      "Added more settings",
      "Made it actually do stuff :fire:"
    ],
    "Installer": [
      "Its actually somewhat an installer",
      "smth smth :D"
    ],
    "Made installer work i hope": [
      "yea u gotta install apps to use them (WOW NO WAY)",
      "i hope it works :/"
    ]
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            What's New in URBANSHADE OS v{currentVersion}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {Object.entries(changelog).map(([section, items], sectionIndex) => (
            <div key={section} className="space-y-3">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Check className="w-5 h-5" />
                {section}
              </h3>
              <ul className="space-y-2 text-sm ml-7">
                {items.map((text, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 animate-fade-in"
                    style={{ animationDelay: `${0.1 * (sectionIndex * 5 + i)}s` }}
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Thank you for using URBANSHADE OS!
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleClose} className="animate-fade-in">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
