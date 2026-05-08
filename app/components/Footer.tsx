"use client";

import { MoneyDirection } from "../types/enums";
import { Box, Typography } from "@mui/material";
import AmountDisplay from "./AmountDisplay";
import { useRecordStore } from "../stores/recordStore";
import CurrencySelector from "./CurrencySelector";
import { allCurrencies } from "@/lib/currencies";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";

interface Props {
  totalOn: number | undefined;
  totalTo: number | undefined;
  total: number | undefined;
  direction: MoneyDirection | 0 | undefined;
}

const Footer = (props: Props) => {
  const t = useTranslations();
  const records = useRecordStore((state) => state.records);
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    if (footerRef.current) observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

  const getUsedCurrencies = () => {
    const usedCurrenciesSet = new Set<string>();
    records.forEach((owner) => {
      owner.records.forEach((record) => {
        usedCurrenciesSet.add(record.currency);
      });
    });
    return allCurrencies.filter((c) => usedCurrenciesSet.has(c.value));
  };
  const usedCurrencies = getUsedCurrencies();

  return (
    <Box sx={{ height: `${footerHeight}px` }}>
      <Box
        ref={footerRef}
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
          gap: { xs: "1rem", lg: "3rem" },
          flexDirection: { xs: "column", md: "row" },
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
          <Typography sx={{ color: "#ffffff", fontSize: 16 }}>
            {t("youOwed")}
            <AmountDisplay
              amount={props.totalOn ?? 0}
              currency={selectedCurrency}
            />
            {t("youOwe")}
            <AmountDisplay
              amount={props.totalTo ?? 0}
              currency={selectedCurrency}
            />
          </Typography>
          <Typography
            sx={{ color: "#ffffff", fontSize: 20 }}
            suppressHydrationWarning
          >
            {props.direction === MoneyDirection.TO
              ? `${t("totalYouOwe")}`
              : `${t("totalYouOwed")}`}
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
