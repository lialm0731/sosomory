import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { HexColorPicker } from "react-colorful";
import { CalendarIcon, Link as LinkIcon, Copy, Palette, Type, Image as ImageIcon } from "lucide-react";
import { WidgetStyle } from "./DDayWidget";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ControlPanelProps {
  targetDate: Date;
  setTargetDate: (date: Date) => void;
  style: WidgetStyle;
  setStyle: (style: WidgetStyle) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  image: string | undefined;
  setImage: (url: string) => void;
  onExport: () => void;
}

const PRESET_COLORS = {
  mono: "#EBEBEB", 
  cream: "#FFF5E1", 
  pink: "#FFDBE9", 
  blue: "#C4E4FF", 
  purple: "#E5DBFF", 
  mint: "#D1FAE5", 
};

export function ControlPanel({
  targetDate,
  setTargetDate,
  style,
  setStyle,
  themeColor,
  setThemeColor,
  image,
  setImage,
  onExport
}: ControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [manualDateInput, setManualDateInput] = useState("");
  const { toast } = useToast();
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      toast({
        title: "Note for Notion Embeds",
        description: "Local uploads won't show in Notion. Use an Image URL for sharing!",
        variant: "destructive",
      });
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(e.target.value);
    setImage(e.target.value);
  };

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualDateInput(val);
    
    const parsed = parse(val, "yyyy-MM-dd", new Date());
    if (!isNaN(parsed.getTime())) {
      setTargetDate(parsed);
    }
  };

  const generateEmbedLink = () => {
    const baseUrl = window.location.origin + "/embed";
    const params = new URLSearchParams({
      date: targetDate.toISOString(),
      style,
      theme: themeColor,
    });
    
    if (imageUrlInput && imageUrlInput.trim().length > 0) {
      params.append("image", imageUrlInput.trim());
      console.log("📸 Added image to URL:", imageUrlInput.trim());
    }

    const fullUrl = `${baseUrl}?${params.toString()}`;
    console.log("🔗 Generated embed link:", fullUrl);
    setGeneratedLink(fullUrl);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "복제됨!",
      description: "노션에 /embed 명령어로 붙여넣기 하세요.",
    });
  };

  return (
    <div className="w-full max-w-md space-y-8 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50">
      
      {/* Date Input */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold">D-Day Date</Label>
        <div className="flex gap-2">
            <Input 
                type="text" 
                placeholder="YYYY-MM-DD" 
                value={manualDateInput || format(targetDate, 'yyyy-MM-dd')}
                onChange={handleManualDateChange}
                className="h-12 rounded-xl bg-white/50 border-slate-200 font-mono"
            />
            <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-12 px-0 h-12 rounded-xl border-slate-200 bg-white/50 hover:bg-white/80 transition-all",
                )}
                >
                <CalendarIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden" align="end">
                <Calendar
                mode="single"
                selected={targetDate}
                onSelect={(date) => {
                    if (date) {
                        setTargetDate(date);
                        setManualDateInput(format(date, 'yyyy-MM-dd'));
                    }
                }}
                initialFocus
                className="rounded-md border-none"
                />
            </PopoverContent>
            </Popover>
        </div>
      </div>

      {/* Style Selector */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
          <Type className="w-3 h-3" /> Font Style
        </Label>
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
          {(["flat", "3d", "pixel"] as WidgetStyle[]).map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={cn(
                "py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 capitalize",
                style === s 
                  ? "bg-white shadow-sm text-slate-900 scale-100" 
                  : "text-slate-500 hover:text-slate-700 scale-95 hover:scale-100"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color Theme */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
          <Palette className="w-3 h-3" /> Color Theme
        </Label>
        <div className="flex flex-wrap items-center gap-3">
          {Object.entries(PRESET_COLORS).map(([name, color]) => (
            <button
              key={name}
              onClick={() => setThemeColor(color)}
              className={cn(
                "w-10 h-10 rounded-full border-2 transition-all duration-300 shadow-sm hover:scale-110",
                themeColor === color ? "border-slate-900 scale-110 ring-2 ring-offset-2 ring-slate-200" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
              title={name}
            />
          ))}
          
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white transition-all hover:scale-110",
                  !Object.values(PRESET_COLORS).includes(themeColor) ? "border-slate-900 ring-2 ring-offset-2 ring-slate-200" : "border-slate-200"
                )}
              >
                <div 
                  className="w-full h-full rounded-full"
                  style={{ 
                    background: !Object.values(PRESET_COLORS).includes(themeColor) 
                      ? themeColor 
                      : 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)' 
                  }} 
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 rounded-2xl border-none shadow-2xl">
              <HexColorPicker color={themeColor} onChange={setThemeColor} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Image Input (URL preferred for Embed) */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
          <ImageIcon className="w-3 h-3" /> Widget Image
        </Label>
        
        <div className="space-y-2">
          <label className="text-xs text-slate-500 font-semibold">Image URL (for Notion)</label>
          <Input 
            placeholder="https://example.com/image.jpg" 
            value={imageUrlInput}
            onChange={handleUrlChange}
            className="bg-white/50 border-slate-200"
          />
          <p className="text-[10px] text-slate-400">💡 Use a public image URL (Imgur, Unsplash, etc.) for Notion embeds to work</p>
        </div>
      </div>

      {/* Generate Link Button */}
      <Button 
        className="w-full h-14 text-lg rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 bg-slate-900 hover:bg-slate-800 text-white"
        size="lg"
        onClick={generateEmbedLink}
      >
        <LinkIcon className="mr-2 h-5 w-5" /> 제작하기
      </Button>

      {/* Display Generated Link */}
      {generatedLink && (
        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">생성된 링크</p>
          <button
            onClick={copyLinkToClipboard}
            className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs break-all text-left hover:bg-blue-50 hover:border-blue-300 transition-all text-slate-700 font-mono"
          >
            {generatedLink}
          </button>
          <p className="text-[10px] text-slate-400">🔗 링크를 클릭하면 복제됩니다</p>
          <p className="text-[10px] text-slate-500">노션에서 /embed 명령어로 붙여넣기 하세요</p>
        </div>
      )}

    </div>
  );
}
