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
      .showAtmosphere(false)
      .backgroundColor("#e2deda");

    // Fetch your JSON data, build the dot matrix, then load into globe
    (async () => {
      try {
        const res = await fetch("/ne_110m_admin_0_countries.json");
        const geojson = await res.json();

        // Build your "dot matrix" array
        const interiorDots = createDotMatrix(geojson);

        // Example travel pins
        const travelPins = [
          { lat: 40.7128, lng: -74.0060, pin: true, city: "NYC" },
          { lat: 34.0522, lng: -118.2437, pin: true, city: "LA" },
          { lat: 0, lng: 0, pin: true, city: "CenterOfGlobe" },
        ];

        const allPoints = [...interiorDots];

        // Configure the globe with your data
        globeInstance
          .pointOfView({ lat: 0, lng: 0, altitude: 1.5 })
          .pointRadius((d: any) => (d.pin ? 0.75 : 0.4))
          .pointsData(allPoints)
          .pointLat("lat")
          .pointLng("lng")
          .pointColor((d: any) => (d.pin ? "#FF4F00" : "#4b5563"))
          .pointAltitude(() => 0.005)

          .objectsData(travelPins)
          .objectLat("lat")
          .objectLng("lng")
          .objectAltitude(() => 0.05)
          .objectThreeObject((pinData: Record<string, any>) => {
            const group = new THREE.Group();
        
            // Cone geometry
            const coneGeom = new THREE.ConeGeometry(0.1, 0.3, 16);
            const coneMat = new THREE.MeshBasicMaterial({ color: 0xff4f00 });
            const coneMesh = new THREE.Mesh(coneGeom, coneMat);
            coneMesh.rotation.x = Math.PI; // point up
        
            // Sphere on top
            const sphereGeom = new THREE.SphereGeometry(0.05, 8, 8);
            const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff4f00 });
            const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
            sphereMesh.position.y = 0.06;
        
            // Add to group
            group.add(coneMesh);
            group.add(sphereMesh);
        
            // Optionally attach metadata
            group.userData = { ...pinData }; 
            return group;
          })
          .onObjectClick((point: any) => {
            alert(`Clicked on ${point.city}`);
          });
          
      } catch (err) {
        console.error("Failed to fetch or parse JSON:", err);
      }
    })();
  }, [globeModule]);

  return (
    <main style={{ width: "100%", height: "80vh" }}>
      <div ref={globeRef} style={{ width: "100%", height: "100%" }} />
      {!globeModule && <p>Loading the globe library...</p>}
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