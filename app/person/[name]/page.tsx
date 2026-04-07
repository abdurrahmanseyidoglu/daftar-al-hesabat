"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRecordStore } from "@/app/stores/recordStore";
import { MoneyDirection } from "@/app/types/enums";
import { RecordEntry } from "@/app/schemas/record.schema";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

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
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useTranslations } from "next-intl";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { useParams } from "next/navigation";
import { json } from "zod";
import RecordFormModal from "@/app/components/RecordFormModal";
import { useModalStore } from "@/app/stores/modalStore";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    searchValue: string;
    onSearchChange: (value: string) => void;
    numSelected: number;
    onDeleteSelected: () => void;
  }
}
const calculateTotal = (namedRecords: RecordEntry[] | undefined): number => {
  if (!namedRecords) {
    return 0;
  }
  let total = 0;
  namedRecords.forEach((record) => {
    if (record.direction === MoneyDirection.ON) total += record.amount;
    if (record.direction === MoneyDirection.TO) total -= record.amount;
  });
  return total;
};
type CustomToolbarProps = GridToolbarProps &
  ToolbarPropsOverrides & {
    searchValue: string;
    onSearchChange: (value: string) => void;
  };

function CustomToolbar({ searchValue, onSearchChange }: CustomToolbarProps) {
  const { name: recordOwner } = useParams<{ name: string }>();

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
        <Typography
          fontSize={"2rem"}
          fontWeight={500}
          sx={{ textAlign: "end" }}
        >
          All Records for {recordOwner}
        </Typography>
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
  const { name: recordsOwner } = useParams<{ name: string }>();

  const findRecordsByName = useRecordStore(
    (state) => state.getRecordsArrayByName,
  );
  const t = useTranslations();
  const personsRecords = findRecordsByName(recordsOwner);
  const removeRecord = useRecordStore((state) => state.removeRecord);
  const [open, setOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState(false);
  const handleClickOpen = (id: string | undefined) => {
    if (!id) return;
    setOpen(true);
    setRecordIdToDelete(id);
  };
  const handleEditOpen = (id: string | undefined) => {
    if (!id) return;
    //  !TODO: handlee editing a row
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
      console.log(
        "Damn! the user cancelled the deletion of: " + recordIdToDelete,
      );
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
  const total = calculateTotal(personsRecords);
  const populateModalPredefinedProps = useModalStore(
    (state) => state.populateModalPredefinedProps,
  );
  const resetModalPredefinedProps = useModalStore(
    (state) => state.resetModalPredefinedProps,
  );
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
      [row.amount, row.details, row.direction, row.details, row.date]
        .map((v) => String(v).toLowerCase())
        .some((v) => v.includes(q)),
    );
  }, [rows, searchValue]);
  const handleDeleteRow = (id: string) => {
    console.log("Rows name to delete: " + id);
  };
  const columns: GridColDef<RecordEntry>[] = [
    {
      field: "date",
      headerName: `Date`,
      flex: 2,
      minWidth: 140,
    },
    {
      field: "amount",
      headerName: `Amount`,
      type: "number",
      flex: 1,
      minWidth: 120,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "details",
      headerName: `Details`,
      type: "number",
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "direction",
      headerName: `TO / ON`,
      flex: 1,
      minWidth: 90,
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
      field: "currency",
      headerName: `Currency`,
      type: "string",
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "actions",
      headerName: `${t("actions")}`,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      width: 120,
      renderCell: (params: GridRenderCellParams<RecordEntry>) => (
        <Stack direction="row" spacing={0.5} alignItems="center" height="100%">
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
                handleEditOpen(params.row.id);
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
          border: "2px solid #8cbbe9",
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
          disableRowSelectionOnClick={false}
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
              fontSize: "1.4rem",
              fontWeight: 700,
            },
            "& .MuiDataGrid-cell": {
              fontSize: "1rem",
            },
          }}
        />
      </Paper>
      <SnackbarProvider />
      <RecordFormModal />
    </Box>
  );
}
