import React from 'react';
import { Modal } from '../Modal';
import { AddViolationForm } from './AddViolationForm';

interface AddViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddViolationModal({ isOpen, onClose, onSuccess }: AddViolationModalProps) {
  if (!isOpen) return null;
  
  return (
    <Modal onClose={onClose}>
      <AddViolationForm onClose={onClose} onSuccess={onSuccess} />
    </Modal>
  );
}