import SearchDlg from '../src/components/SearchComponent/SearchDlg';

export default {
  component: SearchDlg,
  props: {
    open: true,
    onClose: () => console.log('closed'),
    onConfirm: () => console.log('confirmed')
  }
};
