// interface ComponentPC {
//   readonly id: string;
//   error?: string;
//   imageUrl?: string;
//   name?: string;
//   price?: number;
//   refund?: number;
//   refundPercent?: number;
//   quantity?: number;
//   url?: string;
//   availability?: boolean;
//   comment?: string;
// }

// interface SetupPC {
//   readonly id: string;
//   readonly creationDate: Date;
//   owner?: string;
//   subjectId?: string;
//   components?: ComponentPC[];
//   currency?: string;
//   modificationDate?: Date;
//   refund?: number;
//   refundPercent?: number;
//   reseller?: ResellerInfo;
//   tags?: string[];
//   url?: string;
//   priceInfo?: string;
// }

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

interface ParserConfig {
  searchUrlTemplate?: (args: SearchArgs) => string;
  searchUrlByCategoryTemplate?: (args: string[]) => string;
  categoryList?: ResellerCategory[];
  matchesUrl: {
    regex: RegExp;
    methodName: string;
  }[];
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
