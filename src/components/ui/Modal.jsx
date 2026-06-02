import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full ${sizes[size]}
          bg-white/30 backdrop-blur-3xl
          border border-white/20
          rounded-3xl
          shadow-[0_25px_80px_rgba(15,23,42,0.35)]
          flex flex-col
          max-h-[90vh]
          animate-in fade-in zoom-in duration-300
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/20">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>

          <button
            onClick={onClose}
            className="
              p-2 rounded-2xl
              bg-white/20
              hover:bg-white/40
              text-slate-500
              hover:text-slate-800
              transition-all duration-300
              hover:scale-110 hover:rotate-90
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}