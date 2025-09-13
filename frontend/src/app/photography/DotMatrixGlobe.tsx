"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import EXIF from "exif-js";
import { polygon, bbox, booleanPointInPolygon } from "@turf/turf";
import Link from "next/link";
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

  const [travelPins, setAllAreas] = useState<any[]>([]);


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
      .backgroundColor("#1a1a1a");

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
  
  const hardwareDeatils = "Hardware Details";

  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [exifData, setExifData] = useState<Photo['exifData'] | null>(null);
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

  const [showMatrixRain, setShowMatrixRain] = useState(false);

  // Extract EXIF data when an image is selected
  useEffect(() => {
    if (selectedImage) {
      setExifData(null); // Reset EXIF data
      console.log('🖼️ Selected image:', selectedImage.src);
      console.log('🔄 Starting EXIF extraction...');
      extractEXIFData(selectedImage.src).then(data => {
        console.log('📊 EXIF data result:', data);
        setExifData(data);
      }).catch(error => {
        console.error('❌ EXIF extraction error:', error);
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
    
    // Start matrix rain effect after a delay
    setTimeout(() => setShowMatrixRain(true), 3000);
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

    const handleOpenImageViewer = (e: CustomEvent) => {
      const index = e.detail.index;
      setCurrentImageIndex(index);
      setSelectedImage(PHOTOS[index]);
    };

    document.addEventListener('keydown', handleKeyPress);
    window.addEventListener('openImageViewer', handleOpenImageViewer as EventListener);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('openImageViewer', handleOpenImageViewer as EventListener);
    };
  }, [selectedImage, goToNextImage, goToPreviousImage, closeImageViewer]);


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
      <main style={{ width: "100%", height: "100vh" }}>
      <div
        className="bg-bgDark"
        ref={globeRef}
        style={{ width: "100%", height: "100%" }}
      />
      
      {/* Matrix Rain Effect */}
      {showMatrixRain && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(transparent 0%, rgba(0, 255, 0, 0.03) 50%, transparent 100%)',
            animation: 'matrixRain 20s linear infinite'
          }}
        />
      )}
      {/* ---- CRYPTIC STATS UI BLOCK ---- */}
      <div
        className="absolute top-0 left-0 text-gray-50 backdrop-blur-[1px] p-4"
        style={{ 
          zIndex: 9999, 
          fontFamily: "Berkeley Mono, monospace",
          opacity: 1
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
        <div className="text-xs mb-3">
          <button 
            onClick={() => testAPIGateway()}
            className="hover:underline hover:text-orange-400 cursor-pointer"
          >
            Test API Gateway
          </button>
        </div>
        

        {/* Shown only when hovering a pin */}
        {hoveredArea && (
          <div className="text-xs p-2 border border-gray-500 bg-black/50">
            <strong>{hoveredArea}</strong>
            {/* Could show more info about hovered area here */}
          </div>
        )}
      </div>
      {/* -------------------------------- */}
      {!globeModule && (
        <p className="bg-bgDark text-gray-50">
          Loading the globe library...
        </p>
      )}

      {/* Full-screen Image Viewer Modal */}
      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
          onClick={closeImageViewer}
        >
          {/* Close Button */}
          <button
            onClick={closeImageViewer}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: '2px solid #FF4F00',
              color: '#FF4F00',
              fontSize: '18px',
              fontFamily: 'Berkeley Mono, monospace',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#FF4F00';
              e.currentTarget.style.color = '#000';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#FF4F00';
            }}
          >
            CLOSE
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPreviousImage();
            }}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: '2px solid #FF4F00',
              color: '#FF4F00',
              fontSize: '16px',
              fontFamily: 'Berkeley Mono, monospace',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#FF4F00';
              e.currentTarget.style.color = '#000';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#FF4F00';
            }}
          >
            ← PREV
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNextImage();
            }}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: '2px solid #FF4F00',
              color: '#FF4F00',
              fontSize: '16px',
              fontFamily: 'Berkeley Mono, monospace',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#FF4F00';
              e.currentTarget.style.color = '#000';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#FF4F00';
            }}
          >
            NEXT →
          </button>

          {/* Image Container */}
          <div
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px 100px 20px', // Add padding for buttons and info
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              }}
            />
          </div>

          {/* Image Info - Bottom Left */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#FF4F00',
              padding: '15px 20px',
              border: '1px solid #FF4F00',
              fontSize: '12px',
              fontFamily: 'Berkeley Mono, monospace',
              maxWidth: '300px',
              lineHeight: '1.4',
            }}
          >
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              {currentImageIndex + 1} / {PHOTOS.length}
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong>Location:</strong> {selectedImage.area} • {selectedImage.region}
            </div>
            {(exifData?.camera || selectedImage.camera) && (
              <div style={{ marginBottom: '4px' }}>
                <strong>Camera:</strong> {exifData?.camera || selectedImage.camera}
              </div>
            )}
            {(exifData?.lens || selectedImage.lens) && (
              <div style={{ marginBottom: '4px' }}>
                <strong>Lens:</strong> {exifData?.lens || selectedImage.lens}
              </div>
            )}
            {(exifData?.settings || selectedImage.settings) && (
              <div style={{ marginBottom: '4px' }}>
                <strong>Settings:</strong> {exifData?.settings || selectedImage.settings}
              </div>
            )}
            {(exifData?.date || selectedImage.date) && (
              <div style={{ marginBottom: '4px' }}>
                <strong>Date:</strong> {exifData?.date || selectedImage.date}
              </div>
            )}
            {exifData?.focalLength && (
              <div style={{ marginBottom: '4px' }}>
                <strong>Focal Length:</strong> {exifData.focalLength}
              </div>
            )}
            {!exifData && !selectedImage.camera && (
              <div style={{ marginBottom: '4px', color: '#888', fontSize: '11px' }}>
                Loading metadata...
              </div>
            )}
            <div style={{ fontSize: '10px', color: '#888', marginTop: '8px' }}>
              Use arrow keys or buttons to navigate
            </div>
          </div>
        </div>
      )}
      </main>
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
  return `https://die1tcdcthovv.cloudfront.net/${jpgFilename}`;
}

