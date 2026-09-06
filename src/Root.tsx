import "./index.css";
import { Composition } from "remotion";
import { LowerThird } from "./templates/stock-lowerc-third";
import { LowerThirdPropsSchema } from "./templates/stock-lowerc-third/types";
import type { LowerThirdProps } from "./templates/stock-lowerc-third/types";
import { VortexWeb } from "./templates/vortex-web";
import { VortexWebPropsSchema } from "./templates/vortex-web/types";
import type { VortexWebProps } from "./templates/vortex-web/types";

const lowerThirdDefault: LowerThirdProps = {
  title: "BREAKING NEWS",
  subtitle: "Corporate News Update",
  brandColor: "#3B82F6",
  backgroundColor: "#0F172A",
  style: "corporate",
};

const vortexDefault: VortexWebProps = {
  primaryColor: "#00F0FF",
  rotationSpeed: 1.0,
  forwardSpeed: 1.0,
  vortexIntensity: 0.7,
  webDensity: 0.8,
  particleCount: 400,
  ringCount: 20,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LowerThird"
        component={LowerThird}
        durationInFrames={60}
        fps={30}
        width={3840}
        height={2160}
        schema={LowerThirdPropsSchema}
        defaultProps={lowerThirdDefault}
      />

      <Composition
        id="VortexWeb"
        component={VortexWeb}
        durationInFrames={720}
        fps={60}
        width={3840}
        height={2160}
        schema={VortexWebPropsSchema}
        defaultProps={vortexDefault}
      />
    </>
  );
};

