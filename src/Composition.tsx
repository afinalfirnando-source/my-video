// Base composition (kept for compatibility)
import { Composition } from "remotion";
import React from "react";

type Props = {};

export const MyComponent: React.FC<Props> = () => {
  return null;
};

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={60}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
