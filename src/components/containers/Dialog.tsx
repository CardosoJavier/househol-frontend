import React from "react";

export default function Dialog({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="dialog-container" className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div data-testid="dialog-overlay" className="fixed inset-0 bg-accent opacity-65" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }} />
      
      {/* Modal content */}
      <div data-testid="dialog-content" className="relative bg-primary rounded-md p-5 w-5/6 max-w-lg z-10 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
