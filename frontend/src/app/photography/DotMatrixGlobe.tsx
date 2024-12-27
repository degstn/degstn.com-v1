"use client";

import React, { useRef, useState, useEffect } from "react";
import { polygon, bbox, booleanPointInPolygon } from "@turf/turf";
import * as THREE from "three";

/**
 * A single-file page that:
 * 1) Lazy-loads globe.gl only in the browser (no SSR).
 * 2) Creates a minimal dot-matrix globe from your GeoJSON.
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

    // Fetch your JSON data, build the dot matrix, then load into globe
    (async () => {
      try {
        const res = await fetch("/ne_110m_admin_0_countries.json");
        const geojson = await res.json();

        // Build your "dot matrix" array
        const interiorDots = createDotMatrix(geojson);

        const travelPins = [
          { id: "ny", lat: 40.7128, lng: -74.0060, pin: true, area: "NY" },
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

        const allPoints = [...interiorDots];

        // Configure the globe with your data
        globeInstance
        
          .pointOfView({ lat: 0, lng: -55, altitude: 1.5 })
          .pointRadius((d: any) => (d.pin ? 0.75 : 0.4))
          .pointsData(allPoints)
          .pointLat("lat")
          .pointLng("lng")
          .pointColor((d: any) => (d.pin ? "#FF4F00" : "#FF4F00"))
          .pointAltitude(() => 0.005)
          

          
          
          
          
  .htmlElementsData(travelPins) // or any array of { lat, lng, city, photos[] }
  .htmlLat("lat")
  .htmlLng("lng")
  .htmlAltitude(0) // or 0.1 if you want it floating above the globe
  .htmlElement((d: any) => {
    // 1) Create a container element
    const el = document.createElement("div");
    // We'll style it with CSS classes:
    el.classList.add("my-globe-html-container");

    // 2) Insert the label and pin HTML
    el.innerHTML = `
      <div class="my-globe-label">
        ${d.area}
      </div>
      <div class="my-globe-pin"></div>
    `;

    // 3) Make the container clickable
    // el.addEventListener("click", (e) => {
    //   e.stopPropagation(); // stop the globe from picking the click
    //   // For example, open a modal or show images:
    //   console.log("Clicked city:", d.area);
    //   alert("You clicked on " + d.area);
    //   // Or do something more advanced, like open a gallery or load photos
    // });
    el.addEventListener("click", (e) => {
      e.stopPropagation(); // stop the globe from picking the click
      // Instead, open a retro modal with info or images:
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
      <div className="bg-bgDark" ref={globeRef} style={{ width: "100%", height: "100%" }} />
      {!globeModule && <p className="bg-bgDark te">Loading the globe library...</p>}
    </main>
  );
}

/**
 * Builds the in-polygon dot data by sampling each feature in the GeoJSON.
 */
function createDotMatrix(geojson: any) {
  const STEP = 1.5; // larger the number the less fucking gigabytes of memory you leech from someones system
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

/**
 * Loops lat/lng in a bounding box, only pushing points inside the polygon.
 */
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

function showRetroModal(area: string) {
  // Create the backdrop
  const backdrop = document.createElement("div");
  backdrop.classList.add("retro-modal-backdrop");

  // Create the modal content
  const modal = document.createElement("div");
  modal.classList.add("retro-modal-content");
  modal.innerHTML = `
    <h2 >${area}</h2>
    <p>[] [] </p>
    <button id="retro-close-btn">Close</button>
  `;

  // Combine and add to the document
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Close logic
  const closeBtn = modal.querySelector("#retro-close-btn");
  closeBtn?.addEventListener("click", () => {
    backdrop.remove();
  });
}