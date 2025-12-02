import { useState, useRef } from "react";
import { DDayWidget, WidgetStyle } from "@/components/DDayWidget";
import { ControlPanel } from "@/components/ControlPanel";
import generatedImage from "@assets/generated_images/dreamy_pastel_sky_with_fluffy_clouds_and_sparkles.png";
import { toPng } from "html-to-image";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [style, setStyle] = useState<WidgetStyle>("3d");
  const [themeColor, setThemeColor] = useState<string>("#BAE6FD"); // Default Blue
  const [image, setImage] = useState<string>(generatedImage);
  const widgetRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExport = async () => {
    if (widgetRef.current === null) {
      return;
    }

    try {
      // Wait a bit for fonts to load if needed, though usually handled by browser
      const dataUrl = await toPng(widgetRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = "my-dday-widget.png";
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Downloaded!",
        description: "Your widget has been saved as an image.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to download image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col md:flex-row">
      
      {/* Left Side - Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="z-10 flex flex-col items-center gap-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-800 text-center leading-tight">
            Make a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">Widget</span>
          </h1>
          
          <div className="relative group">
            {/* The Widget Preview Wrapper */}
            <div 
              className="p-12 bg-white/40 backdrop-blur-sm rounded-[60px] border border-white/60 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
            >
              <div ref={widgetRef}>
                 <DDayWidget
                  targetDate={targetDate}
                  style={style}
                  themeColor={themeColor}
                  imageUrl={image}
                />
              </div>
            </div>
            
            <p className="text-center mt-6 text-slate-400 font-medium text-sm uppercase tracking-widest">Preview</p>
          </div>
        </div>
      </div>

      {/* Right Side - Controls */}
      <div className="w-full md:w-[480px] bg-white/50 border-l border-white/50 backdrop-blur-md overflow-y-auto p-6 md:p-10">
        <ControlPanel
          targetDate={targetDate}
          setTargetDate={setTargetDate}
          style={style}
          setStyle={setStyle}
          themeColor={themeColor}
          setThemeColor={setThemeColor}
          image={image}
          setImage={setImage}
          onExport={handleExport}
        />
      </div>

    </div>
  );
}
