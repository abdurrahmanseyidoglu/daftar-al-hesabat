import {
  Alert,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { RecordsSourceOfTruth } from "../types/recordsSourceOfTruth";
import { Record } from "../schemas/record.schema";
import RecordsOverView from "./PDF/RecordsOverview";
interface RecordsDiffsDialogProps {
  open: boolean;
  handleRecordsDiffClose: (sourceOfTruth: RecordsSourceOfTruth) => void;
  remoteRecords: Record[] | null;
  localRecords: Record[] | null;
}
const RecordsDiffsDialog = ({
  open,
  handleRecordsDiffClose,
  remoteRecords,
  localRecords,
}: RecordsDiffsDialogProps) => {
  const handleSelect = (value: RecordsSourceOfTruth) => {
    console.log(value);
    handleRecordsDiffClose(value);
  };

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>
        <Alert severity="warning">
          <Typography sx={{ fontSize: "1rem" }}>
            There is a difference between the local and remote version please
            select the version you want to keep
          </Typography>
        </Alert>
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
        <div className="flex items-start justify-center gap-4">
          <div
            className="p-2 w-fit  hover:bg-green-100 rounded-sm hover:cursor-pointer ease-in-out duration-200"
            onClick={() => handleSelect("local")}
          >
            <RecordsOverView records={remoteRecords} title="Remote Records" />
          </div>
          <div
            className="p-2 w-fit hover:bg-blue-100 rounded-sm hover:cursor-pointer ease-in-out duration-200"
            onClick={() => handleSelect("remote")}
          >
            <RecordsOverView records={localRecords} title="Local Records" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordsDiffsDialog;
