"use client";

import { MoneyDirection } from "../types/enums";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import AmountDisplay from "./AmountDisplay";
import { useState } from "react";
interface Props {
  totalOnHim: number | undefined;
  totalToHim: number | undefined;
  total: number | undefined;
  direction: MoneyDirection | 0 | undefined;
  currency: string;
  currencyChange: (currency: string) => void;
}
const Footer = (props: Props) => {
  const handleChange = (event: SelectChangeEvent) => {
    props.currencyChange(event.target.value as string);
  };
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
            he needs to pay you
            <AmountDisplay
              amount={props.totalOnHim ?? 0}
              currency={props.currency}
            />
            and You need to pay him
            <AmountDisplay
              amount={props.totalToHim ?? 0}
              currency={props.currency}
            />
          </Typography>
          <Typography color="white" fontSize={20}>
            {props.direction === MoneyDirection.TO
              ? "Total: You need to pay him"
              : "Total: He needs to pay you"}
            <AmountDisplay
              amount={props.total ?? 0}
              currency={props.currency}
            />
          </Typography>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel
              sx={{ color: "#ffffff !important" }}
              id="currency-selector"
            >
              Currency
            </InputLabel>
            <Select
              labelId="currency-selector"
              id="currency-select"
              value={props.currency}
              label="Currency"
              onChange={handleChange}
              sx={{
                color: "#ffffff",
                height: "42px",
                "& .MuiSelect-icon": {
                  color: "#ffffff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #8cbbe9",
                  transition: "all ease-in-out .2s",
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffffff",
                  border: "1px solid #ffffff",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffffff",
                  border: "1px solid #ffffff",
                },
              }}
              MenuProps={{
                sx: {
                  "&& .Mui-selected": {
                    color: "#1976d2",
                  },
                },
              }}
            >
              <MenuItem value={"usd"}>USD</MenuItem>
              <MenuItem value={"tr"}>TR</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
