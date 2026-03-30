import { Box, Modal, Typography } from "@mui/material";

const AmountFormModal = ({ open, amount }: { boolean, string }) => {
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>This is a Modal</Box>
      </Modal>
    </>
  );
};

export default AmountFormModal;
