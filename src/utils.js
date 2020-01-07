import { BOX_EDGES, SUPPORTED_STYLE_UNITS, TRBL_KEYS_LIST } from "./constants.js";

const FALLBACK_ENABLED_BOX_EDGES_CONFIG = [...BOX_EDGES];
const FALLBACK_DEFAULTS_CONFIG = BOX_EDGES.reduce((acc, curBoxEdge) => ({ ...acc, [curBoxEdge]: undefined }), {})

// checks if array only contains box edges (e.g. ["bottom", "top", "left", "right"])
const _checkIsValidBoxEdgeList = (validList, list) => {
  const nonsenseValue = list.find(
    curListItem => !validList.includes(curListItem)
  );

  if (nonsenseValue !== undefined) {
    throw Error(
      `Nonsense box edge value detected from enabledBoxEdges: ${nonsenseValue}`
    );
  }
  return true;
};

const _checkIsValidDefaultValuesTrblList = (optionKey, list) => {
  if (list.length <= 0 || list.length >= 5) {
    throw Error(
      `Invalid list detected from ${optionKey}: ${JSON.stringify(
        list,
        null,
        2
      )}\nnumber of values parsed must be between 1 and 4 (inclusive)`
    );
  }
  return true;
};

const _getCleanedStringFromOption = option =>
  (option || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const _getListFromLiteral = literal => {
  const cleanedLiteralString = _getCleanedStringFromOption(literal);

  return cleanedLiteralString.split(" ");
};

export const getBoxEdgesFromLiteral = literal => {
  if (!(typeof literal === "string" && literal.length > 0)) {
    return FALLBACK_ENABLED_BOX_EDGES_CONFIG;
  }

  // check if option literal is a shorthand
  if (literal === "all") {
    return ["bottom", "left", "right", "top"];
  }
  if (literal === "horizontal") {
    return ["left", "right"];
  }
  if (literal === "vertical") {
    return ["bottom", "top"];
  }

  // option literal is a string of comma or space separated values 
  const list = _getListFromLiteral(literal.replace(",", ""));

  // e.g. option === "bottom, left, top" === bottom, left, and top box edges are enabled (commas are optional)
  if (BOX_EDGES.some(curBoxEdge => literal.includes(curBoxEdge))) {
    try {
      if (_checkIsValidBoxEdgeList(FALLBACK_ENABLED_BOX_EDGES_CONFIG, list)) {
        // dedupe list
        const dedupedList = [...new Set(list)];

        if (dedupedList.length !== list.length) {
          console.warn("Duplicate box edge values detected.");
        }
        return dedupedList;
      }
    } catch (err) {
      console.error(err);
      // option literal is invalid box edge list, use fallback
      return FALLBACK_ENABLED_BOX_EDGES_CONFIG;
    }
  }
  // e.g. option literal === "yes no yes yes" === bottom, left, and top box edges are enabled
  if (list.length > 0 && list.length < 5) {
    const trblKeys = TRBL_KEYS_LIST[list.length - 1];
    return [
      ...(["yes", "true"].includes(list[trblKeys[2]])
        ? (["bottom"])
        : []),
      ...(["yes", "true"].includes(list[trblKeys[3]])
        ? (["left"])
        : []),
      ...(["yes", "true"].includes(list[trblKeys[1]])
        ? (["right"])
        : []),
      ...(["yes", "true"].includes(list[trblKeys[0]]) 
        ? (["top"]) 
        : []),
    ];
  }
  // option literal is entirely invalid format
  return FALLBACK_ENABLED_BOX_EDGES_CONFIG;
};

export const getDefaultValuesFromLiteral = (optionKey, literal) => {
  if (!(typeof literal === "string" && literal.length > 0)) {
    return FALLBACK_DEFAULTS_CONFIG;
  }

  const list = _getListFromLiteral(literal.replace(",", ""));

  try {
    if (_checkIsValidDefaultValuesTrblList(optionKey, list)) {
      const trblKeys = TRBL_KEYS_LIST[list.length - 1];
      return {
        bottom: getStyleValueFromString(list[trblKeys[2]]),
        left: getStyleValueFromString(list[trblKeys[3]]),
        right: getStyleValueFromString(list[trblKeys[1]]),
        top: getStyleValueFromString(list[trblKeys[0]]),
      };
    }  
    return FALLBACK_DEFAULTS_CONFIG;
  }
  catch (err) {
    console.error(err);
    return FALLBACK_DEFAULTS_CONFIG;
  }
};

export const getEnabledDefaultValues = (enabledBoxEdges, defaultValues) => {
  return Object.entries(defaultValues).reduce(
    (acc, [curBoxEdge, curDefaultValue]) => ({
      ...acc,
      [curBoxEdge]: enabledBoxEdges.includes(curBoxEdge)
        ? curDefaultValue
        : undefined
    }),
    {}
  );
};

export const getStyleValueFromString = value => {
  if (typeof value !== "string" || value === "_") {
    return undefined;
  }

  const regex = new RegExp(`^(-?\\d*\\.?\\d+)(${SUPPORTED_STYLE_UNITS.join("|")})?$`);
  const [matchesList] = Array.from(value.trim().matchAll(regex));

  if (
    typeof matchesList === "undefined" ||
    matchesList[2] === undefined ||
    !SUPPORTED_STYLE_UNITS.includes(matchesList[2])
  ) {
    throw Error("Invalid value given for getStyleValueFromString: " + value);
  }

  return {
    amount: parseFloat(matchesList[1]),
    unit: matchesList[2],
  };
};

export const getValidValues = (errorsTrbl, trblValue) => {
  if (!errorsTrbl) return trblValue;

  return Object.keys(trblValue).reduce(
    (acc, curBoxEdge) => ({
      ...acc,
      ...(errorsTrbl[curBoxEdge] 
        ? {} 
        : trblValue)
    }),
    {}
  );
};
