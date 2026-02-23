"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Z_START = 5;
const Z_END = 1;
const FOV_DESKTOP = { start: 75, end: 88 };
const FOV_MOBILE = { start: 90, end: 105 };
const MOBILE_WIDTH = 768;

/** Map 0..1 to z so that perceived scale (1/z) is linear in t. z = Z_START*Z_END / ((1-t)*Z_END + t*Z_START). */
function zoomToZ(t: number): number {
  const denom = (1 - t) * Z_END + t * Z_START;
  return (Z_START * Z_END) / denom;
}

type ScrollZoomCameraProps = {
  scrollZoom: number;
};

/** Camera z and FOV follow scrollZoom so perceived zoom (1/z) is linear in scroll (same scroll → same scale change). */
export function ScrollZoomCamera({ scrollZoom }: ScrollZoomCameraProps) {
  const { camera, size } = useThree();
  const isMobile = size.width < MOBILE_WIDTH;
  const fovRange = isMobile ? FOV_MOBILE : FOV_DESKTOP;
  useFrame(() => {
    const z = zoomToZ(scrollZoom);
    const fov = THREE.MathUtils.lerp(fovRange.start, fovRange.end, scrollZoom);
    camera.position.z = z;
    const persp = camera as THREE.PerspectiveCamera;
    if (persp.fov !== undefined && Math.abs(persp.fov - fov) > 0.01) {
      persp.fov = fov;
      persp.updateProjectionMatrix();
    }
  });

  return null;
}
