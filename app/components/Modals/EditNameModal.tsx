import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";

interface Props {
  isOpen: boolean;
  closeModal: (state: boolean, name: string | null) => void;
  name: string | null;
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
  px: 8,
};

export default function EditNameModal(props: Props) {
  const handleClose = () => props.closeModal(false, null);

  return (
    <div>
      <Modal
        open={props.isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h1>{props.name}</h1>
        </Box>
      </Modal>
    </div>
  );
}
