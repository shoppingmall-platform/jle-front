import React from "react";
import ReactDOM from "react-dom";
import "@/App.css";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// Portal 렌더링 공통 함수
const createPortal = (Component) => {
  return ReactDOM.createPortal(
    Component,
    document.getElementById("portal-root")
  );
};

// Modal 컴포넌트
export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// Drawer 컴포넌트
export const Drawer = ({ isOpen, onClose, position = "right", children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={`drawer-overlay ${position}`} onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 1, right: 1 }}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
};
