"use client";

import { MoneyDirection } from "../types/enums";
import { Box, Typography } from "@mui/material";
import AmountDisplay from "./AmountDisplay";
import { useRecordStore } from "../stores/recordStore";
import CurrencySelector from "./CurrencySelector";
import { allCurrencies } from "@/lib/currencies";

interface Props {
  totalOn: number | undefined;
  totalTo: number | undefined;
  total: number | undefined;
  direction: MoneyDirection | 0 | undefined;
}

const Footer = (props: Props) => {
  const records = useRecordStore((state) => state.records);
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const getUsedCurrencies = () => {
    const usedCurrenciesSet = new Set<string>();

    records.forEach((owner) => {
      owner.records.forEach((record) => {
        usedCurrenciesSet.add(record.currency);
      });
    });
    console.log(allCurrencies.filter((c) => usedCurrenciesSet.has(c.value)));

    return allCurrencies.filter((c) => usedCurrenciesSet.has(c.value));
  };
  const usedCurrencies = getUsedCurrencies();

  return (
    <Box sx={{ marginTop: "4rem" }}>
      <Box
        sx={{
          position: "fixed",
          bottom: "0",
          background: "#1976d2",
          width: "100%",
          p: 2,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "3rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: ".5",
          }}
        >
          <Typography color="white" fontSize={16}>
            You are owed
            <AmountDisplay
              amount={props.totalOn ?? 0}
              currency={selectedCurrency}
            />
            You owe
            <AmountDisplay
              amount={props.totalTo ?? 0}
              currency={selectedCurrency}
            />
          </Typography>
          <Typography color="white" fontSize={20} suppressHydrationWarning>
            {props.direction === MoneyDirection.TO
              ? "Total: You owe"
              : "Total: You are owed "}
            <AmountDisplay
              amount={props.total ?? 0}
              currency={selectedCurrency}
            />
          </Typography>
        </Box>
        <CurrencySelector usedCurrencies={usedCurrencies} />
      </Box>
    </Box>
  );
};

export default Footer;
