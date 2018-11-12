import chrome from './Browser';
import Cart from '../Models/Cart';

const storage = chrome.storage.local;

export const getTags = (): Promise<any> => {
  return get('tags');
};

export const getComments = (): Promise<string[]> => {
  return get('comments');
};

export const addTags = async (newtags: string[]) => {
  const tags = await getTags();
  setTags(Array.from(new Set([...tags, ...newtags])));
};

export const addComment = async (newComment: string) => {
  const comments = await getComments();
  setComments(Array.from(new Set([...comments, newComment])));
};

export const getCarts = async (): Promise<any> => {
  return await get('carts');
};

export const addCart = async (cart: Cart) => {
  const carts = await getCarts();
  carts.push(cart);
  setCarts(carts);
};

export const get = (key: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    storage.get(key, items => {
      console.log(items[key]);
      resolve(items[key] || []);
    });
  });
};

export const setTags = (tags: string[]) => {
  set({ tags });
};
export const setCarts = (carts: Cart[]) => {
  set({ carts });
};

export const setComments = (comments: string[]) => {
  set({ comments });
};

export const set = (item: {}) => {
  storage.set(item);
};
