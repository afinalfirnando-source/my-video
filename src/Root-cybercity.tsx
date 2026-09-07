// CyberCityLoop - Cyberpunk digital urban exploration
import { Composition } from "remotion";
import { CyberGrid } from "./templates/cyber-grid/index.tsx";
import { CyberGridPropsSchema } from "./templates/cyber-grid/types.ts";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CyberCityLoop-Professional-1"
      component={CyberGrid}
      durationInFrames={300}
      fps={60}
      width={3840}
      height={2160}
      schema={CyberGridPropsSchema}
      defaultProps={{
        gridColor: "#00F0FF",
        scanLineColor: "#FF00FF",
        backgroundColor: "#0A001A",
        gridSize: 25,
        scanSpeed: 0.5,
        glitchIntensity: 0.7,
        dataStreamDensity: 100,
        fps: 60,
      }}
    />
  );
};
