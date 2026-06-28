'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icons from '@/assets/icons';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface IConfirmModalProps {
  isOpen?: boolean;
  onCancel?: () => any;
  onOk?: () => any;
  noCancel?: boolean;
  noSubmit?: boolean;
  cancelText?: string;
  okText?: string;
  loadingOnOk?: boolean;
  title?: any;
  content?: any;
  type?: 'delete';
  icon?: any;
  completed?: boolean;
  bodyContent?: React.ReactNode;
  data?: any;
  classNameContent?: string;
  iconClassName?: string;
}

const ModalConfirm = ({
  isOpen = false,
  onCancel,
  onOk,
  noCancel = false,
  cancelText,
  okText,
  loadingOnOk = false,
  title,
  content,
  type,
  icon,
  completed = false,
  bodyContent,
  noSubmit,
  classNameContent,
  iconClassName,
}: IConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onCancel?.()}>
      <DialogContent
        className={`${bodyContent ? 'w-fit' : 'max-w-[600px]'} !pt-2 bg-theme-neutral-1 border-none`}
        showCloseButton={true}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle
            className={
              'inline-flex items-center gap-2 text-lg font-bold text-theme-neutral-11 pb-2 border-b -mx-6 px-6'
            }
          >
            {title || '　'}
          </DialogTitle>
          {icon && (
            <div
              className={cn(
                'flex items-center justify-center py-4',
                iconClassName
              )}
            >
              <Image src={icon} alt="icon" width={64} height={64} />
            </div>
          )}
          {content && (
            <DialogDescription
              className={cn(
                'text-base text-theme-neutral-11 leading-relaxed whitespace-break-spaces flex justify-center text-center',
                classNameContent
              )}
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          )}
          {/* Body content */}
          {bodyContent && <div className={classNameContent}>{bodyContent}</div>}
        </DialogHeader>

        {(completed || !noCancel || !noSubmit) && (
          <DialogFooter
            className={`flex flex-row justify-center gap-3 mt-4 ${completed ? 'justify-center' : 'justify-end'}`}
          >
            {completed ? (
              <Button
                variant="primary"
                size="md"
                onClick={onOk}
                className="min-w-[100px]"
              >
                {t('common.confirm')}
              </Button>
            ) : (
              <>
                {!noCancel && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={onCancel}
                    disabled={loadingOnOk}
                    className="min-w-[100px]"
                  >
                    {cancelText || t('common.cancel')}
                  </Button>
                )}
                {!noSubmit && (
                  <Button
                    variant={type === 'delete' ? 'danger' : 'primary'}
                    size="md"
                    onClick={onOk}
                    disabled={loadingOnOk}
                    className="min-w-[100px]"
                  >
                    {loadingOnOk && (
                      <Image
                        src={Icons.Loader2}
                        alt=""
                        width={16}
                        height={16}
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                    )}
                    {okText || t('common.confirm')}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

class StaticMethodConfirm {
  public static instanceUIRef: any = null;

  public static open(payload: IConfirmModalProps) {
    if (StaticMethodConfirm.instanceUIRef?.open)
      StaticMethodConfirm.instanceUIRef?.open(payload);
  }

  public static close() {
    if (StaticMethodConfirm.instanceUIRef?.close)
      StaticMethodConfirm.instanceUIRef?.close();
  }
}

export const ModalConfirmInstance = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState<IConfirmModalProps>();

  useEffect(() => {
    StaticMethodConfirm.instanceUIRef = {
      open: (payload: IConfirmModalProps) => {
        setData(payload);
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
      },
    };
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    if (!data || !data?.onOk) return;

    setLoading(true);
    await data?.onOk();
    setLoading(false);
    setIsOpen(false);
  };

  const handleCancel = async () => {
    if (data?.onCancel) {
      await data.onCancel();
    }
    setIsOpen(false);
  };

  return (
    <ModalConfirm
      {...data}
      isOpen={isOpen}
      onCancel={handleCancel}
      onOk={handleSubmit}
      loadingOnOk={data?.loadingOnOk || loading}
    />
  );
};

export default StaticMethodConfirm;
export { ModalConfirm };
