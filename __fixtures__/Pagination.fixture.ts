import Pagination from '../src/components/Pagination';
import TopAchatParser from '../src/services/Parsers/TopAchatParser';

const topAchat = new TopAchatParser();

export default {
  component: Pagination,
  props: {
    currentIndex: 1,
    pageCount: 2,
    onIndexChange: index =>
      topAchat.searchComponentWithFilter({
        index: 1,
        categories: ['micro', 'wpr']
      })
  }
};
