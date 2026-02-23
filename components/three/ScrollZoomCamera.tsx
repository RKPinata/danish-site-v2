"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const LERP = 0.07;
const Z_START = 5;
const Z_END = 1;
const FOV_DESKTOP = { start: 75, end: 88 };
const FOV_MOBILE = { start: 90, end: 105 };
const MOBILE_WIDTH = 768;

type ScrollZoomCameraProps = {
  scrollZoom: number;
};

export function ScrollZoomCamera({ scrollZoom }: ScrollZoomCameraProps) {
  const { camera, size } = useThree();
  const currentZ = useRef(Z_START);
  const currentFov = useRef(FOV_DESKTOP.start);
  const isMobile = size.width < MOBILE_WIDTH;
  const fovRange = isMobile ? FOV_MOBILE : FOV_DESKTOP;
  useFrame(() => {
    const targetZ = THREE.MathUtils.lerp(Z_START, Z_END, scrollZoom);
    const targetFov = THREE.MathUtils.lerp(fovRange.start, fovRange.end, scrollZoom);
    currentZ.current += (targetZ - currentZ.current) * LERP;
    currentFov.current += (targetFov - currentFov.current) * LERP;
    camera.position.z = currentZ.current;
    const persp = camera as THREE.PerspectiveCamera;
    if (persp.fov !== undefined) {
      persp.fov = currentFov.current;
      persp.updateProjectionMatrix();
    }
  });

  return null;
}
