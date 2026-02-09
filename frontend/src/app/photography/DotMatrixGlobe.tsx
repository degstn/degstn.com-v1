"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import EXIF from "exif-js";
import { polygon, bbox, booleanPointInPolygon } from "@turf/turf";
import Link from "next/link";
import * as THREE from "three";
import GalleryModal from "./GalleryModal";
import styles from "./photography.module.css";
import areaOverrides from "./areas.json";

/**
 * A single-file page that:
 * 1) Lazy-loads globe.gl only in the browser (no SSR).
 * 2) Creates a minimal dot-matrix globe from your GeoJSON.
 * 3) Adds pins for each area, opening a retro-styled modal with images.
 */

export default function PhotographyPage() {
  const globeRef = useRef<HTMLDivElement | null>(null);
  const globeInstanceRef = useRef<any>(null);

  // We'll store the lazy-loaded globe.gl module here
  const [globeModule, setGlobeModule] = useState<any>(null);

  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [exifData, setExifData] = useState<Photo['exifData'] | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [photosByArea, setPhotosByArea] = useState<Record<string, Photo[]>>({});
  const [loadingAreas, setLoadingAreas] = useState<Record<string, boolean>>({});
  const [regionsByArea, setRegionsByArea] = useState<Record<string, string[]>>({});
  const [areaPins, setAreaPins] = useState<AreaPin[]>([]);
  const [interiorDots, setInteriorDots] = useState<any[]>([]);
  const [globeReady, setGlobeReady] = useState(false);
  const [showAcknowledgements, setShowAcknowledgements] = useState(false);
  const [crypticNumbers, setCrypticNumbers] = useState({
    locations: '00',
    photos: '000',
    date: '00/00/0000 00:00:00'
  });
  
  const animationCompleted = useRef({
    locations: false,
    photos: false,
    date: false
  });


  const fetchAreaPhotos = useCallback(async (area: string) => {
    const key = area.toLowerCase();
    if (photosByArea[key] || loadingAreas[key]) return;
    setLoadingAreas((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(`/api/photography/area?name=${encodeURIComponent(area)}`);
      if (!res.ok) throw new Error(`Failed to load area ${area}`);
      const data: { area: string; photos: Photo[]; regions?: string[] } = await res.json();
      setPhotosByArea((prev) => ({ ...prev, [key]: data.photos || [] }));
      if (data.regions && data.regions.length > 0) {
        setRegionsByArea((prev) => ({ ...prev, [key]: data.regions || [] }));
      }
    } catch (error) {
      console.error("Failed to load area photos:", error);
    } finally {
      setLoadingAreas((prev) => ({ ...prev, [key]: false }));
    }
  }, [photosByArea, loadingAreas]);

  const openGallery = useCallback((area: string) => {
    setActiveArea(area);
    setIsGalleryOpen(true);
    fetchAreaPhotos(area);
  }, [fetchAreaPhotos]);

  useEffect(() => {
    if (activeArea) {
      fetchAreaPhotos(activeArea);
    }
  }, [activeArea, fetchAreaPhotos]);

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
    setActiveArea(null);
  }, []);

  const activeAreaPhotos = useMemo(() => {
    if (!activeArea) return [];
    return photosByArea[activeArea.toLowerCase()] || [];
  }, [activeArea, photosByArea]);

  const activeAreaRegions = useMemo(() => {
    if (!activeArea) return [];
    return regionsByArea[activeArea.toLowerCase()] || [];
  }, [activeArea, regionsByArea]);

  const photoIndexBySrc = useMemo(() => {
    return new Map(activeAreaPhotos.map((photo, index) => [photo.src, index]));
  }, [activeAreaPhotos]);

  const openImageBySrc = useCallback((src: string) => {
    const index = photoIndexBySrc.get(src);
    if (index === undefined) return;
    setCurrentImageIndex(index);
    setSelectedImage(activeAreaPhotos[index]);
  }, [photoIndexBySrc, activeAreaPhotos]);

  const toggleFullscreen = useCallback(() => {
    const element = viewerRef.current;
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);


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

  // Preload first few images for faster loading
  useEffect(() => {
    if (activeAreaPhotos.length === 0) return;
    const preloadImages = activeAreaPhotos.slice(0, 5);
    preloadImages.forEach(photo => {
      const img = new Image();
      img.src = photo.src;
    });
  }, [activeAreaPhotos]);

  useEffect(() => {
    const initialAreas = (areaOverrides as AreaPin[]).map((area) => ({
      id: area.id,
      name: area.name,
      lat: area.lat,
      lng: area.lng,
    }));
    setAreaPins(initialAreas);
    resolveAreaPins(initialAreas).then(setAreaPins);
  }, []);

  // 2) Once we have globe.gl AND our ref is ready, create and configure the globe
  useEffect(() => {
    if (!globeModule || !globeRef.current || globeInstanceRef.current) return;

    const GlobeConstructor = globeModule; // The actual function you can 'new'
    const globeInstance = new GlobeConstructor(globeRef.current);
    globeInstanceRef.current = globeInstance;
    setGlobeReady(true);

    // Basic styling
    globeInstance
      .showGlobe(false)
      .showGraticules(true)
      .showAtmosphere(false)
      .backgroundColor("#111111");

    (async () => {
      try {
        // Load GeoJSON for your dot-matrix fill
        const res = await fetch("/ne_110m_admin_0_countries.json");
        const geojson = await res.json();
        const dots = createDotMatrix(geojson);
        setInteriorDots(dots);
      } catch (err) {
        console.error("Failed to fetch or parse JSON:", err);
      }
    })();
  }, [globeModule]);

  useEffect(() => {
    const globeInstance = globeInstanceRef.current;
    if (!globeInstance || interiorDots.length === 0) return;
    globeInstance
      .pointOfView({ lat: 0, lng: -55, altitude: 1.5 })
      .pointRadius((d: any) => (d.pin ? 0.75 : 0.4))
      .pointsData([...interiorDots])
      .pointLat("lat")
      .pointLng("lng")
      .pointColor((d: any) => (d.pin ? "#FF4F00" : "#FF4F00"))
      .pointAltitude(() => 0.005);
  }, [interiorDots]);

  useEffect(() => {
    const globeInstance = globeInstanceRef.current;
    if (!globeInstance || !globeReady) return;
    const pins = areaPins
      .map((pin) => ({
        id: pin.id || pin.name.toLowerCase().replace(/\s+/g, "-"),
        lat: pin.lat,
        lng: pin.lng,
        pin: true,
        area: pin.name,
      }))
      .filter((pin) => typeof pin.lat === "number" && typeof pin.lng === "number");

    globeInstance
      .htmlElementsData(pins)
      .htmlLat("lat")
      .htmlLng("lng")
      .htmlAltitude(0)
      .htmlElement((d: any) => {
        const el = document.createElement("div");
        el.classList.add("my-globe-html-container");

        const label = document.createElement("div");
        label.classList.add("my-globe-label");
        label.textContent = d.area;

        const pin = document.createElement("div");
        pin.classList.add("my-globe-pin");

        el.appendChild(label);
        el.appendChild(pin);

        el.addEventListener("mouseenter", () => setHoveredArea(d.area));
        el.addEventListener("mouseleave", () => setHoveredArea(null));
        el.addEventListener("click", (evt) => {
          evt.stopPropagation();
          openGallery(d.area);
        });

        return el;
      });
  }, [areaPins, openGallery, globeReady]);

  // Constants for stats
  // Dynamic counting based on actual data
  const allPhotos = useMemo(() => Object.values(photosByArea).flat(), [photosByArea]);
  const totalPhotos = allPhotos.length;
  const totalLocations = areaPins.length;
  const areaStats = useMemo(() => buildAreaStats(allPhotos), [allPhotos]);
  
  // Auto-generate timestamp
  const lastUpdatedString = useMemo(() => {
    return new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }) + ' EST';
  }, []);
  
  // Removed Safari toolbar viewport calculations per request


  // (Removed fullscreen button/logic by request)

  // Extract EXIF data when an image is selected
  useEffect(() => {
    if (selectedImage) {
      setExifData(null); // Reset EXIF data
      if (process.env.NODE_ENV === 'development') {
        console.log('🖼️ Selected image:', selectedImage.src);
        console.log('🔄 Starting EXIF extraction...');
      }
      extractEXIFData(selectedImage.src).then(data => {
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 EXIF data result:', data);
        }
        setExifData(data);
      }).catch(error => {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ EXIF extraction error:', error);
        }
        setExifData({});
      });
    }
  }, [selectedImage]);

  // Cryptic character cycling effect
  const crypticChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const generateCrypticString = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += crypticChars[Math.floor(Math.random() * crypticChars.length)];
    }
    return result;
  };

  const cycleToFinalValue = (finalValue: string, key: keyof typeof crypticNumbers, duration: number = 2000) => {
    // Don't start animation if it's already completed
    if (animationCompleted.current[key]) {
      return;
    }
    
    const startTime = Date.now();
    const finalLength = finalValue.length;
    let animationId: number;
    
    const cycle = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (progress < 1) {
        // Still cycling - show random characters
        const currentLength = Math.max(1, Math.floor(progress * finalLength));
        const currentString = generateCrypticString(currentLength);
        
        setCrypticNumbers(prev => ({
          ...prev,
          [key]: currentString
        }));
        
        animationId = requestAnimationFrame(cycle);
      } else {
        // Animation complete - show final value and mark as completed
        setCrypticNumbers(prev => ({
          ...prev,
          [key]: finalValue
        }));
        animationCompleted.current[key] = true;
        // Don't call requestAnimationFrame again - animation is done
      }
    };
    
    animationId = requestAnimationFrame(cycle);
  };

  useEffect(() => {
    if (!animationCompleted.current.locations && totalLocations > 0) {
      cycleToFinalValue(totalLocations.toString(), 'locations', 1500);
    }
    if (!animationCompleted.current.photos && totalPhotos > 0) {
      cycleToFinalValue(totalPhotos.toString(), 'photos', 2000);
    }
    if (!animationCompleted.current.date) {
      cycleToFinalValue(lastUpdatedString, 'date', 2500);
    }
  }, [totalLocations, totalPhotos, lastUpdatedString]);

  // Navigation functions for image viewer
  const goToNextImage = useCallback(() => {
    setCurrentImageIndex(prevIndex => {
      if (activeAreaPhotos.length === 0) return prevIndex;
      const nextIndex = (prevIndex + 1) % activeAreaPhotos.length;
      setSelectedImage(activeAreaPhotos[nextIndex]);
      return nextIndex;
    });
  }, [activeAreaPhotos]);

  const goToPreviousImage = useCallback(() => {
    setCurrentImageIndex(prevIndex => {
      if (activeAreaPhotos.length === 0) return prevIndex;
      const newIndex = prevIndex === 0 ? activeAreaPhotos.length - 1 : prevIndex - 1;
      setSelectedImage(activeAreaPhotos[newIndex]);
      return newIndex;
    });
  }, [activeAreaPhotos]);

  const closeImageViewer = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        closeImageViewer();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousImage();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedImage, goToNextImage, goToPreviousImage, closeImageViewer]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!selectedImage) return;
    if (activeAreaPhotos.length === 0) return;
    const nextIndex = (currentImageIndex + 1) % activeAreaPhotos.length;
    const prevIndex = (currentImageIndex - 1 + activeAreaPhotos.length) % activeAreaPhotos.length;
    [nextIndex, prevIndex].forEach((index) => {
      const img = new Image();
      img.src = activeAreaPhotos[index].src;
    });
  }, [selectedImage, currentImageIndex, activeAreaPhotos]);


  return (
    <>
      <style jsx>{`
        @keyframes matrixRain {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
      <main className={styles.photographyRoot}>
      <div
        className="bg-bgDark"
        ref={globeRef}
        style={{ width: "100%", height: "100%" }}
      />
      
      {/* Matrix Rain Effect */}
      
      {/* ---- TOP UI (auto-hide) ---- */}
      {!isGalleryOpen && (
      <>
        <div
          className="absolute top-0 left-0 text-gray-50 backdrop-blur-[1px] p-4"
          style={{ 
            zIndex: 9999, 
            fontFamily: "var(--tx-02), system-ui, -apple-system, sans-serif",
            background: "rgba(17, 17, 17, 0.0)"
          }}
        >
        <div className="text-xs mb-1">
          <Link href="/" className="hover:underline hover:text-orange-400">
            back
          </Link>
        </div>
        <div className="text-xs mb-0 text-orange-400">/photography</div>
        <div className="text-xs mb-0">
          Last updated <span className="text-orange-400 font-mono">{crypticNumbers.date}</span> <br />
          <span className="text-orange-400 font-bold font-mono">{crypticNumbers.locations}</span> locations · <span className="text-orange-400 font-bold font-mono">{crypticNumbers.photos}</span> photos
        </div>
        <div className="text-xs mb-3">
          <Link href="/photography/hardware" className="hover:underline hover:text-orange-400">
            Hardware Details
          </Link>
        </div>
        {/* Fullscreen button removed */}
        

        {/* Shown only when hovering a pin */}
        {hoveredArea && (
          <div className={styles.hoverPanel}>
            <div className={styles.hoverTitle}>{hoveredArea}</div>
            <div className={styles.hoverMeta}>
              {areaStats[hoveredArea]?.count ?? 0} photos
            </div>
          </div>
        )}
        </div>
        <div className={styles.acknowledgementContainer}>
        <button
          className={styles.acknowledgementButton}
          onClick={() => setShowAcknowledgements((prev) => !prev)}
          aria-label="Toggle acknowledgements"
        >
          Acknowledgements
        </button>
        {showAcknowledgements && (
          <div className={styles.acknowledgementDrawer}>
            <div className={styles.acknowledgementTitle}>Powered By</div>
            <div className={styles.acknowledgementList}>
              <div>
                <a href="https://github.com/vasturiano/globe.gl" target="_blank" rel="noreferrer">
                  globe.gl
                </a>{" "}
                /{" "}
                <a href="https://threejs.org/" target="_blank" rel="noreferrer">
                  three.js
                </a>
              </div>
              <div>
                <a
                  href="https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Natural Earth Countries (110m)
                </a>
              </div>
              <div>
                <a href="https://turfjs.org/" target="_blank" rel="noreferrer">
                  Turf.js
                </a>{" "}
                (polygon sampling)
              </div>
              <div>
                <a href="https://github.com/exif-js/exif-js" target="_blank" rel="noreferrer">
                  EXIF.js
                </a>{" "}
                metadata
              </div>
              <div>
                <a href="https://aws.amazon.com/s3/" target="_blank" rel="noreferrer">
                  AWS S3
                </a>{" "}
                +{" "}
                <a href="https://aws.amazon.com/cloudfront/" target="_blank" rel="noreferrer">
                  CloudFront
                </a>
              </div>
              <div>
                <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
                  Next.js
                </a>{" "}
                +{" "}
                <a href="https://react.dev/" target="_blank" rel="noreferrer">
                  React
                </a>
              </div>
            </div>
          </div>
        )}
        </div>
      </>
      )}
      {/* -------------------------------- */}
      {!globeModule && (
        <p className="bg-bgDark text-gray-50">
          Loading the globe library...
        </p>
      )}

      {isGalleryOpen && activeArea && (
        <GalleryModal
          areaTitle={activeArea}
          photos={activeAreaPhotos}
          isLoading={Boolean(loadingAreas[activeArea.toLowerCase()])}
          regionNames={activeAreaRegions}
          onClose={closeGallery}
          onOpenImage={openImageBySrc}
        />
      )}

      {/* Full-screen Image Viewer Modal (bottom info auto-hides) */}
      {selectedImage && (
        <div
          className={styles.viewerBackdrop}
          onClick={closeImageViewer}
          ref={viewerRef}
        >
          {/* Close Button */}
          <button
            onClick={closeImageViewer}
            className={`${styles.viewerButton} ${styles.viewerClose}`}
          >
            CLOSE
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className={`${styles.viewerButton} ${styles.viewerFullscreen}`}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <svg
                className={styles.viewerFullscreenIcon}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M9 4H4v5M4 4l6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                <path d="M15 20h5v-5M20 20l-6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
              </svg>
            ) : (
              <svg
                className={styles.viewerFullscreenIcon}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M4 9V4h5M4 4l6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                <path d="M20 15v5h-5M20 20l-6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
              </svg>
            )}
          </button>

          {/* Image Container */}
          <div
            className={styles.viewerContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className={styles.viewerImage}
            />
          </div>

          <div
            className={styles.viewerNav}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={goToPreviousImage}
              className={`${styles.viewerButton} ${styles.viewerNavButton}`}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </button>
            <button
              onClick={goToNextImage}
              className={`${styles.viewerButton} ${styles.viewerNavButton}`}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </button>
          </div>

          {/* Image Info - Bottom Left */}
          <div className={styles.viewerInfo}>
            <div className={styles.viewerInfoTitle}>
              {currentImageIndex + 1} / {activeAreaPhotos.length}
            </div>
            <div className={styles.viewerInfoRow}>
              <strong>Location:</strong> {selectedImage.area} • {selectedImage.region}
            </div>
            {(exifData?.camera || selectedImage.camera) && (
              <div className={styles.viewerInfoRow}>
                <strong>Camera:</strong> {exifData?.camera || selectedImage.camera}
              </div>
            )}
            {(exifData?.lens || selectedImage.lens) && (
              <div className={styles.viewerInfoRow}>
                <strong>Lens:</strong> {exifData?.lens || selectedImage.lens}
              </div>
            )}
            {(exifData?.settings || selectedImage.settings) && (
              <div className={styles.viewerInfoRow}>
                <strong>Settings:</strong> {exifData?.settings || selectedImage.settings}
              </div>
            )}
            {(exifData?.date || selectedImage.date) && (
              <div className={styles.viewerInfoRow}>
                <strong>Date:</strong> {exifData?.date || selectedImage.date}
              </div>
            )}
            {exifData?.focalLength && (
              <div className={styles.viewerInfoRow}>
                <strong>Focal Length:</strong> {exifData.focalLength}
              </div>
            )}
            {!exifData && !selectedImage.camera && (
              <div className={styles.viewerInfoMuted}>
                Loading metadata...
              </div>
            )}
            <div className={styles.viewerInfoHint}>
              Use arrow keys or buttons to navigate
            </div>
          </div>
        </div>
      )}
      </main>
      {/* Removed scroll shim */}
    </>
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
  camera?: string;
  lens?: string;
  settings?: string;
  date?: string;
  exifData?: {
    camera?: string;
    lens?: string;
    settings?: string;
    date?: string;
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
  };
}

interface AreaPin {
  id?: string;
  folder?: string;
  name: string;
  lat?: number;
  lng?: number;
}

function getCachedGeocode(name: string): { lat: number; lng: number } | null {
  try {
    const key = `photography-geocode:${name.toLowerCase()}`;
    const cached = window.localStorage.getItem(key);
    if (!cached) return null;
    const parsed = JSON.parse(cached) as { lat: number; lng: number };
    if (typeof parsed.lat !== "number" || typeof parsed.lng !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function setCachedGeocode(name: string, coords: { lat: number; lng: number }) {
  try {
    const key = `photography-geocode:${name.toLowerCase()}`;
    window.localStorage.setItem(key, JSON.stringify(coords));
  } catch {
    // ignore cache failures
  }
}

async function geocodeAreaName(name: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(name);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data?.length) return null;
    const lat = Number.parseFloat(data[0].lat);
    const lng = Number.parseFloat(data[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

async function resolveAreaPins(areas: AreaPin[]): Promise<AreaPin[]> {
  const resolved = await Promise.all(
    areas.map(async (area) => {
      if (typeof area.lat === "number" && typeof area.lng === "number") return area;
      const cached = getCachedGeocode(area.name);
      if (cached) return { ...area, ...cached };
      const geocoded = await geocodeAreaName(area.name);
      if (!geocoded) return area;
      setCachedGeocode(area.name, geocoded);
      return { ...area, ...geocoded };
    })
  );
  return resolved;
}


// Function to map CloudFront filename back to S3 path
function getS3PathFromCloudFrontUrl(cloudFrontUrl: string): string | null {
  const filename = cloudFrontUrl.split('/').pop();
  if (!filename) return null;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Mapping CloudFront URL:', cloudFrontUrl);
    console.log('📁 Filename:', filename);
    console.log('🗺️ S3 path (with images/ prefix):', `images/${filename}`);
  }
  
  // Lambda expects keys like "images/IMG_2911.jpg"
  return `images/${filename}`;
}

// Function to extract EXIF data from S3 image using Lambda
function extractEXIFData(imageSrc: string): Promise<Photo['exifData']> {
  return new Promise(async (resolve) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Extracting EXIF for image:', imageSrc);
      }
      
      // Get the S3 path from CloudFront URL
      const imageKey = getS3PathFromCloudFrontUrl(imageSrc);
      if (!imageKey) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ Could not map CloudFront URL to S3 path');
        }
        resolve({});
        return;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔑 S3 image key for Lambda:', imageKey);
      }
      
      // Use Lambda Function URL with CORS proxy as fallback
      const lambdaUrl = 'https://3iv5ldbur7w7lune5vcil2p7be0fvttp.lambda-url.us-east-2.on.aws/';
      const apiUrl = lambdaUrl; // Try direct first, then proxy if needed
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🌐 Testing Lambda Function URL:', apiUrl);
      }
      
      // Prepare the request body
      const requestBody = { imageKey };
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📤 Request body:', JSON.stringify(requestBody));
        console.log('🚀 Making fetch request...');
      }
      
      // Call Lambda function via API Gateway
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📡 API Response status:', response.status);
        console.log('📡 API Response statusText:', response.statusText);
        console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));
      }
      
      if (response.ok) {
        const exifData = await response.json();
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ EXIF data received:', exifData);
        }
        resolve(exifData);
      } else {
        const errorText = await response.text();
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ Lambda EXIF extraction failed:', response.status, response.statusText);
          console.log('❌ Error response body:', errorText);
        }
        resolve({});
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ EXIF extraction failed:', error);
        console.log('❌ Error details:', error instanceof Error ? error.message : String(error));
        console.log('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      }
      resolve({});
    }
  });
}

function buildAreaStats(photos: Photo[]) {
  const stats: Record<string, { count: number; regions: Set<string> }> = {};
  photos.forEach((photo) => {
    if (!stats[photo.area]) {
      stats[photo.area] = { count: 0, regions: new Set() };
    }
    stats[photo.area].count += 1;
    stats[photo.area].regions.add(photo.region);
  });

  const normalized: Record<string, { count: number; regionsCount: number }> = {};
  Object.entries(stats).forEach(([area, data]) => {
    normalized[area] = { count: data.count, regionsCount: data.regions.size };
  });

  return normalized;
}