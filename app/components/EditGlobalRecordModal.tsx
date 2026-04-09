import { Modal } from "@mui/material";
import { useState } from "react";

const EditGlobalRecordModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <h1>This is the name edit modal</h1>
    </Modal>
  );
};

export default EditGlobalRecordModal;
