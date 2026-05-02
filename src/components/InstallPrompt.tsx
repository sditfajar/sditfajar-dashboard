'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function InstallPrompt() {
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallPromptVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
      setIsInstallPromptVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsInstallPromptVisible(false);
  };

  // Hanya tampilkan di halaman admin atau guru
  if (!pathname?.includes('/admin') && !pathname?.includes('/guru')) {
    return null;
  }

  if (!isInstallPromptVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-2xl shadow-xl p-4 flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <h3 className="font-semibold text-sm text-green-900 dark:text-green-50">Instal Aplikasi SDIT Fajar</h3>
        <p className="text-xs text-green-700 dark:text-green-400">Pasang di layar utama untuk akses lebih cepat</p>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleInstallClick}
          className="bg-green-600 dark:bg-green-500 text-white dark:text-black text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-green-700 dark:hover:bg-green-400 transition-colors whitespace-nowrap"
        >
          Instal
        </button>
        <button 
          onClick={handleDismiss}
          className="p-1.5 text-green-600 hover:text-green-800 dark:hover:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
  );
}