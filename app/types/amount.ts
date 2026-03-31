import Currency from "./currency";
import { MoneyDirection } from "./enums";

export default interface Amount {
  name: string;
  amount: number;
  details?: string;
  currency: Currency;
  direction: MoneyDirection;
}
