import chrome from '../services/Browser';
import { addConfig, addTags, setConfigs, setTags } from '../services/Storage';
import Config from '../Models/Config';
//Action du clique sur l'icone de l'extension
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

// Réinitialise les données
if (true) {
  //setConfigs([]);
  setTags(['Streaming', 'Montage vidéo', '1080p', '4K', 'Gaming']);
}

let copiedConfig: Config = undefined;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === 'open_dashboard') {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
  }

  if (msg.command === 'save_config' && msg.config) {
    addConfig(msg.config);
    addTags(msg.config.tags);
  }

  if (msg.command === 'copy_config' && msg.config) {
    copiedConfig = msg.config;
  }
});

function createPasteMenu() {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    title: 'Poster config',
    onclick: (object, tab) => {
      chrome.tabs.sendMessage(tab.id, {
        command: 'post_config',
        config: copiedConfig
      });
    }
  });
}

const tabListener = tab => {
  chrome.tabs.query({ windowId: tab.windowId, active: true }, tab => {
    if (tab[0].url.match(/www\.config-gamer\.fr\/forum/)) {
      createPasteMenu();
    }
  });
};

chrome.tabs.onActivated.addListener(tabListener);
chrome.tabs.onCreated.addListener(tabListener);
chrome.tabs.onUpdated.addListener(tabListener);
