import React, { useState, useEffect } from "react";
import { StarButton } from "./star-button";
 
export default function StarButtonDemo() {
  const [lightColor, setLightColor] = useState("#FF2056");
 
  return (
    <div className="flex items-center justify-center p-10 bg-white">
      <StarButton lightColor={lightColor} className="rounded-3xl !h-12 !px-8 text-lg font-bold">
        Experience Srikara
      </StarButton>
    </div>
  );
}
