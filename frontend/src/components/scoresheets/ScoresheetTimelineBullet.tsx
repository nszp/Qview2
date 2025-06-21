import { Badge } from "@mantine/core";
import { CheckIcon, MinusIcon, XIcon } from "lucide-react";
import type { QuestionSummary } from "@/utils/summaryEngine.ts";

const ICON_SIZE = 20;
const ICON_STYLE = {
  marginBottom: "-5px",
};
const ICON_STROKE_WIDTH = 3;

export default function ScoresheetTimelineBullet({
  questionResult,
  questionNumber,
}: {
  questionResult: QuestionSummary["type"];
  questionNumber: string | number;
}) {
  let icon = (
    <MinusIcon
      size={ICON_SIZE}
      style={ICON_STYLE}
      strokeWidth={ICON_STROKE_WIDTH}
    />
  );
  let color = "gray";

  if (questionResult === "correct") {
    icon = (
      <CheckIcon
        size={ICON_SIZE}
        style={ICON_STYLE}
        strokeWidth={ICON_STROKE_WIDTH}
      />
    );
    color = "green";
  } else if (questionResult === "incorrect") {
    icon = (
      <XIcon
        size={ICON_SIZE}
        style={ICON_STYLE}
        strokeWidth={ICON_STROKE_WIDTH}
      />
    );
    color = "red";
  }

  return (
    <Badge
      circle
      bg={color}
      size={"lg"}
      styles={{
        root: {
          marginLeft: "-1px",
          "::before": {
            content: `"${questionNumber === "OT" ? "TB" : `#${questionNumber}`}"`,
            fontSize: "15px",
            position: "absolute",
            top: "0.5px",
            left: "0",
            transform: "translate(-135%)",
            color: "var(--mantine-color-text)",
            fontWeight: 600,
            textAlign: "right",
            width: "100%",
          },
        },
      }}
    >
      {icon}
    </Badge>
  );
}
