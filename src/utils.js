import { BOX_EDGES, SUPPORTED_STYLE_UNITS, TRBL_KEYS_LIST } from "./constants.js";

const DEFAULT_ENABLED_BOX_EDGES_CONFIG = [...BOX_EDGES];

const _checkIsValidBoxEdgeList =(
  validList,
  list
) => {
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

const _getCleanedStringFromOption = (option) =>
  (option || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const _getListFromListLiteral = (literal) => {
  const cleanedLiteralString = _getCleanedStringFromOption(literal);

  return cleanedLiteralString.split(" ");
};

export const getBoxEdgesFromLiteral = (literal) => {
  if (literal === undefined || literal === "") {
    return DEFAULT_ENABLED_BOX_EDGES_CONFIG;
  }
  if (literal === "horizontal") {
    return ["left", "right"];
  }
  if (literal === "horizontal") {
    return ["bottom", "top"];
  }
  const list = _getListFromListLiteral(literal.replace(",", ""));

  if (BOX_EDGES.some(curBoxEdge => literal.includes(curBoxEdge))) {
    if (_checkIsValidBoxEdgeList(DEFAULT_ENABLED_BOX_EDGES_CONFIG, list)) {
      return list;
    }
    return DEFAULT_ENABLED_BOX_EDGES_CONFIG;
  }
  if (list.length > 0 && list.length < 4) {
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
      ...(["yes", "true"].includes(list[trblKeys[0]]) ? (["top"]) : [])
    ];
  }
  return DEFAULT_ENABLED_BOX_EDGES_CONFIG;
};

export const getStyleValueFromString = (value) => {
  if (typeof value !== "string" || value === "_") {
    return undefined;
  }

  const regex = new RegExp(
    `^(-?\\d*\\.?\\d+)(${SUPPORTED_STYLE_UNITS.join("|")})?$`
  );
  const [matchesList] = Array.from(value.trim().matchAll(regex));

  if (
    typeof matchesList === "undefined" ||
    matchesList[2] === undefined ||
    !SUPPORTED_STYLE_UNITS.includes(matchesList[2])
  ) {
    throw Error("Invalid value given for defaultsValues: " + value);
  }

  return {
    amount: parseFloat(matchesList[1]),
    unit: matchesList[2]
  };
}

export const getValidValues = (errorsTrbl, trblValue) => {
  if (!errorsTrbl) return trblValue;

  return Object.keys(trblValue).reduce(
    (acc, curBoxEdge) => ({
      ...acc,
      ...(errorsTrbl[curBoxEdge] ? {} : trblValue)
    }),
    {}
  );
}
