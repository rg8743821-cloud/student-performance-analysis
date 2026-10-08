import React, { useState } from 'react';
import { Student } from '../types/student';
import { generateAIAnalysis } from '../utils/aiAnalysis';
import {
  Printer,
  Download,
  Share2,
  FileText,
  Award,
  CheckCircle,
  Calendar,
  User,
  Shield,
  GraduationCap
} from 'lucide-react';
import { getScoreColor } from './charts/ChartComponents';

interface ReportViewProps {
  students: Student[];
  initialStudent?: Student | null;
  onSelectStudent: (student: Student) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  students,
  initialStudent,
  onSelectStudent,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    return initialStudent?.id || (students.length > 0 ? students[0].id : '');
  });

  const activeStudent = students.find((s) => s.id === selectedStudentId) || initialStudent || students[0];

  if (!activeStudent) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Student Records Found</h3>
        <p className="text-xs text-slate-400 mt-1">Please add or load student records to generate academic reports.</p>
      </div>
    );
  }

  const analysis = generateAIAnalysis(activeStudent);

  // Trigger browser print (CSS takes care of clean print formatting)
  const handlePrint = () => {
    window.print();
  };

  // Download JSON / CSV export of student performance card
  const handleDownloadCSV = () => {
    const rows = [
      ['Student Performance Evaluation Report'],
      ['Generated On', new Date().toLocaleDateString()],
      ['Student Name', activeStudent.name],
      ['Roll Number', activeStudent.rollNumber],
      ['Class & Section', `${activeStudent.class} - ${activeStudent.section}`],
      ['Academic Year', activeStudent.academicYear],
      ['Parent / Guardian', activeStudent.parentName],
      ['Overall Percentage', `${activeStudent.overallPercentage}%`],
      ['Overall Grade', activeStudent.overallGrade],
      ['Performance Status', activeStudent.performanceStatus],
      ['Attendance', `${activeStudent.daysPresent}/${activeStudent.totalWorkingDays} (${activeStudent.attendancePercentage}%)`],
      ['Previous Exam %', `${activeStudent.previousExamPercentage}%`],
      [],
      ['Subject', 'Marks Obtained', 'Maximum Marks', 'Percentage', 'Grade', 'Status'],
      ...activeStudent.subjects.map((sub) => [
        sub.name,
        sub.marksObtained.toString(),
        sub.maxMarks.toString(),
        `${sub.percentage}%`,
        sub.grade,
        sub.status,
      ]),
      [],
      ['Teacher Remarks', analysis.overallSummary],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map(val => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Academic_Report_${activeStudent.name.replace(/\s+/g, '_')}_${activeStudent.rollNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Toolbar (Hidden on print) */}
      <div className="print:hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Select Student Report:
          </label>
          <select
            value={activeStudent.id}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              const found = students.find((s) => s.id === e.target.value);
              if (found) onSelectStudent(found);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.rollNumber} - {st.class} {st.section})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download CSV Data
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report Card
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div id="printable-report" className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm text-slate-800 space-y-8 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
        
        {/* Institutional Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  Student Performance Analysis System
                </h1>
                <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                  Official Academic Assessment & Progress Report
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 font-medium">
              <div>Session: <strong className="text-slate-900">{activeStudent.academicYear}</strong></div>
              <div>Issue Date: <strong className="text-slate-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></div>
            </div>
          </div>
        </div>

        {/* 1. Student Details Grid */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-500 text-[11px] mb-3">
            Student Identification Profile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{activeStudent.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Roll / ID Number</span>
              <span className="font-mono font-bold text-slate-900">{activeStudent.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Class & Section</span>
              <span className="font-bold text-slate-900">{activeStudent.class} - {activeStudent.section}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Year</span>
              <span className="font-bold text-slate-900">{activeStudent.academicYear}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Parent / Guardian</span>
              <span className="font-bold text-slate-900">{activeStudent.parentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth</span>
              <span className="font-medium text-slate-800">{activeStudent.dateOfBirth || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender</span>
              <span className="font-medium text-slate-800">{activeStudent.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendance Record</span>
              <span className="font-bold text-slate-900">
                {activeStudent.attendancePercentage}% ({activeStudent.daysPresent}/{activeStudent.totalWorkingDays})
              </span>
            </div>
          </div>
        </div>

        {/* 2. Key Academic Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Total Score</span>
            <span className="text-xl font-black text-slate-900">{activeStudent.totalMarks}</span>
            <span className="text-[10px] text-slate-400 block">out of {activeStudent.totalMaxMarks}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Overall Percentage</span>
            <span className="text-xl font-black text-blue-600">{activeStudent.overallPercentage}%</span>
            <span className="text-[10px] text-slate-400 block">Terminal Exam</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Final Letter Grade</span>
            <span className="text-xl font-black text-emerald-600">{activeStudent.overallGrade}</span>
            <span className="text-[10px] text-slate-400 block">Grading Scale</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Academic Status</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">{activeStudent.performanceStatus}</span>
            <span className="text-[10px] text-slate-400 block">Standing</span>
          </div>
        </div>

        {/* 3. Subject-wise Performance Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Subject-wise Marks & Evaluation
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Subject Name</th>
                <th className="py-2.5 px-4 text-center">Marks Obtained</th>
                <th className="py-2.5 px-4 text-center">Max Marks</th>
                <th className="py-2.5 px-4 text-center">Percentage</th>
                <th className="py-2.5 px-4 text-center">Grade</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeStudent.subjects.map((sub, i) => (
                <tr key={sub.id || i} className="even:bg-slate-50/50">
                  <td className="py-2 px-4 font-bold text-slate-900">{sub.name}</td>
                  <td className="py-2 px-4 text-center font-mono font-bold text-slate-800">{sub.marksObtained}</td>
                  <td className="py-2 px-4 text-center font-mono text-slate-500">{sub.maxMarks}</td>
                  <td className="py-2 px-4 text-center font-mono font-bold text-slate-900">{sub.percentage}%</td>
                  <td className="py-2 px-4 text-center font-bold text-blue-700">{sub.grade}</td>
                  <td className="py-2 px-4 text-right font-medium text-slate-700">{sub.status}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100/80 font-bold border-t border-slate-200 text-[11px]">
              <tr>
                <td className="py-2.5 px-4">Aggregate Total</td>
                <td className="py-2.5 px-4 text-center font-mono">{activeStudent.totalMarks}</td>
                <td className="py-2.5 px-4 text-center font-mono">{activeStudent.totalMaxMarks}</td>
                <td className="py-2.5 px-4 text-center font-mono text-blue-700">{activeStudent.overallPercentage}%</td>
                <td className="py-2.5 px-4 text-center text-emerald-700">{activeStudent.overallGrade}</td>
                <td className="py-2.5 px-4 text-right">{activeStudent.performanceStatus}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 4. Strengths & Weaknesses (AI Analytics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
            <h4 className="font-bold text-emerald-900 uppercase text-[11px] flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Academic Strengths
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
              {analysis.strongestSubjects.map((s, idx) => (
                <li key={idx}>
                  <strong>{s.name} ({s.percentage}%):</strong> {s.reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5">
            <h4 className="font-bold text-amber-900 uppercase text-[11px] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Areas Requiring Reinforcement
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
              {analysis.weakestSubjects.map((s, idx) => (
                <li key={idx}>
                  <strong>{s.name} ({s.percentage}%):</strong> {s.reason}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. Teacher Summary & Academic Evaluation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <h4 className="font-bold text-slate-900 uppercase text-[11px]">
            Comprehensive Academic Diagnostic Evaluation
          </h4>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            {analysis.overallSummary}
          </p>
          <div className="pt-2 text-[11px] text-slate-600 flex items-center gap-4">
            <span><strong>Previous Exam Benchmark:</strong> {activeStudent.previousExamPercentage}%</span>
            <span><strong>Current Exam:</strong> {activeStudent.overallPercentage}%</span>
            <span>
              <strong>Growth Delta:</strong>{' '}
              {analysis.examComparison.improvementPercentage >= 0 ? '+' : ''}
              {analysis.examComparison.improvementPercentage}%
            </span>
          </div>
        </div>

        {/* 6. Improvement Plan Summary */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 text-xs space-y-2">
          <h4 className="font-bold text-blue-900 uppercase text-[11px]">
            Personalized Study Plan & Action Items
          </h4>
          <p className="text-slate-700 text-[11px]">
            {analysis.personalizedPlan.dailyStudyRecommendation}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
            <div>
              <strong>Target Revision Strategy:</strong> {analysis.personalizedPlan.revisionStrategy}
            </div>
            <div>
              <strong>Exam Preparation Focus:</strong> {analysis.personalizedPlan.testPreparationPlan}
            </div>
          </div>
        </div>

        {/* 7. Institutional Signatures Block */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-8">
            <div className="h-10"></div>
            <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
              Class Teacher Signature
            </div>
          </div>

          <div className="space-y-8">
            <div className="h-10"></div>
            <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
              Parent / Guardian Signature
            </div>
          </div>

          <div className="space-y-8">
            <div className="h-10"></div>
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
              Principal / Head of School
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
