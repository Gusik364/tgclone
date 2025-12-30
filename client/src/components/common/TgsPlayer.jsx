import { useEffect, useRef, useState } from "react";
import pako from "pako";

function TgsPlayer({ src, size = 100, loop = true, autoplay = true, className = "" }) {
  const containerRef = useRef(null);
  const [lottieData, setLottieData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const loadTgs = async () => {
      try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        
        // TGS это gzip-сжатый JSON (Lottie)
        const uint8Array = new Uint8Array(arrayBuffer);
        const decompressed = pako.inflate(uint8Array, { to: "string" });
        const json = JSON.parse(decompressed);
        
        setLottieData(json);
        setError(false);
      } catch (err) {
        console.error("Failed to load TGS:", err);
        setError(true);
      }
    };

    loadTgs();
  }, [src]);

  useEffect(() => {
    if (!lottieData || !containerRef.current) return;

    // Динамически импортируем lottie-web
    import("lottie-web").then((lottie) => {
      // Очищаем контейнер
      containerRef.current.innerHTML = "";
      
      const anim = lottie.default.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: loop,
        autoplay: autoplay,
        animationData: lottieData,
      });

      return () => anim.destroy();
    });
  }, [lottieData, loop, autoplay]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-secondary-light-text rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-[2rem]">🎁</span>
      </div>
    );
  }

  if (!lottieData) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-[2rem] h-[2rem] border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

export default TgsPlayer;
