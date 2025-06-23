import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-mobile-ui/dist/videojs-mobile-ui.css";
import "videojs-mobile-ui";
import { Box } from "@mantine/core";
import { useEffect, useRef } from "react";
import type Player from "video.js/dist/types/player";

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
            // @ts-ignore boo
            player.mobileUi();
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
    <Box
      style={{
        height: "auto",
        maxHeight: "calc(100lvh - 200px)",
        minHeight: "100px",
        margin: "0 auto",
        aspectRatio: "16/9",
      }}
    >
      <div
        data-vjs-player
        // style={{
        //   width: "100%",
        //   height: "auto",
        //   maxHeight: "calc(100vh - 300px)",
        // }}
      >
        {/* biome-ignore lint/a11y/useMediaCaption: we don't have captions */}
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          playsInline
        />
      </div>
    </Box>
  );
}
