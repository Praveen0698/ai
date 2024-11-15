"use client";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

interface LoaderProps {
  loaderOpen: boolean;
  closeLoader?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ loaderOpen, closeLoader }) => {
  return (
    <Modal
      open={loaderOpen}
      onClose={(_, reason: "backdropClick" | "escapeKeyDown") => {
        // Only allow closing with handleCloseLoader, not by clicking outside or pressing 'Esc'
        if (reason !== "backdropClick") {
          closeLoader?.();
        }
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableEscapeKeyDown
    >
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 outline-none rounded-lg p-4 z-50">
        <div className="loader"></div>
      </Box>
    </Modal>
  );
};

export default Loader;
