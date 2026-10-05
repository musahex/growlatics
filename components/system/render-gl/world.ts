// Normalised pose space → world units. The z=0 plane fills the frustum of a camera at z 9, fov 42°,
// so tiers 1 and 2 frame the same composition.
export const FOV = 42
export const BASE_DIST = 9
export const PLANE_H = 2 * BASE_DIST * Math.tan(((FOV / 2) * Math.PI) / 180)
export const DEPTH = 1.6

/** aspect: canvas w/h. scale: node size compensation as the camera dollies in (1 at the overview). */
export const view = { aspect: 16 / 10, scale: 1 }

export const wx = (x: number) => (x - 0.5) * PLANE_H * view.aspect
export const wy = (y: number) => (0.5 - y) * PLANE_H
export const wz = (z: number) => z * DEPTH

/** Camera distance for a 2D zoom factor (zoom 1.8 at a journey dwell ≈ z 3.2, §7 act 4). */
export const distFor = (zoom: number) => BASE_DIST / Math.pow(Math.max(0.5, zoom), 1.75)
