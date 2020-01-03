export const BOX_EDGES = ["bottom", "left", "right", "top"];

export const DEVICE_TARGETS = ["base", "desktop", "tablet"];

/**
 * @important This list is ordered based on appearance in UIs
 */
export const SUPPORTED_STYLE_UNITS = ["px", "em", "rem", "%"];

/**
 * @important key of TRBL_KEYS_LIST == number of values in trbl string - 1
 */
export const TRBL_KEYS_LIST = [
  [0, 0, 0, 0],
  [0, 1, 0, 1],
  [0, 1, 2, 1],
  [0, 1, 2, 3],
];

export const INITIAL_PLUGIN_CONFIG = {
  enabled: {
    boxEdges: BOX_EDGES,
    styleUnits: SUPPORTED_STYLE_UNITS,
  },
  defaults: {
    base: {
      bottom: { amount: 0, unit: "px" },
      left: { amount: 0, unit: "px" },
      right: { amount: 0, unit: "px" },
      top: { amount: 0, unit: "px" },
    },
    desktop: {
      bottom: { amount: 0, unit: "px" },
      left: { amount: 0, unit: "px" },
      right: { amount: 0, unit: "px" },
      top: { amount: 0, unit: "px" },
    },
    tablet: {
      bottom: { amount: 0, unit: "px" },
      left: { amount: 0, unit: "px" },
      right: { amount: 0, unit: "px" },
      top: { amount: 0, unit: "px" },
    },
  },
};