// app/utils/storage.ts
export const getItem = (key: string) => sessionStorage.getItem(key);
export const setItem = (key: string, value: string) => sessionStorage.setItem(key, value);
export const removeItem = (key: string) => sessionStorage.removeItem(key);