import React from 'react';
import {
  Menu,
  Plus,
  RotateCcw,
  Trash2,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { Student } from '../types/student';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  onAddNew: () => void;
  onResetDemo: () => void;
  onClearData: () => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileSidebar,
  onAddNew,
  onResetDemo,
  onClearData,
  students,
  onSelectStudent,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 print:hidden shadow-2xs">
      
      {/* Left: Hamburger menu for mobile & Title indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Session 2025-2026
          </span>
          <span className="text-xs text-slate-400 font-medium">
            • {students.length} Student Records
          </span>
        </div>
      </div>

      {/* Right: Quick actions (Reset Demo, Clear Data, Add Student) */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Reset Demo Data button */}
        <button
          onClick={onResetDemo}
          title="Reload initial sample student records"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">Sample Demo Data</span>
        </button>

        {/* Clear Data button if students exist */}
        {students.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Clear all student records? You can reload sample demo records anytime.')) {
                onClearData();
              }
            }}
            title="Clear all stored student data"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Add Student Primary Action */}
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>

      </div>

    </header>
  );
};
