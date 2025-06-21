import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useEffect, useRef } from "react";
import type Player from "video.js/dist/types/player";
import { Box } from "@mantine/core";

export default function VideoJS({
  options,
  onReady,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: video.js sucks
  options: any;
  onReady?: (player: Player) => void;
}) {
  const videoRef = useRef(null);
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    let disposed = false;
    if (videoRef.current) {
      // Defer initialization to ensure the element is in the DOM
      setTimeout(() => {
        if (videoRef.current && !disposed) {
          const player = videojs(videoRef.current, options, () => {
            if (onReady) {
              onReady(player);
            }
          });
          playerRef.current = player;
        }
      }, 0);

      return () => {
        disposed = true;
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }
  }, [options, onReady]);

  return (
    // <Box
    //   style={{
    //     width: "80%",
    //     minHeight: "100px",
    //     maxHeight: "80vh",
    //     margin: "0 auto",
    //   }}
    // >
    <div data-vjs-player>
      {/* biome-ignore lint/a11y/useMediaCaption: we don't have captions */}
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
    // </Box>
  );
}
