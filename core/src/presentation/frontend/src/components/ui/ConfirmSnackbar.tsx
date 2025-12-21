'use client';

interface ConfirmSnackbarProps {
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSnackbar({
  message,
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmSnackbarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-6 pointer-events-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 pointer-events-auto"
        onClick={onCancel}
      />
      
      {/* Snackbar */}
      <div className="relative bg-gray-800 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-4 pointer-events-auto animate-slide-up">
        <span className="text-sm">{message}</span>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded hover:bg-gray-700"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
