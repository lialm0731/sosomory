import { useLocation } from "wouter";
import { DDayWidget, WidgetStyle } from "@/components/DDayWidget";
import { useMemo } from "react";

export default function Embed() {
  const [location, params] = useLocation();
  
  // Parse query parameters manually since wouter doesn't have a built-in hook for it in all versions
  const searchParams = new URLSearchParams(window.location.search);
  
  const targetDate = searchParams.get("date") 
    ? new Date(searchParams.get("date")!) 
    : new Date();
    
  const style = (searchParams.get("style") as WidgetStyle) || "3d";
  const themeColor = searchParams.get("theme") || "#C4E4FF";
  const imageUrl = searchParams.get("image") || undefined;

  return (
    <DDayWidget
      targetDate={targetDate}
      style={style}
      themeColor={themeColor}
      imageUrl={imageUrl}
    />
  );
}
