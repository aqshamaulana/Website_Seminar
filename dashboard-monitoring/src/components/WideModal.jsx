// src/components/WideModal.jsx

import React from 'react';
import { X } from 'lucide-react';

const WideModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      ></div>
      
      {/* Pastikan className di div bawah ini sudah benar */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-700 animate-modalSlideIn"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default WideModal;