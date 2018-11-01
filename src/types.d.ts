interface SearchArgs {
  index: number;
  categories: string[];
  text?: string;
  filterValues?: FilterValue[];
}

interface ResellerCategory {
  label: string;
  subCategory?: string;
  value?: string;
  options?: ResellerCategory[];
}

interface ResellerInfo {
  name: string;
  url: string;
  monnaie: string;
  searchUrlTemplate?: string;
  searchUrlByCategoryTemplate?: string;
  categoryList?: ResellerCategory[];
  matchesUrl: {
    regex: RegExp;
    methodName: string;
  }[];
}

interface ParserConfig {
  regex: RegExp;
  methodName: string;
}

interface ParserOptions {
  selector: string;
  attribute?:
    | 'innerText'
    | 'innerHTML'
    | 'src'
    | 'href'
    | 'title'
    | 'value'
    | 'checked'
    | 'id';
  innerAttribute?: string;
  noChildInnerText?: boolean;
  defaultValue?: any;
}

interface ParseResult {
  title?: string;
  data: any;
}

type ParseResponse = ParseResult[];

interface SearchResponse {
  pageCount: number;
  currentPage: number;
  itemsCount?: number;
  items: any[];
  filters?: FilterData[];
  error?: string;
}

interface FilterData {
  id: string;
  label: string;
  type: string;
  options: {
    label: string;
    value: string;
    selected: boolean;
  }[];
}

interface FilterValue {
  id: string;
  value: string;
}
