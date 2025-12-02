import { cn } from "@/lib/utils";
import { differenceInCalendarDays, format } from "date-fns";

export type WidgetStyle = "flat" | "3d" | "pixel";
export type WidgetTheme = "mono" | "blue" | "pink" | "purple" | "custom";

interface DDayWidgetProps {
  title?: string;
  targetDate: Date;
  style: WidgetStyle;
  themeColor: string;
  imageUrl?: string;
  className?: string;
  id?: string;
}

export function DDayWidget({
  title = "D-Day",
  targetDate,
  style,
  themeColor,
  imageUrl,
  className,
  id,
}: DDayWidgetProps) {
  const today = new Date();
  const diffDays = differenceInCalendarDays(today, targetDate);
  
  const prefix = diffDays >= 0 ? "D+" : "D-";
  const days = Math.abs(diffDays);
  
  // Format: MON DEC 1 (Today's Date, as requested)
  const dateString = format(today, "EEE MMM d").toUpperCase();

  const getFontClass = () => {
    switch (style) {
      case "3d": return "font-3d text-3d text-6xl font-black tracking-wide"; // DynaPuff
      case "pixel": return "font-pixel text-pixel text-5xl font-bold tracking-tight"; // Pixelify Sans (Bold)
      default: return "font-display text-flat tracking-wide font-bold text-6xl";
    }
  };

  const getContainerStyle = () => {
    const baseStyle = {
      backgroundColor: themeColor,
    };

    if (style === '3d') {
      return {
        ...baseStyle,
        boxShadow: 'inset 0 4px 15px rgba(255,255,255,0.6), inset 0 -4px 10px rgba(0,0,0,0.1), 0 12px 25px -8px rgba(0,0,0,0.25)',
      };
    }
    
    if (style === 'pixel') {
      return {
        ...baseStyle,
        boxShadow: '6px 6px 0px rgba(0,0,0,0.2), inset 2px 2px 0px rgba(255,255,255,0.2)', // Bevel + Shadow
        border: '4px solid rgba(0,0,0,0.1)' // Pixel border
      };
    }

    return baseStyle;
  };

  return (
    <div
      id={id}
      className={cn(
        "relative flex items-center justify-center overflow-visible", // Changed back to visible so image can overlap
        "w-[320px] h-[140px]",
        "rounded-[40px]",
        className
      )}
      style={getContainerStyle()}
    >
      {/* Full Game Screen Overlay for Pixel Mode - Clipped to shape */}
      {style === 'pixel' && (
        <div className="absolute inset-0 z-0 game-screen-overlay opacity-40 pointer-events-none rounded-[40px] overflow-hidden" />
      )}

      {/* Image Container */}
      <div className={cn(
        "absolute left-[-35px] top-1/2 -translate-y-1/2 z-20 overflow-hidden",
        "w-[100px] h-[100px] rounded-full", // Reduced from 120px to 100px
        style === '3d' && "shadow-[inset_0_4px_8px_rgba(255,255,255,0.5),0_8px_16px_-4px_rgba(0,0,0,0.3)]",
        style === 'pixel' && "border-[4px] border-black/10", 
        style === 'flat' && "shadow-md" 
      )}>
        {imageUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={imageUrl} 
              alt="Widget visual" 
              className={cn(
                "w-full h-full object-cover",
                style === 'pixel' && "contrast-125 brightness-110 grayscale-[0.2]",
              )}
              style={{ imageRendering: style === 'pixel' ? 'pixelated' : 'auto' }}
              crossOrigin="anonymous"
              onLoad={() => {
                console.log("✅ Image loaded:", imageUrl);
              }}
              onError={(e) => {
                console.error("❌ Image failed to load:", imageUrl, e);
                e.currentTarget.style.display = 'none';
              }}
            />
            {style === 'pixel' && (
              <div className="absolute inset-0 pointer-events-none pixel-overlay opacity-30" />
            )}
            {style === '3d' && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/40 to-transparent opacity-80 mix-blend-overlay" />
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-white/20 flex items-center justify-center text-white/50">
            <span className="text-xs">Add Image</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="z-10 flex flex-col justify-center items-center w-full h-full pl-16">
        <div 
          className={cn(
            "leading-none mb-1 drop-shadow-md", 
            getFontClass()
          )}
          style={{ color: 'white' }} // FORCE WHITE
        >
          {prefix}{days}
        </div>
        
        <div 
          className={cn(
            "text-sm font-bold uppercase",
            style === 'pixel' ? 'font-pixel text-xs mt-3 tracking-tight' : 'font-sans tracking-widest mt-1'
          )}
          style={{ color: 'white' }} // FORCE WHITE
        >
          {dateString}
        </div>
      </div>

      {/* Shine/Gloss effect for 3D */}
      {style === '3d' && (
        <div className="absolute top-2 right-4 w-[80px] h-[40px] bg-white/30 rounded-full blur-xl pointer-events-none z-0" />
      )}
    </div>
  );
}
