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
import { formatDate } from "@/utils";
import { useSnackbar } from "notistack";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { useAppStore } from "@/app/stores/appStore";

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

  return (
    <Toolbar>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "1rem",
          }}
        >
          <Link href={"/"}>
            <Tooltip title={"Back Home"}>
              <IconButton aria-label="home" sx={{ padding: 2 }}>
                <ArrowBackIcon sx={{ color: "#000000" }} />
              </IconButton>
            </Tooltip>
          </Link>
          <Typography
            fontSize={"2rem"}
            fontWeight={500}
            sx={{ textAlign: "end" }}
          >
            All Records for {decodeURIComponent(decodedRecordOwner)}
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Search..."
          value={searchValue}
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
          sx={{ width: 220 }}
        />
      </Box>
    </Toolbar>
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
  const updateRecord = useRecordStore((state) => state.updateRecord);
  const t = useTranslations();
  const personsRecords = useRecordStore((state) =>
    state.getRecordsArrayByName(recordsOwner),
  );

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
    console.log({ name: recordsOwner, record: rowData });

    handleModalState(true);
    updateRecord(recordsOwner, rowData.id, {
      amount: rowData.amount,
      direction: rowData.direction,
      date: rowData.date,
      currency: rowData.currency,
      details: rowData.details,
      id: rowData.id,
    });
  };
  const handleClose = (value: boolean) => {
    setOpen(false);
    setSelectedValue(value);
    if (value) {
      const successRemove = removeRecord(recordsOwner, recordIdToDelete);
      if (successRemove) {
        enqueueSnackbar(`deleted`, { variant: "success" });
      } else {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
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
  const populateModalPredefinedProps = useModalStore(
    (state) => state.populateModalPredefinedProps,
  );

  //Set the name in RecordFormModal so user can add to this recordOwner without updating the name
  useEffect(() => {
    if (recordsOwner) {
      populateModalPredefinedProps({ name: recordsOwner });
    }
  }, [recordsOwner, populateModalPredefinedProps]);
  const rows: RecordEntry[] | undefined = useMemo(
    () =>
      personsRecords?.toReversed().map((record) => {
        return {
          id: record.id,
          details: record.details,
          direction: record.direction,
          date: record.date,
          amount: record.amount,
          currency: record.currency,
        };
      }),
    [personsRecords],
  );
  const filteredRows = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!rows) return;
    if (!q) return rows;
    return rows.filter((row) =>
      [row.amount, row.details, row.direction, row.currency, row.date]
        .map((v) => String(v).toLowerCase())
        .some((v) => v.includes(q)),
    );
  }, [rows, searchValue]);
  const columns: GridColDef<RecordEntry>[] = [
    {
      field: "date",
      headerName: `Date`,
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
      headerName: `Amount`,
      type: "number",
      flex: 1,
      minWidth: 250,
      maxWidth: 250,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "currency",
      headerName: `Currency`,
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
      headerName: `TO / ON`,
      flex: 1,
      minWidth: 150,
      maxWidth: 150,
      renderCell: (
        params: GridRenderCellParams<RecordEntry, MoneyDirection>,
      ) =>
        params.value === MoneyDirection.ON ? (
          <Tooltip title="He should pay you">
            <ArrowUpwardIcon sx={{ color: "success.main" }} />
          </Tooltip>
        ) : (
          <Tooltip title="You should pay him">
            <ArrowDownwardIcon sx={{ color: "error.main" }} />
          </Tooltip>
        ),
    },
    {
      field: "details",
      headerName: "Details",
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
          p: 4,
          mt: 3,
          mx: 2,
          border: "none",
          boxShadow: "none",
        }}
      >
        <ConfirmDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          title={`Are you sure you want to delete this record?`}
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
            density: "comfortable",
          }}
          rows={filteredRows}
          columns={columns}
          localeText={{
            footerRowSelected: (count) => ``,
            paginationRowsPerPage: `${t("rowsPerPage")}`,
          }}
          disableRowSelectionOnClick={true}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(model) => setSelectionModel(model)}
          pageSizeOptions={[10, 50, 100]}
          paginationModel={{ page: 0, pageSize: 10 }}
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
              fontWeight: 700,
            },
            "& .MuiDataGrid-cell": {
              fontSize: "1.2rem",
              border: "1px solid #e0e0e0",
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
