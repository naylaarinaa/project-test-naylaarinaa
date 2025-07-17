import React, { useRef, useEffect, useState } from "react";

interface BannerProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

const Banner: React.FC<BannerProps> = ({ imageUrl, title, subtitle }) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const bannerElement = bannerRef.current;

          if (!bannerElement) return (ticking = false);

          const bannerRect = bannerElement.getBoundingClientRect();
          const visible =
            bannerRect.bottom > -100 &&
            bannerRect.top < window.innerHeight + 100;

          if (visible !== isVisible) setIsVisible(visible);

          if (visible) {
            if (imageRef.current) {
              imageRef.current.style.transform = `translate3d(0, ${
                scrollY * 0.3
              }px, 0) scale(1.1)`;
            }
            if (textRef.current) {
              textRef.current.style.transform = `translate3d(0, ${
                scrollY * 0.5
              }px, 0)`;
              textRef.current.style.opacity = Math.max(
                0,
                1 - scrollY / 300
              ).toString();
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  return (
    <section
      ref={bannerRef}
      className="relative w-full overflow-hidden bg-orange-500 z-10 mt-0 [clip-path:polygon(0_0,100%_0,100%_70%,0_100%)]"
    >
      <div
        ref={imageRef}
        className="w-full h-[340px] md:h-[400px] relative will-change-transform transform-gpu scale-110 origin-center"
      >
        <img
          src={imageUrl}
          alt={title || "Banner"}
          className="absolute inset-0 w-full h-full object-cover object-center bg-orange-500"
          draggable={false}
          loading="eager"
          onError={(e) =>
            ((e.target as HTMLImageElement).style.display = "none")
          }
        />

        <div className="absolute inset-0 w-full h-full pointer-events-none z-[2] bg-gradient-to-b from-black/10 via-black/40 to-black/50" />

        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-[3] bg-gradient-to-b from-transparent to-black/10" />
      </div>

      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center pointer-events-none will-change-transform transform-gpu transition-opacity duration-100 ease-out"
      >
        <h1 className="text-white text-4xl md:text-6xl drop-shadow-2xl mb-2 max-w-4xl px-4">
          {title}
        </h1>
        <p className="text-white text-sm md:text-xl drop-shadow-lg max-w-2xl px-4">
          {subtitle}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 z-[4]" />

      {!isVisible && (
        <div className="absolute inset-0 bg-orange-500 animate-pulse" />
      )}
    </section>
  );
};

export default Banner;
