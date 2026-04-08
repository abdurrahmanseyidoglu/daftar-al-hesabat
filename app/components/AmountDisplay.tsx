"use client";
interface Props {
  amount: number;
  currency: string;
}
const AmountDisplay = (props: Props) => {
  return (
    <>
      <span>{` < `}</span>
      <span className="font-semibold">{`${Math.abs(props.amount)}`}</span>
      <span className="font-semibold uppercase">{` ${props.currency}`} </span>
      <span>{` > `}</span>
    </>
  );
};

export default AmountDisplay;
