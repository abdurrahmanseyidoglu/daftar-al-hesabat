import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { RecordsSourceOfTruth } from "../types/recordsSourceOfTruth";
import { Record } from "../schemas/record.schema";
import RecordsOverView from "./PDF/RecordsOverview";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
interface RecordsDiffsDialogProps {
  open: boolean;
  handleRecordsDiffClose: (sourceOfTruth: RecordsSourceOfTruth) => void;
  cloudRecords: Record[] | null;
  localRecords: Record[] | null;
}
const RecordsDiffsDialog = ({
  open,
  handleRecordsDiffClose,
  cloudRecords: cloudRecords,
  localRecords,
}: RecordsDiffsDialogProps) => {
  const handleSelect = (value: RecordsSourceOfTruth) => {
    console.log(value);
    handleRecordsDiffClose(value);
  };
  const t = useTranslations();

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>
        <Alert severity="warning">
          <Typography sx={{ fontSize: "1rem" }}>
            {t("recordsDiffWarning")}
          </Typography>
        </Alert>
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
        <div className="flex items-start justify-center gap-4">
          <div
            className="p-2 w-fit  hover:bg-green-100 rounded-sm hover:cursor-pointer ease-in-out duration-200"
            onClick={() => handleSelect("local")}
          >
            <RecordsOverView records={cloudRecords} title={t("cloudRecords")} />
          </div>
          <div
            className="p-2 w-fit hover:bg-blue-100 rounded-sm hover:cursor-pointer ease-in-out duration-200"
            onClick={() => handleSelect("cloud")}
          >
            <RecordsOverView records={localRecords} title={t("localRecords")} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordsDiffsDialog;
