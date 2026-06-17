const storage = new Map<string, string>();

const asyncStorage = {
  async getItem(key: string) {
    return storage.has(key) ? storage.get(key) ?? null : null;
  },
  async setItem(key: string, value: string) {
    storage.set(key, value);
  },
  async removeItem(key: string) {
    storage.delete(key);
  },
  async clear() {
    storage.clear();
  },
};

export default asyncStorage;
export const getItem = asyncStorage.getItem;
export const setItem = asyncStorage.setItem;
export const removeItem = asyncStorage.removeItem;
export const clear = asyncStorage.clear;
