import React from "react";

export default function Dialog({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="fixed inset-0 z-50">
        {/* Background overlay */}
        <span className="bg-accent opacity-65 fixed inset-0"></span>

        {/* Centered form container */}
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-primary rounded-md p-5 w-5/6 max-w-lg z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
