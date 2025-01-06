"use client";

import React, { useRef, useState, useEffect } from "react";
import { polygon, bbox, booleanPointInPolygon } from "@turf/turf";
import * as THREE from "three";

/**
 * A single-file page that:
 * 1) Lazy-loads globe.gl only in the browser (no SSR).
 * 2) Creates a minimal dot-matrix globe from your GeoJSON.
 * 3) Adds pins for each area, opening a retro-styled modal with images.
 */

export default function PhotographyPage() {
  const globeRef = useRef<HTMLDivElement | null>(null);

  // We'll store the lazy-loaded globe.gl module here
  const [globeModule, setGlobeModule] = useState<any>(null);

  // 1) Lazy import globe.gl in a client-side effect
  useEffect(() => {
    (async () => {
      try {
        const mod = await import("globe.gl");
        // We'll store the default export (the Globe constructor).
        setGlobeModule(() => mod.default);
      } catch (error) {
        console.error("Failed to load Globe module:", error);
      }
    })();
  }, []);

  // 2) Once we have globe.gl AND our ref is ready, create and configure the globe
  useEffect(() => {
    if (!globeModule || !globeRef.current) return;

    const GlobeConstructor = globeModule; // The actual function you can 'new'
    const globeInstance = new GlobeConstructor(globeRef.current);

    // Basic styling
    globeInstance
      .showGlobe(false)
      .showGraticules(true)
      .showAtmosphere(false)
      .backgroundColor("#1a1a1a");

    (async () => {
      try {
        // 2a) Load GeoJSON for your dot-matrix fill
        const res = await fetch("/ne_110m_admin_0_countries.json");
        const geojson = await res.json();

        const interiorDots = createDotMatrix(geojson);

        // 2b) Pins for each area (you can unify with your existing lat/lng if you like)
        const travelPins = [
          { id: "ny", lat: 40.7128, lng: -74.0060, pin: true, area: "New York" },
          { id: "socal", lat: 34.0522, lng: -118.2437, pin: true, area: "SoCal" },
          { id: "southflorida", lat: 26.350519, lng: -80.089828, pin: true, area: "South Florida" },
          { id: "iceland", lat: 65.009835, lng: -19.198598, pin: true, area: "Iceland" },
          { id: "peru", lat: -10.962764, lng: -74.618642, pin: true, area: "Peru" },
          { id: "italy", lat: 43.580391, lng: 12.062670, pin: true, area: "Italy" },
          { id: "france", lat: 47.040182, lng: 2.740044, pin: true, area: "France" },
          { id: "yellowstone", lat: 44.433780, lng: -110.696687, pin: true, area: "Yellowstone" },
          { id: "vancouver", lat: 49.253465, lng: -123.043325, pin: true, area: "Vancouver" },
          { id: "gbnp", lat: 54.800685, lng: -127.647608, pin: true, area: "GBNP" },
          { id: "alaska", lat: 59.355596, lng: -135.474302, pin: true, area: "Alaska" },
          { id: "debug", lat: 0, lng: 0, pin: true, area: "debug" },
        ];

        const allPoints = [...interiorDots]; // or just interiorDots

        globeInstance
          .pointOfView({ lat: 0, lng: -55, altitude: 1.5 })
          .pointRadius((d: any) => (d.pin ? 0.75 : 0.4))
          .pointsData(allPoints)
          .pointLat("lat")
          .pointLng("lng")
          .pointColor((d: any) => (d.pin ? "#FF4F00" : "#FF4F00"))
          .pointAltitude(() => 0.005)
          // HTML pins:
          .htmlElementsData(travelPins)
          .htmlLat("lat")
          .htmlLng("lng")
          .htmlAltitude(0)
          .htmlElement((d: any) => {
            // create a container
            const el = document.createElement("div");
            el.classList.add("my-globe-html-container");

            // label + pin
            el.innerHTML = `
              <div class="my-globe-label">
                ${d.area}
              </div>
              <div class="my-globe-pin"></div>
            `;

            // on click => showRetroModal
            el.addEventListener("click", (evt) => {
              evt.stopPropagation();
              showRetroModal(d.area);
            });

            return el;
          });

      } catch (err) {
        console.error("Failed to fetch or parse JSON:", err);
      }
    })();
  }, [globeModule]);

  return (
    <main style={{ width: "100%", height: "80vh" }}>
      <div
        className="bg-bgDark"
        ref={globeRef}
        style={{ width: "100%", height: "100%" }}
      />
      {!globeModule && (
        <p className="bg-bgDark text-gray-50">
          Loading the globe library...
        </p>
      )}
    </main>
  );
}

