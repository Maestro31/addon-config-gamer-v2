import axios from 'axios';
import Config from '../../Models/Config';
import Component from '../../Models/Component';
import AbstractParser from './AbstractParser';
import { cpus } from 'os';

export default class MaterielNetParser extends AbstractParser {
  reseller: ResellerInfo = {
    name: 'Materiel.net',
    url: 'https://www.materiel.net',
    monnaie: 'EUR',
    searchUrlTemplate:
      'https://www.materiel.net/search/product/{{text}}/ftxt-/{{index}}?department={{category}}',
    searchUrlByCategoryTemplate:
      'https://www.materiel.net/{{cat-0}}/{{cat-1}}/{{cat-2}}',
    categoryList: [
      {
        label: 'Processeurs ',
        options: [
          {
            label: 'Tous les processeurs',
            value: 'processeur/l441'
          },
          {
            label: 'Processeur Intel',
            value: 'processeur/l441/+fb-C000000192'
          },
          {
            label: 'Processeur AMD',
            value: 'processeur/l441/+fb-C000000805'
          }
        ]
      },
      {
        label: 'Cartes Mères',
        options: [
          {
            label: 'Toutes les cartes mères',
            value: 'carte-mere/l443'
          },
          {
            label: 'Carte mère socket 2066',
            value: 'carte-mere/l443/+fv160-15949'
          },
          {
            label: 'Carte mère socket 1151',
            value: 'carte-mere/l443/+fv160-13685'
          },
          {
            label: 'Carte mère socket AM4',
            value: 'carte-mere/l443/+fv160-15394'
          },
          {
            label: 'Carte mère ATX',
            value: 'carte-mere/l443/+fv285-570'
          },
          {
            label: 'Carte mère micro ATX',
            value: 'carte-mere/l443/+fv285-607'
          },
          {
            label: 'Carte mère mini ITX',
            value: 'carte-mere/l443/+fv285-1809'
          }
        ]
      },
      {
        label: 'Mémoire PC / RAM',
        options: [
          {
            label: 'Toutes les mémoires',
            value: 'memoire/l442'
          },
          {
            label: 'RAM DDR4',
            value: 'memoire/l442/+fv133-11607'
          },
          {
            label: 'RAM DDR3',
            value: 'memoire/l442/+fv133-4140'
          },
          {
            label: 'RAM pour PC Portable',
            value: 'memoire/l442/+fv292-1370'
          }
        ]
      },
      {
        label: 'Refroidissement PC ',
        options: [
          {
            label: 'Watercooling',
            value: 'watercooling/l460'
          },
          {
            label: 'Ventilateur Boitier',
            value: 'ventilateur-boitier/l459'
          },
          {
            label: 'Refroidissement Processeur',
            value: 'refroidissement-processeur/l458'
          },
          {
            label: 'Pâte thermique',
            value: 'pate-thermique-pc/l461'
          },
          {
            label: 'Réhobus',
            value: 'rheobus/l462'
          }
        ]
      },
      {
        label: 'Cartes Graphiques',
        options: [
          {
            label: 'Carte graphique',
            value: 'carte-graphique/l426/+fv1025-5797'
          },
          {
            label: 'Carte graphique pro',
            value: 'carte-graphique-pro/l427'
          },
          {
            label: 'Carte graphique NVIDIA',
            value: 'carte-graphique/l426/+fv1026-5801'
          },
          {
            label: 'Carte graphique AMD',
            value: 'carte-graphique/l426/+fv1026-5800'
          },
          {
            label: 'Carte graphique RTX 2080 Ti',
            value: 'carte-graphique/l426/+fv121-16759'
          },
          {
            label: 'Carte graphique RTX 2080',
            value: 'carte-graphique/l426/+fv121-16758'
          },
          {
            label: 'Carte graphique RTX 2070',
            value: 'carte-graphique/l426/+fv121-16760'
          }
        ]
      },
      {
        label: 'Cartes autres',
        options: [
          {
            label: 'Cartes réseau',
            value: 'carte-reseau/l466'
          },
          {
            label: 'Cartes Son',
            value: 'carte-son/l471'
          }
        ]
      },
      {
        label: 'Stockage',
        options: [
          {
            label: 'Disque SSD',
            value: 'disque-ssd/l429'
          },
          {
            label: 'Disque dur interne',
            value: 'disque-dur-interne/l430'
          },
          {
            label: 'Disque dur externe',
            value: 'disque-dur-externe/l431'
          },
          {
            label: 'Serveur NAS',
            value: 'serveur-nas/l432'
          },
          {
            label: 'Clé USB',
            value: 'cle-usb/l433'
          },
          {
            label: 'Carte mémoire',
            value: 'carte-memoire/l434'
          },
          {
            label: 'Lecteur de carte mémoire',
            value: 'lecteur-de-carte-memoire/l435'
          },
          {
            label: 'Boîtier pour disque dur',
            value: 'boitier-pour-disque-dur/l436'
          },
          {
            label: 'Dock pour disque dur',
            value: 'dock-pour-disque-dur/l437'
          },
          {
            label: 'Lecteurs & graveurs optiques',
            value: 'lecteurs-et-graveurs-blu-ray-dvd-et-cd/l438'
          }
        ]
      },
      {
        label: 'Alimentation PC ',
        value: 'alimentation-pc/l445'
      },
      {
        label: 'Boîtier PC',
        value: 'boitier-pc/l446'
      },
      {
        label: 'Accessoires Boîtier PC ',
        options: [
          {
            label: 'Ventilateur',
            value: 'ventilateur-boitier/l449'
          },
          {
            label: 'Connectique',
            value: 'connectique-interne/l451'
          },
          {
            label: 'Rhéobus',
            value: 'rheobus/l450'
          },
          {
            label: 'Rack disque dur',
            value: 'rack-disque-dur-interne/l448'
          },
          {
            label: 'Grille de ventilateur',
            value: 'grille-ventilateur-pc/l452'
          },
          {
            label: 'Filtre anti-poussière',
            value: 'filtre-anti-poussiere/l453'
          },
          {
            label: 'Panneau latéral',
            value: 'panneau-lateral/l454'
          },
          {
            label: 'Vis et fixation',
            value: 'vis-et-fixation/l455'
          }
        ]
      },
      {
        label: 'Montage & installation',
        options: [
          {
            label: 'Montage & installation',
            value: 'montage-et-installation-pc/l465'
          }
        ]
      },
      {
        label: 'Autres périphériques PC',
        options: [
          {
            label: 'Fauteuils Gamers',
            value: 'fauteuil-siege-gamer/l503'
          },
          {
            label: 'Bureau Gamer',
            value: 'bureau-gamer/l504'
          },
          {
            label: 'Packs Clavier/Souris Gamer',
            value: 'pack-clavier-souris-gaming/l482'
          },
          {
            label: 'Réalité virtuelle',
            value: 'realite-virtuelle/l489'
          },
          {
            label: 'Microphones',
            value: 'microphone/l510'
          },
          {
            label: 'Simulation Auto',
            value: 'simulation-automobile/l511'
          },
          {
            label: 'Simulation de vol',
            value: 'simulation-de-vol/l512'
          },
          {
            label: 'Tablette graphique',
            value: 'tablette-graphique/l508'
          },
          {
            label: 'Scanners',
            value: 'scanner/l507'
          },
          {
            label: 'Webcams',
            value: 'webcam/l506'
          },
          {
            label: 'Connecteurs Bluetooth',
            value: 'connecteur-bluetooth/l641'
          }
        ]
      },
      {
        label: 'Montage & acquisition vidéo',
        options: [
          {
            label: 'Montrage & acquisition vidéo',
            value: 'montage-et-acquisition-video/l640'
          }
        ]
      },
      {
        label: "Kit d'évolution PC",
        value: 'kit-d-evolution-pc/l456'
      },
      {
        label: 'Ordinateur / PC Fixe',
        options: [
          {
            label: 'PC de bureau',
            value: 'pc-de-bureau/l402'
          },
          {
            label: 'Les PC Materiel.net - Incontournables !',
            value: 'pc-de-bureau/l402/+fb-C000036995'
          },
          {
            label: 'PC Gamer',
            value: 'pc-de-bureau/l402/+fv1447-7880'
          },
          {
            label: 'iMac et Mac Mini',
            value: 'imac-et-mac-mini/l403'
          },
          {
            label: 'Mini PC',
            value: 'pc-de-bureau/l402/+fv1046-5904'
          },
          {
            label: 'Barebone',
            value: 'barebone/l404'
          },
          {
            label: 'PC à usage professionel',
            value: 'pc-de-bureau/l402/+fv1447-7882'
          },
          {
            label: 'Serveur',
            value: 'serveur/l418'
          },
          {
            label: 'Accessoires Serveur',
            value: 'accessoires-serveur/l420'
          },
          {
            label: 'Montage et installation PC',
            value: 'montage-et-installation-pc/l406'
          },
          {
            label: 'Garanties PC de bureau',
            value: 'garanties-pc-de-bureau/l407'
          },
          {
            label: 'Garanties Serveur',
            value: 'garanties-serveur/l419'
          }
        ]
      },
      {
        label: 'Ordinateur Portable ',
        options: [
          {
            label: 'PC portable',
            value: 'pc-portable/l409'
          },
          {
            label: 'PC portable gamer',
            value: 'pc-portable/l409/+fv417-946'
          },
          {
            label: 'PC portable multimédia',
            value: 'pc-portable/l409/+fv417-943'
          },
          {
            label: 'PC portable bureautique',
            value: 'pc-portable/l409/+fv417-941'
          },
          {
            label: 'Macbook & Macbook Pro',
            value: 'macbook/l410'
          },
          {
            label: 'Sac, sacoche et housse',
            value: 'sac-sacoche-et-housse/l411'
          },
          {
            label: 'Refroidisseur PC portable',
            value: 'refroidisseur-pc-portable/l412'
          },
          {
            label: "Station d'accueil PC portable",
            value: 'station-d-accueil-pc-portable/l413'
          },
          {
            label: 'Chargeur PC portable',
            value: 'chargeur-pc-portable/l634'
          },
          {
            label: 'Accessoires PC portable',
            value: 'accessoires-pc-portable/l414'
          },
          {
            label: 'Garanties PC portable',
            value: 'garanties-pc-portable/l415'
          }
        ]
      },
      {
        label: 'Connectique PC et informatique',
        options: [
          {
            label: 'HDMI',
            value: 'hdmi/l598'
          },
          {
            label: 'USB',
            value: 'usb/l599'
          },
          {
            label: 'VGA',
            value: 'vga/l600'
          },
          {
            label: 'DVI',
            value: 'dvi/l601'
          },
          {
            label: 'Serial ATA',
            value: 'serial-ata/l602'
          },
          {
            label: 'DisplayPort',
            value: 'displayport/l603'
          },
          {
            label: 'Alimentation',
            value: 'alimentation/l604'
          },
          {
            label: 'SAS / SCSI',
            value: 'sas-scsi/l605'
          },
          {
            label: 'Firewire',
            value: 'firewire/l606'
          },
          {
            label: 'IDE',
            value: 'ide/l607'
          },
          {
            label: 'Série',
            value: 'serie/l608'
          },
          {
            label: 'Parallèle',
            value: 'parallele/l610'
          }
        ]
      },
      {
        label: 'Connectique Réseau',
        options: [
          {
            label: 'Câble RJ45',
            value: 'cable-rj45/l612'
          },
          {
            label: 'Connectique RJ45',
            value: 'connectique-rj45/l614'
          },
          {
            label: 'Câble fibre Optique',
            value: 'cable-fibre-optique/l615'
          },
          {
            label: 'Câble RJ11',
            value: 'cable-rj11/l616'
          },
          {
            label: 'Connectique RJ11',
            value: 'connectique-rj11/l617'
          },
          {
            label: 'Outillage',
            value: 'outillage/l618'
          }
        ]
      },
      {
        label: 'Connectique HiFi et Audio',
        options: [
          {
            label: 'Câble audio Jack',
            value: 'cable-audio-jack/l620'
          },
          {
            label: 'Câble audio numériques',
            value: 'cable-audio-numeriques/l621'
          },
          {
            label: "Câble d'enceintes",
            value: 'cable-d-enceintes/l622'
          },
          {
            label: 'Câble audio RCA',
            value: 'cable-audio-rca/l623'
          },
          {
            label: 'Adaptateur',
            value: 'adaptateur/l624'
          }
        ]
      },
      {
        label: 'Connectique TV et Vidéo',
        options: [
          {
            label: 'HDMI',
            value: 'hdmi/l626'
          },
          {
            label: 'S-Vidéo',
            value: 's-video/l627'
          },
          {
            label: 'Câble TV',
            value: 'cable-tv/l629'
          },
          {
            label: 'Câble Satellite',
            value: 'cable-satellite/l630'
          }
        ]
      },
      {
        label: 'Connectique secteur',
        options: [
          {
            label: 'Prise parafoudre',
            value: 'prise-parafoudre/l632'
          },
          {
            label: 'Multiprise',
            value: 'multiprise/l646'
          },
          {
            label: 'Câble Secteur',
            value: 'cable-secteur/l647'
          }
        ]
      },
      {
        label: 'Télévision',
        options: [
          {
            label: 'TV',
            value: 'tv/l553'
          },
          {
            label: 'TV 4K Ultra HD',
            value: 'tv/l553/+fv873-10331'
          },
          {
            label: 'TV OLED',
            value: 'tv/l553/+fv553-11898'
          },
          {
            label: 'TV Incurvée',
            value: 'tv/l553/+fc2127-1'
          },
          {
            label: 'Lecteur Blu-Ray',
            value: 'lecteur-blu-ray/l554'
          },
          {
            label: 'Télécommande',
            value: 'telecommande/l642'
          },
          {
            label: 'Support TV',
            value: 'support-tv/l555'
          }
        ]
      },
      {
        label: 'Vidéoprojection',
        options: [
          {
            label: 'Vidéoprojecteur',
            value: 'videoprojecteur/l559'
          },
          {
            label: 'Vidéoprojecteur Home Cinéma',
            value: 'videoprojecteur/l559/+fv1203-6446'
          },
          {
            label: 'Vidéoprojecteur focale courte',
            value: 'videoprojecteur/l559/+fv1478-8380'
          },
          {
            label: 'Pico projecteur',
            value: 'videoprojecteur/l559/+fv1203-6443'
          },
          {
            label: 'Écran de projection',
            value: 'ecran-de-projection/l560'
          },
          {
            label: 'Support vidéoprojecteur',
            value: 'support-videoprojecteur/l561'
          }
        ]
      },
      {
        label: 'Hifi / Home Cinéma',
        options: [
          {
            label: 'Barre de son',
            value: 'barre-de-son/l563'
          },
          {
            label: 'Ampli Home Cinéma',
            value: 'ampli-home-cinema/l564'
          },
          {
            label: 'Ampli HiFi Stéréo',
            value: 'ampli-hifi-stereo/l565'
          },
          {
            label: 'Enceintes HiFi / Home Cinéma',
            value: 'enceintes-hifi-home-cinema/l566'
          },
          {
            label: 'Subwoofer / Caisson de graves',
            value: 'subwoofer-caisson-de-graves/l567'
          },
          {
            label: 'Système audio multiroom',
            value: 'systeme-audio-multiroom/l568'
          },
          {
            label: 'Casque HiFi',
            value: 'casque-hifi/l569'
          },
          {
            label: 'Mini-chaîne',
            value: 'mini-chaine/l571'
          },
          {
            label: 'Platine CD',
            value: 'platine-cd/l572'
          },
          {
            label: 'Platine Vinyles',
            value: 'platine-vinyles/l573'
          },
          {
            label: 'Support enceintes',
            value: 'support-enceinte/l643'
          }
        ]
      },
      {
        label: 'Audio nomade',
        options: [
          {
            label: 'Casque Audio',
            value: 'casque-audio/l575'
          },
          {
            label: 'Casque à réduction de bruit actif',
            value: 'casque-audio/l575/+fc1866-1'
          },
          {
            label: 'Écouteurs sport',
            value: 'casque-audio/l575/+fv1221-9793'
          },
          {
            label: 'Enceinte Bluetooth',
            value: 'enceinte-bluetooth/l576'
          },
          {
            label: 'Dac Audio et streaming',
            value: 'dac-audio-et-streaming/l578'
          }
        ]
      },
      {
        label: 'Photo / Caméra',
        options: [
          {
            label: 'Appareil photo compact ou bridge',
            value: 'appareil-photo-compact-ou-bridge/l580'
          },
          {
            label: 'Appareil photo hybride',
            value: 'appareil-photo-hybride/l581'
          },
          {
            label: 'Appareil photo Reflex',
            value: 'appareil-photo-reflex/l582'
          },
          {
            label: 'Caméra sport',
            value: 'camera-sport/l583'
          },
          {
            label: 'Caméscope',
            value: 'camescope/l584'
          },
          {
            label: 'Carte mémoire',
            value: 'carte-memoire/l585'
          },
          {
            label: 'Lecteur de carte mémoire',
            value: 'lecteur-de-carte-memoire/l586'
          },
          {
            label: 'Objectif pour appareil photo',
            value: 'objectif-pour-appareil-photo/l587'
          },
          {
            label: 'Flash et éclairage',
            value: 'flash-et-eclairage/l588'
          },
          {
            label: 'Batterie et chargeur',
            value: 'batterie-et-chargeur/l644'
          },
          {
            label: 'Dashcam',
            value: 'dashcam/l589'
          },
          {
            label: 'Sac, sacoche et housse',
            value: 'sac-sacoche-et-housse/l590'
          },
          {
            label: 'Accessoires Photo',
            value: 'accessoires-photo/l591'
          },
          {
            label: 'Accessoires caméra sport',
            value: 'accessoires-camera-sport/l595'
          },
          {
            label: 'Trépied appareil photo',
            value: 'trepied-appareil-photo/l592'
          },
          {
            label: 'Filtre photo',
            value: 'filtre-photo/l593'
          },
          {
            label: 'Complément objectif',
            value: 'complement-objectif/l594'
          }
        ]
      },
      {
        label: 'Smartphone & Téléphone mobile',
        options: [
          {
            label: "Tous l'univers Smartphone et Téléphonie mobile",
            value: 'smartphone-et-telephone-mobile/l531'
          },
          {
            label: 'Smartphone Android',
            value: 'smartphone-et-telephone-mobile/l531/+fv1050-5842'
          },
          {
            label: 'Téléphone portable',
            value: 'smartphone-et-telephone-mobile/l531/+fv991-5557'
          },
          {
            label: 'Smartphone double SIM',
            value: 'smartphone-et-telephone-mobile/l531/+fc1442-1'
          },
          {
            label: 'Smartphone étanche / antichoc',
            value: 'smartphone-et-telephone-mobile/l531/+fc1097-1'
          },
          {
            label: 'iPhone',
            value: 'smartphone-et-telephone-mobile/l531/+fb-C000005309'
          },
          {
            label: 'Smartphone Samsung',
            value: 'smartphone-et-telephone-mobile/l531/+fb-C000001080'
          },
          {
            label: 'Smartphone Xiaomi',
            value: 'smartphone-et-telephone-mobile/l531/+fb-C000036359'
          },
          {
            label: 'Smartphone Wiko',
            value: 'smartphone-et-telephone-mobile/l531/+fb-C000035309'
          },
          {
            label: 'Smartphone Nokia',
            value: 'smartphone-et-telephone-mobile/l531/+fb-C000001062'
          },
          {
            label: 'Smartphone Sony',
            value: 'smartphone-et-telephone-mobile/l531/+fb-C000001152'
          },
          {
            label: 'Smartphone Huawei',
            value: 'smartphone-et-telephone-mobile/l531/+fb-C000035190'
          },
          {
            label: 'Smartphone Asus Zenphone',
            value: 'smartphone-et-telephone-mobile/l531/+fb-C000000806'
          },
          {
            label: 'Smartphone Honor',
            value: 'smartphone-et-telephone-mobile/l531/+fb-C000036353'
          }
        ]
      },
      {
        label: 'Montre connectée',
        options: [
          {
            label: "Tout l'univers Montre connectée",
            value: 'montre-connectee/l534'
          },
          {
            label: 'Apple watch',
            value: 'montre-connectee/l534/+fb-C000005309'
          },
          {
            label: 'Samsung Gear & Galaxy Watch',
            value: 'montre-connectee/l534/+fb-C000001080'
          }
        ]
      },
      {
        label: 'Accessoires téléphonie mobile',
        options: [
          {
            label: 'Carte mémoire',
            value: 'carte-memoire/l537'
          },
          {
            label: 'Coque et housse',
            value: 'coque-et-housse/l538'
          },
          {
            label: "Protection d'écran",
            value: 'protection-d-ecran/l539'
          },
          {
            label: 'Chargeur',
            value: 'chargeur/l540'
          },
          {
            label: 'Batterie et powerbank',
            value: 'batterie-et-powerbank/l541'
          },
          {
            label: 'Adaptateurs et câbles',
            value: 'adaptateurs-et-cables/l542'
          },
          {
            label: 'Kits mains libres',
            value: 'kits-mains-libres/l543'
          },
          {
            label: 'Accessoires auto',
            value: 'accessoires-auto/l544'
          },
          {
            label: 'Autres accessoires',
            value: 'autres-accessoires/l545'
          }
        ]
      },
      {
        label: 'Téléphone fixe',
        options: [
          {
            label: 'Téléphone fixe filaire',
            value: 'telephone-fixe-filaire/l548'
          },
          {
            label: 'Téléphone fixe sans fil',
            value: 'telephone-fixe-sans-fil/l549'
          },
          {
            label: 'Casque téléphonie',
            value: 'casque-telephonie/l550'
          }
        ]
      },
      {
        label: 'Serveur NAS',
        options: [
          {
            label: 'Tous les serveurs NAS',
            value: 'serveur-nas/l519'
          },
          {
            label: 'NAS Synology',
            value: 'serveur-nas/l519/+fb-C000033827'
          },
          {
            label: 'NAS QNAP',
            value: 'serveur-nas/l519/+fb-C000034192'
          },
          {
            label: 'NAS Western Digital',
            value: 'serveur-nas/l519/+fb-C000001076'
          },
          {
            label: 'NAS avec disque dur',
            value: 'serveur-nas/l519/+fv1295-7127'
          },
          {
            label: 'NAS sans disque dur',
            value: 'serveur-nas/l519/+fv1295-7128'
          }
        ]
      },
      {
        label: 'CPL',
        options: [
          {
            label: 'Tous les CPL',
            value: 'cpl/l522'
          },
          {
            label: 'CPL switch',
            value: 'cpl/l522/+fc1022-1'
          },
          {
            label: 'CPL WiFi',
            value: 'cpl/l522/+fc1228-1'
          }
        ]
      },
      {
        label: 'Caméra IP',
        options: [
          {
            label: 'Toutes les Caméras IP',
            value: 'camera-ip/l525'
          },
          {
            label: 'Caméra extérieure',
            value: 'camera-ip/l525/+fv2305-13864'
          },
          {
            label: 'Caméra intérieure',
            value: 'camera-ip/l525/+fv2305-13863'
          },
          {
            label: 'Caméra PoE',
            value: 'camera-ip/l525/+fc1062-1'
          },
          {
            label: 'Caméra WiFi',
            value: 'camera-ip/l525/+fv32-4987'
          }
        ]
      },
      {
        label: 'Carte réseau',
        options: [
          {
            label: 'Toutes les cartes réseau',
            value: 'carte-reseau/l529'
          },
          {
            label: 'Carte Ethernet interne',
            value: 'carte-reseau/l529/+fv1270-6892'
          },
          {
            label: 'Carte Ethernet externe',
            value: 'carte-reseau/l529/+fv1270-6895'
          },
          {
            label: 'Carte WiFi interne',
            value: 'carte-reseau/l529/+fv1270-6893'
          },
          {
            label: 'Carte WiFi externe',
            value: 'carte-reseau/l529/+fv1270-6894'
          }
        ]
      },
      {
        label: 'Écrans ordinateur',
        options: [
          {
            label: 'Écran PC',
            value: 'ecran-pc/l474'
          },
          {
            label: 'Écran PC Gamer',
            value: 'ecran-pc/l474/+fv417-946'
          },
          {
            label: 'Écran PC 4K UHD',
            value: 'ecran-pc/l474/+fv398-8206'
          },
          {
            label: 'Écran PC 27 pouces',
            value: 'ecran-pc/l474/+fv889-4957'
          },
          {
            label: "Bras et support d'écran",
            value: 'bras-support-ecran-pc/l475'
          },
          {
            label: 'Accessoires écran PC',
            value: 'accessoires-ecran-pc/l477'
          },
          {
            label: 'Lunettes polarisante anti-fatigue',
            value: 'lunettes-polarisantes-anti-fatigue/l476'
          }
        ]
      },
      {
        label: 'Claviers & Souris ',
        options: [
          {
            label: 'Clavier PC',
            value: 'clavier-pc/l479'
          },
          {
            label: 'Clavier PC Gamer',
            value: 'clavier-pc/l479/+fv1025-5797'
          },
          {
            label: 'Clavier PC Mécanique',
            value: 'clavier-pc/l479/+fc1431-1'
          },
          {
            label: 'Souris PC',
            value: 'souris-pc/l480'
          },
          {
            label: 'Souris PC Gamer',
            value: 'souris-pc/l480/+fv993-5578'
          },
          {
            label: 'Pack clavier-souris',
            value: 'pack-clavier-souris-bureautique/l481'
          },
          {
            label: 'Pack gaming',
            value: 'pack-clavier-souris-gaming/l482'
          },
          {
            label: 'Tapis de souris',
            value: 'tapis-de-souris/l483'
          }
        ]
      },
      {
        label: 'Casque Micro',
        options: [
          {
            label: 'Tous les Casques Micro',
            value: 'casque-micro/l484'
          },
          {
            label: 'Casque micro Gamer',
            value: 'casque-micro/l484/+fv1221-6518'
          },
          {
            label: 'Casque micro bureautique',
            value: 'casque-micro/l484/+fv1221-6520'
          }
        ]
      },
      {
        label: 'Enceintes PC',
        options: [
          {
            label: 'Toutes les Enceintes PC',
            value: 'enceintes-pc/l505'
          },
          {
            label: 'Enceintes PC 2.0',
            value: 'enceintes-pc/l505/+fv481-1611'
          },
          {
            label: 'Enceintes PC 2.1',
            value: 'enceintes-pc/l505/+fv481-1612'
          },
          {
            label: 'Enceintes PC 5.1',
            value: 'enceintes-pc/l505/+fv481-1613'
          }
        ]
      },
      {
        label: 'Stockage Externe',
        options: [
          {
            label: 'Serveur NAS',
            value: 'serveur-nas/l486'
          },
          {
            label: 'Disque dur externe',
            value: 'disque-dur-externe/l487'
          },
          {
            label: 'Clé USB',
            value: 'cle-usb/l488'
          }
        ]
      },
      {
        label: 'Manette de Jeu',
        options: [
          {
            label: 'Toutes les manettes de jeu',
            value: 'manette-de-jeu/l509'
          },
          {
            label: 'Manette sans fil',
            value: 'manette-de-jeu/l509/+fc194-1'
          },
          {
            label: 'Manette Playstation',
            value: 'manette-de-jeu/l509/+fv363-9969'
          },
          {
            label: 'Manette Xbox',
            value: 'manette-de-jeu/l509/+fv363-10020'
          }
        ]
      },
      {
        label: 'Impression',
        options: [
          {
            label: 'Imprimante multifonction',
            value: 'imprimante-multifonction/l491'
          },
          {
            label: "Imprimante jet d'encre",
            value: 'imprimante-jet-d-encre/l493'
          },
          {
            label: 'Imprimante Laser',
            value: 'imprimante-laser/l492'
          },
          {
            label: 'Imprimante thermique / Titreuse',
            value: 'imprimante-thermique-titreuse/l494'
          },
          {
            label: 'Imprimante 3D',
            value: 'imprimante-3d/l495'
          },
          {
            label: 'Scanner 3D',
            value: 'scanner-3d/l496'
          },
          {
            label: "Cartouche d'encre",
            value: 'cartouche-imprimante/l497'
          },
          {
            label: 'Toner',
            value: 'toner-imprimante/l498'
          },
          {
            label: 'Papier',
            value: 'papier-imprimante/l499'
          },
          {
            label: 'Filament 3D',
            value: 'filament-3d/l500'
          },
          {
            label: 'Accessoires imprimante',
            value: 'accessoires-imprimante/l501'
          }
        ]
      },
      {
        label: 'Onduleur et Prises Parafoudres',
        options: [
          {
            label: 'Batterie onduleur',
            value: 'batterie-onduleur/l654'
          },
          {
            label: 'Accessoires onduleur',
            value: 'accessoires-onduleur/l655'
          },
          {
            label: 'Prise parafoudre',
            value: 'prise-parafoudre/l516'
          }
        ]
      },
      {
        label: 'Raspberry PI ',
        options: [
          {
            label: "L'univers Raspberry PI",
            value: 'raspberry-pi/l444'
          },
          {
            label: 'Carte mère',
            value: 'raspberry-pi/l444/+fv2633-16688'
          },
          {
            label: 'Modules',
            value: 'raspberry-pi/l444/+fv2633-16689'
          },
          {
            label: 'Pack',
            value: 'raspberry-pi/l444/+fv2633-16690'
          }
        ]
      },
      {
        label: 'Tablettes Tactiles ',
        options: [
          {
            label: 'Tablette',
            value: 'tablette/l422'
          },
          {
            label: 'iPad & iPad Mini',
            value: 'tablette/l422/+fb-C000005309'
          },
          {
            label: 'Tablette Android',
            value: 'tablette/l422/+fv1050-5842'
          },
          {
            label: 'Tablette Windows',
            value: 'tablette/l422/+fv1050-13636'
          },
          {
            label: 'Accessoires tablette tactile',
            value: 'accessoires-tablette-tactile/l423'
          }
        ]
      },
      {
        label: 'Os & Logiciel ',
        options: [
          {
            label: 'Windows',
            value: 'windows/l636'
          },
          {
            label: 'Windows Server',
            value: 'windows-server/l637'
          },
          {
            label: 'Microsoft Office',
            value: 'microsoft-office/l638'
          },
          {
            label: 'Antivirus et sécurité',
            value: 'antivirus-et-securite/l639'
          }
        ]
      }
    ],
    matchesUrl: [
      {
        regex: /https:\/\/secure\.materiel\.net\/Cart/,
        methodName: 'fromCart'
      },
      {
        regex: /https:\/\/www\.materiel\.net\/configurateur-pc-sur-mesure/,
        methodName: 'fromConfigurateur'
      },
      {
        regex: /https:\/\/secure\.materiel\.net\/Account\/SavedCartsSection/,
        methodName: 'fromSavedCart'
      }
    ]
  };

