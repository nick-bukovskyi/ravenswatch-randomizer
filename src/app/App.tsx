import * as Toast from '@radix-ui/react-toast';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { MotionConfig } from 'motion/react';

import { Backdrop } from './layout/Backdrop.tsx';
import { Footer } from './layout/Footer.tsx';
import { Header } from './layout/Header.tsx';
import { MainScreen } from './MainScreen.tsx';

export function App() {
  return (
    // "user": Motion drops transform animations and keeps fades under reduced motion
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={300} skipDelayDuration={300}>
        <Toast.Provider swipeDirection="down">
          <Backdrop />
          <div className="mx-auto flex min-h-dvh w-full max-w-[1180px] flex-col px-5 max-[560px]:px-3.5">
            <Header />
            <main className="flex-1">
              <MainScreen />
            </main>
            <Footer />
          </div>
          <Toast.Viewport className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-50 flex w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2 outline-none" />
        </Toast.Provider>
      </TooltipProvider>
    </MotionConfig>
  );
}
