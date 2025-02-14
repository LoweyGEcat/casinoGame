"use client";

import { useEffect, useRef, useCallback } from "react";

export default function RainAnimation() {
  const canvas1Ref = useRef(null);
  const canvas2Ref = useRef(null);
  const canvas3Ref = useRef(null);

  const rainthroughnum = 500;
  const speedRainTrough = 25;
  const rainnum = 500;

  const random = useCallback((min, max) => {
    return Math.random() * (max - min + 1) + min;
  }, []);

  const createRainTrough = useCallback(
    (w, h) => {
      const rainTrough = [];
      for (let i = 0; i < rainthroughnum; i++) {
        rainTrough[i] = {
          x: random(0, w),
          y: random(0, h),
          length: Math.floor(random(1, 830)),
          opacity: Math.random() * 0.2,
          xs: random(-2, 2),
          ys: random(10, 20),
        };
      }
      return rainTrough;
    },
    [random]
  );

  const createRain = useCallback((w, h) => {
    const rain = [];
    for (let i = 0; i < rainnum; i++) {
      rain[i] = {
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 4 + 2,
        ys: Math.random() * 10 + 10,
      };
    }
    return rain;
  }, []);

  const createLightning = useCallback(
    (w, h) => {
      const x = random(100, w - 100);
      const y = random(0, h / 4);
      const lightning = [];

      const createCount = random(1, 3);
      for (let i = 0; i < createCount; i++) {
        const single = {
          x,
          y,
          xRange: random(5, 30),
          yRange: random(10, 25),
          path: [{ x, y }],
          pathLimit: random(40, 55),
        };
        lightning.push(single);
      }
      return lightning;
    },
    [random]
  );

  useEffect(() => {
    const canvas1 = canvas1Ref.current;
    const canvas2 = canvas2Ref.current;
    const canvas3 = canvas3Ref.current;
    if (!canvas1 || !canvas2 || !canvas3) return;

    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    const ctx3 = canvas3.getContext("2d");
    if (!ctx1 || !ctx2 || !ctx3) return;

    let w = (canvas1.width = canvas2.width = canvas3.width = window.innerWidth);
    let h =
      (canvas1.height =
      canvas2.height =
      canvas3.height =
        window.innerHeight);

    let RainTrough = createRainTrough(w, h);
    const rain = createRain(w, h);
    let lightning = [];
    let lightTimeCurrent = 0;
    let lightTimeTotal = 0;

    const handleResize = () => {
      w = canvas1.width = canvas2.width = canvas3.width = window.innerWidth;
      h = canvas1.height = canvas2.height = canvas3.height = window.innerHeight;
      RainTrough = createRainTrough(w, h);
    };

    const clearCanvas1 = () => ctx1.clearRect(0, 0, w, h);
    const clearCanvas2 = () => ctx2.clearRect(0, 0, w, h);
    const clearCanvas3 = () => {
      ctx3.globalCompositeOperation = "destination-out";
      ctx3.fillStyle = `rgba(0,0,0,${random(1, 30) / 100})`;
      ctx3.fillRect(0, 0, w, h);
      ctx3.globalCompositeOperation = "source-over";
    };

    const drawRainTrough = (i) => {
      ctx1.beginPath();
      const grd = ctx1.createLinearGradient(
        0,
        RainTrough[i].y,
        0,
        RainTrough[i].y + RainTrough[i].length
      );
      grd.addColorStop(0, "rgba(255,255,255,0)");
      grd.addColorStop(1, `rgba(255,255,255,${RainTrough[i].opacity})`);
      ctx1.fillStyle = grd;
      ctx1.fillRect(RainTrough[i].x, RainTrough[i].y, 1, RainTrough[i].length);
      ctx1.fill();
    };

    const drawRain = (i) => {
      ctx2.beginPath();
      ctx2.moveTo(rain[i].x, rain[i].y);
      ctx2.lineTo(
        rain[i].x + rain[i].l * rain[i].xs,
        rain[i].y + rain[i].l * rain[i].ys
      );
      ctx2.strokeStyle = "rgba(174,194,224,0.5)";
      ctx2.lineWidth = 1;
      ctx2.lineCap = "round";
      ctx2.stroke();
    };

    const drawLightning = () => {
      for (let i = 0; i < lightning.length; i++) {
        const light = lightning[i];
        light.path.push({
          x:
            light.path[light.path.length - 1].x +
            (random(0, light.xRange) - light.xRange / 2),
          y: light.path[light.path.length - 1].y + random(0, light.yRange),
        });

        if (light.path.length > light.pathLimit) {
          lightning.splice(i, 1);
          continue;
        }

        ctx3.strokeStyle = "rgba(255, 255, 255, .1)";
        ctx3.lineWidth = random(0, 30) === 0 ? 8 : random(0, 15) === 0 ? 6 : 3;

        ctx3.beginPath();
        ctx3.moveTo(light.x, light.y);
        for (const pc of light.path) {
          ctx3.lineTo(pc.x, pc.y);
        }
        if (Math.floor(random(0, 30)) === 1) {
          ctx3.fillStyle = `rgba(255, 255, 255, ${random(1, 3) / 100})`;
          ctx3.fillRect(0, 0, w, h);
        }
        ctx3.lineJoin = "miter";
        ctx3.stroke();
      }
    };

    const animate = () => {
      // Animate rain through
      clearCanvas1();
      for (let i = 0; i < rainthroughnum; i++) {
        if (RainTrough[i].y >= h) {
          RainTrough[i].y = h - RainTrough[i].y - RainTrough[i].length * 5;
        } else {
          RainTrough[i].y += speedRainTrough;
        }
        drawRainTrough(i);
      }

      // Animate rain
      clearCanvas2();
      for (let i = 0; i < rainnum; i++) {
        rain[i].x += rain[i].xs;
        rain[i].y += rain[i].ys;
        if (rain[i].x > w || rain[i].y > h) {
          rain[i].x = Math.random() * w;
          rain[i].y = -20;
        }
        drawRain(i);
      }

      // Animate lightning
      clearCanvas3();
      lightTimeCurrent++;
      if (lightTimeCurrent >= lightTimeTotal) {
        lightning = [...lightning, ...createLightning(w, h)];
        lightTimeCurrent = 0;
        lightTimeTotal = 200;
      }
      drawLightning();

      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [createRain, createRainTrough, createLightning, random]);

  return (
    <div className="relative w-full h-full bg-[#000] z-0">
      <div className="thunder absolute inset-0 bg-black/10 z-[1]">
        <canvas ref={canvas1Ref} className="absolute inset-0 z-[100]" />
        <canvas ref={canvas2Ref} className="absolute inset-0 z-10" />
        <canvas ref={canvas3Ref} className="absolute inset-0 z-5" />
      </div>
      <div className="absolute inset-x-0 top-0">
        <div className="wrapper">
          <div className="goldme"> FOLD </div>
          <div className="fogme"> FOLD </div>
        </div>
      </div>
    </div>
  );
}