  fromCart = (): Config => {
    let config = new Config();
    let elements = this.getListElement(document.body, {
      selector: '.cart-list__body > .cart-table',
      defaultValue: []
    });
    Array.prototype.forEach.call(elements, parentNode => {
      let component = new Component();
      component.instock =
        this.getElementAttribute(parentNode, {
          selector: '.o-availability__value',
          attribute: 'innerText'
        }) === 'EN STOCK';
      component.quantity = parseInt(
        this.getElementAttribute(parentNode, {
          selector: 'span.hida',
          defaultValue: '1',
          attribute: 'innerText'
        })
      );
      let price = this.getElementAttribute(parentNode, {
        selector: '.o-product__price',
        defaultValue: '0',
        attribute: 'innerText'
      }).replace('€', '.');
      component.price = parseFloat(price) / component.quantity;
      component.name = this.getElementAttribute(parentNode, {
        selector: '.title > a',
        defaultValue: '',
        attribute: 'innerText'
      });
      component.url = this.getElementAttribute(parentNode, {
        selector: '.title > a',
        defaultValue: '#',
        attribute: 'href'
      });
      component.imageUrl = this.getElementAttribute(parentNode, {
        selector: 'img',
        defaultValue: '#',
        attribute: 'src'
      });
      component.error = this.getElementAttribute(parentNode, {
        selector: '.error',
        defaultValue: '',
        attribute: 'innerText'
      });
      config.addComponent(component);
    });

    config.monnaie = this.reseller.monnaie;
    config.reseller = this.reseller;
    return config;
  };

