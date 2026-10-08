import { Student, SubjectScore, GradeType, PerformanceStatus, ClassStatistics } from '../types/student';

/**
 * Calculates grade based on the required grading system:
 * 90-100 = A+
 * 80-89 = A
 * 70-79 = B+
 * 60-69 = B
 * 50-59 = C
 * 40-49 = D
 * Below 40 = Needs Improvement
 */
export function calculateGrade(percentage: number): GradeType {
  const rounded = Math.round(percentage * 10) / 10;
  if (rounded >= 90) return 'A+';
  if (rounded >= 80) return 'A';
  if (rounded >= 70) return 'B+';
  if (rounded >= 60) return 'B';
  if (rounded >= 50) return 'C';
  if (rounded >= 40) return 'D';
  return 'Needs Improvement';
}

/**
 * Calculates subject status based on percentage:
 * >= 80: Strong
 * 70-79: Good
 * 50-69: Average
 * < 50: Needs Improvement
 */
export function calculateSubjectStatus(percentage: number): 'Strong' | 'Good' | 'Average' | 'Needs Improvement' {
  if (percentage >= 80) return 'Strong';
  if (percentage >= 70) return 'Good';
  if (percentage >= 50) return 'Average';
  return 'Needs Improvement';
}

/**
 * Calculates overall performance status
 */
export function calculatePerformanceStatus(percentage: number): PerformanceStatus {
  if (percentage >= 85) return 'Outstanding';
  if (percentage >= 70) return 'Good';
  if (percentage >= 50) return 'Average';
  return 'Needs Improvement';
}

/**
 * Computes individual subject percentage, grade and status
 */
export function computeSubject(
  id: string,
  name: string,
  maxMarks: number,
  marksObtained: number
): SubjectScore {
  const validMax = Math.max(1, maxMarks || 100);
  const validObtained = Math.max(0, Math.min(validMax, marksObtained || 0));
  const percentage = Math.round(((validObtained / validMax) * 100) * 10) / 10;
  
  return {
    id,
    name: name.trim() || 'Untitled Subject',
    maxMarks: validMax,
    marksObtained: validObtained,
    percentage,
    grade: calculateGrade(percentage),
    status: calculateSubjectStatus(percentage)
  };
}

/**
 * Recalculates all derived metrics for a student
 */
export function computeStudentMetrics(
  studentData: Omit<Student, 'totalMarks' | 'totalMaxMarks' | 'overallPercentage' | 'averageSubjectMarks' | 'overallGrade' | 'performanceStatus' | 'attendancePercentage'> & {
    attendancePercentage?: number;
    totalMarks?: number;
    totalMaxMarks?: number;
    overallPercentage?: number;
    averageSubjectMarks?: number;
    overallGrade?: GradeType;
    performanceStatus?: PerformanceStatus;
  }
): Student {
  // Attendance
  const workingDays = Math.max(0, studentData.totalWorkingDays || 0);
  const presentDays = Math.max(0, Math.min(workingDays, studentData.daysPresent || 0));
  const attendancePercentage = workingDays > 0 
    ? Math.round(((presentDays / workingDays) * 100) * 10) / 10 
    : 0;

  // Subjects calculation
  const evaluatedSubjects: SubjectScore[] = (studentData.subjects || []).map((sub, idx) => 
    computeSubject(sub.id || `sub-${idx + 1}`, sub.name, sub.maxMarks, sub.marksObtained)
  );

  let totalMarks = 0;
  let totalMaxMarks = 0;

  evaluatedSubjects.forEach((sub) => {
    totalMarks += sub.marksObtained;
    totalMaxMarks += sub.maxMarks;
  });

  const overallPercentage = totalMaxMarks > 0 
    ? Math.round(((totalMarks / totalMaxMarks) * 100) * 10) / 10 
    : 0;

  const averageSubjectMarks = evaluatedSubjects.length > 0 
    ? Math.round((totalMarks / evaluatedSubjects.length) * 10) / 10 
    : 0;

  const overallGrade = calculateGrade(overallPercentage);
  const performanceStatus = calculatePerformanceStatus(overallPercentage);

  return {
    ...studentData,
    totalWorkingDays: workingDays,
    daysPresent: presentDays,
    attendancePercentage,
    subjects: evaluatedSubjects,
    totalMarks,
    totalMaxMarks,
    overallPercentage,
    averageSubjectMarks,
    overallGrade,
    performanceStatus,
    assignmentPerformance: Math.max(0, Math.min(100, studentData.assignmentPerformance || 0)),
    classTestPerformance: Math.max(0, Math.min(100, studentData.classTestPerformance || 0)),
    previousExamPercentage: Math.max(0, Math.min(100, studentData.previousExamPercentage || 0)),
  };
}

