"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const LERP = 0.07;
const Z_START = 5;
const Z_END = 1;
const FOV_START = 75;
const FOV_END = 88;

type ScrollZoomCameraProps = {
  scrollZoom: number;
};

export function ScrollZoomCamera({ scrollZoom }: ScrollZoomCameraProps) {
  const { camera } = useThree();
  const currentZ = useRef(Z_START);
  const currentFov = useRef(FOV_START);
  useFrame(() => {
    const targetZ = THREE.MathUtils.lerp(Z_START, Z_END, scrollZoom);
    const targetFov = THREE.MathUtils.lerp(FOV_START, FOV_END, scrollZoom);
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
