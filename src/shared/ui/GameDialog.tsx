import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';

import { useFocusContentOnOpen } from '../hooks/useFocusContentOnOpen.ts';
import { cn } from '../lib/cn.ts';
import { ToolButton } from './ToolButton.tsx';

export interface DialogNotice {
  /** A new id shows the message again, even when the text is the same */
  readonly id: number;
  readonly message: string;
  readonly tone: 'info' | 'warning';
}

interface GameDialogProps {
  open: boolean;
  trigger: ReactElement;
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  notice: DialogNotice | null;
  onOpenChange: (open: boolean) => void;
}

export function GameDialog({
  open,
  trigger,
  title,
  description,
  children,
  footer,
  notice,
  onOpenChange,
}: GameDialogProps) {
  const { contentRef, handleOpenAutoFocus } = useFocusContentOnOpen();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="game-dialog__overlay fixed inset-0 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount onOpenAutoFocus={handleOpenAutoFocus}>
              <motion.div
                ref={contentRef}
                className="game-dialog fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-1rem)] w-[min(60rem,calc(100vw-1rem))] flex-col outline-none sm:max-h-[calc(100dvh-3rem)]"
                initial={{ opacity: 0, y: 36, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 360, damping: 30 },
                }}
                exit={{
                  opacity: 0,
                  y: 18,
                  scale: 0.97,
                  transition: { duration: 0.18, ease: 'easeIn' },
                }}
              >
                <header className="relative shrink-0 px-12 pt-5 pb-3 text-center sm:px-16 sm:pt-7 sm:pb-4">
                  <Dialog.Title className="game-dialog__title">{title}</Dialog.Title>
                  <Dialog.Description className="mx-auto mt-3 max-w-xl font-body text-sm leading-snug text-cream-muted sm:text-base">
                    {description}
                  </Dialog.Description>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <Dialog.Close asChild>
                      <ToolButton label="Close" icon="close" />
                    </Dialog.Close>
                  </div>
                </header>

                <div className="game-dialog__body min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-8 sm:py-4">
                  {children}
                </div>

                <footer className="relative shrink-0 border-t border-white/6 px-4 py-3 sm:px-8 sm:py-4">
                  <div
                    role="status"
                    className="pointer-events-none absolute inset-x-3 bottom-full mb-3 flex justify-center"
                  >
                    <AnimatePresence mode="popLayout">
                      {notice && (
                        <motion.p
                          key={notice.id}
                          className={cn(
                            'flex max-w-full items-center gap-2 rounded-full border bg-night-deep/95 px-4 py-1.5 font-body text-sm text-cream shadow-[0_10px_24px_-8px_rgb(0_0_0/0.9)] sm:text-base',
                            notice.tone === 'warning' ? 'border-crimson-300/80' : 'border-gold-500',
                          )}
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
                          transition={{ type: 'spring', stiffness: 520, damping: 34 }}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              'size-2 shrink-0 rotate-45',
                              notice.tone === 'warning' ? 'bg-crimson-300' : 'bg-gold-300',
                            )}
                          />
                          {notice.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  {footer}
                </footer>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
