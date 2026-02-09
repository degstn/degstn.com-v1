"use client";

import React, { useMemo, useRef, useState } from "react";
import styles from "./photography.module.css";

type GalleryPhoto = {
  area: string;
  region: string;
  src: string;
  alt: string;
};

type GalleryModalProps = {
  areaTitle: string;
  photos: GalleryPhoto[];
  isLoading?: boolean;
  regionNames?: string[];
  onClose: () => void;
  onOpenImage: (src: string) => void;
};

function formatRegionName(name: string): string {
  const special: Record<string, string> = {
    nyc: "NYC",
    gb: "GB",
    machuPicchu: "Machu Picchu",
    pineCrest: "Pine Crest",
    fTL: "Ft. Lauderdale",
    bocaRaton: "Boca Raton",
    northernLights: "Northern Lights",
    "all (sorting when more photos added)": "All",
    "hyéres": "Hyères",
    "reykjavík": "Reykjavík",
  };
  if (special[name]) return special[name];
  const normalized = name
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
  return normalized
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function slugifyRegion(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function GalleryModal({
  areaTitle,
  photos,
  isLoading = false,
  regionNames = [],
  onClose,
  onOpenImage,
}: GalleryModalProps) {
  const [query, setQuery] = useState("");
  const [cropMode, setCropMode] = useState(true);
  const [loadedBySrc, setLoadedBySrc] = useState<Record<string, boolean>>({});
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const regionMap = useMemo(() => {
    const map = new Map<string, GalleryPhoto[]>();
    photos.forEach((photo) => {
      const key = photo.region || "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(photo);
    });
    regionNames.forEach((region) => {
      if (!map.has(region)) map.set(region, []);
    });
    return map;
  }, [photos, regionNames]);

  const totalRegions = regionMap.size;
  const totalPhotos = photos.length;

  const filteredRegions = useMemo(() => {
    const search = query.trim().toLowerCase();
    const entries = Array.from(regionMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    if (!search) return entries;
    return entries.filter(([region]) => region.toLowerCase().includes(search));
  }, [query, regionMap]);

  const jumpToRegion = (regionName: string) => {
    const targetId = `region-${slugifyRegion(regionName)}`;
    const container = bodyRef.current;
    const section = container?.querySelector(`#${targetId}`);
    section && (section as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalTitle}>{areaTitle}</div>
            <div className={styles.modalMeta}>
              <span className={styles.dataChip}>{totalPhotos} photos</span>
              <span className={styles.dataChip}>{totalRegions} regions</span>
            </div>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            Close
          </button>
        </div>

        <div className={styles.modalControls}>
          <div className={styles.chipRow}>
            {filteredRegions.map(([regionName, regionPhotos]) => (
              <button
                key={regionName}
                className={styles.regionChip}
                onClick={() => jumpToRegion(regionName)}
              >
                {formatRegionName(regionName)}
                <span className={styles.regionChipCount}>{regionPhotos.length}</span>
              </button>
            ))}
          </div>
          <div className={styles.controlsRight}>
            <input
              className={styles.regionSearch}
              placeholder="Filter regions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="button"
              className={styles.cropToggle}
              onClick={() => setCropMode((prev) => !prev)}
              aria-label={cropMode ? "Disable crop mode" : "Enable crop mode"}
            >
              <svg
                className={styles.cropIcon}
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="7"
                  width="14"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                {cropMode ? (
                  <>
                    <path
                      d="M12 2L12 5M12 5L10 3M12 5L14 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    />
                    <path
                      d="M12 22L12 19M12 19L10 21M12 19L14 21"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M12 5L12 2M12 2L10 4M12 2L14 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    />
                    <path
                      d="M12 19L12 22M12 22L10 20M12 22L14 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.modalBody} ref={bodyRef}>
          {isLoading && photos.length === 0 && (
            <div className={styles.modalEmpty}>Loading photos…</div>
          )}
          {!isLoading && photos.length === 0 && (
            <div className={styles.modalEmpty}>No photos yet.</div>
          )}
          {filteredRegions.map(([regionName, regionPhotos]) => {
            const sectionId = `region-${slugifyRegion(regionName)}`;
            return (
              <section key={regionName} id={sectionId} className={styles.regionSection}>
                <div className={styles.regionHeader}>
                  <span>{formatRegionName(regionName)}</span>
                  <span className={styles.regionCount}>{regionPhotos.length}</span>
                </div>
                <div className={styles.photoGrid}>
                  {regionPhotos.map((photo) => {
                    const isLoaded = loadedBySrc[photo.src];
                    return (
                      <button
                        key={photo.src}
                        className={`${styles.photoTile} ${cropMode ? styles.photoTileCropped : ""} ${isLoaded ? styles.photoTileLoaded : ""}`}
                        onClick={() => onOpenImage(photo.src)}
                        type="button"
                      >
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading="lazy"
                          decoding="async"
                          className={`${styles.photoImage} ${cropMode ? styles.photoImageCropped : ""}`}
                          onLoad={() => {
                            setLoadedBySrc((prev) => {
                              if (prev[photo.src]) return prev;
                              return { ...prev, [photo.src]: true };
                            });
                          }}
                        />
                        <div className={styles.photoLoading}>Loading...</div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
