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
import { NebulaDrift } from "./templates/nebula-drift";
import { NebulaDriftPropsSchema } from "./templates/nebula-drift/types";
import type { NebulaDriftProps } from "./templates/nebula-drift/types";
import { CyberGrid } from "./templates/cyber-grid";
import { CyberGridPropsSchema } from "./templates/cyber-grid/types";
import type { CyberGridProps } from "./templates/cyber-grid/types";
import { OceanicDepths } from "./templates/oceanic-depths";
import { OceanicDepthsPropsSchema } from "./templates/oceanic-depths/types";
import type { OceanicDepthsProps } from "./templates/oceanic-depths/types";
import { SolarFlare } from "./templates/solar-flare";
import { SolarFlarePropsSchema } from "./templates/solar-flare/types";
import type { SolarFlareProps } from "./templates/solar-flare/types";
import { DigitalAurora } from "./templates/digital-aurora";
import { DigitalAuroraPropsSchema } from "./templates/digital-aurora/types";
import type { DigitalAuroraProps } from "./templates/digital-aurora/types";

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

const nebulaDefault: NebulaDriftProps = {
  primaryColor: "#8A2BE2",
  secondaryColor: "#00F0FF",
  tertiaryColor: "#FF69B4",
  swirlIntensity: 0.8,
  particleDensity: 300,
  glowIntensity: 0.7,
  layerSpeed: 0.6,
};

const cyberDefault: CyberGridProps = {
  gridColor: "#00F0FF",
  scanLineColor: "#FF00FF",
  backgroundColor: "#000000",
  gridSize: 25,
  scanSpeed: 0.5,
  glitchIntensity: 0.7,
  dataStreamDensity: 100,
  fps: 60,
};

const oceanDefault: OceanicDepthsProps = {
  waterColor: "#1E3A8A",
  lightColor: "#FFFFFF",
  bioluminescentColor: "#00F0FF",
  causticIntensity: 0.8,
  bubbleCount: 200,
  particleDensity: 200,
  currentSpeed: 0.5,
};

const solarDefault: SolarFlareProps = {
  solarColor: "#FFA500",
  flareColor: "#FF4500",
  plasmaColor: "#FFD700",
  surfaceIntensity: 0.8,
  flareCount: 10,
  magneticLineCount: 20,
  plasmaStreamDensity: 100,
  rotationSpeed: 0.3,
};

const auroraDefault: DigitalAuroraProps = {
  primaryColor: "#00FF00",
  secondaryColor: "#00FFFF",
  tertiaryColor: "#FF00FF",
  auroraIntensity: 0.8,
  curtainCount: 15,
  interferenceIntensity: 0.6,
  starDensity: 200,
  waveSpeed: 0.5,
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

      <Composition
        id="NebulaDrift"
        component={NebulaDrift}
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={NebulaDriftPropsSchema}
        defaultProps={nebulaDefault}
      />

      <Composition
        id="CyberGrid"
        component={CyberGrid}
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={CyberGridPropsSchema}
        defaultProps={cyberDefault}
      />

      <Composition
        id="OceanicDepths"
        component={OceanicDepths}
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={OceanicDepthsPropsSchema}
        defaultProps={oceanDefault}
      />

      <Composition
        id="SolarFlare"
        component={SolarFlare}
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={SolarFlarePropsSchema}
        defaultProps={solarDefault}
      />

      <Composition
        id="DigitalAurora"
        component={DigitalAurora}
        durationInFrames={900}
        fps={60}
        width={3840}
        height={2160}
        schema={DigitalAuroraPropsSchema}
        defaultProps={auroraDefault}
      />
    </>
  );
};

