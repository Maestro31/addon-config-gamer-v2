import chrome from './Browser';
import Config from '../Models/Config';

interface SaveMessage {
  command: string;
  config: Config;
}

export const saveConfigMessage = (config: Config) => {
  sendMessage({ command: 'save_config', config });
};

export const sendMessage = (message: SaveMessage) => {
  chrome.runtime.sendMessage(message);
};

export const copyConfigMessage = (config: Config) => {
  sendMessage({ command: 'copy_config', config });
};
