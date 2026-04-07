"use client";

import { use, useState } from "react";
import { useRecordStore } from "@/app/stores/recordStore";
import { MoneyDirection } from "@/app/types/enums";
import { RecordEntry } from "@/app/schemas/record.schema";
import {
  GridToolbarProps,
  Toolbar,
  ToolbarPropsOverrides,
} from "@mui/x-data-grid";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
type CustomToolbarProps = GridToolbarProps &
  ToolbarPropsOverrides & {
    searchValue: string;
    onSearchChange: (value: string) => void;
    params: Promise<{ name: string }>;
  };

function CustomToolbar({
  searchValue,
  onSearchChange,
  params,
}: CustomToolbarProps) {
  const { name } = use(params);

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
          All Records for {name}
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
export default function ProfilePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const findRecordsByName = useRecordStore(
    (state) => state.getRecordsArrayByName,
  );

  const personsRecord = findRecordsByName(name);
  const removeRecord = useRecordStore((state) => state.removeRecord);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <pre>{`${JSON.stringify(personsRecord, null, 6)}`}</pre>
    </div>
  );
}
