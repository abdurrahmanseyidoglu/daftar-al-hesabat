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
import { useRecordStore } from "../stores/recordStore";

interface Props {
  totalOn: number | undefined;
  totalTo: number | undefined;
  total: number | undefined;
  direction: MoneyDirection | 0 | undefined;
}
const Footer = (props: Props) => {
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const updateCurrency = useRecordStore(
    (state) => state.updateSelectedCurrency,
  );
  const handleChange = (event: SelectChangeEvent) => {
    updateCurrency(event.target.value as string);
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
              value={selectedCurrency}
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
