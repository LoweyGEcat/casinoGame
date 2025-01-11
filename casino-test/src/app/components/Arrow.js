import React from "react";
import Image from "next/image";
function Arrow() {
  return (
    <div>
      <Image
      width={1000}
      height={1000}
        src="/image/arrowDiscardPile.svg"
        alt="My image"
        className="w-20 h-20 absolute slow-high-bounce" // Explicit width and height
        style={{
          transition: "transform 0.3s ease-in-out",
        }}
      />
    </div>
  );
}

export default Arrow;
