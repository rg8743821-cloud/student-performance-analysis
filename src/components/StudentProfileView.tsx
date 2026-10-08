import React from 'react';
import {
  Student,
  SubjectScore,
  AIAnalysisResult
} from '../types/student';
import { generateAIAnalysis } from '../utils/aiAnalysis';
import {
  SubjectMarksBarChart,
  SubjectPercentageChart,
  AttendanceChart,
  ExamComparisonChart,
  OverallPerformanceChart,
  getScoreColor
} from './charts/ChartComponents';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Flame,
  HelpCircle,
  Lightbulb,
  Printer,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users
} from 'lucide-react';

interface StudentProfileViewProps {
  student: Student;
  onEdit: (student: Student) => void;
  onOpenReport: (student: Student) => void;
  onBack?: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  onEdit,
  onOpenReport,
  onBack,
}) => {
  const analysis: AIAnalysisResult = generateAIAnalysis(student);

  const getStatusBadge = (status: SubjectScore['status']) => {
    switch (status) {
      case 'Strong':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Average':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Needs Improvement':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getGradeBadge = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    if (grade === 'B+' || grade === 'B') return 'bg-blue-50 text-blue-700 border-blue-300';
    if (grade === 'C') return 'bg-amber-50 text-amber-700 border-amber-300';
    if (grade === 'D') return 'bg-orange-50 text-orange-700 border-orange-300';
    return 'bg-rose-50 text-rose-700 border-rose-300';
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Student Bio Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
        {/* Subtle background accent strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
          {/* Identity info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {student.rollNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  {student.class} - Sec {student.section}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Academic Year: <strong className="text-slate-700">{student.academicYear}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Guardian: <strong className="text-slate-700">{student.parentName}</strong>
                </span>
                {student.parentContact && (
                  <span className="text-slate-400">({student.parentContact})</span>
                )}
                {student.gender && (
                  <span>• {student.gender}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => onEdit(student)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Student
            </button>
            <button
              onClick={() => onOpenReport(student)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Percentage */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Overall Percentage
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{student.overallPercentage}%</span>
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Cohort Standing: <strong>{student.performanceStatus}</strong>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Overall Grade */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Overall Grade
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-600">{student.overallGrade}</span>
              <span className="text-xs text-slate-400">Scale A+ to Needs Imp.</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Grading Benchmark System
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Attendance Record
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{student.attendancePercentage}%</span>
              <span className="text-xs text-slate-400">Regularity</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {student.daysPresent} of {student.totalWorkingDays} days present
            </span>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
            student.attendancePercentage >= 85 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Marks */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Total Marks
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{student.totalMarks}</span>
              <span className="text-xs text-slate-400">/ {student.totalMaxMarks}</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Avg Marks/Subject: <strong>{student.averageSubjectMarks}</strong>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECTION 5: SUBJECT-WISE PERFORMANCE TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Subject-wise Academic Performance</h3>
            <p className="text-xs text-slate-500">
              Detailed breakdown of scores, percentages, official letter grades and competency status.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
            {student.subjects.length} Subjects Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-6 text-center">Marks Obtained</th>
                <th className="py-3 px-6 text-center">Maximum Marks</th>
                <th className="py-3 px-6 text-center">Percentage</th>
                <th className="py-3 px-6 text-center">Grade</th>
                <th className="py-3 px-6 text-right">Performance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {student.subjects.map((sub, idx) => {
                const color = getScoreColor(sub.percentage);
                return (
                  <tr key={sub.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-800 text-sm">
                      {sub.name}
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-slate-900">
                      {sub.marksObtained}
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono text-slate-500">
                      {sub.maxMarks}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold ${color.bg}`}>
                        {sub.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold border ${getGradeBadge(sub.grade)}`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 9: PERFORMANCE COMPARISON HIGHLIGHTS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Performance Comparison (Previous Exam vs Current Exam)
            </h3>
            <p className="text-xs text-slate-500">
              Comparative trajectory tracking against previous academic cycle benchmark.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Trajectory Status</span>
              <span className={`text-xs font-bold ${
                analysis.examComparison.improvementPercentage >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {analysis.examComparison.trend}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium block mb-1">Previous Exam Benchmark</span>
            <span className="text-2xl font-black text-slate-800">{student.previousExamPercentage}%</span>
            <span className="text-[11px] text-slate-400 block mt-1">Baseline performance</span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <span className="text-xs text-blue-700 font-medium block mb-1">Current Exam Standing</span>
            <span className="text-2xl font-black text-blue-900">{student.overallPercentage}%</span>
            <span className="text-[11px] text-blue-600 block mt-1">Evaluated across {student.subjects.length} subjects</span>
          </div>

          <div className={`p-4 rounded-xl border ${
            analysis.examComparison.improvementPercentage >= 0
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-rose-50/70 border-rose-200'
          }`}>
            <span className="text-xs font-medium block mb-1 text-slate-700">Improvement / Delta</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${
                analysis.examComparison.improvementPercentage >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {analysis.examComparison.improvementPercentage >= 0 ? '+' : ''}
                {analysis.examComparison.improvementPercentage}%
              </span>
              <span className="text-xs font-semibold text-slate-600">
                ({analysis.examComparison.differenceInMarks >= 0 ? '+' : ''}{analysis.examComparison.differenceInMarks} Net Marks)
              </span>
            </div>
            <span className="text-[11px] text-slate-600 block mt-1">
              {analysis.examComparison.narrative}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 6: PERFORMANCE CHARTS (5 Visualizations) */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Academic Performance Visualizations
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Subject-wise Marks Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <SubjectMarksBarChart subjects={student.subjects} />
          </div>

          {/* Chart 2: Subject-wise Percentage Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <SubjectPercentageChart subjects={student.subjects} />
          </div>

          {/* Chart 3: Attendance Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <AttendanceChart
              daysPresent={student.daysPresent}
              totalWorkingDays={student.totalWorkingDays}
              attendancePercentage={student.attendancePercentage}
            />
          </div>

          {/* Chart 4: Previous vs Current Exam comparison */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <ExamComparisonChart
              previousPercentage={student.previousExamPercentage}
              currentPercentage={student.overallPercentage}
            />
          </div>
        </div>

        {/* Chart 5: Holistic Overall Performance Chart (spanning full width) */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <OverallPerformanceChart
            overallPercentage={student.overallPercentage}
            assignmentPerformance={student.assignmentPerformance}
            classTestPerformance={student.classTestPerformance}
            attendancePercentage={student.attendancePercentage}
          />
        </div>
      </div>

      {/* SECTION 7: AI PERFORMANCE ANALYSIS */}
      <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-xs relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">AI Performance Analytics & Diagnostic Summary</h3>
            <p className="text-xs text-slate-500">
              Automated cognitive analysis derived directly from examination results, homework scores, and attendance.
            </p>
          </div>
        </div>

        {/* Executive summary block */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-slate-800 text-sm leading-relaxed mb-6 font-normal">
          {analysis.overallSummary}
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Strongest Subjects */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Strongest Subjects (Core Strengths)
            </h4>
            <div className="space-y-2.5">
              {analysis.strongestSubjects.map((s, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-emerald-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>{s.name}</span>
                    <span className="text-emerald-600 font-mono">{s.percentage}%</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{s.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weakest Subjects / Needing Attention */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-3">
              <TrendingDown className="w-4 h-4 text-amber-600" />
              Identified Focus Areas & Academic Gaps
            </h4>
            <div className="space-y-2.5">
              {analysis.weakestSubjects.map((s, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-amber-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>{s.name}</span>
                    <span className="text-rose-600 font-mono">{s.percentage}%</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{s.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance & Declining Areas side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Clock className="w-4 h-4 text-blue-600" />
              Attendance Correlation Analysis
            </h4>
            <p className="text-slate-700 leading-relaxed">{analysis.attendanceAnalysis.narrative}</p>
            <p className="text-slate-500 text-[11px]">{analysis.attendanceAnalysis.impactOnAcademics}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              Declining Performance Areas
            </h4>
            <ul className="space-y-1 list-disc pl-4 text-slate-700">
              {analysis.decliningPerformanceAreas.map((area, i) => (
                <li key={i}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* General Study Recommendations */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-white text-xs">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            General Study Recommendations for Student & Parents
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-300">
            {analysis.studyRecommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold shrink-0">✓</span>
                <span className="text-[11px] leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: PERSONALIZED IMPROVEMENT PLAN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Personalized Academic Improvement Plan</h3>
            <p className="text-xs text-slate-500">
              Customized actionable study strategy based on {student.name}'s specific subject weaknesses.
            </p>
          </div>
        </div>

        {/* Priority Subjects Cards */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Priority Subjects Requiring Immediate Focus
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.personalizedPlan.prioritySubjects.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{item.subject}</span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-rose-100 text-rose-800 text-[10px]">
                    Priority #{i + 1}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">{item.reason}</div>
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 font-semibold text-[11px]">
                  Daily Time Target: {item.dailyTime}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Plan Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Daily Study Routine */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Daily Study Routine
            </h5>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {analysis.personalizedPlan.dailyStudyRecommendation}
            </p>
          </div>

          {/* Revision Strategy */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Spaced Revision Strategy
            </h5>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {analysis.personalizedPlan.revisionStrategy}
            </p>
          </div>

          {/* Weekly Targets */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600" />
              Weekly Milestone Targets
            </h5>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
              {analysis.personalizedPlan.weeklyTargets.map((wt, i) => (
                <li key={i}>{wt}</li>
              ))}
            </ul>
          </div>

          {/* Test Preparation Plan */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600" />
              Pre-Examination Battle Plan
            </h5>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {analysis.personalizedPlan.testPreparationPlan}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
