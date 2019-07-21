import ScrapperService from './ScrapperService'
import AmazonScrapper from './Amazon/AmazonScrapper'
import LdlcScrapper from './LDLC/LdlcScrapper'
import MaterielNetScrapper from './MaterielNet/MaterielNetScrapper'
import TopAchatScrapper from './TopAchat/TopAchatScrapper'
import LdlcBEScrapper from './LDLC/LdlcBEScrapper'
import LdlcCHScrapper from './LDLC/LdlcCHScrapper'
import LdlcESScrapper from './LDLC/LdlcESScrapper'
import LdlcLUScrapper from './LDLC/LdlcLUScrapper'

const scrapperService = new ScrapperService([
  new MaterielNetScrapper(),
  new TopAchatScrapper(),
  new AmazonScrapper(),
  new LdlcBEScrapper(),
  new LdlcCHScrapper(),
  new LdlcESScrapper(),
  new LdlcScrapper(),
  new LdlcLUScrapper()
])

export default scrapperService
