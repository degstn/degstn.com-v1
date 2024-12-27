import React from "react";
import DotMatrixGlobe from "./DotMatrixGlobe"; // The client component


export default function PhotographyPage() {
  return (
    <main className="bg-bgDark" style={{ width: "100%", height: "80vh" }}>
      <DotMatrixGlobe />      
    </main>
  );
}