"use client";

import { useRef, useEffect } from "react";

class Vector {
  constructor(x, y, x1, y1) {
    this.X = x;
    this.Y = y;
    this.X1 = x1;
    this.Y1 = y1;
  }

  dX() {
    return this.X1 - this.X;
  }
  dY() {
    return this.Y1 - this.Y;
  }
  Normalized() {
    var l = this.Length();
    return new Vector(
      this.X,
      this.Y,
      this.X + this.dX() / l,
      this.Y + this.dY() / l
    );
  }

  Length() {
    return Math.sqrt(Math.pow(this.dX(), 2) + Math.pow(this.dY(), 2));
  }

  Multiply(n) {
    return new Vector(
      this.X,
      this.Y,
      this.X + this.dX() * n,
      this.Y + this.dY() * n
    );
  }

  Clone() {
    return new Vector(this.x, this.y, this.X1, this.Y1);
  }
}

class Lightning {
  constructor(c) {
    this.config = c;
  }

  Cast(context, from, to) {
    context.save();

    if (!from || !to) {
      return;
    }
    var v = new Vector(from.X1, from.Y1, to.X1, to.Y1);
    var vLen = v.Length();
    var refv = from;
    var lR = vLen / context.canvas.width;
    var segments = Math.floor(this.config.Segments * lR);
    var l = vLen / segments;

    for (let i = 1; i <= segments; i++) {
      var dv = v.Multiply((1 / segments) * i);

      if (i !== segments) {
        dv.Y1 += l * Math.random() * 2 - l; // Allow for both positive and negative offsets
        dv.X1 += l * Math.random() * 2 - l;
      }

      var r = new Vector(refv.X1, refv.Y1, dv.X1, dv.Y1);

      this.Line(context, r, {
        Color: this.config.GlowColor,
        With: this.config.GlowWidth * lR,
        Blur: this.config.GlowBlur * lR,
        BlurColor: this.config.GlowColor,
        Alpha:
          this.Random(this.config.GlowAlpha, this.config.GlowAlpha * 2) / 100,
      });

      this.Line(context, r, {
        Color: this.config.Color,
        With: this.config.Width,
        Blur: this.config.Blur,
        BlurColor: this.config.BlurColor,
        Alpha: this.config.Alpha,
      });
      refv = r;
    }

    this.Circle(context, to, lR);
    this.Circle(context, from, lR);

    context.restore();
  }

  Circle(context, p, lR) {
    context.beginPath();
    context.arc(
      p.X1 + Math.random() * 10 * lR,
      p.Y1 + Math.random() * 10 * lR,
      5,
      0,
      2 * Math.PI,
      false
    );
    context.fillStyle = "white";
    context.shadowBlur = 100;
    context.shadowColor = "#2319FF";
    context.fill();
  }

  Line(context, v, c) {
    context.beginPath();
    context.strokeStyle = c.Color;
    context.lineWidth = c.With;
    context.moveTo(v.X, v.Y);
    context.lineTo(v.X1, v.Y1);
    context.globalAlpha = c.Alpha;
    context.shadowBlur = c.Blur;
    context.shadowColor = c.BlurColor;
    context.stroke();
  }

  Random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

const LightningEffect = () => {
  const canvasRef = useRef(null);
  const lightningRef = useRef([]);
  const shadowRef = useRef(null);
  const borderLightningRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Lightning configuration
    const config = {
      Segments: 30,
      Width: 2,
      Color: "white",
      Blur: 10,
      BlurColor: "white",
      Alpha: 1,
      GlowColor: "#4444FF",
      GlowWidth: 20,
      GlowBlur: 50,
      GlowAlpha: 50,
    };

    const lt = new Lightning(config);

    const createLightning = () => {
      const startX = Math.random() * canvas.width;
      const startY = 0;
      const branches = 3 + Math.floor(Math.random() * 3); // 3 to 5 branches

      return Array(branches)
        .fill()
        .map(() => ({
          start: new Vector(0, 0, startX, startY),
          end: new Vector(0, 0, Math.random() * canvas.width, canvas.height),
          alpha: 1,
        }));
    };

    const createBorderLightning = () => {
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let start, end;

      switch (side) {
        case 0: // top
          start = new Vector(0, 0, Math.random() * canvas.width, 0);
          end = new Vector(0, 0, Math.random() * canvas.width, 0);
          break;
        case 1: // right
          start = new Vector(0, 0, canvas.width, Math.random() * canvas.height);
          end = new Vector(0, 0, canvas.width, Math.random() * canvas.height);
          break;
        case 2: // bottom
          start = new Vector(0, 0, Math.random() * canvas.width, canvas.height);
          end = new Vector(0, 0, Math.random() * canvas.width, canvas.height);
          break;
        case 3: // left
          start = new Vector(0, 0, 0, Math.random() * canvas.height);
          end = new Vector(0, 0, 0, Math.random() * canvas.height);
          break;
      }

      return { start, end, alpha: 1, side };
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw shadow effect
      if (shadowRef.current) {
        ctx.fillStyle = `rgba(100, 149, 237, ${shadowRef.current.alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        shadowRef.current.alpha -= 0.05;
        if (shadowRef.current.alpha <= 0) {
          shadowRef.current = null;
        }
      }

      // Draw main lightning
      if (lightningRef.current.length > 0) {
        lightningRef.current.forEach((bolt, index) => {
          lt.Cast(ctx, bolt.start, bolt.end);
          bolt.alpha -= 0.05;

          if (bolt.alpha <= 0) {
            lightningRef.current.splice(index, 1);
          }
        });
      }

      // Draw border lightning
      borderLightningRef.current.forEach((bolt, index) => {
        lt.Cast(ctx, bolt.start, bolt.end);
        bolt.alpha -= 0.02;

        if (bolt.alpha <= 0) {
          borderLightningRef.current[index] = createBorderLightning();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Initialize border lightning
    for (let i = 0; i < 8; i++) {
      borderLightningRef.current.push(createBorderLightning());
    }

    const lightningInterval = setInterval(() => {
      lightningRef.current = createLightning();
      // Create shadow effect with a slight delay
      setTimeout(() => {
        shadowRef.current = { alpha: 0.3 };
      }, 50);
    }, 1000);

    return () => {
      clearInterval(lightningInterval);
    };
  }, []);

  return (
    <div className="w-full h-full relative border-8 border-[#4af7ff]">
      <canvas
        ref={canvasRef}
        width={800}
        height={700}
        style={{
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div className="absolute inset-x-0 top-0">
        <div className="title-wrapper mt-10">
          <h1 className="sweet-title shadow-lg">
            <span data-text="CHALLENGE">CHALLENGE</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default LightningEffect;
