export interface NFe {
  id: string;
  access_key: string;
  number: string;
  series: string;
  issue_date: Date;
  issuer_name: string;
  issuer_cnpj: string;
  total_value: number;
  items: NFeItem[];
  created_at: Date;
}

export interface NFeItem {
  id: string;
  code: string;
  description: string;
  ncm: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  nfe_id: string;
}

export interface NFeListResponse {
  data: NFe[];
  total: number;
  page: number;
  limit: number;
}
