export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.substr(1, value.length);
}

export function camelCase(value: string): string {
  return value.replace(/-([a-z])/g, g => g[1].toUpperCase());
}
