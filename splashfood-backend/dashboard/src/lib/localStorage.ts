export const getPreference = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(`sf_pref_${key}`);
    return item !== null ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setPreference = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`sf_pref_${key}`, JSON.stringify(value));
  } catch {}
};
