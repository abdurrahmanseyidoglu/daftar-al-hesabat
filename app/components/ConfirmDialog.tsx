import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { DialogContent } from "@mui/material";

const emails = ["username@gmail.com", "user02@gmail.com"];

export interface Props {
  open: boolean;
  selectedValue: boolean;
  onClose: (value: boolean) => boolean;
  title?: string;
  description?: string;
}

export default function ConfirmDialog(props: Props) {
  const { onClose, selectedValue, open, title, description } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleConformation = (value: boolean) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title ?? "Are you sure?"}</DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            fontSize: "2rem",
          }}
        >
          {description}
        </Typography>
        <Button onClick={() => handleConformation(true)} color="primary">
          YES
        </Button>
        <Button onClick={() => handleConformation(false)} color="error">
          NO
        </Button>
      </DialogContent>
    </Dialog>
  );
}
