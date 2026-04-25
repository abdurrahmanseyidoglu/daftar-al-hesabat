import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useRecordStore } from "../stores/recordStore";
import Currency from "../types/currency";
import { allCurrencies } from "@/lib/currencies";

interface CurrencySelectorProps {
  usedCurrencies: Currency[];
}

const CurrencySelector = ({ usedCurrencies }: CurrencySelectorProps) => {
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const updateCurrency = useRecordStore(
    (state) => state.updateSelectedCurrency,
  );

  const selectedCurrencyOption = allCurrencies.find(
    (currency) => currency.value === selectedCurrency,
  );

  const isSelectedCurrencyInUse = usedCurrencies.some(
    (currency) => currency.value === selectedCurrency,
  );

  const availableCurrencies = isSelectedCurrencyInUse
    ? usedCurrencies
    : selectedCurrencyOption
      ? [selectedCurrencyOption, ...usedCurrencies]
      : usedCurrencies;
  const selectValue = availableCurrencies.some(
    (currency) => currency.value === selectedCurrency,
  )
    ? selectedCurrency
    : "";

  const handleChange = (event: SelectChangeEvent) => {
    updateCurrency(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel sx={{ color: "#ffffff !important" }} id="currency-selector">
          Currency
        </InputLabel>
        <Select
          labelId="currency-selector"
          id="currency-select"
          value={selectValue}
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
          {availableCurrencies.map((cur) => (
            <MenuItem value={cur.value} key={cur.value}>
              {cur.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CurrencySelector;
