import chrome from './Browser';
import Cart from '../Models/Cart';

interface Message {
  [key: string]: any;
}

export const saveCartMessage = (cart: Cart) => {
  sendMessage('save_cart', { cart });
};

export const sendMessage = (command: string, message?: Message) => {
  chrome.runtime.sendMessage({ command, ...message });
};

export const copyCartMessage = (cart: Cart) => {
  sendMessage('copy_cart', { cart });
};

interface Actions {
  [key: string]: ((data?: any) => void)[];
}

export default class Messenger {
  static readonly actions: Actions = {};

  static register = (command: string, callback: (data?: any) => void): void => {
    if (Messenger.actions[command] == undefined) {
      Messenger.actions[command] = [];
    }

    Messenger.actions[command].push(callback);
  };

  static executeCommand = (command: string, message?: any) => {
    if (Messenger.actions[command])
      Messenger.actions[command].forEach(action => action(message));
  };
}