// Test function to check Lambda Function URL
async function testAPIGateway() {
  const lambdaUrl = 'https://3iv5ldbur7w7lune5vcil2p7be0fvttp.lambda-url.us-east-2.on.aws/';
  
  try {
    console.log(`🧪 Testing Lambda Function URL: ${lambdaUrl}`);
    
    // Test with a simple POST request
    const response = await fetch(lambdaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageKey: 'test-image.jpg' })
    });
    
    console.log(`📡 Response status:`, response.status, response.statusText);
    console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Success! Response data:`, data);
    } else {
      const errorText = await response.text();
      console.log(`❌ Error response:`, errorText);
    }
  } catch (error) {
    console.log(`❌ Network error:`, error instanceof Error ? error.message : String(error));
  }
}

// Function to map CloudFront filename back to S3 path
function getS3PathFromCloudFrontUrl(cloudFrontUrl: string): string | null {
  const filename = cloudFrontUrl.split('/').pop();
  if (!filename) return null;
  
  console.log('🔍 Mapping CloudFront URL:', cloudFrontUrl);
  console.log('📁 Filename:', filename);
  
  // The S3 bucket has files with just the filename like IMG_2911.jpg
  // So we just need to return the filename as-is
  console.log('🗺️ S3 path (just filename):', filename);
  return filename;
}

// Function to extract EXIF data from S3 image using Lambda
function extractEXIFData(imageSrc: string): Promise<Photo['exifData']> {
  return new Promise(async (resolve) => {
    try {
      console.log('🔍 Extracting EXIF for image:', imageSrc);
      
      // Get the S3 path from CloudFront URL
      const imageKey = getS3PathFromCloudFrontUrl(imageSrc);
      if (!imageKey) {
        console.log('❌ Could not map CloudFront URL to S3 path');
        resolve({});
        return;
      }
      
      console.log('🔑 S3 image key for Lambda:', imageKey);
      
      // Use Lambda Function URL with CORS proxy as fallback
      const lambdaUrl = 'https://3iv5ldbur7w7lune5vcil2p7be0fvttp.lambda-url.us-east-2.on.aws/';
      const apiUrl = lambdaUrl; // Try direct first, then proxy if needed
      console.log('🌐 Testing Lambda Function URL:', apiUrl);
      
      // Prepare the request body
      const requestBody = { imageKey };
      console.log('📤 Request body:', JSON.stringify(requestBody));
      
      // Call Lambda function via API Gateway
      console.log('🚀 Making fetch request...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response statusText:', response.statusText);
      console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const exifData = await response.json();
        console.log('✅ EXIF data received:', exifData);
        resolve(exifData);
      } else {
        const errorText = await response.text();
        console.log('❌ Lambda EXIF extraction failed:', response.status, response.statusText);
        console.log('❌ Error response body:', errorText);
        resolve({});
      }
    } catch (error) {
      console.log('❌ EXIF extraction failed:', error);
      console.log('❌ Error details:', error instanceof Error ? error.message : String(error));
      console.log('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
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

  // deerfield
  { area: "South Florida", region: "deerfield", src: getS3ImageUrl("/images/southflorida/deerfield/IMG_1703-Enhanced-SR.jpeg"), alt: "IMG_1703-Enhanced-SR" },
  { area: "South Florida", region: "deerfield", src: getS3ImageUrl("/images/southflorida/deerfield/IMG_5787.jpeg"), alt: "IMG_5787" },

  // ftl
  { area: "South Florida", region: "fTL", src: getS3ImageUrl("/images/southflorida/ftl/copahardrockdenoise-clear.jpeg"), alt: "copahardrockdenoise-clear" },

  // miami
  { area: "South Florida", region: "miami", src: getS3ImageUrl("/images/southflorida/miami/IMG_0859.jpeg"), alt: "IMG_0859" },
  { area: "South Florida", region: "miami", src: getS3ImageUrl("/images/southflorida/miami/IMG_0864.jpeg"), alt: "IMG_0864" },
  { area: "South Florida", region: "miami", src: getS3ImageUrl("/images/southflorida/miami/IMG_0868.jpeg"), alt: "IMG_0868" },
  { area: "South Florida", region: "miami", src: getS3ImageUrl("/images/southflorida/miami/IMG_0869.jpeg"), alt: "IMG_0869" },
  { area: "South Florida", region: "miami", src: getS3ImageUrl("/images/southflorida/miami/IMG_0912.jpeg"), alt: "IMG_0912" },

  // northernlights
  { area: "South Florida", region: "northernLights", src: getS3ImageUrl("/images/southflorida/northernlights/IMG_2286.jpeg"), alt: "IMG_2286" },

  // pinecrest
  { area: "South Florida", region: "pineCrest", src: getS3ImageUrl("/images/southflorida/pinecrest/IMG_1011.jpeg"), alt: "IMG_1011" },
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
  const filteredPhotos = PHOTOS.filter(
    (p) => p.area.toLowerCase() === areaTitle.toLowerCase()
  );

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
      <h3 style="margin-bottom: 0.5rem;">${regionName.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + regionName.replace(/([A-Z])/g, ' $1').slice(1)}</h3>
      <div
      style="
      display: flex;
      flex-wrap: wrap; /* let images wrap to next line */
      gap: 0.5rem;     /* spacing between images */
      align-items: flex-start;
      "
      >
    `;

    // Each image has a fixed height of 220px, width is auto,
    // and object-fit: contain so they're not cropped.
    regionPhotos.forEach((photo, index) => {
      const globalIndex = PHOTOS.findIndex(p => p.src === photo.src);
            html += `
              <div 
                style="position: relative; height: 220px; width: auto; background: #1a1a1a; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid transparent;"
                onclick="openImageViewer(${globalIndex})"
                onmouseover="this.style.transform='scale(1.05)'; this.style.borderColor='#FF4F00'"
                onmouseout="this.style.transform='scale(1)'; this.style.borderColor='transparent'"
              >
          <img
            src="${photo.src}"
            alt="${photo.alt}"
            loading="lazy"
            decoding="async"
            onload="this.parentElement.querySelector('.loading')?.remove()"
            style="
              height: 220px;
              width: auto;
              object-fit: contain;
              pointer-events: none;
            "
          />
          <div class="loading" style="position: absolute; color: #666; font-size: 12px;">Loading...</div>
        </div>
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

  // Add global function for image viewer
  (window as any).openImageViewer = (index: number) => {
    // This will be handled by the React component
    const event = new CustomEvent('openImageViewer', { detail: { index } });
    window.dispatchEvent(event);
  };
}