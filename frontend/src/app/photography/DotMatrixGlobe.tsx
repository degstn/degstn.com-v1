"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import EXIF from "exif-js";
import { polygon, bbox, booleanPointInPolygon } from "@turf/turf";
import Link from "next/link";
import * as THREE from "three";
import GalleryModal from "./GalleryModal";
import styles from "./photography.module.css";

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

  const [, setAllAreas] = useState<any[]>([]);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [exifData, setExifData] = useState<Photo['exifData'] | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
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


  const openGallery = useCallback((area: string) => {
    setActiveArea(area);
    setIsGalleryOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
    setActiveArea(null);
  }, []);

  const activeAreaPhotos = useMemo(() => {
    if (!activeArea) return [];
    return PHOTOS.filter((photo) => photo.area.toLowerCase() === activeArea.toLowerCase());
  }, [activeArea]);

  const openImageBySrc = useCallback((src: string) => {
    const index = PHOTO_INDEX_BY_SRC.get(src);
    if (index === undefined) return;
    setCurrentImageIndex(index);
    setSelectedImage(PHOTOS[index]);
  }, []);

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
    const preloadImages = PHOTOS.slice(0, 5); // Preload first 5 images
    preloadImages.forEach(photo => {
      const img = new Image();
      img.src = photo.src;
    });
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
      .backgroundColor("#111111");

    // Globe is ready

    (async () => {
      try {
        // 2a) Load GeoJSON for your dot-matrix fill
        const res = await fetch("/ne_110m_admin_0_countries.json");
        const geojson = await res.json();

        const interiorDots = createDotMatrix(geojson);

        // 2b) Pins for each area (you can unify with your existing lat/lng if you like)
        const travelPins = [
          { id: "ny", lat: 42.7128, lng: -74.0060, pin: true, area: "New York" },
          { id: "socal", lat: 37.0522, lng: -120.2437, pin: true, area: "SoCal" },
          { id: "southflorida", lat: 29.350519, lng: -81.089828, pin: true, area: "South Florida" },
          { id: "iceland", lat: 66.009835, lng: -19.198598, pin: true, area: "Iceland" },
          { id: "peru", lat: -7.962764, lng: -74.618642, pin: true, area: "Peru" },
          { id: "italy", lat: 46.580391, lng: 12.062670, pin: true, area: "Italy" },
          { id: "france", lat: 50.040182, lng: 2.740044, pin: true, area: "France" },
          { id: "morocco", lat: 31.7917, lng: -7.0926, pin: true, area: "Morocco" },
          { id: "yellowstone", lat: 44.433780, lng: -110.696687, pin: true, area: "Yellowstone" },
          { id: "vancouver", lat: 52.253465, lng: -123.043325, pin: true, area: "Vancouver" },
          { id: "gbnp", lat: 54.800685, lng: -127.647608, pin: true, area: "GBNP" },
          { id: "alaska", lat: 59.355596, lng: -135.474302, pin: true, area: "Alaska" },
          { id: "kiawah", lat: 35.608571, lng: -80.084449, pin: true, area: "Kiawah" },
          // { id: "debug", lat: 1, lng: 0, pin: true, area: "debug" },
        ];

        setAllAreas(travelPins);

        

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

      } catch (err) {
        console.error("Failed to fetch or parse JSON:", err);
      }
    })();
  }, [globeModule, openGallery]);

  // Constants for stats
  // Dynamic counting based on actual data
  const totalPhotos = PHOTOS.length;
  const uniqueAreas = Array.from(new Set(PHOTOS.map(photo => photo.area)));
  const totalLocations = uniqueAreas.length;
  
  // Auto-generate timestamp
  const lastUpdatedString = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }) + ' EST';
  
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

  // Start cryptic effect immediately on mount (only once)
  useEffect(() => {
    // Start cryptic cycling for each value immediately
    cycleToFinalValue(totalLocations.toString(), 'locations', 1500);
    cycleToFinalValue(totalPhotos.toString(), 'photos', 2000);
    cycleToFinalValue(lastUpdatedString, 'date', 2500);
    
  }, []); // Empty dependency array - only run once on mount

  // Navigation functions for image viewer
  const goToNextImage = useCallback(() => {
    setCurrentImageIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % PHOTOS.length;
      setSelectedImage(PHOTOS[nextIndex]);
      return nextIndex;
    });
  }, []);

  const goToPreviousImage = useCallback(() => {
    setCurrentImageIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? PHOTOS.length - 1 : prevIndex - 1;
      setSelectedImage(PHOTOS[newIndex]);
      return newIndex;
    });
  }, []);

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
    const nextIndex = (currentImageIndex + 1) % PHOTOS.length;
    const prevIndex = (currentImageIndex - 1 + PHOTOS.length) % PHOTOS.length;
    [nextIndex, prevIndex].forEach((index) => {
      const img = new Image();
      img.src = PHOTOS[index].src;
    });
  }, [selectedImage, currentImageIndex]);


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
      <div
        className="absolute top-0 left-0 text-gray-50 backdrop-blur-[1px] p-4"
        style={{ 
          zIndex: 9999, 
          fontFamily: "var(--tx-02), system-ui, -apple-system, sans-serif",
          background: '#111111'
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
              {AREA_STATS[hoveredArea]?.count ?? 0} photos
            </div>
          </div>
        )}
      </div>
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
              {currentImageIndex + 1} / {PHOTOS.length}
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

