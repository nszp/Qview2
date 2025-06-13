import { Circle } from "lucide-react";

export function ScoresheetTeamIcon({
  color,
  size,
  mb,
  mr,
  mt,
  ml,
  m,
}: {
  color: string;
  size: number;
  mb?: string;
  mr?: string;
  mt?: string;
  ml?: string;
  m?: string;
}) {
  return (
    <Circle
      color={color}
      fill={color}
      size={size}
      style={{
        marginBottom: mb,
        marginRight: mr,
        marginTop: mt,
        marginLeft: ml,
        margin: m,
        position: "relative",
        top: "-2px",
        verticalAlign: "middle",
      }}
    />
  );
}
