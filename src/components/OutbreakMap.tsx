'use client'
// MARK: - DEPRECATED
// This file used to contain the Leaflet-based 2D outbreak map. It has been
// replaced by `GlobeComponent.tsx` (react-globe.gl 3D globe). Kept as a thin
// re-export so any stragglers still importing `OutbreakMap` get the new globe.
export { default } from './GlobeComponent'
