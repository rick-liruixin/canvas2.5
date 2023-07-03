import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import video1 from "./assets/video1.mp4";
import "./App.css";
import Player, { Events } from "xgplayer";
import "xgplayer/dist/index.min.css";
const w = window;
const requestAnimationFrames = w.requestAnimationFrame;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let requestAnimationFramesId: number;
function App() {
  const { PLAY } = Events;
  const player = useRef<Player>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<any>();
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [styles, setStyles] = useState<CSSProperties>({});
  const ratio = useRef<number>(1);

  interface RGBColor {
    r: number;
    g: number;
    b: number;
  }
  const areColorsSimilar = useCallback(
    (rgb1: RGBColor, rgb2: RGBColor, tolerance: number): boolean => {
      const rDiff = Math.abs(rgb1.r - rgb2.r);
      const gDiff = Math.abs(rgb1.g - rgb2.g);
      const bDiff = Math.abs(rgb1.b - rgb2.b);
      return rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance;
    },
    []
  );

  const switchToCanvas = useCallback(() => {
    if (player.current?.paused || player.current?.ended) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const video = videoWrapperRef.current?.querySelector(
      "video"
    ) as HTMLVideoElement;
    ctx.current.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = ctx.current.getImageData(0, 0, canvas.width, canvas.height),
      imageData = image.data;
    for (let i = 3, len = imageData.length; i < len; i = i + 4) {
      if (
        areColorsSimilar(
          {
            r: imageData[i - 3],
            g: imageData[i - 2],
            b: imageData[i - 1],
          },
          {
            r: 0,
            g: 255,
            b: 5,
          },
          120
        )
      ) {
        imageData[i] = 0;
      }
    }
    ctx.current.putImageData(image, 0, 0, 0, 0, canvas.width, canvas.height);
    requestAnimationFramesId = requestAnimationFrames(switchToCanvas);
  }, [areColorsSimilar]);

  const initCanvas = useCallback(
    ({ width, height }: { width: number; height: number }) => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      ctx.current = canvas.getContext("2d");
      ratio.current = getPixelRatio(ctx.current);
      canvas.width = width * ratio.current;
      canvas.height = height * ratio.current;
      switchToCanvas();
    },
    [switchToCanvas]
  );

  const play = useCallback(() => {
    videoRef.current = videoWrapperRef.current?.querySelector(
      "video"
    ) as HTMLVideoElement;
    const { width, height } = videoRef.current.getBoundingClientRect();
    setStyles({ width, height });
    initCanvas({ width, height });
  }, [initCanvas]);

  const initVideo = useCallback(
    (fn?: () => void) => {
      player.current = new Player({
        id: "video1",
        url: video1,
        height: "auto",
        width: "100%",
        autoplay: true,
        autoplayMuted: true,
        controls: false,
        loop: true,
      });
      player.current?.on(PLAY, () => {
        fn?.();
      });
    },
    [PLAY]
  );
  useEffect(() => {
    initVideo(play);
  }, [initVideo, play]);

  const getPixelRatio = (context: any) => {
    const backingStore: any =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    return (window.devicePixelRatio || 1) / backingStore;
  };

  return (
    <div>
      <canvas ref={canvasRef} id="rick-canvas" style={styles}>
        您的浏览器不支持canvas，请升级浏览器再试
      </canvas>
      <div className="wrapper">
        <div ref={videoWrapperRef} id="video1"></div>
      </div>
    </div>
  );
}

export default App;
