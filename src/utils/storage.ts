function serialize<T = any>(data: T) {
  return JSON.stringify(data);
}

function deserialize<T = any>(data: string) {
  return JSON.parse(data) as T;
}

export function set<T = any>(storage: Storage, key: string, data: T) {
  storage.setItem(key, serialize(data));
}

export function get<T = any>(storage: Storage, key: string) {
  const serializedData = storage.getItem(key);
  return serializedData ? deserialize<T>(serializedData) : undefined;
}

export function remove(storage: Storage, key: string) {
  storage.removeItem(key);
}

export function clear(storage: Storage) {
  storage.clear();
}

// export default
