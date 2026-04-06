import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowSelectionModel,
  GridToolbarProps,
  ColumnsPanelTrigger,
  Toolbar,
  ToolbarPropsOverrides,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useRecordStore } from "../stores/recordStore";
import { MoneyDirection } from "../types/enums";
import { RecordEntry } from "../schemas/record.schema";
import { useTranslations } from "next-intl";
import ConfirmDialog from "./ConfirmDialog";

interface RowData {
  id: number;
  name: string;
  recordsCount: number;
  total: number;
  direction: MoneyDirection;
}

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    searchValue: string;
    onSearchChange: (value: string) => void;
    numSelected: number;
    onDeleteSelected: () => void;
  }
}

const calculateTotal = (namedRecords: RecordEntry[]): number => {
  let total = 0;
  namedRecords.forEach((record) => {
    if (record.direction === MoneyDirection.ON) total += record.amount;
    if (record.direction === MoneyDirection.TO) total -= record.amount;
  });
  return total;
};

function CustomToolbar({
  searchValue,
  onSearchChange,
}: GridToolbarProps & ToolbarPropsOverrides) {
  return (
    <Toolbar>
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
    </Toolbar>
  );
}

export default function GlobalRecordsTable() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [selectedRowNameToDelete, setSelectedRowNameToDelete] = useState<
    string | null
  >(null);
  const [selectedValue, setSelectedValue] = useState(false);
  const handleClickOpen = (name: string) => {
    setOpen(true);
    setSelectedRowNameToDelete(name);
  };

  const handleClose = (value: boolean) => {
    console.log("handle close called: " + value);
    setOpen(false);
    setSelectedValue(value);
    if (value) {
      console.log(
        "Run the delete function with the name of: " + selectedRowNameToDelete,
      );
      setSelectedRowNameToDelete(null);
    } else {
      console.log(
        "Damn! the user cancelled the deletion of: " + selectedRowNameToDelete,
      );
      setSelectedRowNameToDelete(null);
    }
  };
  const records = useRecordStore((state) => state.records);

  const [searchValue, setSearchValue] = useState("");
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<GridRowId>(),
  });

  const rows: RowData[] = useMemo(
    () =>
      records.map((record, index) => {
        const total = calculateTotal(record.records);
        return {
          id: index,
          name: record.name,
          recordsCount: record.records.length,
          total,
          direction: total >= 0 ? MoneyDirection.ON : MoneyDirection.TO,
        };
      }),
    [records],
  );

  const filteredRows = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [row.name, row.recordsCount, row.total, row.direction]
        .map((v) => String(v).toLowerCase())
        .some((v) => v.includes(q)),
    );
  }, [rows, searchValue]);

  const handleDeleteRow = (name: string) => {
    console.log("Rows name to delete: " + name);
  };

  const handleGoToDetails = (name: string) => {
    // TODO: Add details page
    console.log(name);
  };

  const columns: GridColDef<RowData>[] = [
    {
      field: "name",
      headerName: `${t("name")}`,
      flex: 2,
      minWidth: 140,
    },
    {
      field: "recordsCount",
      headerName: `${t("recordsCount")}`,
      type: "number",
      flex: 1,
      minWidth: 120,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "total",
      headerName: `${t("total")}`,
      type: "number",
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      renderCell: (params: GridRenderCellParams<RowData, number>) => (
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
            color: (params.value ?? 0) >= 0 ? "success.main" : "error.main",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "direction",
      headerName: `${t("to")} / ${t("on")}`,
      flex: 1,
      minWidth: 90,
      renderCell: (params: GridRenderCellParams<RowData, MoneyDirection>) =>
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
      field: "actions",
      headerName: `${t("actions")}`,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      width: 120,
      renderCell: (params: GridRenderCellParams<RowData>) => (
        <Stack direction="row" spacing={0.5} alignItems="center" height="100%">
          <Tooltip title="Go to details">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleGoToDetails(params.row.name);
              }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <ConfirmDialog
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
          />
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleClickOpen(params.row.name);
              }}
            >
              <DeleteIcon fontSize="small" />
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
          pageSizeOptions={[10, 100, 500]}
          paginationModel={{ page: 0, pageSize: 10 }}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              searchValue,
              onSearchChange: setSearchValue,
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
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
    </Box>
  );
}
