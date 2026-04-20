"use client";

import { formatMoney } from "@/utils";

interface Props {
  amount: number;
  currency: string;
}
const AmountDisplay = (props: Props) => {
  return (
    <>
      <span>{` < `}</span>
      <span className="font-semibold" suppressHydrationWarning>
        {formatMoney(Math.abs(props.amount))}
      </span>
      <span className="font-semibold uppercase" suppressHydrationWarning>
        {` ${props.currency}`}
      </span>
      <span>{` > `}</span>
    </>
  );
};

export default AmountDisplay;
