import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import NumberField from "../NumberField";
import { MoneyDirection } from "../../types/enums";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import InputLabel from "@mui/material/InputLabel";
import { enGB } from "date-fns/locale";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { formSchema, RecordEntry } from "../../schemas/record.schema";
import { useRecordStore } from "../../stores/recordStore";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { NameOptionType } from "../../types/nameOptionType";
import { useModalStore } from "../../stores/modalStore";
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useParams } from "next/navigation";
import { allCurrencies } from "@/lib/currencies";
type FormValuesType = { name: string } & { record: RecordEntry };

const modalStyle = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: "60%", lg: "40%" },
  height: "fit",
  bgcolor: "background.paper",
  border: "1px solid text.primary",
  boxShadow: 24,
  borderRadius: 3,
  py: 4,
  px: 8,
};

const filter = createFilterOptions<NameOptionType>();
const RecordFormModal = () => {
  const { enqueueSnackbar } = useSnackbar();

  const t = useTranslations();
  const isModalOpen = useModalStore((state) => state.isModalOpen);
  const modalPredefinedProps = useModalStore(
    (state) => state.modalPredefinedProps,
  );
  const handleModalState = useModalStore((state) => state.handleModalState);
  const updateSelectedCurrency = useRecordStore(
    (state) => state.updateSelectedCurrency,
  );
  const addRecordToNewName = useRecordStore(
    (state) => state.addRecordToNewName,
  );
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const addRecordToExistingName = useRecordStore(
    (state) => state.addRecordToExistingName,
  );
  const doesNameExistInRecords = useRecordStore(
    (state) => state.doesNameExistInRecords,
  );
  const updateRecord = useRecordStore((state) => state.updateRecord);
  const resetModalPredefinedProps = useModalStore(
    (state) => state.resetModalPredefinedProps,
  );

  const { name } = useParams<{ name: string }>();
  let recordsOwner;
  if (!!name) {
    recordsOwner = decodeURI(name);
  } else {
    recordsOwner = undefined;
  }
  const { control, handleSubmit, reset } = useForm<FormValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      record: {
        direction: MoneyDirection.ON,
        currency: selectedCurrency,
        amount: 0,
        date: new Date(),
        details: "",
      },
    },
  });
  useEffect(() => {
    if (!isModalOpen) return;

    const hasRecordProps =
      modalPredefinedProps?.record &&
      (modalPredefinedProps.name ||
        modalPredefinedProps.record.direction != null ||
        modalPredefinedProps.record.currency != null ||
        modalPredefinedProps.record.amount != null ||
        modalPredefinedProps.record.date != null ||
        modalPredefinedProps.record.details != null ||
        modalPredefinedProps.record.id != null);

    if (hasRecordProps) {
      reset({
        name: modalPredefinedProps.name ?? "",
        record: {
          direction:
            modalPredefinedProps.record?.direction ?? MoneyDirection.ON,
          currency: modalPredefinedProps.record?.currency ?? selectedCurrency,
          amount: modalPredefinedProps.record?.amount ?? 0,
          date: modalPredefinedProps.record?.date
            ? new Date(modalPredefinedProps.record.date)
            : new Date(),
          details: modalPredefinedProps.record?.details ?? "",
          id: modalPredefinedProps.record?.id ?? "",
        },
      });
    } else {
      reset({
        name: !!recordsOwner ? recordsOwner : "",
        record: {
          direction: MoneyDirection.ON,
          currency: selectedCurrency,
          amount: 0,
          date: new Date(),
          details: "",
        },
      });
    }
  }, [
    recordsOwner,
    isModalOpen,
    modalPredefinedProps,
    reset,
    selectedCurrency,
  ]);
  const [savingForm, setSavingForm] = useState(false);

  const saveAction = (data: FormValuesType) => {
    setSavingForm(true);
    updateSelectedCurrency(data.record.currency);
    const existing = doesNameExistInRecords(data.name.trim());
    if (!existing) {
      addRecordToNewName(data.name.trim(), { ...data.record });
    } else if (!!data.record.id) {
      updateRecord(data.name, data.record.id, { ...data.record });
    } else {
      addRecordToExistingName(data.name, { ...data.record });
    }
    setSavingForm(false);
    handleModalState(false);
    enqueueSnackbar(t("addedToName",{name:data.name}), {
      variant: "success",
    });
  };
  const records = useRecordStore((state) => state.records);
  const namesOptions: Array<NameOptionType> = records.map((record) => ({
    name: record.name,
  }));

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={() => {
          handleModalState(false);
          resetModalPredefinedProps();
        }}
      >
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
            {!!(recordsOwner && modalPredefinedProps?.record)
              ? `${t("updateRecord")}`
              : t("addAmount")}
          </Typography>
          <form onSubmit={handleSubmit(saveAction)} noValidate>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    disabled={
                      !!(!!recordsOwner || modalPredefinedProps?.record)
                    }
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
                          name: `${t("add?", { inputValue: inputValue })}`,
                        });
                      }
                      return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
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
                        label={t("name")}
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
                    label={t("amount")}
                    min={0}
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
                    label={t("details")}
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
                    <Tooltip title={t("hePayYou")}>
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
                            <span>{t("onHim")}</span>
                            <ArrowUpwardIcon sx={{ color: "success.main" }} />
                          </Box>
                        }
                      />
                    </Tooltip>
                    <Tooltip title={t("youPayHim")}>
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
                            <span>{t("toHim")}</span>
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
                      label={t("date")}
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
                  <Autocomplete
                    options={allCurrencies}
                    groupBy={(option) => option.group}
                    getOptionLabel={(option) => option.label}
                    value={
                      allCurrencies.find((c) => c.value === field.value) ?? null
                    }
                    onChange={(_, selected) =>
                      field.onChange(selected?.value ?? "")
                    }
                    renderGroup={(params) => (
                      <Box key={params.key}>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 2,
                            py: 0.5,
                            color: "text.secondary",
                            fontWeight: 600,
                            display: "block",
                          }}
                        >
                          {params.group}
                        </Typography>
                        {params.children}
                        {params.group === "Common" && (
                          <Divider sx={{ my: 0.5 }} />
                        )}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("selectCurrency")}
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                loading={savingForm}
              >
                {t("save")}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default RecordFormModal;
