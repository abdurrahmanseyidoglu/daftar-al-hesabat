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
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { formSchema, RecordEntry } from "../schemas/record.schema";
import { useRecordStore } from "../stores/recordStore";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { NameOptionType } from "../types/nameOptionType";
import { useModalStore } from "../stores/modalStore";

type FormValuesType = { name: string } & { record: RecordEntry };

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

const filter = createFilterOptions<NameOptionType>();
const RecordFormModal = () => {
  const isModalOpen = useModalStore((state) => state.isModalOpen);
  const modalPredefinedProps = useModalStore(
    (state) => state.modalPredefinedProps,
  );
  const handleModalState = useModalStore((state) => state.handleModalState);

  const addRecordToNewName = useRecordStore(
    (state) => state.addRecordToNewName,
  );
  const addRecordToExistingName = useRecordStore(
    (state) => state.addRecordToExistingName,
  );
  const doesNameExistInRecords = useRecordStore(
    (state) => state.doesNameExistInRecords,
  );
  const { control, handleSubmit } = useForm<FormValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: modalPredefinedProps?.name ?? "",
      record: {
        direction: modalPredefinedProps?.record.direction ?? MoneyDirection.ON,
        currency: modalPredefinedProps?.record.currency ?? "usd",
        amount: modalPredefinedProps?.record.amount ?? 0,
        date: modalPredefinedProps?.record.date ?? new Date(),
        details: modalPredefinedProps?.record.details ?? "",
      },
    },
  });

  const [savingForm, setSavingForm] = useState(false);

  const saveAction = (data: FormValuesType) => {
    setSavingForm(true);

    const existing = doesNameExistInRecords(data.name);
    if (!existing) {
      addRecordToNewName(data.name, { ...data.record });
    } else {
      addRecordToExistingName(data.name, { ...data.record });
    }
    setSavingForm(false);
    handleModalState(false);
  };
  const records = useRecordStore((state) => state.records);
  const namesOptions: Array<NameOptionType> = records.map((record) => ({
    name: record.name,
  }));

  return (
    <Modal open={isModalOpen} onClose={() => handleModalState(false)}>
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
                <Autocomplete
                  value={field.value ? { name: field.value } : null}
                  onChange={(event, newValue) => {
                    let resolvedName = "";

                    if (typeof newValue === "string") {
                      resolvedName = newValue;
                    } else if (newValue?.inputValue) {
                      resolvedName = newValue.inputValue;
                    } else if (newValue?.name) {
                      resolvedName = newValue.name;
                    }
                    field.onChange(resolvedName);
                  }}
                  inputValue={field.value ?? ""}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === "input") {
                      field.onChange(newInputValue);
                    }
                    if (reason === "clear") {
                      field.onChange("");
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some(
                      (option) => inputValue === option.name,
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push({
                        inputValue,
                        name: `Add "${inputValue}" ?`,
                      });
                    }
                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="free-solo-with-text"
                  options={namesOptions}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") return option;
                    return option.inputValue ?? option.name ?? "";
                  }}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        {option.name}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Name"
                      size="small"
                      fullWidth
                      onBlur={field.onBlur}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />

            <Controller
              name="record.amount"
              control={control}
              render={({ field, fieldState }) => (
                <NumberField
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
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
              name="record.details"
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
              name="record.direction"
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
              name="record.date"
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
              name="record.currency"
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

export default RecordFormModal;
