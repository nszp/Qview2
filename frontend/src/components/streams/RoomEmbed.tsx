import { Suspense, useMemo, useRef } from "react";
import type Player from "video.js/dist/types/player";
import { Text, Skeleton, Box } from "@mantine/core";
import * as React from "react";

const VideoJS = React.lazy(() => import("@/components/streams/VideoJS.tsx"));

export default function RoomEmbed({ roomName }: { roomName: string }) {
  const playerRef = useRef<Player>(null);

  const videoJsOptions = useMemo(
    () => ({
      autoplay: true,
      muted: true,
      controls: true,
      fill: true,
      responsive: true,
      liveui: true,
      sources: [
        {
          src: `http://video.q2025.org:8080/hls/${roomName.replace(/ /g, "")}.m3u8`,
          type: "application/x-mpegURL",
        },
      ],
    }),
    [roomName],
  );

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;
  };

  return (
    <Box>
      <Suspense
        fallback={
          <Skeleton
            style={{
              height: "auto",
              maxHeight: "calc(100lvh - 200px)",
              minHeight: "100px",
              margin: "0 auto",
              aspectRatio: "16/9",
              width: "auto",
            }}
          />
        }
      >
        <Text ta="center" size="sm">
          {roomName}
        </Text>
        <VideoJS options={videoJsOptions} />
      </Suspense>
    </Box>
  );
}
