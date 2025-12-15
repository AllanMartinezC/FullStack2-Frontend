// src/utils/slug.ts
export const toSlug = (s: string) =>
  s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase()
    .replace(/\s+/g, "-");

export const sameCategory = (a: string, b: string) =>
  toSlug(a) === toSlug(b);