/** 
 * Builds the in-polygon dot data by sampling each feature in the GeoJSON.
 */
function createDotMatrix(geojson: any) {
  const STEP = 1.5;
  const results: any[] = [];

  geojson.features.forEach((feature: any) => {
    const { type, coordinates } = feature.geometry;
    if (type === "Polygon") {
      results.push(...samplePolygonGrid(coordinates[0], STEP));
    } else if (type === "MultiPolygon") {
      coordinates.forEach((poly: number[][][]) => {
        results.push(...samplePolygonGrid(poly[0], STEP));
      });
    }
  });
  return results;
}

function samplePolygonGrid(outerRing: number[][], STEP: number) {
  const turfPoly = polygon([outerRing]);
  const [minLng, minLat, maxLng, maxLat] = bbox(turfPoly);

  const dots: any[] = [];
  for (let lat = minLat; lat <= maxLat; lat += STEP) {
    for (let lng = minLng; lng <= maxLng; lng += STEP) {
      if (booleanPointInPolygon([lng, lat], turfPoly)) {
        dots.push({ lat, lng });
      }
    }
  }
  return dots;
}

// Photo interface
interface Photo {
  area: string;   
  region: string; 
  src: string;    
  alt: string;    
}

// Hardcoded sample images
const photos: Photo[] = [
  // ALASKA
  // ketchikan?  (folder name includes “?”)
  { area: "Alaska", region: "ketchikan", src: "/images/alaska/ketchikan?/IMG_1408.jpeg", alt: "IMG_1408" },
  { area: "Alaska", region: "ketchikan", src: "/images/alaska/ketchikan?/IMG_1409.jpeg", alt: "IMG_1409" },

  // juneau
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_1328 Medium.jpeg", alt: "IMG_1328" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_1340 Medium.jpeg", alt: "IMG_1340" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_1343 Medium.jpeg", alt: "IMG_1343" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_1355 Medium.jpeg", alt: "IMG_1355" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_1357 Medium.jpeg", alt: "IMG_1357" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_1362 Medium.jpeg", alt: "IMG_1362" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_1364 Medium.jpeg", alt: "IMG_1364" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_1365 Medium.jpeg", alt: "IMG_1365" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_5210 Medium.jpeg", alt: "IMG_5210" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_5222 Medium.jpeg", alt: "IMG_5222" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_5235 Medium.jpeg", alt: "IMG_5235" },
  { area: "Alaska", region: "juneau", src: "/images/alaska/juneau/IMG_1335 Medium.jpeg", alt: "IMG_1335" },

  // other
  { area: "Alaska", region: "other", src: "/images/alaska/other/IMG_1387 Medium.jpeg", alt: "IMG_1387" },

  // DEBUG
  { area: "debug", region: "debugRegion1", src: "/images/debug/debugRegion1/IMG_1155 Medium.jpeg", alt: "IMG_1155" },

  // FRANCE
  // paris
  { area: "France", region: "paris", src: "/images/france/paris/IMG_2369_jpg Medium.jpeg", alt: "IMG_2369_jpg" },

  // hyéres (hyéres folder)
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_2911 Medium.jpeg", alt: "IMG_2911" },
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_2922 Medium.jpeg", alt: "IMG_2922" },
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_2939 Medium.jpeg", alt: "IMG_2939" },
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_3053 Medium.jpeg", alt: "IMG_3053" },
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_3166 Medium.jpeg", alt: "IMG_3166" },
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_3185 Medium.jpeg", alt: "IMG_3185" },
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_3197 Medium.jpeg", alt: "IMG_3197" },
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_3210 Medium.jpeg", alt: "IMG_3210" },
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_3211 Medium.jpeg", alt: "IMG_3211" },
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_3237 Medium.jpeg", alt: "IMG_3237" },
  { area: "France", region: "hyéres", src: "/images/france/hyéres/IMG_3287 Medium.jpeg", alt: "IMG_3287" },

  // GBNP
  // gb
  { area: "GBNP", region: "gb", src: "/images/gbnp/gb/IMG_1396 Medium.jpeg", alt: "IMG_1396" },
  { area: "GBNP", region: "gb", src: "/images/gbnp/gb/IMG_1399 Medium.jpeg", alt: "IMG_1399" },
  { area: "GBNP", region: "gb", src: "/images/gbnp/gb/IMG_5254 Medium.jpeg", alt: "IMG_5254" },
  { area: "GBNP", region: "gb", src: "/images/gbnp/gb/IMG_5256 Medium.jpeg", alt: "IMG_5256" },
  { area: "GBNP", region: "gb", src: "/images/gbnp/gb/IMG_5270 Medium.jpeg", alt: "IMG_5270" },
  { area: "GBNP", region: "gb", src: "/images/gbnp/gb/IMG_5275 Medium.jpeg", alt: "IMG_5275" },
  { area: "GBNP", region: "gb", src: "/images/gbnp/gb/IMG_5288 Medium.jpeg", alt: "IMG_5288" },
  { area: "GBNP", region: "gb", src: "/images/gbnp/gb/IMG_5295 Medium.jpeg", alt: "IMG_5295" },

  // ICELAND
  // all (sorting when more photos added)
  { area: "Iceland", region: "all", src: "/images/iceland/all (sorting when more photos added)/IMG_1228 Medium.jpeg", alt: "IMG_1228" },
  { area: "Iceland", region: "all", src: "/images/iceland/all (sorting when more photos added)/IMG_2388 Medium.jpeg", alt: "IMG_2388" },
  { area: "Iceland", region: "all", src: "/images/iceland/all (sorting when more photos added)/IMG_2448 Medium.jpeg", alt: "IMG_2448" },
  { area: "Iceland", region: "all", src: "/images/iceland/all (sorting when more photos added)/IMG_2456 Medium.jpeg", alt: "IMG_2456" },
  { area: "Iceland", region: "all", src: "/images/iceland/all (sorting when more photos added)/IMG_2470 Medium.jpeg", alt: "IMG_2470" },
  { area: "Iceland", region: "all", src: "/images/iceland/all (sorting when more photos added)/IMG_2487 Medium.jpeg", alt: "IMG_2487" },
  { area: "Iceland", region: "all", src: "/images/iceland/all (sorting when more photos added)/IMG_2557 Medium.jpeg", alt: "IMG_2557" },
  { area: "Iceland", region: "all", src: "/images/iceland/all (sorting when more photos added)/IMG_2605 Medium.jpeg", alt: "IMG_2605" },
  { area: "Iceland", region: "all", src: "/images/iceland/all (sorting when more photos added)/IMG_2633 Medium.jpeg", alt: "IMG_2633" },

  // reykjavík
  { area: "Iceland", region: "reykjavík", src: "/images/iceland/reykjavík/IMG_2359 Medium.jpeg", alt: "IMG_2359" },

  // ITALY
  // florence (folder is spelled “florance” on disk)
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_2382_jpg Medium.jpeg", alt: "IMG_2382_jpg" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_2384_jpg Medium.jpeg", alt: "IMG_2384_jpg" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3293 Medium.jpeg", alt: "IMG_3293" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3297 Medium.jpeg", alt: "IMG_3297" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3308 Medium.jpeg", alt: "IMG_3308" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3318 Medium.jpeg", alt: "IMG_3318" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3321 Medium.jpeg", alt: "IMG_3321" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3330 Medium.jpeg", alt: "IMG_3330" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3335 Medium.jpeg", alt: "IMG_3335" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3336 Medium.jpeg", alt: "IMG_3336" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3340 Medium.jpeg", alt: "IMG_3340" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3348 Medium.jpeg", alt: "IMG_3348" },
  { area: "Italy", region: "florence", src: "/images/italy/florance/IMG_3355 Medium.jpeg", alt: "IMG_3355" },

  // milan
  { area: "Italy", region: "milan", src: "/images/italy/milan/IMG_2446_jpg Medium.jpeg", alt: "IMG_2446_jpg" },

  // venice
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2722 Medium.jpeg", alt: "IMG_2722" },
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2727 Medium.jpeg", alt: "IMG_2727" },
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2754 Medium.jpeg", alt: "IMG_2754" },
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2763 Medium.jpeg", alt: "IMG_2763" },
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2767 Medium.jpeg", alt: "IMG_2767" },
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2785-Edit Medium.jpeg", alt: "IMG_2785-Edit" },
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2822 Medium.jpeg", alt: "IMG_2822" },
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2875 Medium.jpeg", alt: "IMG_2875" },
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2903 Medium.jpeg", alt: "IMG_2903" },
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2905 Medium.jpeg", alt: "IMG_2905" },
  { area: "Italy", region: "venice", src: "/images/italy/venice/IMG_2907 Medium.jpeg", alt: "IMG_2907" },

  // NY
  // nyc
  { area: "New York", region: "nyc", src: "/images/ny/nyc/IMG_0251 Medium.jpeg", alt: "IMG_0251" },
  { area: "New York", region: "nyc", src: "/images/ny/nyc/IMG_0275 Medium.jpeg", alt: "IMG_0275" },
  { area: "New York", region: "nyc", src: "/images/ny/nyc/IMG_0300 Medium.jpeg", alt: "IMG_0300" },
  { area: "New York", region: "nyc", src: "/images/ny/nyc/IMG_0304 Medium.jpeg", alt: "IMG_0304" },
  { area: "New York", region: "nyc", src: "/images/ny/nyc/IMG_0321 Medium.jpeg", alt: "IMG_0321" },
  { area: "New York", region: "nyc", src: "/images/ny/nyc/IMG_0501 Medium.jpeg", alt: "IMG_0501" },

  // hamptons
  { area: "New York", region: "hamptons", src: "/images/ny/hamptons/IMG_0254 Medium.jpeg", alt: "IMG_0254" },
  { area: "New York", region: "hamptons", src: "/images/ny/hamptons/IMG_0262 Medium.jpeg", alt: "IMG_0262" },

  // PERU
  // lima
  { area: "Peru", region: "lima", src: "/images/peru/lima/IMG_0930 Medium.jpeg", alt: "IMG_0930" },
  { area: "Peru", region: "lima", src: "/images/peru/lima/IMG_0932 Medium.jpeg", alt: "IMG_0932" },
  { area: "Peru", region: "lima", src: "/images/peru/lima/IMG_0934 Medium.jpeg", alt: "IMG_0934" },
  { area: "Peru", region: "lima", src: "/images/peru/lima/IMG_0940 Medium.jpeg", alt: "IMG_0940" },

  // machupicchu
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5059-HDR Medium.jpeg", alt: "IMG_5059-HDR" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5072 Medium.jpeg", alt: "IMG_5072" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5083 Medium.jpeg", alt: "IMG_5083" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5095 Medium.jpeg", alt: "IMG_5095" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5098 Medium.jpeg", alt: "IMG_5098" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5109 Medium.jpeg", alt: "IMG_5109" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5119 Medium.jpeg", alt: "IMG_5119" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5123 Medium.jpeg", alt: "IMG_5123" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5132 Medium.jpeg", alt: "IMG_5132" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5134 Medium.jpeg", alt: "IMG_5134" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5136 Medium.jpeg", alt: "IMG_5136" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5143 Medium.jpeg", alt: "IMG_5143" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5147 Medium.jpeg", alt: "IMG_5147" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5151 Medium.jpeg", alt: "IMG_5151" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5162 Medium.jpeg", alt: "IMG_5162" },
  { area: "Peru", region: "machupicchu", src: "/images/peru/machupicchu/IMG_5189 Medium.jpeg", alt: "IMG_5189" },

  // SOCAL
  // sf
  { area: "SoCal", region: "sf", src: "/images/socal/sf/IMG_9894-Edit-Edit-Edit Medium.jpeg", alt: "IMG_9894-Edit-Edit-Edit" },

  // carmel
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_0025 Medium.jpeg", alt: "IMG_0025" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_0069 Medium.jpeg", alt: "IMG_0069" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_0079 Medium.jpeg", alt: "IMG_0079" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_0126 Medium.jpeg", alt: "IMG_0126" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_0132 Medium.jpeg", alt: "IMG_0132" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_9901 Medium.jpeg", alt: "IMG_9901" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_9931-Edit Medium.jpeg", alt: "IMG_9931-Edit" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_9934 Medium.jpeg", alt: "IMG_9934" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_9940-Enhanced-NR-Edit Medium.jpeg", alt: "IMG_9940-Enhanced-NR-Edit" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_9947-Edit Medium.jpeg", alt: "IMG_9947-Edit" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_9955 Medium.jpeg", alt: "IMG_9955" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_9957 Medium.jpeg", alt: "IMG_9957" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_9963 Medium.jpeg", alt: "IMG_9963" },
  { area: "SoCal", region: "carmel", src: "/images/socal/carmel/IMG_9999 Medium.jpeg", alt: "IMG_9999" },

  // SOUTHFLORIDA
  // airshow
  { area: "South Florida", region: "airshow", src: "/images/southflorida/airshow/IMG_7918 Medium.jpeg", alt: "IMG_7918" },
  { area: "South Florida", region: "airshow", src: "/images/southflorida/airshow/IMG_7933 Medium.jpeg", alt: "IMG_7933" },
  { area: "South Florida", region: "airshow", src: "/images/southflorida/airshow/IMG_7982 Medium.jpeg", alt: "IMG_7982" },
  { area: "South Florida", region: "airshow", src: "/images/southflorida/airshow/IMG_7983 Medium.jpeg", alt: "IMG_7983" },
  { area: "South Florida", region: "airshow", src: "/images/southflorida/airshow/IMG_8319 Medium.jpeg", alt: "IMG_8319" },
  { area: "South Florida", region: "airshow", src: "/images/southflorida/airshow/IMG_8465 Medium.jpeg", alt: "IMG_8465" },

  // boca
  { area: "South Florida", region: "boca", src: "/images/southflorida/boca/IMG_1524 Medium.jpeg", alt: "IMG_1524" },
  { area: "South Florida", region: "boca", src: "/images/southflorida/boca/IMG_1528 Medium.jpeg", alt: "IMG_1528" },
  { area: "South Florida", region: "boca", src: "/images/southflorida/boca/IMG_1644 Medium.jpeg", alt: "IMG_1644" },
  { area: "South Florida", region: "boca", src: "/images/southflorida/boca/IMG_1789 Medium.jpeg", alt: "IMG_1789" },
  { area: "South Florida", region: "boca", src: "/images/southflorida/boca/IMG_1790 Medium.jpeg", alt: "IMG_1790" },
  { area: "South Florida", region: "boca", src: "/images/southflorida/boca/IMG_1791 Medium.jpeg", alt: "IMG_1791" },
  { area: "South Florida", region: "boca", src: "/images/southflorida/boca/IMG_1792 Medium.jpeg", alt: "IMG_1792" },
  { area: "South Florida", region: "boca", src: "/images/southflorida/boca/IMG_1795 Medium.jpeg", alt: "IMG_1795" },
  { area: "South Florida", region: "boca", src: "/images/southflorida/boca/IMG_1952 Medium.jpeg", alt: "IMG_1952" },

  // deerfield
  { area: "South Florida", region: "deerfield", src: "/images/southflorida/deerfield/IMG_1703-Enhanced-SR Medium.jpeg", alt: "IMG_1703-Enhanced-SR" },
  { area: "South Florida", region: "deerfield", src: "/images/southflorida/deerfield/IMG_5787 Medium.jpeg", alt: "IMG_5787" },

  // ftl
  { area: "South Florida", region: "ftl", src: "/images/southflorida/ftl/copahardrockdenoise-clear.jpeg", alt: "copahardrockdenoise-clear" },

  // miami
  { area: "South Florida", region: "miami", src: "/images/southflorida/miami/IMG_0859 Medium.jpeg", alt: "IMG_0859" },
  { area: "South Florida", region: "miami", src: "/images/southflorida/miami/IMG_0864 Medium.jpeg", alt: "IMG_0864" },
  { area: "South Florida", region: "miami", src: "/images/southflorida/miami/IMG_0868 Medium.jpeg", alt: "IMG_0868" },
  { area: "South Florida", region: "miami", src: "/images/southflorida/miami/IMG_0869 Medium.jpeg", alt: "IMG_0869" },
  { area: "South Florida", region: "miami", src: "/images/southflorida/miami/IMG_0912 Medium.jpeg", alt: "IMG_0912" },

  // northernlights
  { area: "South Florida", region: "northernlights", src: "/images/southflorida/northernlights/IMG_2286 Medium.jpeg", alt: "IMG_2286" },

  // pinecrest
  { area: "South Florida", region: "pinecrest", src: "/images/southflorida/pinecrest/IMG_1011 Medium.jpeg", alt: "IMG_1011" },
  { area: "South Florida", region: "pinecrest", src: "/images/southflorida/pinecrest/IMG_2107 Medium.jpeg", alt: "IMG_2107" },
  { area: "South Florida", region: "pinecrest", src: "/images/southflorida/pinecrest/IMG_0969 Medium.jpeg", alt: "IMG_0969" },

  // VANCOUVER
  // northernlights
  { area: "Vancouver", region: "northernlights", src: "/images/vancouver/northernlights/IMG_1416 Medium.jpeg", alt: "IMG_1416" },
  { area: "Vancouver", region: "northernlights", src: "/images/vancouver/northernlights/IMG_1417 Medium.jpeg", alt: "IMG_1417" },
  { area: "Vancouver", region: "northernlights", src: "/images/vancouver/northernlights/IMG_1420 Medium.jpeg", alt: "IMG_1420" },
  { area: "Vancouver", region: "northernlights", src: "/images/vancouver/northernlights/IMG_1426 Medium.jpeg", alt: "IMG_1426" },
  { area: "Vancouver", region: "northernlights", src: "/images/vancouver/northernlights/IMG_1428 Medium.jpeg", alt: "IMG_1428" },
  { area: "Vancouver", region: "northernlights", src: "/images/vancouver/northernlights/IMG_1429 Medium.jpeg", alt: "IMG_1429" },
  { area: "Vancouver", region: "northernlights", src: "/images/vancouver/northernlights/IMG_1431 Medium.jpeg", alt: "IMG_1431" },
  { area: "Vancouver", region: "northernlights", src: "/images/vancouver/northernlights/IMG_1432 Medium.jpeg", alt: "IMG_1432" },
  { area: "Vancouver", region: "northernlights", src: "/images/vancouver/northernlights/IMG_1433 Medium.jpeg", alt: "IMG_1433" },

  // city
  { area: "Vancouver", region: "city", src: "/images/vancouver/city/IMG_1290.jpeg", alt: "IMG_1290" },
  { area: "Vancouver", region: "city", src: "/images/vancouver/city/IMG_1299.jpeg", alt: "IMG_1299" },
  { area: "Vancouver", region: "city", src: "/images/vancouver/city/IMG_1300.jpeg", alt: "IMG_1300" },
  // Noticed "IMG_1310 2.jpeg" in the listing; if you need it, add here.
  { area: "Vancouver", region: "city", src: "/images/vancouver/city/IMG_1324.jpeg", alt: "IMG_1324" },

  // YELLOWSTONE
  // north
  { area: "Yellowstone", region: "north", src: "/images/yellowstone/north/IMG_3614-Enhanced-NR Medium.jpeg", alt: "IMG_3614-Enhanced-NR" },
  { area: "Yellowstone", region: "north", src: "/images/yellowstone/north/IMG_3653-Enhanced-SR Medium.jpeg", alt: "IMG_3653-Enhanced-SR" },
  { area: "Yellowstone", region: "north", src: "/images/yellowstone/north/IMG_3669 Medium.jpeg", alt: "IMG_3669" },
  { area: "Yellowstone", region: "north", src: "/images/yellowstone/north/IMG_3693 Medium.jpeg", alt: "IMG_3693" },
  { area: "Yellowstone", region: "north", src: "/images/yellowstone/north/IMG_3724-Edit Medium.jpeg", alt: "IMG_3724-Edit" },
];

