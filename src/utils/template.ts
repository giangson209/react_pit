export const template = <S extends string | number, V = string | number>(
  strings: TemplateStringsArray,
  ...keys: S[]
) => {
  return (...values: (string | Record<S, V>)[]) => {
    const dict: Record<S, V> = (values[values.length - 1] as any) || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? (values as any)[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join("");
  };
};
