import { useEffect } from "react";

/**
 * Oneko cursor follower — port of adryd's oneko.js (MIT).
 * A 32×32 pixel cat that chases the pointer using an 8-frame spritesheet.
 */
export function Oneko() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const nekoEl = document.createElement("div");
    nekoEl.id = "oneko";
    nekoEl.setAttribute("aria-hidden", "true");
    Object.assign(nekoEl.style, {
      width: "32px",
      height: "32px",
      position: "fixed",
      pointerEvents: "none",
      imageRendering: "pixelated",
      backgroundImage: "url(/oneko.gif)",
      left: "16px",
      top: "16px",
      zIndex: "2147483647",
    } as CSSStyleDeclaration);

    let nekoPosX = 32;
    let nekoPosY = 32;
    let mousePosX = window.innerWidth / 2;
    let mousePosY = window.innerHeight / 2;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;
    const nekoSpeed = 10;

    const spriteSets: Record<string, [number, number][]> = {
      idle: [[-3, -3]],
      alert: [[-7, -3]],
      scratch: [
        [-5, 0],
        [-6, 0],
        [-7, 0],
      ],
      tired: [[-3, -2]],
      sleeping: [
        [-2, 0],
        [-2, -1],
      ],
      N: [
        [-1, -2],
        [-1, -3],
      ],
      NE: [
        [0, -2],
        [0, -3],
      ],
      E: [
        [-3, 0],
        [-3, -1],
      ],
      SE: [
        [-5, -1],
        [-5, -2],
      ],
      S: [
        [-6, -3],
        [-7, -2],
      ],
      SW: [
        [-5, -3],
        [-6, -1],
      ],
      W: [
        [-4, -2],
        [-4, -3],
      ],
      NW: [
        [-1, 0],
        [-1, -1],
      ],
    };

    document.body.appendChild(nekoEl);

    const onMove = (e: PointerEvent) => {
      mousePosX = e.clientX;
      mousePosY = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const setSprite = (name: string, frame: number) => {
      const set = spriteSets[name];
      const sprite = set[frame % set.length];
      nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    };

    const resetIdle = () => {
      idleAnimation = null;
      idleAnimationFrame = 0;
    };

    const idle = () => {
      idleTime += 1;
      if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation === null) {
        const avail = ["sleeping", "scratch"] as const;
        idleAnimation = avail[Math.floor(Math.random() * avail.length)];
      }
      switch (idleAnimation) {
        case "sleeping":
          if (idleAnimationFrame < 8) setSprite("tired", 0);
          else setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192) resetIdle();
          break;
        case "scratch":
          setSprite("scratch", idleAnimationFrame);
          if (idleAnimationFrame > 9) resetIdle();
          break;
        default:
          setSprite("idle", 0);
          return;
      }
      idleAnimationFrame += 1;
    };

    const frame = () => {
      frameCount += 1;
      const diffX = nekoPosX - mousePosX;
      const diffY = nekoPosY - mousePosY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      if (distance < nekoSpeed || distance < 48) {
        idle();
        return;
      }
      idleAnimation = null;
      idleAnimationFrame = 0;

      if (idleTime > 1) {
        setSprite("alert", 0);
        idleTime = Math.min(idleTime, 7) - 1;
        return;
      }

      let direction = "";
      direction += diffY / distance > 0.5 ? "N" : "";
      direction += diffY / distance < -0.5 ? "S" : "";
      direction += diffX / distance > 0.5 ? "W" : "";
      direction += diffX / distance < -0.5 ? "E" : "";
      setSprite(direction, frameCount);

      nekoPosX -= (diffX / distance) * nekoSpeed;
      nekoPosY -= (diffY / distance) * nekoSpeed;
      nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;
    };

    const interval = window.setInterval(frame, 100);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("pointermove", onMove);
      nekoEl.remove();
    };
  }, []);

  return null;
}