// Utility function to generate S3/CloudFront URLs
function getS3ImageUrl(localPath: string): string {
  // Extract just the filename from the path
  const filename = localPath.split('/').pop() || '';
  
  // Change .jpeg to .jpg
  const jpgFilename = filename.replace('.jpeg', '.jpg');
  
  // Return CloudFront URL with just the filename (no folder structure)
  return `https://cdn.degstn.com/images/${jpgFilename}`;
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

// Hardcoded sample images - moved outside component to prevent recreation
const PHOTOS: Photo[] = [
  // ALASKA
  // ketchikan?  (folder name includes "?")
  { area: "Alaska", region: "ketchikan", src: getS3ImageUrl("/images/alaska/ket/IMG_1408.jpeg"), alt: "IMG_1408", camera: "Canon EOS R5", lens: "RF 24-70mm f/2.8L IS USM", settings: "f/8, 1/125s, ISO 100", date: "2023" },
  { area: "Alaska", region: "ketchikan", src: getS3ImageUrl("/images/alaska/ket/IMG_1409.jpeg"), alt: "IMG_1409", camera: "Canon EOS R5", lens: "RF 24-70mm f/2.8L IS USM", settings: "f/5.6, 1/250s, ISO 200", date: "2023" },

  // juneau
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_1328.jpeg"), alt: "IMG_1328", camera: "Canon EOS R5", lens: "RF 70-200mm f/2.8L IS USM", settings: "f/4, 1/500s, ISO 400", date: "2023" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_1340.jpeg"), alt: "IMG_1340", camera: "Canon EOS R5", lens: "RF 24-70mm f/2.8L IS USM", settings: "f/2.8, 1/60s, ISO 800", date: "2023" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_1343.jpeg"), alt: "IMG_1343", camera: "Canon EOS R5", lens: "RF 15-35mm f/2.8L IS USM", settings: "f/11, 1/30s, ISO 100", date: "2023" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_1355.jpeg"), alt: "IMG_1355" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_1357.jpeg"), alt: "IMG_1357" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_1362.jpeg"), alt: "IMG_1362" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_1364.jpeg"), alt: "IMG_1364" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_1365.jpeg"), alt: "IMG_1365" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_5210.jpeg"), alt: "IMG_5210" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_5222.jpeg"), alt: "IMG_5222" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_5235.jpeg"), alt: "IMG_5235" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_1335.jpeg"), alt: "IMG_1335" },
  { area: "Alaska", region: "juneau", src: getS3ImageUrl("/images/alaska/juneau/IMG_1324.jpeg"), alt: "IMG_1324" },


  // other
  { area: "Alaska", region: "other", src: getS3ImageUrl("/images/alaska/other/IMG_1387.jpeg"), alt: "IMG_1387" },

  // DEBUG
  { area: "Kiawah", region: "Ocean Course", src: getS3ImageUrl("/images/debug/debugRegion1/IMG_1155.jpeg"), alt: "IMG_1155" },

  // FRANCE
  // paris
  { area: "France", region: "paris", src: getS3ImageUrl("/images/france/paris/IMG_2369_jpg.jpeg"), alt: "IMG_2369_jpg", camera: "Canon EOS R5", lens: "RF 24-70mm f/2.8L IS USM", settings: "f/5.6, 1/125s, ISO 200", date: "2022" },

  // hyéres (hyéres folder)
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_2911.jpeg"), alt: "IMG_2911" },
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_2922.jpeg"), alt: "IMG_2922" },
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_2939.jpeg"), alt: "IMG_2939" },
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_3053.jpeg"), alt: "IMG_3053" },
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_3166.jpeg"), alt: "IMG_3166" },
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_3185.jpeg"), alt: "IMG_3185" },
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_3197.jpeg"), alt: "IMG_3197" },
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_3210.jpeg"), alt: "IMG_3210" },
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_3211.jpeg"), alt: "IMG_3211" },
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_3237.jpeg"), alt: "IMG_3237" },
  { area: "France", region: "hyéres", src: getS3ImageUrl("/images/france/hyeres/IMG_3287.jpeg"), alt: "IMG_3287" },

  // GBNP
  // gb
  { area: "GBNP", region: "gb", src: getS3ImageUrl("/images/gbnp/gb/IMG_1396.jpeg"), alt: "IMG_1396" },
  { area: "GBNP", region: "gb", src: getS3ImageUrl("/images/gbnp/gb/IMG_1399.jpeg"), alt: "IMG_1399" },
  { area: "GBNP", region: "gb", src: getS3ImageUrl("/images/gbnp/gb/IMG_5254.jpeg"), alt: "IMG_5254" },
  { area: "GBNP", region: "gb", src: getS3ImageUrl("/images/gbnp/gb/IMG_5256.jpeg"), alt: "IMG_5256" },
  { area: "GBNP", region: "gb", src: getS3ImageUrl("/images/gbnp/gb/IMG_5270.jpeg"), alt: "IMG_5270" },
  { area: "GBNP", region: "gb", src: getS3ImageUrl("/images/gbnp/gb/IMG_5275.jpeg"), alt: "IMG_5275" },
  { area: "GBNP", region: "gb", src: getS3ImageUrl("/images/gbnp/gb/IMG_5288.jpeg"), alt: "IMG_5288" },
  { area: "GBNP", region: "gb", src: getS3ImageUrl("/images/gbnp/gb/IMG_5295.jpeg"), alt: "IMG_5295" },

  // ICELAND
  // all (sorting when more photos added)
  { area: "Iceland", region: "all", src: getS3ImageUrl("/images/iceland/all (sorting when more photos added)/IMG_1228.jpeg"), alt: "IMG_1228" },
  { area: "Iceland", region: "all", src: getS3ImageUrl("/images/iceland/all (sorting when more photos added)/IMG_2388.jpeg"), alt: "IMG_2388" },
  { area: "Iceland", region: "all", src: getS3ImageUrl("/images/iceland/all (sorting when more photos added)/IMG_2448.jpeg"), alt: "IMG_2448" },
  { area: "Iceland", region: "all", src: getS3ImageUrl("/images/iceland/all (sorting when more photos added)/IMG_2456.jpeg"), alt: "IMG_2456" },
  { area: "Iceland", region: "all", src: getS3ImageUrl("/images/iceland/all (sorting when more photos added)/IMG_2470.jpeg"), alt: "IMG_2470" },
  { area: "Iceland", region: "all", src: getS3ImageUrl("/images/iceland/all (sorting when more photos added)/IMG_2487.jpeg"), alt: "IMG_2487" },
  { area: "Iceland", region: "all", src: getS3ImageUrl("/images/iceland/all (sorting when more photos added)/IMG_2557.jpeg"), alt: "IMG_2557" },
  { area: "Iceland", region: "all", src: getS3ImageUrl("/images/iceland/all (sorting when more photos added)/IMG_2605.jpeg"), alt: "IMG_2605" },
  { area: "Iceland", region: "all", src: getS3ImageUrl("/images/iceland/all (sorting when more photos added)/IMG_2633.jpeg"), alt: "IMG_2633" },

  // reykjavík
  { area: "Iceland", region: "reykjavík", src: getS3ImageUrl("/images/iceland/reykjavik/IMG_2359.jpeg"), alt: "IMG_2359" },

  // ITALY
  // florence (folder is spelled "florance" on disk)
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_2382_jpg.jpeg"), alt: "IMG_2382_jpg", camera: "Canon EOS R5", lens: "RF 15-35mm f/2.8L IS USM", settings: "f/8, 1/60s, ISO 100", date: "2022" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_2384_jpg.jpeg"), alt: "IMG_2384_jpg" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3293.jpeg"), alt: "IMG_3293" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3297.jpeg"), alt: "IMG_3297" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3308.jpeg"), alt: "IMG_3308" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3318.jpeg"), alt: "IMG_3318" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3321.jpeg"), alt: "IMG_3321" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3330.jpeg"), alt: "IMG_3330" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3335.jpeg"), alt: "IMG_3335" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3336.jpeg"), alt: "IMG_3336" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3340.jpeg"), alt: "IMG_3340" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3348.jpeg"), alt: "IMG_3348" },
  { area: "Italy", region: "florence", src: getS3ImageUrl("/images/italy/florance/IMG_3355.jpeg"), alt: "IMG_3355" },

  // milan
  { area: "Italy", region: "milan", src: getS3ImageUrl("/images/italy/milan/IMG_2446_jpg.jpeg"), alt: "IMG_2446_jpg" },

  // venice
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2722.jpeg"), alt: "IMG_2722" },
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2727.jpeg"), alt: "IMG_2727" },
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2754.jpeg"), alt: "IMG_2754" },
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2763.jpeg"), alt: "IMG_2763" },
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2767.jpeg"), alt: "IMG_2767" },
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2785-Edit.jpeg"), alt: "IMG_2785-Edit" },
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2822.jpeg"), alt: "IMG_2822" },
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2875.jpeg"), alt: "IMG_2875" },
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2903.jpeg"), alt: "IMG_2903" },
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2905.jpeg"), alt: "IMG_2905" },
  { area: "Italy", region: "venice", src: getS3ImageUrl("/images/italy/venice/IMG_2907.jpeg"), alt: "IMG_2907" },

  // NY
  // nyc
  { area: "New York", region: "nyc", src: getS3ImageUrl("/images/ny/nyc/IMG_0251.jpeg"), alt: "IMG_0251" },
  { area: "New York", region: "nyc", src: getS3ImageUrl("/images/ny/nyc/IMG_0275.jpeg"), alt: "IMG_0275" },
  { area: "New York", region: "nyc", src: getS3ImageUrl("/images/ny/nyc/IMG_0300.jpeg"), alt: "IMG_0300" },
  { area: "New York", region: "nyc", src: getS3ImageUrl("/images/ny/nyc/IMG_0304.jpeg"), alt: "IMG_0304" },
  { area: "New York", region: "nyc", src: getS3ImageUrl("/images/ny/nyc/IMG_0321.jpeg"), alt: "IMG_0321" },
  { area: "New York", region: "nyc", src: getS3ImageUrl("/images/ny/nyc/IMG_0501.jpeg"), alt: "IMG_0501" },

  // hamptons
  { area: "New York", region: "hamptons", src: getS3ImageUrl("/images/ny/hamptons/IMG_0254.jpeg"), alt: "IMG_0254" },
  { area: "New York", region: "hamptons", src: getS3ImageUrl("/images/ny/hamptons/IMG_0262.jpeg"), alt: "IMG_0262" },

  // PERU
  // lima
  { area: "Peru", region: "lima", src: getS3ImageUrl("/images/peru/lima/IMG_0930.jpeg"), alt: "IMG_0930" },
  { area: "Peru", region: "lima", src: getS3ImageUrl("/images/peru/lima/IMG_0932.jpeg"), alt: "IMG_0932" },
  { area: "Peru", region: "lima", src: getS3ImageUrl("/images/peru/lima/IMG_0934.jpeg"), alt: "IMG_0934" },
  { area: "Peru", region: "lima", src: getS3ImageUrl("/images/peru/lima/IMG_0940.jpeg"), alt: "IMG_0940" },

  // machupicchu
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5059-HDR.jpeg"), alt: "IMG_5059-HDR" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5072.jpeg"), alt: "IMG_5072" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5083.jpeg"), alt: "IMG_5083" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5095.jpeg"), alt: "IMG_5095" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5098.jpeg"), alt: "IMG_5098" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5109.jpeg"), alt: "IMG_5109" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5119.jpeg"), alt: "IMG_5119" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5123.jpeg"), alt: "IMG_5123" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5132.jpeg"), alt: "IMG_5132" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5134.jpeg"), alt: "IMG_5134" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5136.jpeg"), alt: "IMG_5136" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5143.jpeg"), alt: "IMG_5143" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5147.jpeg"), alt: "IMG_5147" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5151.jpeg"), alt: "IMG_5151" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5162.jpeg"), alt: "IMG_5162" },
  { area: "Peru", region: "machuPicchu", src: getS3ImageUrl("/images/peru/machupicchu/IMG_5189.jpeg"), alt: "IMG_5189" },

  // SOCAL
  // sf
  { area: "SoCal", region: "sf", src: getS3ImageUrl("/images/socal/sf/IMG_9894-Edit-Edit-Edit.jpeg"), alt: "IMG_9894-Edit-Edit-Edit" },

  // carmel
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_0025.jpeg"), alt: "IMG_0025" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_0069.jpeg"), alt: "IMG_0069" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_0079.jpeg"), alt: "IMG_0079" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_0126.jpeg"), alt: "IMG_0126" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_0132.jpeg"), alt: "IMG_0132" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_9901.jpeg"), alt: "IMG_9901" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_9931-Edit.jpeg"), alt: "IMG_9931-Edit" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_9934.jpeg"), alt: "IMG_9934" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_9940-Enhanced-NR-Edit.jpeg"), alt: "IMG_9940-Enhanced-NR-Edit" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_9947-Edit.jpeg"), alt: "IMG_9947-Edit" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_9955.jpeg"), alt: "IMG_9955" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_9957.jpeg"), alt: "IMG_9957" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_9963.jpeg"), alt: "IMG_9963" },
  { area: "SoCal", region: "carmel", src: getS3ImageUrl("/images/socal/carmel/IMG_9999.jpeg"), alt: "IMG_9999" },

  // SOUTHFLORIDA
  // airshow
  { area: "South Florida", region: "airshow", src: getS3ImageUrl("/images/southflorida/airshow/IMG_7918.jpeg"), alt: "IMG_7918" },
  { area: "South Florida", region: "airshow", src: getS3ImageUrl("/images/southflorida/airshow/IMG_7933.jpeg"), alt: "IMG_7933" },
  { area: "South Florida", region: "airshow", src: getS3ImageUrl("/images/southflorida/airshow/IMG_7982.jpeg"), alt: "IMG_7982" },
  { area: "South Florida", region: "airshow", src: getS3ImageUrl("/images/southflorida/airshow/IMG_7983.jpeg"), alt: "IMG_7983" },
  { area: "South Florida", region: "airshow", src: getS3ImageUrl("/images/southflorida/airshow/IMG_8319.jpeg"), alt: "IMG_8319" },
  { area: "South Florida", region: "airshow", src: getS3ImageUrl("/images/southflorida/airshow/IMG_8465.jpeg"), alt: "IMG_8465" },

  // boca
  { area: "South Florida", region: "bocaRaton", src: getS3ImageUrl("/images/southflorida/boca/IMG_1524.jpeg"), alt: "IMG_1524" },
  { area: "South Florida", region: "bocaRaton", src: getS3ImageUrl("/images/southflorida/boca/IMG_1528.jpeg"), alt: "IMG_1528" },
  { area: "South Florida", region: "bocaRaton", src: getS3ImageUrl("/images/southflorida/boca/IMG_1644.jpeg"), alt: "IMG_1644" },
  { area: "South Florida", region: "bocaRaton", src: getS3ImageUrl("/images/southflorida/boca/IMG_1789.jpeg"), alt: "IMG_1789" },
  { area: "South Florida", region: "bocaRaton", src: getS3ImageUrl("/images/southflorida/boca/IMG_1790.jpeg"), alt: "IMG_1790" },
  { area: "South Florida", region: "bocaRaton", src: getS3ImageUrl("/images/southflorida/boca/IMG_1791.jpeg"), alt: "IMG_1791" },
  { area: "South Florida", region: "bocaRaton", src: getS3ImageUrl("/images/southflorida/boca/IMG_1792.jpeg"), alt: "IMG_1792" },
  { area: "South Florida", region: "bocaRaton", src: getS3ImageUrl("/images/southflorida/boca/IMG_1795.jpeg"), alt: "IMG_1795" },
  { area: "South Florida", region: "bocaRaton", src: getS3ImageUrl("/images/southflorida/boca/IMG_1952.jpeg"), alt: "IMG_1952" },
  { area: "South Florida", region: "bocaRaton", src: getS3ImageUrl("/images/southflorida/boca/IMG_3168.jpeg"), alt: "IMG_3168" },

  // deerfield
  { area: "South Florida", region: "deerfield", src: getS3ImageUrl("/images/southflorida/deerfield/IMG_1703-Enhanced-SR.jpeg"), alt: "IMG_1703-Enhanced-SR" },
  { area: "South Florida", region: "deerfield", src: getS3ImageUrl("/images/southflorida/deerfield/IMG_5787.jpeg"), alt: "IMG_5787" },

  // ftl
  { area: "South Florida", region: "fTL", src: getS3ImageUrl("/images/southflorida/ftl/copahardrockdenoise-clear.jpeg"), alt: "copahardrockdenoise-clear" },
  { area: "South Florida", region: "fTL", src: getS3ImageUrl("/images/southflorida/ftl/IMG_3074.jpeg"), alt: "IMG_3074" },

  // miami
  { area: "South Florida", region: "miami", src: getS3ImageUrl("/images/southflorida/miami/IMG_0859.jpeg"), alt: "IMG_0859" },
  { area: "South Florida", region: "miami", src: getS3ImageUrl("/images/southflorida/miami/IMG_0864.jpeg"), alt: "IMG_0864" },
  { area: "South Florida", region: "miami", src: getS3ImageUrl("/images/southflorida/miami/IMG_0868.jpeg"), alt: "IMG_0868" },
  { area: "South Florida", region: "miami", src: getS3ImageUrl("/images/southflorida/miami/IMG_0869.jpeg"), alt: "IMG_0869" },
  { area: "South Florida", region: "miami", src: getS3ImageUrl("/images/southflorida/miami/IMG_0912.jpeg"), alt: "IMG_0912" },

  // northernlights
  { area: "South Florida", region: "northernLights", src: getS3ImageUrl("/images/southflorida/northernlights/IMG_2286.jpeg"), alt: "IMG_2286" },

  // pinecrest
  { area: "South Florida", region: "pineCrest", src: getS3ImageUrl("/images/southflorida/pinecrest/IMG_2107.jpeg"), alt: "IMG_2107" },
  { area: "South Florida", region: "pineCrest", src: getS3ImageUrl("/images/southflorida/pinecrest/IMG_0969.jpeg"), alt: "IMG_0969" },

  // VANCOUVER
  // northernlights
  { area: "Vancouver", region: "northernLights", src: getS3ImageUrl("/images/vancouver/northernlights/IMG_1416.jpeg"), alt: "IMG_1416" },
  { area: "Vancouver", region: "northernLights", src: getS3ImageUrl("/images/vancouver/northernlights/IMG_1417.jpeg"), alt: "IMG_1417" },
  { area: "Vancouver", region: "northernLights", src: getS3ImageUrl("/images/vancouver/northernlights/IMG_1420.jpeg"), alt: "IMG_1420" },
  { area: "Vancouver", region: "northernLights", src: getS3ImageUrl("/images/vancouver/northernlights/IMG_1426.jpeg"), alt: "IMG_1426" },
  { area: "Vancouver", region: "northernLights", src: getS3ImageUrl("/images/vancouver/northernlights/IMG_1428.jpeg"), alt: "IMG_1428" },
  { area: "Vancouver", region: "northernLights", src: getS3ImageUrl("/images/vancouver/northernlights/IMG_1429.jpeg"), alt: "IMG_1429" },
  { area: "Vancouver", region: "northernLights", src: getS3ImageUrl("/images/vancouver/northernlights/IMG_1431.jpeg"), alt: "IMG_1431" },
  { area: "Vancouver", region: "northernLights", src: getS3ImageUrl("/images/vancouver/northernlights/IMG_1432.jpeg"), alt: "IMG_1432" },
  { area: "Vancouver", region: "northernLights", src: getS3ImageUrl("/images/vancouver/northernlights/IMG_1433.jpeg"), alt: "IMG_1433" },

  // city
  { area: "Vancouver", region: "city", src: getS3ImageUrl("/images/vancouver/city/IMG_1290.jpeg"), alt: "IMG_1290" },
  { area: "Vancouver", region: "city", src: getS3ImageUrl("/images/vancouver/city/IMG_1299.jpeg"), alt: "IMG_1299" },
  { area: "Vancouver", region: "city", src: getS3ImageUrl("/images/vancouver/city/IMG_1300.jpeg"), alt: "IMG_1300" },

  // YELLOWSTONE
  // north
  { area: "Yellowstone", region: "north", src: getS3ImageUrl("/images/yellowstone/north/IMG_3614-Enhanced-NR.jpeg"), alt: "IMG_3614-Enhanced-NR" },
  { area: "Yellowstone", region: "north", src: getS3ImageUrl("/images/yellowstone/north/IMG_3653-Enhanced-SR.jpeg"), alt: "IMG_3653-Enhanced-SR" },
  { area: "Yellowstone", region: "north", src: getS3ImageUrl("/images/yellowstone/north/IMG_3669.jpeg"), alt: "IMG_3669" },
  { area: "Yellowstone", region: "north", src: getS3ImageUrl("/images/yellowstone/north/IMG_3693.jpeg"), alt: "IMG_3693" },
  { area: "Yellowstone", region: "north", src: getS3ImageUrl("/images/yellowstone/north/IMG_3724-Edit.jpeg"), alt: "IMG_3724-Edit" },
 
  // MOROCCO
  // Fes
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001433FR1752522744.jpg"), alt: "B00001433FR1752522744" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001463FR1752660204.jpg"), alt: "B00001463FR1752660204" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001483FR1752660236.jpg"), alt: "B00001483FR1752660236" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001513FR1752660392.jpg"), alt: "B00001513FR1752660392" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001543FR1752660430.jpg"), alt: "B00001543FR1752660430" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001583FR1752660472.jpg"), alt: "B00001583FR1752660472" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001633FR1752660544.jpg"), alt: "B00001633FR1752660544" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001703FR1752660720.jpg"), alt: "B00001703FR1752660720" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001743FR1752660778.jpg"), alt: "B00001743FR1752660778" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001803FR1752665772.jpg"), alt: "B00001803FR1752665772" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/B00001843FR1752665832.jpg"), alt: "B00001843FR1752665832" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/IMG_8379.jpg"), alt: "IMG_8379" },
  { area: "Morocco", region: "Fes", src: getS3ImageUrl("/images/morocco/fes/IMG_8386.jpg"), alt: "IMG_8386" },
  
  // Marrakesh
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00001883FR1752830438.jpg"), alt: "B00001883FR1752830438" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00001903FR1752831862.jpg"), alt: "B00001903FR1752831862" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00001923FR1752832024.jpg"), alt: "B00001923FR1752832024" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00001933FR1752832102.jpg"), alt: "B00001933FR1752832102" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00001943FR1752832190.jpg"), alt: "B00001943FR1752832190" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00001973FR1752832682.jpg"), alt: "B00001973FR1752832682" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00001993FR1752833582.jpg"), alt: "B00001993FR1752833582" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002063FR1752836604.jpg"), alt: "B00002063FR1752836604" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002133FR1752877146.jpg"), alt: "B00002133FR1752877146" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002183FR1752877202.jpg"), alt: "B00002183FR1752877202" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002193FR1752877242.jpg"), alt: "B00002193FR1752877242" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002213FR1752877308.jpg"), alt: "B00002213FR1752877308" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002223FR1752877328.jpg"), alt: "B00002223FR1752877328" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002263FR1752877358.jpg"), alt: "B00002263FR1752877358" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002293FR1752877564.jpg"), alt: "B00002293FR1752877564" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002313FR1752953762.jpg"), alt: "B00002313FR1752953762" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002333FR1752954228.jpg"), alt: "B00002333FR1752954228" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002343FR1752954258.jpg"), alt: "B00002343FR1752954258" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002013FR1752835014.jpg"), alt: "B00002013FR1752835014" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00002023FR1752835024.jpg"), alt: "B00002023FR1752835024" },
  { area: "Morocco", region: "Marrakesh", src: getS3ImageUrl("/images/morocco/marrakesh/B00001993FR1752833582-2.jpg"), alt: "B00001993FR1752833582-2" },


  // Casablanca
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/IMG_8335.jpg"), alt: "IMG_8335" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/IMG_8356.jpg"), alt: "IMG_8356" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/IMG_8366.jpg"), alt: "IMG_8366" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/B00000913FR1752421136.jpg"), alt: "B00000913FR1752421136" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/B00000653FR1752418428.jpg"), alt: "B00000653FR1752418428" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/B00000593FR1752330720.jpg"), alt: "B00000593FR1752330720" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/B00000713FR1752419354.jpg"), alt: "B00000713FR1752419354" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/B00000823FR1752420346.jpg"), alt: "B00000823FR1752420346" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/B00000743FR1752419572.jpg"), alt: "B00000743FR1752419572" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/IMG_3857.jpg"), alt: "IMG_3857" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/B00000943FR1752421278.jpg"), alt: "B00000943FR1752421278" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/B00001083FR1752436216.jpg"), alt: "B00001083FR1752436216" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/IMG_3884.jpg"), alt: "IMG_3884" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/IMG_3854.jpg"), alt: "IMG_3854" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/B00000953FR1752421300.jpg"), alt: "B00000953FR1752421300" },
  { area: "Morocco", region: "Casablanca", src: getS3ImageUrl("/images/morocco/casablanca/B00000723FR1752419364.jpg"), alt: "B00000723FR1752419364" },

  // Rabat
  { area: "Morocco", region: "Rabat", src: getS3ImageUrl("/images/morocco/rabat/B00001143FR1752492576.jpg"), alt: "B00001143FR1752492576" },
  { area: "Morocco", region: "Rabat", src: getS3ImageUrl("/images/morocco/rabat/B00001213FR1752493186.jpg"), alt: "B00001213FR1752493186" },
  { area: "Morocco", region: "Rabat", src: getS3ImageUrl("/images/morocco/rabat/B00001173FR1752492598.jpg"), alt: "B00001173FR1752492598" },
  { area: "Morocco", region: "Rabat", src: getS3ImageUrl("/images/morocco/rabat/B00001183FR1752492754.jpg"), alt: "B00001183FR1752492754" },
  { area: "Morocco", region: "Rabat", src: getS3ImageUrl("/images/morocco/rabat/B00001243FR1752493648.jpg"), alt: "B00001243FR1752493648" },
  { area: "Morocco", region: "Rabat", src: getS3ImageUrl("/images/morocco/rabat/B00001253FR1752493666.jpg"), alt: "B00001253FR1752493666" },
  { area: "Morocco", region: "Rabat", src: getS3ImageUrl("/images/morocco/rabat/IMG_3890.jpg"), alt: "IMG_3890" },
  // moved to Fes per user update
];

const AREA_STATS = buildAreaStats(PHOTOS);
const PHOTO_INDEX_BY_SRC = new Map(PHOTOS.map((photo, index) => [photo.src, index]));

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