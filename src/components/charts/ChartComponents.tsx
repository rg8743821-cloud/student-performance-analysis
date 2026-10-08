import React, { useState } from 'react';
import { SubjectScore } from '../../types/student';

// Color helper for percentages
export function getScoreColor(percentage: number): {
  bg: string;
  fill: string;
  text: string;
  border: string;
  badge: string;
} {
  if (percentage >= 90) {
    return {
      bg: 'bg-emerald-50 text-emerald-700',
      fill: '#10b981',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800'
    };
  }
  if (percentage >= 80) {
    return {
      bg: 'bg-blue-50 text-blue-700',
      fill: '#2563eb',
      text: 'text-blue-700',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800'
    };
  }
  if (percentage >= 70) {
    return {
      bg: 'bg-cyan-50 text-cyan-700',
      fill: '#0891b2',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-800'
    };
  }
  if (percentage >= 60) {
    return {
      bg: 'bg-amber-50 text-amber-700',
      fill: '#d97706',
      text: 'text-amber-700',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800'
    };
  }
  if (percentage >= 50) {
    return {
      bg: 'bg-orange-50 text-orange-700',
      fill: '#ea580c',
      text: 'text-orange-700',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800'
    };
  }
  return {
    bg: 'bg-rose-50 text-rose-700',
    fill: '#e11d48',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800'
  };
}

/**
 * 1. Subject-wise Marks Bar Chart (Marks Obtained vs Maximum Marks)
 */
