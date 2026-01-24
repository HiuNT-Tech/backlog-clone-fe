'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddNewCardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (title: string) => void;
}

const AddNewCardPopup: React.FC<AddNewCardPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = React.useState('');

  React.useEffect(() => {
    if (!isOpen) {
      setTitle('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (title.trim() && onConfirm) {
      onConfirm(title);
      setTitle('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[80%] w-[900px] flex flex-col shadow-[0px_9px_28px_8px_#0000000D] rounded-lg p-4 bg-white"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>{t('column.addNewCard.popup.title')}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder={t('column.addNewCard.popup.placeholder')}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
        />
        <DialogFooter className="flex justify-end gap-4 mr-6">
          <Button variant="secondary" onClick={onClose} className="py-2 px-10">
            {t('common.cancel')}
          </Button>
          <Button
            className="py-2 px-10"
            variant="primary"
            onClick={handleConfirm}
            disabled={!title.trim()}
          >
            {t('common.add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewCardPopup;
