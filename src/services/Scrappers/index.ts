import AmazonScrapper from './Amazon/AmazonScrapper'
import LdlcScrapper from './LDLC/LdlcScrapper'
import MaterielNetScrapper from './MaterielNet/MaterielNetScrapper'
import TopAchatScrapper from './TopAchat/TopAchatScrapper'
import LdlcBEScrapper from './LDLC/LdlcBEScrapper'
import LdlcCHScrapper from './LDLC/LdlcCHScrapper'
import LdlcESScrapper from './LDLC/LdlcESScrapper'
import LdlcLUScrapper from './LDLC/LdlcLUScrapper'

const scrapper = new AmazonScrapper()
scrapper.setNextScrapper(new MaterielNetScrapper())
scrapper.setNextScrapper(new TopAchatScrapper())
scrapper.setNextScrapper(new LdlcScrapper())
scrapper.setNextScrapper(new LdlcBEScrapper())
scrapper.setNextScrapper(new LdlcESScrapper())
scrapper.setNextScrapper(new LdlcLUScrapper())
scrapper.setNextScrapper(new LdlcCHScrapper())

export default scrapper
