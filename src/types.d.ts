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
  currency: string;
  tag?: string;
}

interface ParserParams {
  searchUrlTemplate?: (args: SearchArgs) => string;
  searchUrlByCategoryTemplate?: Function;
  categoryList?: ResellerCategory[];
  // matchesUrl: {
  //   regex: RegExp;
  //   methodName: string;
  // }[];
}

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
