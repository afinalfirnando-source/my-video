// CosmicVoyage - Space exploration narrative
import { Composition } from "remotion";
import { NebulaDrift } from "./templates/nebula-drift/index.tsx";
import { NebulaDriftPropsSchema } from "./templates/nebula-drift/types.ts";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CosmicVoyage-Professional-1"
      component={NebulaDrift}
      durationInFrames={360}
      fps={60}
      width={3840}
      height={2160}
      schema={NebulaDriftPropsSchema}
      defaultProps={{
        primaryColor: "#8A2BE2",
        secondaryColor: "#00F0FF",
        tertiaryColor: "#FF69B4",
        swirlIntensity: 0.8,
        particleDensity: 300,
        glowIntensity: 0.7,
        layerSpeed: 0.6,
      }}
    />
  );
};
