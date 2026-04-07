import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { Box, DialogContent } from "@mui/material";
import { Palette } from "@mui/material/styles";

type MuiColor = keyof Palette;

export interface Props {
  open: boolean;
  selectedValue: boolean;
  onClose: (value: boolean) => void;
  title?: string;
  titleColor?: MuiColor;
  description?: string;
  descriptionColor?: MuiColor;
}

export default function ConfirmDialog(props: Props) {
  const {
    onClose,
    selectedValue,
    open,
    title,
    description,
    descriptionColor,
    titleColor,
  } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleConformation = (value: boolean) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle color={titleColor}>{title ?? "Are you sure?"}</DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            fontSize: "1rem",
          }}
          color={descriptionColor}
        >
          {description}
        </Typography>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => handleConformation(false)}
            color="error"
          >
            NO
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleConformation(true)}
            color="primary"
          >
            YES
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
