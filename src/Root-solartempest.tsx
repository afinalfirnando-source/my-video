// SolarTempest - Nature's power demonstration
import { Composition } from "remotion";
import { SolarFlare } from "./templates/solar-flare/index.tsx";
import { SolarFlarePropsSchema } from "./templates/solar-flare/types.ts";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SolarTempest-Professional-1"
      component={SolarFlare}
      durationInFrames={200}
      fps={60}
      width={3840}
      height={2160}
      schema={SolarFlarePropsSchema}
      defaultProps={{
        solarColor: "#FFA500",
        flareColor: "#FF4500",
        plasmaColor: "#FFD700",
        surfaceIntensity: 0.8,
        flareCount: 10,
        magneticLineCount: 20,
        plasmaStreamDensity: 100,
        rotationSpeed: 0.3,
      }}
    />
  );
};
