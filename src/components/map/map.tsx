import React, { useEffect, useRef } from "react";

const DEFAULT_CENTER = { lat: 10.799404860172336, lng: 106.68865305328224 }; // Cà Mèn Quán 10.799404860172336, 106.68865305328224
declare global { interface Window { H: any } }

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    // tránh nạp trùng
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.type = "text/javascript"; // ép classic script
    s.src = src;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

export const HereMap: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      // 1) CSS UI
      if (!document.querySelector('link[href*="mapsjs-ui.css"]')) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "https://js.api.here.com/v3/3.1/mapsjs-ui.css";
        document.head.appendChild(css);
      }

      // 2) Nạp lần lượt 4 file UMD (không phải bundle)
      await loadScript("https://js.api.here.com/v3/3.1/mapsjs-core.js");
      await loadScript("https://js.api.here.com/v3/3.1/mapsjs-service.js");
      await loadScript("https://js.api.here.com/v3/3.1/mapsjs-mapevents.js");
      await loadScript("https://js.api.here.com/v3/3.1/mapsjs-ui.js");

      const H = window.H;
      const apikey = process.env.REACT_APP_HERE_API_KEY as string;
      if (!apikey) { console.error("Missing REACT_APP_HERE_API_KEY"); return; }

      const platform = new H.service.Platform({ apikey });
      const layers = platform.createDefaultLayers();

      const map = new H.Map(ref.current!, layers.vector.normal.map, {
        center: DEFAULT_CENTER,
        zoom: 16,
        pixelRatio: window.devicePixelRatio || 1,
      });

      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      const ui = H.ui.UI.createDefault(map, layers);
      ui.getControl("mapsettings")?.setVisibility(false);
      ui.getControl("zoom")?.setVisibility(false);
      ui.getControl("scalebar")?.setVisibility(false);

      const marker = new H.map.Marker(DEFAULT_CENTER);
      map.addObject(marker);

      const onResize = () => map.getViewPort().resize();
      window.addEventListener("resize", onResize);

      // cleanup
      return () => {
        window.removeEventListener("resize", onResize);
        map.dispose();
      };
    })().catch(console.error);
  }, []);

  return (
    <div
      ref={ref}
      style={{ width: 400, height: 400, borderRadius: 10, overflow: "hidden" }}
    />
  );
};
