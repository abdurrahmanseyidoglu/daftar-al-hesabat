import { useRecordStore } from "@/app/stores/recordStore";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  updatedName: string;
};

interface Props {
  isOpen: boolean;
  closeModal: (state: boolean, name: string) => void;
  name: string;
}
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1px solid text.primary",
  boxShadow: 24,
  borderRadius: 3,
  py: 4,
  px: 6,
  width: { xs: "90%", md: "60%", lg: "40%" },
};

export default function EditNameModal(props: Props) {
  const updateRecordOwnerName = useRecordStore(
    (state) => state.updateRecordOwnerName,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    values: {
      updatedName: props.name,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    updateRecordOwnerName(props.name, data.updatedName.trim());
    props.closeModal(false, "");
  };

  const handleClose = () => props.closeModal(false, "");

  return (
    <div>
      <Modal
        open={props.isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Update Records Name"
                {...register("updatedName", {
                  required: "Name cannot be empty",
                })}
                error={!!errors.updatedName}
                helperText={errors.updatedName && "Name Can not be empty"}
              />

              <Button type="submit" variant="contained" fullWidth>
                Save
              </Button>
              <Alert severity="warning">
                <AlertTitle>Heads up!</AlertTitle>
                Renaming <strong>{props.name}</strong> will update all records
                associated with this name. This action cannot be undone. Make
                sure you want to proceed before saving.
              </Alert>
            </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
