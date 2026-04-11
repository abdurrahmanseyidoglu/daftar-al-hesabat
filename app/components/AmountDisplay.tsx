"use client";
interface Props {
  amount: number;
  currency: string;
}
const AmountDisplay = (props: Props) => {
  return (
    <>
      <span>{` < `}</span>
      <span
        className="font-semibold"
        suppressHydrationWarning
      >{`${Math.abs(props.amount)}`}</span>
      <span className="font-semibold uppercase" suppressHydrationWarning>
        {` ${props.currency}`}{" "}
      </span>
      <span>{` > `}</span>
    </>
  );
};

export default AmountDisplay;
