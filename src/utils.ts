export const parseRuleValue = (value: string) => {
  if (
    value &&
    value.indexOf('.') !== value.length - 1 &&
    !isNaN(Number(value))
  ) {
    return parseFloat(value);
  }
  return value;
};