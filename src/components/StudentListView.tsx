import React, { useState, useMemo } from 'react';
import {
  Student,
  PerformanceStatus,
  GradeType
} from '../types/student';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Plus,
  ArrowUpDown,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { getScoreColor } from './charts/ChartComponents';

interface StudentListViewProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onAddNew: () => void;
  onLoadDemo: () => void;
}

export const StudentListView: React.FC<StudentListViewProps> = ({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onAddNew,
  onLoadDemo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'pct-desc' | 'pct-asc' | 'name' | 'roll' | 'attendance'>('pct-desc');
  const [deleteCandidate, setDeleteCandidate] = useState<Student | null>(null);

  // Derive unique classes and sections from students
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.class && set.add(s.class));
    return Array.from(set).sort();
  }, [students]);

  const availableSections = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.section && set.add(s.section));
    return Array.from(set).sort();
  }, [students]);

  // Filtered & Sorted student list
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        // Search query by name or roll number
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = student.name.toLowerCase().includes(q);
          const matchesRoll = student.rollNumber.toLowerCase().includes(q);
          if (!matchesName && !matchesRoll) return false;
        }

        // Class filter
        if (selectedClass !== 'all' && student.class !== selectedClass) {
          return false;
        }

        // Section filter
        if (selectedSection !== 'all' && student.section !== selectedSection) {
          return false;
        }

        // Performance status filter
        if (selectedStatus !== 'all') {
          if (selectedStatus === 'needs_attention') {
            return student.overallPercentage < 50 || student.attendancePercentage < 75;
          }
          if (student.performanceStatus !== selectedStatus) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'pct-desc') return b.overallPercentage - a.overallPercentage;
        if (sortBy === 'pct-asc') return a.overallPercentage - b.overallPercentage;
        if (sortBy === 'attendance') return b.attendancePercentage - a.attendancePercentage;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'roll') return a.rollNumber.localeCompare(b.rollNumber);
        return 0;
      });
  }, [students, searchQuery, selectedClass, selectedSection, selectedStatus, sortBy]);

  const getStatusBadge = (status: PerformanceStatus) => {
    switch (status) {
      case 'Outstanding':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Average':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Needs Improvement':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getGradeBadge = (grade: GradeType) => {
    if (grade === 'A+' || grade === 'A') return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    if (grade === 'B+' || grade === 'B') return 'bg-blue-50 text-blue-700 border-blue-300';
    if (grade === 'C') return 'bg-amber-50 text-amber-700 border-amber-300';
    if (grade === 'D') return 'bg-orange-50 text-orange-700 border-orange-300';
    return 'bg-rose-50 text-rose-700 border-rose-300';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Directory & Records</h2>
          <p className="text-xs text-slate-500">
            Manage academic records, grades, attendance tracking and student performance profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {students.length === 0 && (
            <button
              onClick={onLoadDemo}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Load Sample Students
            </button>
          )}
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Filter by Class */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-medium"
            >
              <option value="all">All Classes</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Filter by Section */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-medium"
            >
              <option value="all">All Sections</option>
              {availableSections.map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>

          {/* Filter by Performance Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Outstanding">Outstanding (≥85%)</option>
              <option value="Good">Good (70-84%)</option>
              <option value="Average">Average (50-69%)</option>
              <option value="Needs Improvement">Needs Improvement (&lt;50%)</option>
              <option value="needs_attention">⚠️ Attention Needed (&lt;50% or Low Att.)</option>
            </select>
          </div>
        </div>

        {/* Status Count Strip & Sort */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredStudents.length}</strong> of{' '}
            <strong className="text-slate-800">{students.length}</strong> students
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-600">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 bg-white font-medium focus:outline-none"
            >
              <option value="pct-desc">Highest Percentage</option>
              <option value="pct-asc">Lowest Percentage</option>
              <option value="attendance">Highest Attendance</option>
              <option value="name">Name (A-Z)</option>
              <option value="roll">Roll Number</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">No matching students found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Try adjusting your search query or filters, or add new student records.
            </p>
            {students.length === 0 && (
              <button
                onClick={onLoadDemo}
                className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
              >
                Load Sample Student Dataset
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-5">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-center">Attendance</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Performance Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => {
                  const pctColor = getScoreColor(st.overallPercentage);

                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                      onClick={() => onViewStudent(st)}
                    >
                      {/* Name */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {st.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                              {st.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {st.subjects.length} subjects
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {st.rollNumber}
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {st.class}
                      </td>

                      {/* Section */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {st.section}
                        </span>
                      </td>

                      {/* Percentage */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold ${pctColor.badge}`}>
                          {st.overallPercentage}%
                        </span>
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`font-mono font-bold ${
                            st.attendancePercentage >= 85
                              ? 'text-emerald-700'
                              : st.attendancePercentage >= 75
                              ? 'text-slate-700'
                              : 'text-rose-600'
                          }`}>
                            {st.attendancePercentage}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({st.daysPresent}/{st.totalWorkingDays})
                          </span>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold border text-[11px] ${getGradeBadge(st.overallGrade)}`}>
                          {st.overallGrade}
                        </span>
                      </td>

                      {/* Performance Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(st.performanceStatus)}`}>
                          {st.performanceStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewStudent(st)}
                            title="View Full Profile"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditStudent(st)}
                            title="Edit Student Data"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidate(st)}
                            title="Delete Student"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">Delete Student Record?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <strong>{deleteCandidate.name}</strong> ({deleteCandidate.rollNumber})? This action will permanently remove their marks and attendance records.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
