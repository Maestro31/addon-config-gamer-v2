import chrome from './Browser';
import Config from '../Models/Config';
import Component from '../Models/Component';

const storage = chrome.storage.local;

export const getTags = (): Promise<any> => {
  return get('tags');
};

export const addTags = async (newtags: string[]) => {
  const tags = await getTags();
  setTags(Array.from(new Set([...tags, ...newtags])));
};

export const getConfigs = async (): Promise<any> => {
  const data = await get('configs');
  const configs = data.map(config => {
    let c = Config.create(config);
    console.log(c);
    c.components = c.components.map(component => Component.create(component));
    return c;
  });
  console.log(configs);
  return configs;
};

export const addConfig = async (config: Config) => {
  const configs = await getConfigs();
  configs.push(config);
  setConfigs(configs);
};

export const get = (key: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    storage.get(key, items => {
      console.log(items[key]);
      resolve(items[key]);
    });
  });
};

export const setTags = (tags: string[]) => {
  set({ tags });
};
export const setConfigs = (configs: Config[]) => {
  set({ configs });
};

export const set = (item: {}) => {
  storage.set(item);
};
