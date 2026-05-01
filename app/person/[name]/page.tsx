"use client";

import { useEffect, useMemo, useState } from "react";
import { useRecordStore } from "@/app/stores/recordStore";
import { MoneyDirection } from "@/app/types/enums";
import { RecordEntry } from "@/app/schemas/record.schema";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowId,
  GridRowSelectionModel,
  GridToolbarProps,
  Toolbar,
  ToolbarPropsOverrides,
} from "@mui/x-data-grid";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  Stack,
  IconButton,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslations } from "next-intl";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { useParams } from "next/navigation";
import RecordFormModal from "@/app/components/Modals/RecordFormModal";
import { useModalStore } from "@/app/stores/modalStore";
import { formatDate, formatMoney } from "@/lib/utils";
import { useSnackbar } from "notistack";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { useAppStore } from "@/app/stores/appStore";
import { useLocale } from "next-intl";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    searchValue: string;
    onSearchChange: (value: string) => void;
    numSelected: number;
    onDeleteSelected: () => void;
  }
}

type CustomToolbarProps = GridToolbarProps &
  ToolbarPropsOverrides & {
    searchValue: string;
    onSearchChange: (value: string) => void;
  };

function CustomToolbar({ searchValue, onSearchChange }: CustomToolbarProps) {
  const { name } = useParams<{ name: string }>();
  const decodedRecordOwner = decodeURI(name);
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flexStart",
          gap: { sm: ".3rem", md: "1rem" },
        }}
      >
        <Link href={"/"}>
          <Tooltip title={"Back Home"}>
            <IconButton aria-label="home" sx={{ padding: 2 }}>
              <ArrowBackIcon
                sx={{ color: "#000000" }}
                className={isRTL ? "rotate-180" : ""}
              />
            </IconButton>
          </Tooltip>
        </Link>
        <Typography
          fontSize={{ xs: "1.5rem", md: "2rem" }}
          fontWeight={500}
          sx={{ textAlign: "start", padding: "1rem" }}
        >
          All Records for {decodedRecordOwner} in
          {` ${selectedCurrency.toUpperCase()} `}
        </Typography>
      </Box>
      <Toolbar>
        <Box width={"100%"}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchValue}
            sx={{ width: { xs: "100%", sm: "300px" } }}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Toolbar>
    </Box>
  );
}
export default function ProfilePage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleModalState = useModalStore((state) => state.handleModalState);

  const { name } = useParams<{ name: string }>();
  const recordsOwner = decodeURI(name);
  const calculateTotalPerPerson = useRecordStore(
    (state) => state.calculateTotalPerPerson,
  );
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const initialized = useAppStore((state) => state.initialized);
  const calculationObject = initialized
    ? calculateTotalPerPerson(recordsOwner, selectedCurrency)
    : undefined;

  const removeRecord = useRecordStore((state) => state.removeRecord);
  const t = useTranslations();
  const personsRecords = useRecordStore((state) =>
    state.getRecordsArrayByName(recordsOwner),
  );

  const personsRecordsFilteredByCurrency = useMemo(() => {
    return personsRecords?.filter((r) => r.currency === selectedCurrency);
  }, [personsRecords, selectedCurrency]);
  const [open, setOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState(false);

  const handleClickOpen = (id: string | undefined) => {
    if (!id) return;
    setOpen(true);
    setRecordIdToDelete(id);
  };

  const handleEditOpen = (rowData: RecordEntry) => {
    if (!rowData) return;

    populateModalPredefinedProps({ name: recordsOwner, record: rowData });

    handleModalState(true);
  };
  const handleClose = (value: boolean) => {
    setOpen(false);
    setSelectedValue(value);
    if (value) {
      const successRemove = removeRecord(recordsOwner, recordIdToDelete);
      if (successRemove) {
        enqueueSnackbar(t("deleted"), { variant: "success" });
      } else {
        enqueueSnackbar(t("wentWrong"), { variant: "error" });
      }
      setRecordIdToDelete(null);
    } else {
      setTimeout(() => {
        setRecordIdToDelete(null); // Wait foe the modal closing animation to finish
      }, 200);
    }
  };
  const [searchValue, setSearchValue] = useState("");
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<GridRowId>(),
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const populateModalPredefinedProps = useModalStore(
    (state) => state.populateModalPredefinedProps,
  );
  const resetModalPredefinedProps = useModalStore(
    (state) => state.resetModalPredefinedProps,
  );

  //Set the name in RecordFormModal so user can add to this recordOwner without updating the name
  useEffect(() => {
    if (recordsOwner) {
      populateModalPredefinedProps({ name: recordsOwner });
    }
  }, [recordsOwner, populateModalPredefinedProps, resetModalPredefinedProps]);
  const rows: RecordEntry[] | undefined = useMemo(
    () =>
      personsRecordsFilteredByCurrency?.toReversed().map((record) => {
        return {
          id: record.id,
          details: record.details,
          direction: record.direction,
          date: record.date,
          amount: record.amount,
          currency: record.currency,
        };
      }),
    [personsRecordsFilteredByCurrency],
  );
  const filteredRows = useMemo(() => {
    const searchQuery = searchValue.trim().toLowerCase();
    if (!rows) return;
    if (!searchQuery) return rows;
    return rows.filter((row) =>
      [row.amount, row.details, row.direction, row.currency, row.date]
        .map((cellValue) => String(cellValue).toLowerCase())
        .some((cellValue) => cellValue.includes(searchQuery)),
    );
  }, [rows, searchValue]);
  const columns: GridColDef<RecordEntry>[] = [
    {
      field: "date",
      headerName: t("date"),
      flex: 2,
      minWidth: 210,
      maxWidth: 210,
      valueFormatter: (value: Date) => (value ? formatDate(value) : ""),
      renderCell: (params: GridRenderCellParams<RecordEntry, Date>) => (
        <div>{params.value ? formatDate(params.value) : ""}</div>
      ),
    },
    {
      field: "amount",
      headerName: t("amount"),
      type: "number",
      flex: 1,
      minWidth: 250,
      maxWidth: 250,
      align: "left",
      headerAlign: "left",

      renderCell: (params: GridRenderCellParams<RecordEntry, number>) => (
        <Typography
          sx={{
            fontWeight: 600,
            textAlign: "left",
            marginBlock: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "center",
            height: "100%",
            fontSize: "1.2rem",
            color:
              params.row.direction === MoneyDirection.ON
                ? "success.main"
                : "error.main",
          }}
        >
          {params.row.direction === MoneyDirection.ON
            ? formatMoney(params.value ?? 0)
            : `-${formatMoney(params.value ?? 0)}`}
        </Typography>
      ),
    },
    {
      field: "currency",
      headerName: t("currency"),
      type: "string",
      flex: 1,
      minWidth: 150,
      maxWidth: 150,
      align: "left",
      headerAlign: "left",
      renderCell: (params: GridRenderCellParams<RecordEntry, string>) => (
        <div className="uppercase"> {params.value}</div>
      ),
    },

    {
      field: "direction",
      headerName: `${t("to")} / ${t("on")}`,
      flex: 1,
      minWidth: 150,
      maxWidth: 150,
      renderCell: (
        params: GridRenderCellParams<RecordEntry, MoneyDirection>,
      ) =>
        params.value === MoneyDirection.ON ? (
          <Tooltip title={t("hePayYou")}>
            <ArrowUpwardIcon sx={{ color: "success.main" }} />
          </Tooltip>
        ) : (
          <Tooltip title={t("youPayHim")}>
            <ArrowDownwardIcon sx={{ color: "error.main" }} />
          </Tooltip>
        ),
    },
    {
      field: "details",
      headerName: t("details"),
      minWidth: 200,
      flex: 1,
      align: "left",
      headerAlign: "left",
      renderCell: (params: GridRenderCellParams<RecordEntry, string>) => {
        return params.value ? (
          <Tooltip title={params.value}>
            <div style={{ whiteSpace: "normal" }}>{params.value}</div>
          </Tooltip>
        ) : (
          <h1>-</h1>
        );
      },
    },
    {
      field: "actions",
      headerName: `${t("actions")}`,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      width: 120,
      renderCell: (params: GridRenderCellParams<RecordEntry>) => (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleClickOpen(params.row.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleEditOpen(params.row);
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          maxWidth: "100%",
          p: { xs: 1, md: 3 },
          mt: { xs: 1, md: 3 },
          mx: { xs: 1, md: 2 },
          border: "none",
          boxShadow: "none",
        }}
      >
        <ConfirmDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          title={t("recordDeleteConfirmation")}
          descriptionColor="error"
        />
        <DataGrid
          autosizeOptions={{
            includeHeaders: true,
            includeOutliers: true,
            outliersFactor: 1.5,
            expand: false, // don't stretch to fill remaining space
          }}
          showToolbar
          initialState={{
            density: "standard",
          }}
          rows={filteredRows}
          columns={columns}
          localeText={{
            paginationRowsPerPage: t("rowsPerPage"),
            paginationDisplayedRows: ({ from, to, count }) =>
              t("paginationDisplayedRows", { from, to, count }),
          }}
          disableRowSelectionOnClick={true}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(model) => setSelectionModel(model)}
          pageSizeOptions={[10, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              searchValue,
              onSearchChange: setSearchValue,
              showQuickFilter: true,
            },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "1.1rem",
             
            },
            "& .MuiDataGrid-cell": {
              fontSize: "1.2rem",
            },
          }}
        />
      </Paper>
      <RecordFormModal />
      <Footer
        totalOn={calculationObject?.totalOnHim}
        totalTo={calculationObject?.totalToHim}
        total={calculationObject?.total}
        direction={calculationObject?.direction}
      />
    </Box>
  );
}
