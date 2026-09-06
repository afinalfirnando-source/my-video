import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img } from "remotion";
import type { LowerThirdProps } from "./types";

export const LowerThird: React.FC<LowerThirdProps> = (props) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 150], [0, 1], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: props.backgroundColor,
        flexDirection: "row",
        alignItems: "center",
        padding: "80px",
        gap: "40px",
      }}
    >
      {props.logoUrl && (
        <Img
          src={props.logoUrl}
          style={{ width: 120, height: 120, objectFit: "contain" }}
        />
      )}

      <div
        style={{
          flex: 1,
          opacity: progress,
          transform: `translateY(${interpolate(frame, [0, 30], [60, 0], {
            easing: Easing.spring(),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
        }}
      >
        <h1
          style={{
            color: "#FFFFFF",
            fontSize: "120px",
            fontWeight: 700,
            margin: 0,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {props.title}
        </h1>
        <p
          style={{
            color: props.brandColor,
            fontSize: "48px",
            fontWeight: 500,
            margin: "10px 0 0 0",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {props.subtitle}
        </p>
      </div>

      <div
        style={{
          width: "6px",
          height: "200px",
          backgroundColor: props.brandColor,
          borderRadius: "3px",
        }}
      />
    </AbsoluteFill>
  );
};
