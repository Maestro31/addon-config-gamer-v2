import chrome from '../services/Browser';
import {
  addConfig,
  addTags,
  setConfigs,
  setTags,
  setComments
} from '../services/Storage';
import SetupPC from '../Models/SetupPC';
import Messenger from '../services/Messages';

//Action du clique sur l'icone de l'extension
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

// Réinitialise les données
// if (true) {
//   setConfigs(null);
//   setComments(null);
//   setTags(null);
// }

let copiedConfig: SetupPC;

Messenger.register('open_dashboard', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

Messenger.register('save_config', msg => {
  addConfig(msg.config);
  addTags(msg.config.tags);
});

Messenger.register('copy_config', msg => {
  copiedConfig = msg.config;
});

Messenger.register('open_options', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  Messenger.executeCommand(msg.command, msg);
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

function createCopyMenu() {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    title: 'Copier config',
    onclick: function(object, tab) {
      chrome.tabs.sendMessage(tab.id, { command: 'copy_config' }, config => {
        copiedConfig = config;
      });
    }
  });
}

var tabListener = function() {
  chrome.tabs.query(
    { currentWindow: true, active: true, highlighted: true },
    function(tab) {
      if (!tab[0]) return;

      if (tab[0].url.indexOf('www.config-gamer.fr/forum/') != -1) {
        createPasteMenu();
      } else if (
        tab[0].url.indexOf('www.topachat.com/pages/configomatic.php') != -1
      ) {
        createCopyMenu();
      } else if (tab[0].url.indexOf('secure.materiel.net/Cart') != -1) {
        createCopyMenu();
      } else if (
        tab[0].url.indexOf('materiel.net/configurateur-pc-sur-mesure/') != -1
      ) {
        createCopyMenu();
      } else if (tab[0].url.indexOf('www.ldlc') != -1) {
        createCopyMenu();
      } else if (tab[0].url.indexOf('infomaxparis.com') != -1) {
        createCopyMenu();
      } else chrome.contextMenus.removeAll();
    }
  );
};

chrome.tabs.onActivated.addListener(tabListener);
chrome.tabs.onCreated.addListener(tabListener);
chrome.tabs.onUpdated.addListener(tabListener);
chrome.tabs.onHighlighted.addListener(tabListener);
chrome.tabs.onDetached.addListener(tabListener);
chrome.tabs.onReplaced.addListener(tabListener);
chrome.windows.onCreated.addListener(tabListener);
chrome.windows.onFocusChanged.addListener(tabListener);
