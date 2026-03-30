import Currency from "./currency";

export interface Amount {
  name: string;
  amount: number;
  details: string;
  currency: Currency;
}
