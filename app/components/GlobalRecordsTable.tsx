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
import { useTranslations } from "next-intl";
import ConfirmDialog from "./ConfirmDialog";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditNameModal from "./Modals/EditNameModal";
import {
  calculateTotalForPersonRecords,
  formatMoney,
  getRecordsFilteredByCurrency,
} from "@/lib/utils";
interface RowData {
  id: string;
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

function CustomToolbar({
  searchValue,
  onSearchChange,
}: GridToolbarProps & ToolbarPropsOverrides) {
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const t = useTranslations();
  return (
    <Box>
      <Typography
        fontSize={{ xs: "1.5rem", md: "2rem" }}
        fontWeight={500}
        sx={{ textAlign: "start" }}
        mb={3}
      >
        {t("allRecordsInCurrency", {
          currency: selectedCurrency.toUpperCase(),
        })}
      </Typography>
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

export default function GlobalRecordsTable() {
  const storeRecords = useRecordStore((state) => state.records);
  const selectedCurrency = useRecordStore((state) => state.selectedCurrency);
  const records = useMemo(
    () => getRecordsFilteredByCurrency(selectedCurrency, storeRecords),
    [selectedCurrency, storeRecords],
  );
  const removeNameWithHisRecords = useRecordStore(
    (state) => state.removeNameWithHisRecords,
  );
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [selectedNameToDelete, setSelectedNameToDelete] = useState<
    string | null
  >(null);
  const [selectedValue, setSelectedValue] = useState(false);
  const handleClickOpen = (name: string) => {
    setOpen(true);
    setSelectedNameToDelete(name);
  };

  const handleClose = (value: boolean) => {
    setOpen(false);
    setSelectedValue(value);
    if (value) {
      const successRemove = removeNameWithHisRecords(selectedNameToDelete);
      if (successRemove) {
        enqueueSnackbar(t("deleted"), { variant: "success" });
      } else {
        enqueueSnackbar(t("wentWrong"), { variant: "error" });
      }
      setSelectedNameToDelete(null);
    } else {
      setTimeout(() => {
        setSelectedNameToDelete(null); // Wait for the modal closing animation to finish
      }, 200);
    }
  };

  const [searchValue, setSearchValue] = useState("");
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<GridRowId>(),
  });

  const rows: RowData[] = useMemo(
    () =>
      records
        .toReversed()
        .map((record) => {
          const total = calculateTotalForPersonRecords(record.records);
          return {
            id: record.name,
            name: record.name,
            recordsCount: record.records.length,
            total,
            direction: total >= 0 ? MoneyDirection.ON : MoneyDirection.TO,
          };
        })
        .filter((r) => r.recordsCount !== 0),
    [records],
  );
  const filteredRows = useMemo(() => {
    const searchQuery = searchValue.trim().toLowerCase();
    if (!searchQuery) return rows;
    return rows.filter((row) =>
      [row.name, row.recordsCount, row.total, row.direction]
        .map((cellValue) => String(cellValue).toLowerCase())
        .some((cellValue) => cellValue.includes(searchQuery)),
    );
  }, [rows, searchValue]);

  const [nameModalState, setNameModalState] = useState(false);
  const [nameModalName, setNameModalName] = useState<string>("");
  const handleNameModal = (state: boolean, name: string) => {
    setNameModalState(state);
    setNameModalName(name);
  };
  const columns: GridColDef<RowData>[] = [
    {
      field: "name",
      headerName: `${t("name")}`,
      flex: 2,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<RowData>) => (
        <Link className="underline " href={`person/${params.row.name}`}>
          {params.row.name}
        </Link>
      ),
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
          {formatMoney(params.value ?? 0)} {selectedCurrency.toUpperCase()}
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
            <Link href={`/person/${params.row.name}`}>
              <IconButton size="small">
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Edit name">
            <IconButton
              size="small"
              onClick={() => handleNameModal(true, params.row.name)}
            >
              <EditOutlinedIcon fontSize="small" sx={{ color: "green" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("delete")}>
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
          title={`${t("nameDeleteConfirmation", { nameToDelete: selectedNameToDelete ?? "" })}`}
          description={`${t("nameDeleteHeadsUp", { nameToDelete: selectedNameToDelete ?? "" })}`}
          descriptionColor="error"
        />
        <DataGrid
          showToolbar
          initialState={{
            density: "standard",
          }}
          autosizeOptions={{
            includeHeaders: true,
            includeOutliers: true,
            outliersFactor: 1.5,
            expand: false,
          }}
          rows={filteredRows}
          columns={columns}
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
            pagination: {
              labelRowsPerPage: t("rowsPerPage"),
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
            },
          }}
        />
      </Paper>
      <EditNameModal
        isOpen={nameModalState}
        closeModal={handleNameModal}
        name={nameModalName}
      />
    </Box>
  );
}
