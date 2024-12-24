"use client";

import React, { useEffect, useRef } from "react";
import Globe from "globe.gl";
// We'll import only the turf methods we need:
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

    const globeInstance = new Globe(globeRef.current);

    // Hide default globe texture & atmosphere for minimal look
    globeInstance
      .showGlobe(false)
      .showAtmosphere(false)
      .backgroundColor("#e2deda");

    (async () => {
      const res = await fetch("/ne_110m_admin_0_countries.json");
      const geojson = await res.json();

      let interiorDots: { lat: number; lng: number }[] = [];
      const STEP = 1.5; // smaller step => more detail => more CPU usage

      geojson.features.forEach((feature: any) => {
        const { type, coordinates } = feature.geometry;
        if (type === "Polygon") {
          const outerRing = coordinates[0];
          interiorDots.push(...samplePolygonGrid(outerRing, STEP));
        } else if (type === "MultiPolygon") {
          coordinates.forEach((polygonCoords: number[][][]) => {
            const outerRing = polygonCoords[0];
            interiorDots.push(...samplePolygonGrid(outerRing, STEP));
          });
        }
      });

      // Example travel pins
      const travelPins = [
        { lat: 40.7128, lng: -74.0060, pin: true, city: "NYC" },
        { lat: 34.0522, lng: -118.2437, pin: true, city: "LA" },
      ];

      // Combine into a single array
      const allPoints: MyPoint[] = [...interiorDots, ...travelPins];

      globeInstance
      .pointOfView({ lat: 0, lng: 0, altitude: 1.5 })
      .pointRadius((d: object) => (d as MyPoint).pin ? 0.75 : 0.4)
        .pointsData(allPoints)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor(d => (d as MyPoint).pin ? "#FF4F00" : "#4b5563")
        .pointAltitude(() => 0.005)
        // Add the click handler here:
        .onPointClick((point, event) => {
          console.log("Clicked point:", point);
          // For example, show city name if it's a pin
          if ((point as MyPoint).pin) {
            alert(`You clicked on ${(point as MyPoint).city}`);
          } else {
            console.log("not a pin this does fuck all");
          }
        });
    })();
  }, []);

  const styles = {
    width: '100%',
    height: '100%', // or a fixed 80vh, etc.
  };
  
  return (
    <div style={styles}>
      <div ref={globeRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

/**
 * samplePolygonGrid:
 * - Takes an array of [lng, lat] coords forming the polygon's outer ring.
 * - Converts to a turf polygon, gets the bounding box, then steps through
 *   that bounding box in increments of `STEP`.
 * - For each grid point, checks if it’s inside the polygon.
 */
function samplePolygonGrid(outerRing: number[][], STEP: number) {
  const turfPoly = polygon([outerRing]);
  const [minLng, minLat, maxLng, maxLat] = bbox(turfPoly);

  const results: { lat: number; lng: number }[] = [];

  for (let lat = minLat; lat <= maxLat; lat += STEP) {
    for (let lng = minLng; lng <= maxLng; lng += STEP) {
      if (booleanPointInPolygon([lng, lat], turfPoly)) {
        results.push({ lat, lng });
      }
    }
  }

  return results;
}