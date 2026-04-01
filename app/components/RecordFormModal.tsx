import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import NumberField from "./NumberField";
import { MoneyDirection } from "../types/enums";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import InputLabel from "@mui/material/InputLabel";
import { enGB } from "date-fns/locale";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Record, schema } from "../schemas/record.schema";
import { useRecordStore } from "../stores/recordStore";

type FormValues = z.infer<typeof schema>;

interface AmountFormModalProp {
  open: boolean;
  record: Record | null;
  onDismiss: () => void;
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "90%",
  bgcolor: "background.paper",
  border: "1px solid text.primary",
  boxShadow: 24,
  borderRadius: 3,
  py: 4,
  px: 8,
};

const AmountFormModal = ({ open, record, onDismiss }: AmountFormModalProp) => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      direction: record?.direction ?? MoneyDirection.ON,
      currency: record?.currency ?? "usd",
      amount: record?.amount ?? 0,
      date: record?.date ?? new Date(),
      name: record?.name ?? "",
      details: record?.details ?? "",
    },
  });
  const addRecord = useRecordStore((state) => state.addRecord);
  const [savingForm, setSavingForm] = useState(false);

  const saveAction = (data: FormValues) => {
    setSavingForm(true);
    const record: Record = {
      amount: data.amount,
      currency: data.currency,
      name: data.name,
      date: data.date,
      direction: data.direction,
      details: data.details,
    };
    console.log(record);
    addRecord(record);
    setSavingForm(false);
    onDismiss();
  };
  const records = useRecordStore((state) => state.records);
  return (
    <Modal open={open} onClose={onDismiss}>
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h4"
          mb={2}
          color="primary"
          textTransform="uppercase"
          fontWeight="500"
        >
          Add amount
        </Typography>
        <form onSubmit={handleSubmit(saveAction)} noValidate>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Name"
                  size="small"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="amount"
              control={control}
              render={({ field, fieldState }) => (
                <NumberField
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)} // value is already a number
                  onBlur={field.onBlur}
                  name={field.name}
                  label="Amount"
                  min={1}
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="details"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Details"
                  size="small"
                  fullWidth
                  multiline
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="direction"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <Tooltip title="He should pay you">
                    <FormControlLabel
                      value={MoneyDirection.ON}
                      control={<Radio />}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <span>On Him</span>
                          <ArrowUpwardIcon sx={{ color: "success.main" }} />
                        </Box>
                      }
                    />
                  </Tooltip>
                  <Tooltip title="You should pay him">
                    <FormControlLabel
                      value={MoneyDirection.TO}
                      control={<Radio />}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <span>To Him</span>
                          <ArrowDownwardIcon sx={{ color: "error.main" }} />
                        </Box>
                      }
                    />
                  </Tooltip>
                </RadioGroup>
              )}
            />
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState }) => (
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={enGB}
                >
                  <DatePicker
                    {...field}
                    label="Date"
                    slotProps={{
                      textField: {
                        size: "small",
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />

            <Controller
              name="currency"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth size="small" error={!!fieldState.error}>
                  <InputLabel>Select Currency</InputLabel>
                  <Select {...field} label="Select Currency">
                    <MenuItem value="usd">USD Dollar</MenuItem>
                    <MenuItem value="tr">Turkish Lira</MenuItem>
                    <MenuItem value="eu">Euro</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              loading={savingForm}
            >
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AmountFormModal;
