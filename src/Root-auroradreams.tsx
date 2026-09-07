// AuroraDreams - Nature meets technology
import { Composition } from "remotion";
import { DigitalAurora } from "./templates/digital-aurora/index.tsx";
import { DigitalAuroraPropsSchema } from "./templates/digital-aurora/types.ts";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AuroraDreams-Professional-1"
      component={DigitalAurora}
      durationInFrames={240}
      fps={60}
      width={3840}
      height={2160}
      schema={DigitalAuroraPropsSchema}
      defaultProps={{
        primaryColor: "#00FF00",
        secondaryColor: "#00FFFF",
        tertiaryColor: "#FF00FF",
        auroraIntensity: 0.8,
        curtainCount: 12,
        interferenceIntensity: 0.6,
        starDensity: 150,
        waveSpeed: 0.4,
      }}
    />
  );
};
