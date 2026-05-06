import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import { Box, DialogContent } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { AlertColor } from "@mui/material/Alert";
import { useTranslations } from "next-intl";

type MuiColor = keyof Palette;

export interface Props {
  open: boolean;
  selectedValue: boolean;
  onClose: (value: boolean) => void;
  title?: string;
  titleColor?: MuiColor;
  description?: string;
  descriptionSeverity?: AlertColor;
}

export default function ConfirmDialog(props: Props) {
  const t = useTranslations();
  const {
    onClose,
    selectedValue,
    open,
    title,
    description,
    descriptionSeverity = "error",
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
        {description && (
          <Alert severity={descriptionSeverity}>{description}</Alert>
        )}
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
            onClick={() => handleConformation(true)}
            color="primary"
          >
            {t("yes")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleConformation(false)}
            color="error"
          >
            {t("no")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
