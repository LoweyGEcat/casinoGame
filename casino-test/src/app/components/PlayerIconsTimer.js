import React from "react";

const Timer = ({ timer }) => {
  const circleRadius = 50; // Radius of the circle
  const circleLength = 2 * Math.PI * circleRadius; // Length of the circle (circumference)
  const totalTime = 30; // Total timer duration in seconds
  const strokeDashoffset = circleLength - (circleLength * timer) / totalTime; // Calculate offset based on timer

  return (
    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
      <svg
        className="w-32 h-32" // Increased width and height
        width="120" // Size of the container to fit the full circle
        height="120"
        viewBox="0 0 120 120" // Adjusted viewBox to ensure the full circle fits
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle
          cx="60" // Center of the circle (in the middle of the SVG container)
          cy="60"
          r={circleRadius}
          stroke="blue" // Hardcoded stroke color
          strokeWidth="8"
          fill="none"
          opacity="0.2"
        />
        {/* Foreground Circle */}
        <circle
          cx="60" // Same center as the background circle
          cy="60"
          r={circleRadius}
          stroke="yellow" // Hardcoded stroke color
          strokeWidth="8"
          fill="none"
          strokeDasharray={circleLength}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 1s linear", // Smooth transition
          }}
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <span className="text-2xl font-bold text-black">{timer}s</span>
      </div>
    </div>
  );
};
export default Timer;
