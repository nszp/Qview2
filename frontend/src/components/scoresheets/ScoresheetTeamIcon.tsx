import { Circle } from "lucide-react";

export function ScoresheetTeamIcon({
  color,
  size,
  style,
}: {
  color: string;
  size: number;
  style?: React.CSSProperties;
}) {
  return (
    <Circle
      color={color}
      fill={color}
      size={size}
      style={{
        position: "relative",
        top: "-2px",
        verticalAlign: "middle",
        ...(style || {}),
      }}
    />
  );
}
