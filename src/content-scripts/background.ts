import chrome from '../services/Browser';
import {
  addCart,
  addTags,
  setCarts,
  setTags,
  setComments
} from '../services/Storage';
import Cart from '../Models/Cart';
import Messenger from '../services/Messages';

//Action du clique sur l'icone de l'extension
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

// Réinitialise les données
// if (true) {
//   setCarts(null);
//   setComments(null);
//   setTags(null);
// }

let copiedCart: Cart;

Messenger.register('open_dashboard', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

Messenger.register('save_cart', msg => {
  addCart(msg.cart);
  addTags(msg.cart.tags);
});

Messenger.register('copy_cart', msg => {
  copiedCart = msg.cart;
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
    title: 'Poster les articles',
    onclick: (object, tab) => {
      chrome.tabs.sendMessage(tab.id, {
        command: 'post_cart',
        cart: copiedCart
      });
    }
  });
}

function createCopyMenu() {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    title: 'Copier les articles',
    onclick: function(object, tab) {
      chrome.tabs.sendMessage(tab.id, { command: 'copy_cart' }, cart => {
        copiedCart = cart;
      });
    }
  });
}

const matchesForPaste = [
  'www.config-gamer.fr/forum/',
  'www.config-gamer.fr/administrator/'
];

const matchesForCopy = [
  'www.topachat.com/pages/configomatic.php',
  'secure.materiel.net/Cart',
  'materiel.net/configurateur-pc-sur-mesure/',
  'www.ldlc',
  'infomaxparis.com',
  'www.amazon'
];

var tabListener = function() {
  chrome.tabs.query(
    { currentWindow: true, active: true, highlighted: true },
    function(tab) {
      if (!tab[0]) return;

      if (matchesForPaste.some(url => tab[0].url.indexOf(url) != -1))
        createPasteMenu();
      else if (matchesForCopy.some(url => tab[0].url.indexOf(url) != -1))
        createCopyMenu();
      else chrome.contextMenus.removeAll();
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
