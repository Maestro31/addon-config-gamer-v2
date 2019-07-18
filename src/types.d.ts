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

interface Reseller {
  name: string;
  url: string;
  currency: string;
  tag?: string;
}

interface ScrapperParams {
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
  articlesCount?: number;
  articles: any[];
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
