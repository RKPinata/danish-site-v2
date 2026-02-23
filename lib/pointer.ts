/**
 * Mutable pointer store read directly by R3F useFrame loops.
 * Written to by usePointerInput — never triggers React re-renders.
 */
export const pointer = { x: 0, y: 0 };
