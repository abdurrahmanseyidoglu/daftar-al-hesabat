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
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useRecordStore } from "../stores/recordStore";
import { MoneyDirection } from "../types/enums";
import { RecordEntry } from "../schemas/record.schema";

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
  numSelected,
  onDeleteSelected,
}: GridToolbarProps & ToolbarPropsOverrides) {
  return (
    <Toolbar>
      <Typography
        variant="h6"
        sx={{ flex: "1 1 auto", fontWeight: 600, color: "text.primary" }}
      >
        {numSelected > 0 ? `${numSelected} selected` : "Global Records"}
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

      <ColumnsPanelTrigger />

      {numSelected > 0 && (
        <Tooltip title="Delete selected">
          <IconButton color="error" onClick={onDeleteSelected} size="small">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function GlobalRecordsTable() {
  const records = useRecordStore((state) => state.records);
  const removeUsersByIndexes = useRecordStore(
    (state) => state.removeUsersByIndexes,
  );

  const [searchValue, setSearchValue] = useState("");
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<GridRowId>(),
  });
  const selectedIds = Array.from(selectionModel.ids).map(Number);

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

  const handleDeleteSelected = () => {
    removeUsersByIndexes(selectedIds);
    setSelectionModel({ type: "include", ids: new Set<GridRowId>() });
  };

  const handleDeleteRow = (id: number) => {
    removeUsersByIndexes([id]);
    setSelectionModel((prev) => {
      const next = new Set(prev.ids);
      next.delete(id);
      return { type: "include", ids: next };
    });
  };

  const handleEditRow = (id: number) => {
    // TODO: Add edit logic
    console.log("Edit row", id);
  };

  const handleGoToDetails = (id: number) => {
    // TODO: Add details page
    console.log("Go to details for row", id);
  };

  const columns: GridColDef<RowData>[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 2,
      minWidth: 140,
    },
    {
      field: "recordsCount",
      headerName: "Records Count",
      type: "number",
      flex: 1,
      minWidth: 120,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "total",
      headerName: "Total",
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
      headerName: "To / On",
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
      headerName: "Actions",
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
                handleGoToDetails(params.row.id);
              }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEditRow(params.row.id);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRow(params.row.id);
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
      <Paper sx={{ width: "100%", mb: 2 }}>
        <DataGrid
          showToolbar
          initialState={{
            density: "comfortable",
          }}
          rows={filteredRows}
          columns={columns}
          checkboxSelection
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
              numSelected: selectedIds.length,
              onDeleteSelected: handleDeleteSelected,
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "1rem",
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
