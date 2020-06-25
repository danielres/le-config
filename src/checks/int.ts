export const int = [
  (v) => (v ? Number(v) : v),
  (v) => Number.isInteger(v),
  "should be an integer",
];

export const min = (minValue) => [
  (v) => (v ? Number(v) : v),
  (v) => Number.isInteger(v) && v >= minValue,
  `should be an integer ≥ ${minValue}`,
];
