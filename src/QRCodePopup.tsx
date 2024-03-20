import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import QRCode from 'qrcode.react';

interface PopupProps {
  content: string; // Content to be used for QR code generation
  isOpen: boolean;
  onClose(): void;
}

const QRCodePopup: React.FC<PopupProps> = ({ content, isOpen, onClose }) => {

  return (
    <>
      <Modal show={isOpen} onHide={onClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <QRCode value={content} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QRCodePopup;