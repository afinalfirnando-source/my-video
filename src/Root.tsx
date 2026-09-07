import "./index.css";
import { Composition } from "remotion";
import { LowerThird } from "./templates/stock-lowerc-third";
import { LowerThirdPropsSchema } from "./templates/stock-lowerc-third/types";
import type { LowerThirdProps } from "./templates/stock-lowerc-third/types";
import { VortexWeb } from "./templates/vortex-web";
import { VortexWebPropsSchema } from "./templates/vortex-web/types";
import type { VortexWebProps } from "./templates/vortex-web/types";
import { QuantumParticles } from "./templates/quantum-particles";
import { QuantumParticlesPropsSchema } from "./templates/quantum-particles/types";
import type { QuantumParticlesProps } from "./templates/quantum-particles/types";
import { GeometricGrid } from "./templates/geometric-grid";
import { GeometricGridPropsSchema } from "./templates/geometric-grid/types";
import type { GeometricGridProps } from "./templates/geometric-grid/types";
import { FluidChromatic } from "./templates/fluid-chromatic";
import { FluidChromaticPropsSchema } from "./templates/fluid-chromatic/types";
import type { FluidChromaticProps } from "./templates/fluid-chromatic/types";
import { BinaryMatrix } from "./templates/binary-matrix";
import { BinaryMatrixPropsSchema } from "./templates/binary-matrix/types";
import type { BinaryMatrixProps } from "./templates/binary-matrix/types";
import { FractalZoom } from "./templates/fractal-zoom";
import { FractalZoomPropsSchema } from "./templates/fractal-zoom/types";
import type { FractalZoomProps } from "./templates/fractal-zoom/types";

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

const quantumDefault: QuantumParticlesProps = {
  primaryColor: "#00F0FF",
  secondaryColor: "#FF00FF",
  particleCount: 800,
  particleSize: 4,
  glowIntensity: 1,
  connectionDistance: 200,
  driftSpeed: 0.8,
  trailIntensity: 0.3,
};

const geometricDefault: GeometricGridProps = {
  gridColor: "#00F0FF",
  backgroundColor: "#000000",
  gridSize: 30,
  rotationSpeed: 1,
  morphSpeed: 1,
  depth: 40,
  lineWidth: 2,
  secondaryColor: "#FF00FF",
  pulseIntensity: 0.5,
};

const fluidDefault: FluidChromaticProps = {
  primaryColor: "#00F0FF",
  secondaryColor: "#FF00FF",
  flowSpeed: 0.8,
  turbulence: 1,
  opacity: 0.6,
  particleCount: 500,
  waveCount: 10,
  noiseDensity: 0.02,
};

const matrixDefault: BinaryMatrixProps = {
  textColor: "#00FF88",
  backgroundColor: "#000000",
  rainDensity: 1,
  speed: 1,
  fontSize: 20,
  glowIntensity: 1,
  characterSet: "0123456789ABCDEF",
  secondaryColor: "#00F0FF",
};

const fractalDefault: FractalZoomProps = {
  colorScheme: "fire",
  zoomSpeed: 1.0,
  maxIterations: 100,
  intensity: 0.8,
  fractalType: "mandelbrot",
  backgroundColor: "#000000",
  glowIntensity: 0.3,
  orbitTrap: true,
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
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={VortexWebPropsSchema}
        defaultProps={vortexDefault}
      />

      <Composition
        id="QuantumParticles"
        component={QuantumParticles}
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={QuantumParticlesPropsSchema}
        defaultProps={quantumDefault}
      />

      <Composition
        id="GeometricGrid"
        component={GeometricGrid}
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={GeometricGridPropsSchema}
        defaultProps={geometricDefault}
      />

      <Composition
        id="FluidChromatic"
        component={FluidChromatic}
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={FluidChromaticPropsSchema}
        defaultProps={fluidDefault}
      />

      <Composition
        id="BinaryMatrix"
        component={BinaryMatrix}
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={BinaryMatrixPropsSchema}
        defaultProps={matrixDefault}
      />

      <Composition
        id="FractalZoom"
        component={FractalZoom}
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={FractalZoomPropsSchema}
        defaultProps={fractalDefault}
      />
    </>
  );
};

