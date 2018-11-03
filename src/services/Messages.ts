import chrome from './Browser';
import Config from '../Models/Config';

interface Message {
  [key: string]: any;
}

export const saveConfigMessage = (config: Config) => {
  sendMessage('save_config', { config });
};

export const sendMessage = (command: string, message?: Message) => {
  chrome.runtime.sendMessage({ command, ...message });
};

export const copyConfigMessage = (config: Config) => {
  sendMessage('copy_config', { config });
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
