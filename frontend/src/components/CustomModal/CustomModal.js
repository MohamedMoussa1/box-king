import "./CustomModal.css";
import { Box, Typography, Button, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CancelIcon from "@mui/icons-material/Close";

const CustomModal = ({
  openModal,
  onClose,
  onConfirm,
  deleteRequest,
  message,
}) => {
  return (
    <Modal disablePortal open={openModal} onClose={onClose}>
      <Box className="modal">
        <Typography>{message}</Typography>
        <Box className="modal-button-container">
          <Button
            className={deleteRequest && "delete-button"}
            variant="contained"
            onClick={onConfirm}
          >
            {deleteRequest && (
              <>
                <DeleteIcon /> Delete
              </>
            )}
          </Button>
          <Button
            className="cancel-button"
            variant="contained"
            onClick={onClose}
          >
            <CancelIcon />
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