export const SubjectMarksBarChart: React.FC<{ subjects: SubjectScore[] }> = ({ subjects }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!subjects || subjects.length === 0) {
    return <div className="text-slate-400 py-10 text-center text-sm">No subjects recorded</div>;
  }

  const chartHeight = 220;
  const maxScale = Math.max(...subjects.map((s) => s.maxMarks), 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-800">Subject-wise Marks vs Maximum</h4>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block"></span> Marks Obtained
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-200 inline-block"></span> Max Marks
          </span>
        </div>
      </div>

      <div className="relative pt-6">
        {/* SVG Chart */}
        <div className="h-56 flex items-end justify-between gap-3 px-2 border-b border-slate-200 pb-2">
          {subjects.map((sub, idx) => {
            const obtainedHeight = Math.round((sub.marksObtained / maxScale) * (chartHeight - 30));
            const maxHeight = Math.round((sub.maxMarks / maxScale) * (chartHeight - 30));
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={sub.id || idx}
                className="flex-1 flex flex-col items-center group relative cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none transform -translate-x-1/2 left-1/2">
                    <p className="font-semibold">{sub.name}</p>
                    <p className="text-slate-300">
                      Score: <span className="text-white font-bold">{sub.marksObtained}</span> / {sub.maxMarks} ({sub.percentage}%)
                    </p>
                  </div>
                )}

                {/* Bars Container */}
                <div className="w-full max-w-[48px] flex items-end justify-center relative" style={{ height: `${chartHeight - 30}px` }}>
                  {/* Background Max Bar */}
                  <div
                    className="absolute w-full rounded-t bg-slate-100 transition-all"
                    style={{ height: `${maxHeight}px` }}
                  />
                  {/* Obtained Bar */}
                  <div
                    className={`relative w-full rounded-t transition-all duration-300 ${
                      isHovered ? 'bg-blue-700 shadow-md' : 'bg-blue-600'
                    }`}
                    style={{ height: `${obtainedHeight}px` }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-bold text-slate-700 group-hover:text-blue-700">
                      {sub.marksObtained}
                    </span>
                  </div>
                </div>

                {/* Subject Name Label */}
                <div className="mt-2 text-center w-full">
                  <span
                    className="text-[11px] font-medium text-slate-600 block truncate"
                    title={sub.name}
                  >
                    {sub.name.length > 9 ? `${sub.name.slice(0, 8)}…` : sub.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    /{sub.maxMarks}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Subject-wise Percentage Chart
 */
export const SubjectPercentageChart: React.FC<{ subjects: SubjectScore[] }> = ({ subjects }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-800">Subject-wise Percentage Analysis</h4>
        <span className="text-xs text-slate-500 font-medium">Benchmark: 40% Pass | 80% Distinction</span>
      </div>

      <div className="space-y-3.5">
        {subjects.map((sub) => {
          const color = getScoreColor(sub.percentage);
          return (
            <div key={sub.id || sub.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 truncate max-w-[180px]">{sub.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${color.badge}`}>
                    {sub.grade} • {sub.status}
                  </span>
                  <span className="font-bold text-slate-800 w-12 text-right">{sub.percentage}%</span>
                </div>
              </div>
              
              {/* Progress bar with benchmark line at 40% and 80% */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                {/* 40% threshold marker */}
                <div className="absolute top-0 bottom-0 left-[40%] w-[1px] bg-slate-300 z-10" />
                {/* 80% threshold marker */}
                <div className="absolute top-0 bottom-0 left-[80%] w-[1px] bg-slate-300 z-10" />
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, Math.max(0, sub.percentage))}%`,
                    backgroundColor: color.fill
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 3. Attendance Chart (Radial Gauge + Breakdown)
 */
export const AttendanceChart: React.FC<{
  daysPresent: number;
  totalWorkingDays: number;
  attendancePercentage: number;
}> = ({ daysPresent, totalWorkingDays, attendancePercentage }) => {
  const absentDays = Math.max(0, totalWorkingDays - daysPresent);
  
  // Radial calculations
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, attendancePercentage) / 100) * circumference;

  let statusColor = '#10b981'; // emerald
  let statusBadge = 'bg-emerald-100 text-emerald-800';
  let statusLabel = 'Exemplary Regularity';

  if (attendancePercentage < 75) {
    statusColor = '#e11d48'; // red
    statusBadge = 'bg-rose-100 text-rose-800';
    statusLabel = 'Attendance Shortage';
  } else if (attendancePercentage < 85) {
    statusColor = '#d97706'; // amber
    statusBadge = 'bg-amber-100 text-amber-800';
    statusLabel = 'Satisfactory';
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-800">Attendance Overview</h4>
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusBadge}`}>
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Radial SVG Gauge */}
        <div className="flex flex-col items-center justify-center relative py-2">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 150 150">
            {/* Background track */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Value stroke */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke={statusColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-800">{attendancePercentage}%</span>
            <span className="text-[11px] font-medium text-slate-500">Attendance</span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="space-y-3">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-medium text-slate-600">Days Present</span>
            </div>
            <span className="text-sm font-bold text-slate-800">{daysPresent} Days</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-xs font-medium text-slate-600">Days Absent</span>
            </div>
            <span className="text-sm font-bold text-slate-800">{absentDays} Days</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-xs font-medium text-slate-600">Total Working Days</span>
            </div>
            <span className="text-sm font-bold text-slate-800">{totalWorkingDays} Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. Previous Exam vs Current Exam Comparison Chart
 */
export const ExamComparisonChart: React.FC<{
  previousPercentage: number;
  currentPercentage: number;
}> = ({ previousPercentage, currentPercentage }) => {
  const diff = Math.round((currentPercentage - previousPercentage) * 10) / 10;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-800">Exam Comparison (Term Over Term)</h4>
        <div
          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isPositive
              ? 'bg-emerald-100 text-emerald-800'
              : isNeutral
              ? 'bg-slate-100 text-slate-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {isPositive ? '▲ +' : isNeutral ? '● ' : '▼ '}
          {diff}% {isPositive ? 'Improvement' : isNeutral ? 'Unchanged' : 'Decline'}
        </div>
      </div>

      <div className="pt-2 pb-4">
        {/* Comparison bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-500">Previous Exam Result</span>
              <span className="font-bold text-slate-700">{previousPercentage}%</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, previousPercentage))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-blue-900">Current Exam Result</span>
              <span className="font-black text-blue-600 text-sm">{currentPercentage}%</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isPositive ? 'bg-emerald-500' : isNeutral ? 'bg-blue-600' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, currentPercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Delta Callout Box */}
        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
          <span className="text-slate-600">Net Academic Progression</span>
          <span className="font-mono font-bold text-slate-800">
            {previousPercentage}% → {currentPercentage}% ({diff > 0 ? `+${diff}%` : `${diff}%`})
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 5. Overall Multi-Metric Performance Chart
 */
export const OverallPerformanceChart: React.FC<{
  overallPercentage: number;
  assignmentPerformance: number;
  classTestPerformance: number;
  attendancePercentage: number;
}> = ({
  overallPercentage,
  assignmentPerformance,
  classTestPerformance,
  attendancePercentage
}) => {
  const metrics = [
    { label: 'Terminal Exam', value: overallPercentage, color: '#2563eb' },
    { label: 'Assignments', value: assignmentPerformance, color: '#0891b2' },
    { label: 'Class Tests', value: classTestPerformance, color: '#8b5cf6' },
    { label: 'Attendance', value: attendancePercentage, color: '#10b981' }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-800">Overall Holistic Metrics</h4>
        <span className="text-xs text-slate-500 font-medium">Exams & Continual Assessment</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center text-center shadow-xs"
          >
            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="24" stroke="#f1f5f9" strokeWidth="5" fill="transparent" />
                <circle
                  cx="30"
                  cy="30"
                  r="24"
                  stroke={m.color}
                  strokeWidth="5"
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 - (Math.min(100, m.value) / 100) * (2 * Math.PI * 24)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute font-bold text-xs text-slate-800">{m.value}%</span>
            </div>
            <span className="text-xs font-semibold text-slate-700">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 6. Class Grade Distribution Chart
 */
export const ClassGradeDistributionChart: React.FC<{
  distribution: Record<string, number>;
  totalStudents: number;
}> = ({ distribution, totalStudents }) => {
  const grades = ['A+', 'A', 'B+', 'B', 'C', 'D', 'Needs Improvement'];
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-800">Grade Distribution Breakdown</h4>
        <span className="text-xs text-slate-500 font-medium">{totalStudents} Total Enrolled</span>
      </div>

      <div className="space-y-2 pt-1">
        {grades.map((grade) => {
          const count = distribution[grade] || 0;
          const pctOfClass = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
          const barWidth = Math.round((count / maxCount) * 100);

          let barColor = 'bg-blue-600';
          if (grade === 'A+' || grade === 'A') barColor = 'bg-emerald-600';
          else if (grade === 'B+' || grade === 'B') barColor = 'bg-blue-600';
          else if (grade === 'C') barColor = 'bg-amber-500';
          else if (grade === 'D') barColor = 'bg-orange-500';
          else barColor = 'bg-rose-600';

          return (
            <div key={grade} className="flex items-center gap-3 text-xs">
              <span className="w-28 font-medium text-slate-700 truncate">{grade}</span>
              <div className="flex-1 h-3.5 bg-slate-100 rounded-sm overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-sm transition-all duration-500`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className="w-16 text-right font-mono text-slate-600 font-semibold">
                {count} <span className="text-slate-400 font-normal">({pctOfClass}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 7. Performance Range Distribution Chart (Requirement 2: 90-100%, 80-89%, 70-79%, 60-69%, Below 60%)
 */
export const PerformanceRangeDistributionChart: React.FC<{
  ranges: {
    range90To100: number;
    range80To89: number;
    range70To79: number;
    range60To69: number;
    below60: number;
  };
  totalStudents: number;
}> = ({ ranges, totalStudents }) => {
  const items = [
    { label: '90% to 100%', count: ranges.range90To100, color: 'bg-emerald-600', fill: '#059669', badge: 'bg-emerald-100 text-emerald-800' },
    { label: '80% to 89%', count: ranges.range80To89, color: 'bg-blue-600', fill: '#2563eb', badge: 'bg-blue-100 text-blue-800' },
    { label: '70% to 79%', count: ranges.range70To79, color: 'bg-cyan-600', fill: '#0891b2', badge: 'bg-cyan-100 text-cyan-800' },
    { label: '60% to 69%', count: ranges.range60To69, color: 'bg-amber-500', fill: '#f59e0b', badge: 'bg-amber-100 text-amber-800' },
    { label: 'Below 60%', count: ranges.below60, color: 'bg-rose-600', fill: '#e11d48', badge: 'bg-rose-100 text-rose-800' },
  ];

  const maxCount = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Academic Performance Distribution</h4>
          <p className="text-xs text-slate-500">Student cohort breakdown by percentage brackets</p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
          {totalStudents} Students
        </span>
      </div>

      <div className="space-y-3.5 pt-1">
        {items.map((item) => {
          const pctOfTotal = totalStudents > 0 ? Math.round((item.count / totalStudents) * 100) : 0;
          const barWidth = Math.round((item.count / maxCount) * 100);

          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.badge}`}>
                    {item.count} {item.count === 1 ? 'Student' : 'Students'}
                  </span>
                  <span className="font-mono font-bold text-slate-800 w-10 text-right">
                    {pctOfTotal}%
                  </span>
                </div>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 8. Subject Averages Bar Chart (Requirement 5)
 */
export const SubjectAveragesBarChart: React.FC<{
  subjects: {
    subject: string;
    averagePercentage: number;
    studentCount: number;
    highestScore: number;
    lowestScore: number;
  }[];
}> = ({ subjects }) => {
  if (subjects.length === 0) {
    return <div className="text-slate-400 py-8 text-center text-xs">No subject records available</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Subject Averages Comparison</h4>
          <p className="text-xs text-slate-500">Benchmark across all curriculum subjects</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Class Average %
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {subjects.map((sub, idx) => {
          const color = getScoreColor(sub.averagePercentage);
          return (
            <div
              key={sub.subject}
              className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors space-y-2"
              title={`${sub.subject} - High: ${sub.highestScore}, Low: ${sub.lowestScore}, Class Average: ${sub.averagePercentage}%`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                {/* Subject Name with ranking */}
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-200/80 text-slate-600 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {sub.subject}
                  </span>
                </div>

                {/* Score Metrics clearly separated: High/Low marks (numbers only) & Class Average (percentage) */}
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">
                    High: <strong className="text-emerald-700 font-bold">{sub.highestScore}</strong> • Low: <strong className="text-rose-600 font-bold">{sub.lowestScore}</strong>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 whitespace-nowrap">
                    Class Average: {sub.averagePercentage}%
                  </span>
                </div>
              </div>

              {/* Visual Benchmark Bar with 60% Passing benchmark marker */}
              <div className="h-3 w-full bg-slate-200/80 rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 bottom-0 left-[60%] w-[1.5px] bg-slate-400 z-10"
                  title="Passing Benchmark (60%)"
                />
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, Math.max(0, sub.averagePercentage))}%`,
                    backgroundColor: color.fill,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 9. Class Attendance Visualization (Requirement 6)
 */
export const ClassAttendanceVisualization: React.FC<{
  averageAttendance: number;
  highestAttendance: number;
  lowestAttendance: number;
  below75Count: number;
  totalStudents: number;
}> = ({
  averageAttendance,
  highestAttendance,
  lowestAttendance,
  below75Count,
  totalStudents,
}) => {
  const satisfactoryCount = Math.max(0, totalStudents - below75Count);
  const satisfactoryPct = totalStudents > 0 ? Math.round((satisfactoryCount / totalStudents) * 100) : 0;
  const below75Pct = totalStudents > 0 ? Math.round((below75Count / totalStudents) * 100) : 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Class Attendance Overview & Regularity</h4>
          <p className="text-xs text-slate-500">Analysis against institutional 75% attendance threshold</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          averageAttendance >= 85
            ? 'bg-emerald-100 text-emerald-800'
            : averageAttendance >= 75
            ? 'bg-blue-100 text-blue-800'
            : 'bg-rose-100 text-rose-800'
        }`}>
          Avg: {averageAttendance}%
        </span>
      </div>

      {/* Progress visual representation */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Attendance Distribution Ratio</span>
          <span className="font-mono text-slate-500 text-[11px]">
            {satisfactoryCount} Regular / {below75Count} At-Risk
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${satisfactoryPct}%` }}
            title={`Satisfactory (≥75%): ${satisfactoryCount} students (${satisfactoryPct}%)`}
          />
          <div
            className="h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${below75Pct}%` }}
            title={`Below 75%: ${below75Count} students (${below75Pct}%)`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Regular Attendance (≥75%): <strong className="text-slate-800">{satisfactoryPct}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Critical Shortage (&lt;75%): <strong className="text-rose-600">{below75Pct}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

