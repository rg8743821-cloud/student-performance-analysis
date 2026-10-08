import React from 'react';
import { Student } from '../types/student';
import { calculateClassStatistics } from '../utils/calculations';
import {
  Users,
  Award,
  Clock,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
  BookOpen,
  Sparkles,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { ClassGradeDistributionChart, getScoreColor } from './charts/ChartComponents';

interface DashboardViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onNavigate: (tab: string) => void;
  onAddNew: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  onSelectStudent,
  onNavigate,
  onAddNew,
}) => {
  const stats = calculateClassStatistics(students);

  return (
    <div className="space-y-6 pb-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Academic Analytics & Decision Support
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Student Performance Analysis System
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Real-time evaluation platform tracking examination marks, subject mastery, classroom attendance, and automated improvement roadmaps.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Student Record
            </button>
            <button
              onClick={() => onNavigate('students')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              View All Students ({students.length})
            </button>
          </div>
        </div>

        {/* Ambient watermark circle decoration */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />
      </div>

      {/* 5 Primary Stat Cards (from Section 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            {stats.totalStudents}
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 group-hover:text-blue-600">
            Active Enrolled <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* 2. Average Class Percentage */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average Class %
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            {stats.averagePercentage}%
          </div>
          <span className="text-[11px] text-slate-500">
            High: {stats.highestPercentage}% • Low: {stats.lowestPercentage}%
          </span>
        </div>

        {/* 3. Average Attendance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg Attendance
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            {stats.averageAttendance}%
          </div>
          <span className="text-[11px] text-slate-500">
            Working days recorded
          </span>
        </div>

        {/* 4. Students Needing Improvement */}
        <div
          onClick={() => onNavigate('class-analysis')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Needs Improvement
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 mb-1">
            {stats.studentsNeedingImprovement.length}
          </div>
          <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
            Score &lt;50% or Low Att. <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* 5. Top Performing Students */}
        <div
          onClick={() => onNavigate('class-analysis')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Top Performers
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-700 mb-1">
            {stats.studentsAbove90}
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 group-hover:text-indigo-600">
            Scoring 90%+ (Grade A+) <ArrowRight className="w-3 h-3" />
          </span>
        </div>

      </div>

      {/* Grid: Grade Distribution & Cohort Performance Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Grade Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <ClassGradeDistributionChart
            distribution={stats.gradeDistribution}
            totalStudents={stats.totalStudents}
          />
        </div>

        {/* Right 1 Col: Performance Tier Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">Cohort Performance Tiers</h4>
            <p className="text-xs text-slate-500 mb-4">Academic brackets based on terminal evaluation.</p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">Distinction Tier (≥90%)</span>
                  <span className="text-[11px] text-emerald-700">Exceptional Academic Mastery</span>
                </div>
                <span className="text-lg font-black text-emerald-800 font-mono">
                  {stats.studentsAbove90}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">Proficient Tier (60% - 89%)</span>
                  <span className="text-[11px] text-blue-700">Satisfactory & Commendable</span>
                </div>
                <span className="text-lg font-black text-blue-800 font-mono">
                  {stats.students60To89}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-900 block">Remedial Tier (&lt;60%)</span>
                  <span className="text-[11px] text-rose-700">Requires Academic Intervention</span>
                </div>
                <span className="text-lg font-black text-rose-800 font-mono">
                  {stats.studentsBelow60}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('class-analysis')}
              className="w-full py-2 px-3 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Open Comprehensive Class Analytics
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Grid: Top 5 Performers & Students Needing Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 5 Performers Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Top Performing Students</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Honor Roll
            </span>
          </div>

          {stats.topPerformers.length === 0 ? (
            <p className="text-slate-400 text-xs py-6 text-center">No student records available</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.topPerformers.map((st, idx) => (
                <div
                  key={st.id}
                  onClick={() => onSelectStudent(st)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-bold text-xs font-mono text-slate-400 group-hover:text-blue-600">
                      #{idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors block">
                        {st.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {st.class}-{st.section} • Roll: {st.rollNumber}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 font-mono block">
                      {st.overallPercentage}%
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      Grade {st.overallGrade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Students Needing Improvement */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Students Needing Support & Improvement</h3>
            </div>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Action Required
            </span>
          </div>

          {stats.studentsNeedingImprovement.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All enrolled students are currently meeting baseline targets!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.studentsNeedingImprovement.slice(0, 5).map((st) => (
                <div
                  key={st.id}
                  onClick={() => onSelectStudent(st)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-bold">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 group-hover:text-rose-600 transition-colors block">
                        {st.name}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{st.class}-{st.section}</span>
                        {st.attendancePercentage < 75 && (
                          <span className="text-rose-600 font-semibold">• Att: {st.attendancePercentage}%</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-rose-600 font-mono block">
                      {st.overallPercentage}%
                    </span>
                    <span className="text-[10px] font-semibold text-rose-700">
                      Grade: {st.overallGrade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