/**
 * Computes class-wide statistics across all students or a filtered subset
 */
export function calculateClassStatistics(students: Student[]): ClassStatistics {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      averagePercentage: 0,
      highestPercentage: 0,
      lowestPercentage: 0,
      averageAttendance: 0,
      studentsAbove90: 0,
      students60To89: 0,
      studentsBelow60: 0,
      gradeDistribution: {
        'A+': 0,
        'A': 0,
        'B+': 0,
        'B': 0,
        'C': 0,
        'D': 0,
        'Needs Improvement': 0
      },
      topPerformers: [],
      studentsNeedingImprovement: [],
      subjectAverages: []
    };
  }

  const totalStudents = students.length;
  let totalPercentSum = 0;
  let totalAttendanceSum = 0;
  let highestPercentage = -1;
  let lowestPercentage = 101;
  let studentsAbove90 = 0;
  let students60To89 = 0;
  let studentsBelow60 = 0;

  const gradeDistribution: Record<GradeType, number> = {
    'A+': 0,
    'A': 0,
    'B+': 0,
    'B': 0,
    'C': 0,
    'D': 0,
    'Needs Improvement': 0
  };

  const subjectMap = new Map<string, { totalScore: number; maxScore: number; count: number; highest: number; lowest: number }>();

  students.forEach((st) => {
    totalPercentSum += st.overallPercentage;
    totalAttendanceSum += st.attendancePercentage;

    if (st.overallPercentage > highestPercentage) highestPercentage = st.overallPercentage;
    if (st.overallPercentage < lowestPercentage) lowestPercentage = st.overallPercentage;

    if (st.overallPercentage >= 90) studentsAbove90++;
    else if (st.overallPercentage >= 60) students60To89++;
    else studentsBelow60++;

    if (gradeDistribution[st.overallGrade] !== undefined) {
      gradeDistribution[st.overallGrade]++;
    }

    // Accumulate subject scores
    st.subjects.forEach((sub) => {
      const normName = sub.name.trim();
      if (!normName) return;
      const current = subjectMap.get(normName) || {
        totalScore: 0,
        maxScore: 0,
        count: 0,
        highest: -1,
        lowest: 1000
      };

      current.totalScore += sub.marksObtained;
      current.maxScore += sub.maxMarks;
      current.count += 1;
      if (sub.percentage > current.highest) current.highest = sub.percentage;
      if (sub.percentage < current.lowest) current.lowest = sub.percentage;

      subjectMap.set(normName, current);
    });
  });

  const subjectAverages = Array.from(subjectMap.entries()).map(([name, data]) => ({
    subject: name,
    averagePercentage: data.maxScore > 0 ? Math.round(((data.totalScore / data.maxScore) * 100) * 10) / 10 : 0,
    highestScore: data.highest === -1 ? 0 : data.highest,
    lowestScore: data.lowest === 1000 ? 0 : data.lowest,
    studentCount: data.count
  })).sort((a, b) => b.averagePercentage - a.averagePercentage);

  // Top performers (sorted by percentage desc)
  const topPerformers = [...students]
    .sort((a, b) => b.overallPercentage - a.overallPercentage)
    .slice(0, 5);

  // Students needing improvement (percentage < 50 or overallGrade D / Needs Improvement or low attendance)
  const studentsNeedingImprovement = students
    .filter((st) => st.overallPercentage < 50 || st.overallGrade === 'Needs Improvement' || st.attendancePercentage < 75)
    .sort((a, b) => a.overallPercentage - b.overallPercentage);

  return {
    totalStudents,
    averagePercentage: Math.round((totalPercentSum / totalStudents) * 10) / 10,
    highestPercentage: Math.max(0, highestPercentage),
    lowestPercentage: lowestPercentage === 101 ? 0 : lowestPercentage,
    averageAttendance: Math.round((totalAttendanceSum / totalStudents) * 10) / 10,
    studentsAbove90,
    students60To89,
    studentsBelow60,
    gradeDistribution,
    topPerformers,
    studentsNeedingImprovement,
    subjectAverages
  };
}
