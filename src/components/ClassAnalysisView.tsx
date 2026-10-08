import React, { useState, useMemo } from 'react';
import { Student } from '../types/student';
import {
  Users,
  Award,
  TrendingUp,
  Clock,
  BookOpen,
  Filter,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Sparkles,
  HelpCircle,
  FileQuestion,
  RotateCcw
} from 'lucide-react';
import {
  PerformanceRangeDistributionChart,
  SubjectAveragesBarChart,
  ClassAttendanceVisualization,
  getScoreColor
} from './charts/ChartComponents';

interface ClassAnalysisViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const ClassAnalysisView: React.FC<ClassAnalysisViewProps> = ({
  students,
  onSelectStudent,
}) => {
  // Filters: Academic Year, Class, Section (Requirement 8)
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  // Dynamic filter options extracted from actual student records
  const academicYears = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.academicYear && set.add(s.academicYear));
    return Array.from(set).sort();
  }, [students]);

  const classesList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.class && set.add(s.class));
    return Array.from(set).sort();
  }, [students]);

  const sectionsList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.section && set.add(s.section));
    return Array.from(set).sort();
  }, [students]);

  // Filtered subset of real student records
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedYear !== 'all' && s.academicYear !== selectedYear) return false;
      if (selectedClass !== 'all' && s.class !== selectedClass) return false;
      if (selectedSection !== 'all' && s.section !== selectedSection) return false;
      return true;
    });
  }, [students, selectedYear, selectedClass, selectedSection]);

  // 1. CLASS OVERVIEW METRICS (Requirement 1)
  const overviewStats = useMemo(() => {
    const totalStudents = filteredStudents.length;
    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        classAverage: 0,
        averageAttendance: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        needingImprovementCount: 0,
      };
    }

    let percentSum = 0;
    let attendanceSum = 0;
    let highest = -1;
    let lowest = 101;
    let needingImpCount = 0;

    filteredStudents.forEach((st) => {
      percentSum += st.overallPercentage;
      attendanceSum += st.attendancePercentage;

      if (st.overallPercentage > highest) highest = st.overallPercentage;
      if (st.overallPercentage < lowest) lowest = st.overallPercentage;

      // Students needing improvement (Requirement 1 & 4: percentage below 60%)
      if (st.overallPercentage < 60) {
        needingImpCount++;
      }
    });

    return {
      totalStudents,
      classAverage: Math.round((percentSum / totalStudents) * 10) / 10,
      averageAttendance: Math.round((attendanceSum / totalStudents) * 10) / 10,
      highestPercentage: highest >= 0 ? highest : 0,
      lowestPercentage: lowest <= 100 ? lowest : 0,
      needingImprovementCount: needingImpCount,
    };
  }, [filteredStudents]);

  // 2. PERFORMANCE DISTRIBUTION (Requirement 2: 90-100%, 80-89%, 70-79%, 60-69%, Below 60%)
  const performanceRanges = useMemo(() => {
    let range90To100 = 0;
    let range80To89 = 0;
    let range70To79 = 0;
    let range60To69 = 0;
    let below60 = 0;

    filteredStudents.forEach((st) => {
      const pct = st.overallPercentage;
      if (pct >= 90) range90To100++;
      else if (pct >= 80) range80To89++;
      else if (pct >= 70) range70To79++;
      else if (pct >= 60) range60To69++;
      else below60++;
    });

    return {
      range90To100,
      range80To89,
      range70To79,
      range60To69,
      below60,
    };
  }, [filteredStudents]);

  // 3. TOP 5 STUDENTS (Requirement 3: sorted highest to lowest)
  const top5Students = useMemo(() => {
    return [...filteredStudents]
      .sort((a, b) => b.overallPercentage - a.overallPercentage)
      .slice(0, 5);
  }, [filteredStudents]);

  // 4. STUDENTS NEEDING IMPROVEMENT (Requirement 4: overall percentage below 60%)
  const studentsNeedingImprovement = useMemo(() => {
    return filteredStudents
      .filter((st) => st.overallPercentage < 60)
      .sort((a, b) => a.overallPercentage - b.overallPercentage);
  }, [filteredStudents]);

  // Helper to find a student's weakest subject
  const getWeakestSubjectInfo = (student: Student) => {
    if (!student.subjects || student.subjects.length === 0) {
      return { name: 'N/A', percentage: 0 };
    }
    const sorted = [...student.subjects].sort((a, b) => a.percentage - b.percentage);
    return {
      name: sorted[0].name,
      percentage: sorted[0].percentage,
    };
  };

  // 5. SUBJECT-WISE CLASS PERFORMANCE (Requirement 5)
  const subjectPerformanceList = useMemo(() => {
    const subjectMap = new Map<
      string,
      {
        totalScore: number;
        totalMax: number;
        count: number;
        highestMarks: number;
        lowestMarks: number;
      }
    >();

    filteredStudents.forEach((st) => {
      st.subjects.forEach((sub) => {
        const name = sub.name.trim();
        if (!name) return;

        const existing = subjectMap.get(name) || {
          totalScore: 0,
          totalMax: 0,
          count: 0,
          highestMarks: -1,
          lowestMarks: 99999,
        };

        existing.totalScore += sub.marksObtained;
        existing.totalMax += sub.maxMarks;
        existing.count += 1;

        if (sub.marksObtained > existing.highestMarks) {
          existing.highestMarks = sub.marksObtained;
        }
        if (sub.marksObtained < existing.lowestMarks) {
          existing.lowestMarks = sub.marksObtained;
        }

        subjectMap.set(name, existing);
      });
    });

    return Array.from(subjectMap.entries())
      .map(([name, data]) => ({
        subject: name,
        studentCount: data.count,
        averagePercentage:
          data.totalMax > 0
            ? Math.round(((data.totalScore / data.totalMax) * 100) * 10) / 10
            : 0,
        highestScore: data.highestMarks >= 0 ? data.highestMarks : 0,
        lowestScore: data.lowestMarks <= 10000 ? data.lowestMarks : 0,
      }))
      .sort((a, b) => b.averagePercentage - a.averagePercentage);
  }, [filteredStudents]);

  // 6. ATTENDANCE ANALYSIS (Requirement 6)
  const attendanceStats = useMemo(() => {
    if (filteredStudents.length === 0) {
      return {
        classAverageAttendance: 0,
        highestAttendance: 0,
        lowestAttendance: 0,
        below75Count: 0,
      };
    }

    let attSum = 0;
    let highest = -1;
    let lowest = 101;
    let below75 = 0;

    filteredStudents.forEach((st) => {
      attSum += st.attendancePercentage;
      if (st.attendancePercentage > highest) highest = st.attendancePercentage;
      if (st.attendancePercentage < lowest) lowest = st.attendancePercentage;
      if (st.attendancePercentage < 75) below75++;
    });

    return {
      classAverageAttendance: Math.round((attSum / filteredStudents.length) * 10) / 10,
      highestAttendance: highest >= 0 ? highest : 0,
      lowestAttendance: lowest <= 100 ? lowest : 0,
      below75Count: below75,
    };
  }, [filteredStudents]);

  // 7. CLASS PERFORMANCE INSIGHTS (Requirement 7)
  const insights = useMemo(() => {
    if (filteredStudents.length === 0) return null;

    const strongestSub = subjectPerformanceList.length > 0 ? subjectPerformanceList[0] : null;
    const weakestSub =
      subjectPerformanceList.length > 0
        ? subjectPerformanceList[subjectPerformanceList.length - 1]
        : null;

    const highPerformersCount = filteredStudents.filter(
      (s) => s.overallPercentage >= 80
    ).length;

    return {
      overallPerformance: `The evaluated cohort of ${filteredStudents.length} students is achieving an overall class average of ${overviewStats.classAverage}%, with percentages ranging from ${overviewStats.lowestPercentage}% to a cohort high of ${overviewStats.highestPercentage}%.`,
      strongestSubject: strongestSub
        ? `${strongestSub.subject} demonstrates the highest academic mastery with a class average of ${strongestSub.averagePercentage}% (recorded peak score: ${strongestSub.highestScore} marks).`
        : 'Sufficient subject score data is not yet recorded.',
      weakestSubject: weakestSub
        ? `${weakestSub.subject} is currently the lowest-scoring subject across the cohort with an average of ${weakestSub.averagePercentage}%, indicating an area where curriculum reinforcement and revision drills will yield high impact.`
        : 'Sufficient subject score data is not yet recorded.',
      attendanceObservation:
        attendanceStats.below75Count === 0
          ? `Class attendance is strong at an average of ${attendanceStats.classAverageAttendance}%. All enrolled students meet or exceed the mandatory 75% institutional attendance requirement.`
          : `Class attendance averages ${attendanceStats.classAverageAttendance}%. However, ${attendanceStats.below75Count} ${
              attendanceStats.below75Count === 1 ? 'student falls' : 'students fall'
            } below the mandatory 75% threshold, requiring prompt parent contact to prevent learning disruption.`,
      highPerformingStudents: `${highPerformersCount} ${
        highPerformersCount === 1 ? 'student is' : 'students are'
      } performing at high distinction levels (80% and above, Grade A/A+).`,
      studentsNeedingImprovement: `${overviewStats.needingImprovementCount} ${
        overviewStats.needingImprovementCount === 1 ? 'student is' : 'students are'
      } currently scoring below 60% and require targeted academic assistance.`,
    };
  }, [filteredStudents, overviewStats, subjectPerformanceList, attendanceStats]);

  const handleResetFilters = () => {
    setSelectedYear('all');
    setSelectedClass('all');
    setSelectedSection('all');
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
      
      {/* Page Header & Filter Controls (Requirement 8) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-xl font-bold text-slate-900">Class Performance Analysis</h2>
          </div>
          <p className="text-xs text-slate-500">
            Comprehensive institutional cohort analytics, subject difficulty ranking, attendance tracking and student alerts.
          </p>
        </div>

        {/* 3 Working Filters: Academic Year, Class, Section (Requirement 8) */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          
          {/* Academic Year Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-600">Academic Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Academic Years</option>
              {academicYears.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-600">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Classes</option>
              {classesList.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-600">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Sections</option>
              {sectionsList.map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters Shortcut */}
          {(selectedYear !== 'all' || selectedClass !== 'all' || selectedSection !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>
      </div>

      {/* Requirement 11: Empty state if no matching students after filtering */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No student records available for this selection.
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your Academic Year, Class or Section filters above, or add new students to this cohort.
          </p>
          <div className="pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
            >
              Clear Active Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* FEATURE 1: CLASS OVERVIEW SUMMARY CARDS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                1. Class Performance Overview
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Active Selection: <strong className="text-slate-800">{filteredStudents.length} Students</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              
              {/* Total Students */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Students</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{overviewStats.totalStudents}</div>
                <span className="text-[10px] text-slate-400 mt-1 block">Enrolled in cohort</span>
              </div>

              {/* Class Average Percentage */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Class Average %</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-blue-600">{overviewStats.classAverage}%</div>
                <span className="text-[10px] text-slate-400 mt-1 block">Cohort mean percentage</span>
              </div>

              {/* Average Attendance */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Avg Attendance</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{overviewStats.averageAttendance}%</div>
                <span className="text-[10px] text-slate-400 mt-1 block">Class regularity rate</span>
              </div>

              {/* Highest Student Percentage */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase">Highest Score</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600">{overviewStats.highestPercentage}%</div>
                <span className="text-[10px] text-emerald-700 mt-1 block">Top student mark</span>
              </div>

              {/* Lowest Student Percentage */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-rose-700 uppercase">Lowest Score</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-rose-600">{overviewStats.lowestPercentage}%</div>
                <span className="text-[10px] text-rose-700 mt-1 block">Cohort low mark</span>
              </div>

              {/* Students Needing Improvement */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-amber-700 uppercase">Needs Imp.</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-600">{overviewStats.needingImprovementCount}</div>
                <span className="text-[10px] text-amber-700 mt-1 block">Scoring &lt;60% target</span>
              </div>

            </div>
          </div>

          {/* FEATURE 7: CLASS PERFORMANCE INSIGHTS (Automatic summary from actual student records) */}
          {insights && (
            <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-xs relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Automated Class Performance Insights</h3>
                  <p className="text-xs text-slate-500">
                    Data-driven observations calculated strictly from actual student test records and attendance logs.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Overall performance */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Overall Class Standing
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{insights.overallPerformance}</p>
                </div>

                {/* Strongest & Weakest Subjects */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div>
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Strongest Subject
                    </span>
                    <p className="text-slate-600 text-[11px]">{insights.strongestSubject}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="font-bold text-rose-800 flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Weakest Subject (Attention Needed)
                    </span>
                    <p className="text-slate-600 text-[11px]">{insights.weakestSubject}</p>
                  </div>
                </div>

                {/* Attendance & High Performers Count */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      Attendance Observation
                    </span>
                    <p className="text-slate-600 text-[11px]">{insights.attendanceObservation}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">Top Performers (≥80%):</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {insights.highPerformingStudents.split(' ')[0]} Students
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">Students Below 60%:</span>
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {insights.studentsNeedingImprovement.split(' ')[0]} Students
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GRID: FEATURE 2 (PERFORMANCE DISTRIBUTION) & FEATURE 6 (ATTENDANCE ANALYSIS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* FEATURE 2: PERFORMANCE DISTRIBUTION CHART */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <PerformanceRangeDistributionChart
                ranges={performanceRanges}
                totalStudents={overviewStats.totalStudents}
              />
            </div>

            {/* FEATURE 6: ATTENDANCE ANALYSIS & VISUALIZATION */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <ClassAttendanceVisualization
                averageAttendance={attendanceStats.classAverageAttendance}
                highestAttendance={attendanceStats.highestAttendance}
                lowestAttendance={attendanceStats.lowestAttendance}
                below75Count={attendanceStats.below75Count}
                totalStudents={overviewStats.totalStudents}
              />

              {/* 4 Attendance Stat Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Class Average</span>
                  <span className="text-lg font-black text-slate-900">{attendanceStats.classAverageAttendance}%</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-0.5">Highest Rate</span>
                  <span className="text-lg font-black text-emerald-700">{attendanceStats.highestAttendance}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Lowest Rate</span>
                  <span className="text-lg font-black text-slate-900">{attendanceStats.lowestAttendance}%</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                  <span className="text-[10px] uppercase font-bold text-rose-800 block mb-0.5">&lt;75% Shortage</span>
                  <span className="text-lg font-black text-rose-700">{attendanceStats.below75Count}</span>
                </div>
              </div>
            </div>

          </div>

          {/* GRID: FEATURE 3 (TOP 5 STUDENTS) & FEATURE 4 (STUDENTS NEEDING IMPROVEMENT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* FEATURE 3: TOP 5 STUDENTS TABLE (Requirement 3: Rank, Student Name, Roll Number, Class, Section, Percentage, Grade, Attendance) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Top 5 Performing Students</h3>
                      <p className="text-[11px] text-slate-500">Sorted automatically from highest to lowest percentage</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Honor Roll
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4 text-center">Rank</th>
                        <th className="py-2.5 px-4">Student Name</th>
                        <th className="py-2.5 px-3">Roll No</th>
                        <th className="py-2.5 px-3">Class & Sec</th>
                        <th className="py-2.5 px-3 text-center">Score %</th>
                        <th className="py-2.5 px-3 text-center">Grade</th>
                        <th className="py-2.5 px-4 text-right">Attendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {top5Students.map((st, idx) => (
                        <tr
                          key={st.id}
                          onClick={() => onSelectStudent(st)}
                          className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                          title="Click to view full Performance Profile"
                        >
                          <td className="py-3 px-4 text-center">
                            <span className="w-6 h-6 rounded-full inline-flex items-center justify-center font-mono font-bold text-xs bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              #{idx + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                              {st.name}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                            {st.rollNumber}
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">
                            {st.class}-{st.section}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                            {st.overallPercentage}%
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getGradeBadge(st.overallGrade)}`}>
                              {st.overallGrade}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                            {st.attendancePercentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                Click any student row to inspect their detailed Performance Profile
              </div>
            </div>

            {/* FEATURE 4: STUDENTS NEEDING IMPROVEMENT (Requirement 4: percentage below 60%) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Students Needing Improvement</h3>
                      <p className="text-[11px] text-slate-500">Students scoring below 60% overall</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    {studentsNeedingImprovement.length} Students
                  </span>
                </div>

                {studentsNeedingImprovement.length === 0 ? (
                  <div className="py-12 px-6 text-center text-xs text-slate-500">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="font-bold text-slate-800 text-sm">No students below 60% in this selection!</p>
                    <p className="text-slate-400 text-xs mt-1">All students in this cohort currently achieve 60% or higher.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-2.5 px-4">Student Name</th>
                          <th className="py-2.5 px-3">Roll No</th>
                          <th className="py-2.5 px-3 text-center">Score %</th>
                          <th className="py-2.5 px-3 text-center">Grade</th>
                          <th className="py-2.5 px-3 text-center">Attendance</th>
                          <th className="py-2.5 px-4 text-right">Weakest Subject</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentsNeedingImprovement.map((st) => {
                          const weakest = getWeakestSubjectInfo(st);
                          return (
                            <tr
                              key={st.id}
                              onClick={() => onSelectStudent(st)}
                              className="hover:bg-rose-50/50 transition-colors cursor-pointer group"
                              title="Click to view personalized improvement plan"
                            >
                              <td className="py-3 px-4">
                                <span className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors block">
                                  {st.name}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {st.class}-{st.section}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                                {st.rollNumber}
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-rose-600">
                                {st.overallPercentage}%
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getGradeBadge(st.overallGrade)}`}>
                                  {st.overallGrade}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center font-mono">
                                <span className={st.attendancePercentage < 75 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                                  {st.attendancePercentage}%
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className="inline-block px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                                  {weakest.name} ({weakest.percentage}%)
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                Click any student row to view customized study recommendations & targets
              </div>
            </div>

          </div>

          {/* FEATURE 5: SUBJECT-WISE CLASS PERFORMANCE (Table & Bar Chart) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Subject-wise Class Performance</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {subjectPerformanceList.length} Subjects Evaluated
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Calculated class averages, highest marks, and lowest marks across all subjects in the current cohort.
              </p>
            </div>

            {/* Sub-section: Subject Averages Bar Chart */}
            <div className="pt-2">
              <SubjectAveragesBarChart subjects={subjectPerformanceList} />
            </div>

            {/* Sub-section: Subject Table (Subject, Number of Students, Average Percentage, Highest Marks, Lowest Marks) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden pt-1">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-5">Subject Name</th>
                      <th className="py-3 px-4 text-center">Number of Students</th>
                      <th className="py-3 px-4 text-center">Average Percentage</th>
                      <th className="py-3 px-4 text-center">Highest Marks</th>
                      <th className="py-3 px-5 text-right">Lowest Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {subjectPerformanceList.map((sub) => {
                      const scoreColor = getScoreColor(sub.averagePercentage);
                      return (
                        <tr key={sub.subject} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-slate-900">
                            {sub.subject}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                            {sub.studentCount}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold ${scoreColor.badge}`}>
                              {sub.averagePercentage}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                            {sub.highestScore}
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono font-bold text-rose-600">
                            {sub.lowestScore}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ALL STUDENTS IN COHORT (Clickable to open detailed profile) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">All Students in Filtered Cohort</h3>
                <p className="text-xs text-slate-500">
                  Click any student to open their complete individual Performance Profile and Study Plan.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {filteredStudents.length} Students Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-6">Student</th>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4 text-center">Score %</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Attendance %</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => (
                    <tr
                      key={st.id}
                      onClick={() => onSelectStudent(st)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-6 font-bold text-slate-900 group-hover:text-blue-600">
                        {st.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {st.rollNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {st.class}-{st.section}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                        {st.overallPercentage}%
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-blue-700">
                        {st.overallGrade}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span className={st.attendancePercentage < 75 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                          {st.attendancePercentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {st.performanceStatus}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <span className="text-blue-600 font-semibold text-xs inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Open Profile <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
