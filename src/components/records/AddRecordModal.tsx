import React from 'react';
import { Modal } from '../Modal';
import { AddRecordForm } from './AddRecordForm';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRecordModal({ isOpen, onClose, onSuccess }: AddRecordModalProps) {
  if (!isOpen) return null;
  
  return (
    <Modal onClose={onClose}>
      <AddRecordForm onClose={onClose} onSuccess={onSuccess} />
    </Modal>
  );
}