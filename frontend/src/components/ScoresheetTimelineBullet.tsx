import { Badge } from "@mantine/core";

export default function ScoresheetTimelineBullet({
  teamColor,
  questionNumber,
}: { teamColor: string; questionNumber: number }) {
  return (
    <Badge
      circle
      bg={teamColor}
      size={"lg"}
      styles={{
        root: {
          marginLeft: "-1px",
        },
      }}
    >
      {questionNumber}
    </Badge>
  );
}
