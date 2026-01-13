import { useState, useEffect, useMemo } from "react";
import { ShoppingBag, Coins, Check, Lock, Sparkles, Palette, Crown, Award, RefreshCw, Clock, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/hooks/useShop";
import { useKroner } from "@/hooks/useKroner";
import { useThemePresets, ThemePreset, themePresets } from "@/hooks/useThemePresets";
import { RARITY_COLORS, getRarityLabel, ShopItem } from "@/lib/shopItems";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Generate rotating shop items based on 12-hour window
const getRotationSeed = (): number => {
  const now = Date.now();
  const twelveHours = 12 * 60 * 60 * 1000;
  return Math.floor(now / twelveHours);
};

const getNextRotationTime = (): Date => {
  const now = Date.now();
  const twelveHours = 12 * 60 * 60 * 1000;
  const nextRotation = Math.ceil(now / twelveHours) * twelveHours;
  return new Date(nextRotation);
};

// Seeded random for consistent rotation across users
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const shuffleWithSeed = <T,>(array: T[], seed: number): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const Shop = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const [timeUntilRotation, setTimeUntilRotation] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  // Countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nextRotation = getNextRotationTime();
      const diff = nextRotation.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilRotation(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const { items, ownsItem, purchaseItem, loading, inventory } = useShop(userId);
  const { balance, spendKroner, canAfford } = useKroner(userId);
  const { applyPreset, getCurrentPreset } = useThemePresets();

  // Get rotating 6 items (2 guaranteed rare+, 4 any)
  const rotatingItems = useMemo(() => {
    const seed = getRotationSeed();
    
    // Combine DB items with theme presets
    const allThemes: ShopItem[] = themePresets
      .filter(t => t.source === 'default')
      .map((t, i) => ({
        id: `theme-${t.id}`,
        item_type: 'theme' as const,
        item_id: t.id,
        name: t.name,
        description: `Desktop theme with ${t.name.toLowerCase()} color scheme`,
        price: 150 + (i * 50),
        rarity: i < 3 ? 'common' as const : i < 6 ? 'uncommon' as const : 'rare' as const,
        is_available: true,
        preview_data: t.colors,
      }));

    // Add some titles
    const titles: ShopItem[] = [
      { id: 'title-operative', item_type: 'title', item_id: 'operative', name: 'Operative', description: 'A simple but clean title', price: 100, rarity: 'common', is_available: true },
      { id: 'title-agent', item_type: 'title', item_id: 'agent', name: 'Agent', description: 'For those who work in the shadows', price: 200, rarity: 'uncommon', is_available: true },
      { id: 'title-sentinel', item_type: 'title', item_id: 'sentinel', name: 'Sentinel', description: 'Guardian of the facility', price: 350, rarity: 'rare', is_available: true },
      { id: 'title-commander', item_type: 'title', item_id: 'commander', name: 'Commander', description: 'Lead your team to victory', price: 500, rarity: 'rare', is_available: true },
      { id: 'title-overseer', item_type: 'title', item_id: 'overseer', name: 'Overseer', description: 'Watch over all operations', price: 750, rarity: 'epic', is_available: true },
      { id: 'title-phantom', item_type: 'title', item_id: 'phantom', name: 'Phantom', description: 'Invisible and deadly', price: 1000, rarity: 'epic', is_available: true },
      { id: 'title-legend', item_type: 'title', item_id: 'legend', name: 'Legend', description: 'Your name echoes through history', price: 2500, rarity: 'legendary', is_available: true },
    ];

    // Add some badges
    const badges: ShopItem[] = [
      { id: 'badge-bronze-star', item_type: 'badge', item_id: 'bronze-star', name: 'Bronze Star', description: 'A modest achievement', price: 75, rarity: 'common', is_available: true },
      { id: 'badge-silver-shield', item_type: 'badge', item_id: 'silver-shield', name: 'Silver Shield', description: 'Protection and honor', price: 150, rarity: 'uncommon', is_available: true },
      { id: 'badge-gold-crown', item_type: 'badge', item_id: 'gold-crown', name: 'Gold Crown', description: 'Royalty status', price: 300, rarity: 'rare', is_available: true },
      { id: 'badge-diamond', item_type: 'badge', item_id: 'diamond', name: 'Diamond', description: 'Unbreakable brilliance', price: 600, rarity: 'epic', is_available: true },
      { id: 'badge-cosmic', item_type: 'badge', item_id: 'cosmic', name: 'Cosmic', description: 'Beyond this world', price: 1500, rarity: 'legendary', is_available: true },
    ];

    const allItems = [...allThemes, ...titles, ...badges, ...items];
    
    // Separate by rarity
    const rareAndHigher = allItems.filter(i => ['rare', 'epic', 'legendary'].includes(i.rarity));
    const anyRarity = allItems.filter(i => !['rare', 'epic', 'legendary'].includes(i.rarity));
    
    // Shuffle each pool
    const shuffledRare = shuffleWithSeed(rareAndHigher, seed);
    const shuffledAny = shuffleWithSeed(anyRarity, seed + 1000);
    
    // Pick 2 rare+ and 4 any
    const selected = [
      ...shuffledRare.slice(0, 2),
      ...shuffledAny.slice(0, 4),
    ];
    
    // Shuffle final selection
    return shuffleWithSeed(selected, seed + 2000);
  }, [items]);

  const handlePurchase = async (item: ShopItem) => {
    const success = await purchaseItem(item, spendKroner);
    if (success && item.item_type === 'theme') {
      // Offer to apply theme immediately
      const preset = themePresets.find(t => t.id === item.item_id);
      if (preset) {
        applyPreset(preset);
      }
    }
  };

  const handleApplyTheme = (item: ShopItem) => {
    const preset = themePresets.find(t => t.id === item.item_id);
    if (preset) {
      applyPreset(preset);
    }
  };

  const getCategoryIcon = (type: string) => {
    switch(type) {
      case 'theme': return <Palette className="w-8 h-8" />;
      case 'title': return <Crown className="w-8 h-8" />;
      case 'badge': return <Award className="w-8 h-8" />;
      default: return <Sparkles className="w-8 h-8" />;
    }
  };

  const getCategoryLabel = (type: string) => {
    switch(type) {
      case 'theme': return 'Theme';
      case 'title': return 'Title';
      case 'badge': return 'Badge';
      default: return type;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/50 p-4 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/10 flex items-center justify-center border border-yellow-500/30">
              <ShoppingBag className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Daily Shop</h1>
              <p className="text-xs text-muted-foreground">Featured items rotate every 12 hours</p>
            </div>
          </div>
          
          {/* Balance Display */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <Coins className="w-5 h-5 text-yellow-500" />
              <div className="text-right">
                <div className="font-bold text-yellow-500 text-lg">{balance.spendable.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground -mt-1">Kroner</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rotation Timer */}
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary/5 border border-primary/10">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">New items in</span>
          <span className="font-mono font-bold text-primary">{timeUntilRotation}</span>
        </div>
      </div>

      {/* Featured Items Grid */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading shop...
          </div>
        ) : (
          <div className="space-y-4">
            {/* Featured Section */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {rotatingItems.map((item) => {
                const owned = ownsItem(item.item_type, item.item_id);
                const affordable = canAfford(item.price);
                const rarityStyle = RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS];
                const isTheme = item.item_type === 'theme';

                return (
                  <div
                    key={item.id}
                    className={`relative rounded-2xl border p-4 transition-all hover:scale-[1.02] hover:shadow-xl ${rarityStyle.bg} ${rarityStyle.border} ${
                      owned ? 'opacity-80' : ''
                    }`}
                  >
                    {/* Category + Rarity */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {getCategoryLabel(item.item_type)}
                      </Badge>
                      <Badge className={`text-[10px] ${rarityStyle.text} bg-background/80 border-0`}>
                        {getRarityLabel(item.rarity)}
                      </Badge>
                    </div>

                    {/* Preview */}
                    <div className={`w-full aspect-[4/3] rounded-xl mb-3 flex items-center justify-center overflow-hidden ${
                      isTheme ? '' : 'bg-background/30'
                    }`}>
                      {isTheme && item.preview_data ? (
                        <div 
                          className="w-full h-full rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, ${item.preview_data.bgGradientStart} 0%, ${item.preview_data.bgGradientEnd} 100%)`
                          }}
                        />
                      ) : (
                        <div className={rarityStyle.text}>
                          {getCategoryIcon(item.item_type)}
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <h3 className="font-bold text-sm text-foreground mb-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

                    {/* Price & Action */}
                    {owned ? (
                      <div className="space-y-2">
                        <Button disabled className="w-full h-10" size="sm" variant="outline">
                          <Check className="w-4 h-4 mr-1.5" />
                          Owned
                        </Button>
                        {isTheme && (
                          <Button 
                            className="w-full h-9" 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleApplyTheme(item)}
                          >
                            <Zap className="w-4 h-4 mr-1.5" />
                            Apply
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        className="w-full h-10"
                        size="sm"
                        disabled={!affordable}
                        onClick={() => handlePurchase(item)}
                      >
                        {affordable ? (
                          <>
                            <Coins className="w-4 h-4 mr-1.5" />
                            {item.price.toLocaleString()} K
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-1.5" />
                            {item.price.toLocaleString()} K
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Info Section */}
            <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                How to earn Kroner
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Complete Battle Pass levels for Kroner rewards</li>
                <li>• Finish daily and weekly quests</li>
                <li>• Unlock achievements for bonus Kroner</li>
                <li>• Login daily for streak bonuses</li>
              </ul>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-border/50 p-3 bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>💎 2 Rare+ guaranteed each rotation</span>
          <span>Lifetime: {balance.lifetime.toLocaleString()} K</span>
        </div>
      </div>
    </div>
  );
};
