export interface SubjectScore {
  id: string;
  name: string;
  maxMarks: number;
  marksObtained: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'Needs Improvement';
  status: 'Strong' | 'Good' | 'Average' | 'Needs Improvement';
}

export type GradeType = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'Needs Improvement';

export type PerformanceStatus = 'Outstanding' | 'Good' | 'Average' | 'Needs Improvement';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  academicYear: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  parentName: string;
  parentContact?: string;
  
  // Attendance
  totalWorkingDays: number;
  daysPresent: number;
  attendancePercentage: number;
  
  // Subjects
  subjects: SubjectScore[];
  
  // Additional Performance Metrics
  assignmentPerformance: number; // 0-100%
  classTestPerformance: number; // 0-100%
  previousExamPercentage: number; // 0-100%
  
  // Calculated Metrics
  totalMarks: number;
  totalMaxMarks: number;
  overallPercentage: number;
  averageSubjectMarks: number;
  overallGrade: GradeType;
  performanceStatus: PerformanceStatus;
  
  createdAt: string;
  updatedAt: string;
}

export interface ClassStatistics {
  totalStudents: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  averageAttendance: number;
  studentsAbove90: number;
  students60To89: number;
  studentsBelow60: number;
  gradeDistribution: Record<GradeType, number>;
  topPerformers: Student[];
  studentsNeedingImprovement: Student[];
  subjectAverages: {
    subject: string;
    averagePercentage: number;
    highestScore: number;
    lowestScore: number;
    studentCount: number;
  }[];
}

export interface AIAnalysisResult {
  overallSummary: string;
  strongestSubjects: { name: string; percentage: number; reason: string }[];
  weakestSubjects: { name: string; percentage: number; reason: string }[];
  subjectsRequiringAttention: { name: string; percentage: number; urgency: 'High' | 'Medium' | 'Low'; advice: string }[];
  attendanceAnalysis: {
    status: 'Exemplary' | 'Satisfactory' | 'Critical Shortage';
    percentage: number;
    narrative: string;
    impactOnAcademics: string;
  };
  examComparison: {
    previousPercentage: number;
    currentPercentage: number;
    improvementPercentage: number;
    differenceInMarks: number;
    trend: 'Significant Improvement' | 'Moderate Improvement' | 'Steady' | 'Decline';
    improvingSubjects: string[];
    decliningSubjects: string[];
    narrative: string;
  };
  decliningPerformanceAreas: string[];
  studyRecommendations: string[];
  personalizedPlan: {
    prioritySubjects: { subject: string; currentScore: number; reason: string; dailyTime: string }[];
    dailyStudyRecommendation: string;
    weeklyTargets: string[];
    revisionStrategy: string;
    practiceRecommendations: string[];
    testPreparationPlan: string;
  };
}
