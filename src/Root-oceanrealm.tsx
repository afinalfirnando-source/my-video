// OceanRealm - Underwater discovery
import { Composition } from "remotion";
import { OceanicDepths } from "./templates/oceanic-depths/index.tsx";
import { OceanicDepthsPropsSchema } from "./templates/oceanic-depths/types.ts";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OceanRealm-Professional-1"
      component={OceanicDepths}
      durationInFrames={180}
      fps={60}
      width={3840}
      height={2160}
      schema={OceanicDepthsPropsSchema}
      defaultProps={{
        waterColor: "#1E3A8A",
        lightColor: "#FFFFFF",
        bioluminescentColor: "#00F0FF",
        causticIntensity: 0.8,
        bubbleCount: 200,
        particleDensity: 200,
        currentSpeed: 0.5,
      }}
    />
  );
};