  fromSavedCart = (): Config => {
    let config = new Config();
    let elements = this.getListElement(document.body, {
      selector: '.basket__body.show .order__body .order-table',
      defaultValue: []
    });
    Array.prototype.forEach.call(elements, parentNode => {
      let component = new Component();
      component.instock =
        this.getElementAttribute(parentNode, {
          selector: '.order-cell--stock .o-availability__value',
          attribute: 'innerText'
        }) === 'EN STOCK';
      component.quantity = parseInt(
        this.getElementAttribute(parentNode, {
          selector: 'order-cell--quantity',
          defaultValue: '1',
          attribute: 'innerHTML'
        }).replace('x', '')
      );
      let price = this.getElementAttribute(parentNode, {
        selector: '.order-cell--price',
        defaultValue: '0',
        attribute: 'innerText'
      }).replace('€', '.');
      component.price = parseFloat(price) / component.quantity;
      component.name = this.getElementAttribute(parentNode, {
        selector: '.order-cell--designation a',
        defaultValue: '',
        attribute: 'innerText'
      });
      component.url = this.getElementAttribute(parentNode, {
        selector: '.order-cell--designation a',
        defaultValue: '#',
        attribute: 'href'
      });
      component.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.order-cell--pic > img',
        defaultValue: '#',
        attribute: 'src'
      });

      config.addComponent(component);
    });

    return config;
  };

  fromConfigurateur = (): Config => {
    let config = new Config();

    const elements = this.getListElement(document.body, {
      selector: '.c-row__content',
      defaultValue: []
    });
    Array.prototype.forEach.call(elements, parentNode => {
      let component = new Component();
      component.name = this.getElementAttribute(parentNode, {
        selector: '.c-meta__title',
        defaultValue: '',
        attribute: 'innerText'
      });
      component.url = this.getElementAttribute(parentNode, {
        selector: '.c-selected-product__meta > a',
        defaultValue: '#',
        attribute: 'href'
      });
      component.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.c-selected-product__thumb > img',
        defaultValue: '#',
        attribute: 'src'
      });
      component.error = this.getElementAttribute(parentNode, {
        selector: '.error',
        defaultValue: '',
        attribute: 'innerText'
      });
      console.log(component);
      config.addComponent(component);
    });

    let recapElements = this.getListElement(document.body, {
      selector: '.c-configuration__table tbody > tr',
      defaultValue: []
    });
    Array.prototype.forEach.call(recapElements, parentNode => {
      const instock =
        this.getElementAttribute(parentNode, {
          selector: 'td:first-child title',
          attribute: 'innerHTML',
          defaultValue: ''
        }) === 'En stock';
      let name = this.getElementAttribute(parentNode, {
        selector: 'td:nth-child(2)',
        attribute: 'innerText',
        defaultValue: ''
      });
      const price = parseFloat(
        this.getElementAttribute(parentNode, {
          selector: 'td:nth-child(3)',
          attribute: 'innerText',
          defaultValue: '0'
        })
          .replace('€', '.')
          .replace(/\s/g, '')
      );

      const match = name.match(/^([0-9]+) x (.+)$/);

      let quantity = 1;
      if (match) {
        quantity = parseInt(match[1]);
        name = match[2];
      }

      config.components = config.components.map(item => {
        if (name === item.name) {
          item.instock = instock;
          item.quantity = quantity;
          item.price = price;
        }
        return item;
      });
    });

    return config;
  };

  updateComponent = (component: Component): Promise<Component> => {
    return axios.get(component.url).then(({ data }) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const price = this.getElementAttribute(doc.body, {
        selector: '.o-product__price',
        attribute: 'innerText',
        defaultValue: '0'
      })
        .replace('€', '.')
        .replace(/\s/g, '');

      component.price = parseFloat(price);
      component.instock =
        this.getElementAttribute(doc.body, {
          selector: '.o-availability__value',
          attribute: 'innerText',
          defaultValue: false
        }) === 'En stock';

      return component;
    });
  };

  parseListComponents(doc: Document): Component[] {
    console.log('Analyse des composants en cours...');
    let components: Array<Component> = [];

    const html = doc.head.innerHTML;

    const rePrice = /price\["([A-Z0-9]+)"\].+<span class="o-product__price">([0-9\s]+€)<sup>([0-9]+)/g;

    let prices;
    let matches = [];
    while ((matches = rePrice.exec(html))) {
      let priceStr = matches[2] + matches[3];
      const price = parseFloat(priceStr.replace('€', '.').replace(/\s/g, ''));

      prices = { ...prices, [matches[1]]: price };
    }

    const reStock = /stock\["([A-Z0-9]+)"\].+value--stock_([0-9]+)">/g;

    let stocks;
    matches = [];
    while ((matches = reStock.exec(html))) {
      stocks = { ...stocks, [matches[1]]: matches[2] == '1' };
    }

    const elements = this.getListElement(doc.body, {
      selector: '.c-products-list .c-products-list__item',
      defaultValue: []
    });

    Array.prototype.forEach.call(elements, parentNode => {
      let component = new Component();

      component.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.c-product__thumb > img',
        innerAttribute: 'data-src',
        defaultValue: '#'
      });

      component.name = this.getElementAttribute(parentNode, {
        selector: '.c-product__title ',
        attribute: 'innerText',
        defaultValue: ''
      });

      const relativeUrl = this.getElementAttribute(parentNode, {
        selector: '.c-product__thumb > img',
        innerAttribute: 'data-wrap-url',
        defaultValue: '#'
      });

      component.url = `${this.reseller.url}${relativeUrl}`;

      const componentId = parentNode.id || parentNode.getAttribute('data-id');

      if (stocks === undefined) {
        component.instock =
          this.getElementAttribute(parentNode, {
            selector: '.o-availability__value',
            attribute: 'innerText',
            defaultValue: ''
          }) === 'En stock';
      } else if (Object.keys(stocks).includes(componentId))
        component.instock = stocks[componentId];

      if (prices === undefined) {
        const price = this.getElementAttribute(parentNode, {
          selector: '.o-product__price',
          attribute: 'innerText',
          defaultValue: '0'
        });

        component.price = parseFloat(
          price.replace('€', '.').replace(/\s/g, '')
        );
      } else if (Object.keys(prices).includes(componentId))
        component.price = prices[componentId];

      components.push(component);
    });
    return components;
  }

  getFilters = (doc: Document): FilterData[] => {
    console.log('Récupération des filtres de la page en cours...');
    const filterNodes = this.getListElement(doc.body, {
      selector: '#filterProduct > div.c-collapse',
      defaultValue: []
    });

    let filters: FilterData[] = [];

    Array.prototype.forEach.call(filterNodes, filterNode => {
      let filter: FilterData = {
        id: '',
        type: '',
        label: '',
        options: []
      };

      filter.label = this.getElementAttribute(filterNode, {
        selector: 'a:first-child',
        attribute: 'innerText',
        noChildInnerText: true,
        defaultValue: ''
      }).trim();

      const filterContent = <HTMLDivElement>(
        filterNode.querySelector('.c-collapse__content')
      );

      filter.type = filterContent.classList.contains('is-slider')
        ? 'ruler'
        : 'combo';

      if (filter.type === 'combo') {
        filter.id = this.getElementAttribute(filterNode, {
          selector: 'ul > li:first-child > input',
          attribute: 'id',
          defaultValue: ''
        }).split('_')[1];

        const inputs = this.getListElement(filterNode, {
          selector: 'ul > li',
          defaultValue: []
        });

        Array.prototype.forEach.call(inputs, inputNode => {
          let option = {
            label: '',
            value: '',
            selected: false
          };

          option.label = this.getElementAttribute(inputNode, {
            selector: 'label',
            attribute: 'innerText',
            noChildInnerText: true,
            defaultValue: ''
          }).trim();

          option.value = this.getElementAttribute(inputNode, {
            selector: 'input',
            attribute: 'value',
            defaultValue: ''
          });

          option.selected = this.getElementAttribute(inputNode, {
            selector: 'input',
            attribute: 'checked',
            defaultValue: ''
          });

          console.log(option.selected);

          filter.options.push(option);
        });
      }

      if (filter.type === 'ruler') {
        filter.id = this.getElementAttribute(filterNode, {
          selector: '.o-range-slider',
          innerAttribute: 'data-min-input-id',
          defaultValue: ''
        }).split('_')[1];

        const dataRange = this.getElementAttribute(filterNode, {
          selector: '.o-range-slider',
          innerAttribute: 'data-range',
          defaultValue: null
        });

        const unit = this.getElementAttribute(filterNode, {
          selector: '.o-range-slider',
          innerAttribute: 'data-unit',
          defaultValue: ''
        });

        const dataCurrentMin = this.getElementAttribute(filterNode, {
          selector: '.o-range-slider',
          innerAttribute: 'data-current-min',
          defaultValue: ''
        });

        const dataCurrentMax = this.getElementAttribute(filterNode, {
          selector: '.o-range-slider',
          innerAttribute: 'data-current-max',
          defaultValue: ''
        });

        if (dataRange) {
          dataRange.split(', ').forEach(step => {
            filter.options.push({
              label: `${step} ${unit}`,
              value: step,
              selected: step == dataCurrentMin || step == dataCurrentMax
            });
          });
        } else {
          const min = parseInt(dataCurrentMin);
          const max = parseInt(dataCurrentMax);

          filter.options.push({
            label: `${min} ${unit}`,
            value: min.toString(),
            selected: true
          });

          let step = Math.round((max - min) / 198);
          step = step < 1 ? 1 : step;

          for (let i = min; i < max; i += step) {
            filter.options.push({
              label: `${i} ${unit}`,
              value: i.toString(),
              selected: false
            });
          }

          filter.options.push({
            label: `${max} ${unit}`,
            value: max.toString(),
            selected: true
          });
        }
      }

      filters.push(filter);
    });

    console.log(filters);

    return filters;
  };

  getSearchWithFilterUrl = (args: SearchArgs): string => {
    let url = this.getUrlFromTemplate(
      this.reseller.searchUrlByCategoryTemplate,
      args
    );

    if (args.filterValues && args.filterValues.length !== 0) {
      let selectedOptions = {};
      let filterValues = args.filterValues;

      for (let i = 0; i < filterValues.length; i++) {
        const id = filterValues[i].id;
        const value = filterValues[i].value;
        if (selectedOptions[id] === undefined) {
          selectedOptions[id] = [];
        }

        selectedOptions[id].push(value.toString());
      }

      Object.keys(selectedOptions).forEach(key => {
        if (selectedOptions[key][0].includes('_')) {
          let [low, high] = selectedOptions[key][0].split('_');
          url += `+${key}-l${low}h${high}`;
        } else url += `+${key}-${selectedOptions[key].join(',')}`;
      });
    }

    if (url.endsWith('/')) {
      url = url.replace(/\/$/, '');
    }

    if (args.index > 1) url += `/page${args.index}`;

    console.log(url);

    return url;
  };

  searchComponentWithFilter = async (
    args: SearchArgs
  ): Promise<SearchResponse> => {
    const url = this.getSearchWithFilterUrl(args);

    return axios
      .get(url)
      .then(({ data }) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const itemsCountString = this.getElementAttribute(doc.body, {
          selector: '.c-products__count',
          attribute: 'innerText',
          defaultValue: '0'
        });

        const match = itemsCountString.match(/([0-9])+/g);

        if (!match) return this.sendNoComponentsFound('Aucun élément trouvé');

        const itemsCount = parseInt(match[2]);
        const pageCount = Math.round(itemsCount / 48 + 0.5);

        const filters = this.getFilters(doc);

        const components = this.parseListComponents(doc);

        console.log(components);

        return {
          pageCount,
          currentPage: args.index,
          items: components,
          filters
        };
      })
      .catch(error => {
        return {
          pageCount: 0,
          currentPage: args.index,
          items: [],
          error: error.message
        };
      });
  };

  searchComponent = async (keys: SearchArgs): Promise<SearchResponse> => {
    if (keys.text === undefined || keys.text === '') {
      return this.searchComponentWithFilter(keys);
    }

    const url = this.getUrlFromTemplate(this.reseller.searchUrlTemplate, keys);

    return axios
      .get(url)
      .then(({ data }) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const itemsCountString = this.getElementAttribute(doc.body, {
          selector: '.c-products__count',
          attribute: 'innerText',
          defaultValue: '0'
        });

        const match = itemsCountString.match(/([0-9])+/g);

        if (!match) return this.sendNoComponentsFound('Aucun élément trouvé');

        const itemsCount = parseInt(match[2]);
        const pageCount = Math.round(itemsCount / 48 + 0.5);

        const components = this.parseListComponents(doc);

        return {
          pageCount,
          currentPage: keys.index,
          itemsCount,
          items: components
        };
      })
      .catch(error => {
        return {
          pageCount: 0,
          currentPage: 0,
          itemsCount: 0,
          items: [],
          error: error.message
        };
      });
  };
}