/** 
 * showRetroModal:
 *  - filters the photos array by area
 *  - groups them by region
 *  - builds a sticky, scrollable modal
 */
function showRetroModal(areaTitle: string) {
  const backdrop = document.createElement("div");
  backdrop.classList.add("retro-modal-backdrop");

  const modal = document.createElement("div");
  modal.classList.add("retro-modal-content");
  modal.setAttribute(
    "style",
    "width: 80%; max-width: 1000px; max-height: 80vh; overflow-y: auto;"
  );

  // Filter photos by area
  const filteredPhotos = photos.filter((p) => p.area.toLowerCase() === areaTitle.toLowerCase());

  // Group by region
  const regionMap: Record<string, Photo[]> = {};
  filteredPhotos.forEach((photo) => {
    if (!regionMap[photo.region]) {
      regionMap[photo.region] = [];
    }
    regionMap[photo.region].push(photo);
  });

  let html = `
    <div 
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        backdrop-filter: blur(6px);
        background: rgba(25, 25, 25, 0.3);
        padding: 0.5rem;
        z-index: 10;
        margin-bottom: 1.5rem;
      "
    >
      <h2 style="margin: 0;">${areaTitle}</h2>
      <button 
        id="retro-close-btn"
        style="
          color: #f9fafb;
          cursor: pointer;
          font-family: 'Berkeley Mono', monospace;
        "
      >
        Close
      </button>
    </div>
  `;

  // Build a section for each region
  Object.keys(regionMap).forEach((regionName) => {
    const regionPhotos = regionMap[regionName];
    html += `
      <section style="margin-bottom: 1.5rem;">
        <h3 style="margin-bottom: 0.5rem;">${regionName}</h3>
        <div style="
          display: grid;
          gap: 0.5rem;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        ">
    `;

    regionPhotos.forEach((photo) => {
      html += `
        <img
          src="${photo.src}"
          alt="${photo.alt}"
          loading="lazy"
          style="
            width: 146.66;
            height: 220px;
            object-fit: cover;
            background: #4b5563;
          "
        />
      `;
    });

    html += `</div></section>`;
  });

  modal.innerHTML = html;
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  const closeBtn = modal.querySelector("#retro-close-btn");
  closeBtn?.addEventListener("click", () => {
    backdrop.remove();
  });
}