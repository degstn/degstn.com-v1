"use client";

import React, { useEffect, useRef } from "react";
import Globe from "globe.gl";
import { polygon, bbox, booleanPointInPolygon } from "@turf/turf";

interface MyPoint {
  lat: number;
  lng: number;
  pin?: boolean;
  city?: string;
}

export default function DotMatrixGlobe() {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    // Initialize the Globe only on the client
    const globe = new Globe(globeRef.current)
      .showGlobe(false)
      .showAtmosphere(false)
      .backgroundColor("#e2deda");

    // Fetch your JSON in client-side code
    (async () => {
      const res = await fetch("/ne_110m_admin_0_countries.json");
      const geojson = await res.json();

      // Generate your interior dots
      const interiorDots: MyPoint[] = createDotMatrix(geojson);

      // Example travel pins
      const travelPins: MyPoint[] = [
        { lat: 40.7128, lng: -74.006, pin: true, city: "NYC" },
        { lat: 34.0522, lng: -118.2437, pin: true, city: "LA" },
      ];

      const allPoints = [...interiorDots, ...travelPins];

      globe
        .pointOfView({ lat: 0, lng: 0, altitude: 1.5 })
        .pointRadius((d: any) => (d.pin ? 0.75 : 0.4))
        .pointsData(allPoints)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor((d: any) => (d.pin ? "#FF4F00" : "#4b5563"))
        .pointAltitude(() => 0.005)
        .onPointClick((point: any) => {
          if (point.pin) {
            alert(`Clicked on ${point.city}`);
          } else {
            console.log("Clicked a standard dot:", point.lat, point.lng);
          }
        });
    })();
  }, []);

  return <div ref={globeRef} style={{ width: "100%", height: "80vh" }} />;
}

/** Creates an array of { lat, lng } from your GeoJSON. */
function createDotMatrix(geojson: any) {
  const STEP = 1.5; // Adjust step for performance vs. detail
  const results: MyPoint[] = [];

  geojson.features.forEach((feature: any) => {
    const { type, coordinates } = feature.geometry;

    if (type === "Polygon") {
      results.push(...samplePolygonGrid(coordinates[0], STEP));
    } else if (type === "MultiPolygon") {
      coordinates.forEach((polygonCoords: number[][][]) => {
        results.push(...samplePolygonGrid(polygonCoords[0], STEP));
      });
    }
  });
  return results;
}

function samplePolygonGrid(outerRing: number[][], STEP: number) {
  const turfPoly = polygon([outerRing]);
  const [minLng, minLat, maxLng, maxLat] = bbox(turfPoly);

  const dots: MyPoint[] = [];

  for (let lat = minLat; lat <= maxLat; lat += STEP) {
    for (let lng = minLng; lng <= maxLng; lng += STEP) {
      if (booleanPointInPolygon([lng, lat], turfPoly)) {
        dots.push({ lat, lng });
      }
    }
  }
  return dots;
}