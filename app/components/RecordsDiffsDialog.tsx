import { Dialog, DialogTitle } from "@mui/material";
import { RecordsSourceOfTruth } from "../types/recordsSourceOfTruth";
import { Record } from "../schemas/record.schema";
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
    <Dialog open={open}>
      <DialogTitle>
        There is a difference between the local and remote version which one you
        want?
      </DialogTitle>
      <div className="flex items-start justify-center gap-4">
        <div
          className="p-2 border border-amber-700"
          onClick={() => handleSelect("local")}
        >
          {JSON.stringify(remoteRecords)}
        </div>
        <div
          className="p-2 border border-lime-400"
          onClick={() => handleSelect("remote")}
        >
          {JSON.stringify(localRecords)}
        </div>
      </div>
    </Dialog>
  );
};

export default RecordsDiffsDialog;
