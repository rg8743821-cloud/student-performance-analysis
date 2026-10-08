import { Student, AIAnalysisResult, SubjectScore } from '../types/student';

/**
 * Generates comprehensive academic performance analysis and personalized improvement plans
 * based strictly on the student's actual marks, attendance, assignment, and previous exam records.
 */
export function generateAIAnalysis(student: Student): AIAnalysisResult {
  const {
    name,
    overallPercentage,
    overallGrade,
    attendancePercentage,
    subjects,
    previousExamPercentage,
    assignmentPerformance,
    classTestPerformance,
    totalMarks,
    totalMaxMarks
  } = student;

  // 1. Sort subjects by percentage
  const sortedSubjects = [...subjects].sort((a, b) => b.percentage - a.percentage);
  const strongestList = sortedSubjects.filter((s) => s.percentage >= 75);
  const weakestList = sortedSubjects.filter((s) => s.percentage < 60);

  // Strongest subjects breakdown
  const strongestSubjects = (strongestList.length > 0 ? strongestList : sortedSubjects.slice(0, 2)).map((s) => ({
    name: s.name,
    percentage: s.percentage,
    reason: s.percentage >= 90
      ? `Demonstrates mastery (${s.marksObtained}/${s.maxMarks}) with consistent high comprehension.`
      : s.percentage >= 80
      ? `Strong grasp of core curriculum principles with room to reach top tier (A+).`
      : `Solid foundational performance above cohort median.`
  }));

  // Weakest subjects breakdown
  const weakestSubjects = (weakestList.length > 0 ? weakestList : sortedSubjects.slice(-2)).map((s) => ({
    name: s.name,
    percentage: s.percentage,
    reason: s.percentage < 40
      ? `Critically below passing benchmark (${s.marksObtained}/${s.maxMarks}); requires targeted conceptual remediation.`
      : s.percentage < 60
      ? `Moderate conceptual gaps observed; targeted practice sets and question drills will yield quick gains.`
      : `Scoring slightly below student's top subjects; minor adjustments in revision will elevate the score.`
  }));

  // Subjects requiring attention
  const subjectsRequiringAttention = sortedSubjects
    .filter((s) => s.percentage < 70)
    .map((s) => {
      const urgency: 'High' | 'Medium' | 'Low' = s.percentage < 50 ? 'High' : s.percentage < 65 ? 'Medium' : 'Low';
      const advice = s.percentage < 50
        ? `Review fundamental formulas/definitions with teacher, re-attempt textbook chapter exercises.`
        : `Focus on time-bound practice tests and review past mistakes in test questions.`;
      return {
        name: s.name,
        percentage: s.percentage,
        urgency,
        advice
      };
    });

  // If all subjects are >= 70, suggest maintaining excellence in the lowest
  if (subjectsRequiringAttention.length === 0 && sortedSubjects.length > 0) {
    const lowest = sortedSubjects[sortedSubjects.length - 1];
    subjectsRequiringAttention.push({
      name: lowest.name,
      percentage: lowest.percentage,
      urgency: 'Low',
      advice: 'Maintain current steady revision routine and attempt advanced level mock tests.'
    });
  }

  // 2. Attendance Analysis
  let attendanceStatus: 'Exemplary' | 'Satisfactory' | 'Critical Shortage' = 'Satisfactory';
  let attendanceNarrative = '';
  let impactOnAcademics = '';

  if (attendancePercentage >= 90) {
    attendanceStatus = 'Exemplary';
    attendanceNarrative = `${name} has achieved an outstanding ${attendancePercentage}% attendance record (${student.daysPresent} of ${student.totalWorkingDays} days present).`;
    impactOnAcademics = 'Regular classroom engagement strongly correlates with steady concept retention and prompt assignment completion.';
  } else if (attendancePercentage >= 75) {
    attendanceStatus = 'Satisfactory';
    attendanceNarrative = `${name} holds a satisfactory ${attendancePercentage}% attendance record (${student.daysPresent} of ${student.totalWorkingDays} days present).`;
    impactOnAcademics = 'Attendance meets standard school guidelines. Minimizing avoidable absences will further reinforce test performance.';
  } else {
    attendanceStatus = 'Critical Shortage';
    attendanceNarrative = `Warning: ${name}'s attendance is currently at ${attendancePercentage}% (${student.daysPresent} of ${student.totalWorkingDays} days), which falls below the mandatory 75% threshold.`;
    impactOnAcademics = 'Significant classroom hours missed directly impact topic continuity, laboratory work, and upcoming test confidence.';
  }

  // 3. Exam Comparison
  const diffPercent = Math.round((overallPercentage - previousExamPercentage) * 10) / 10;
  // Estimate marks difference based on max marks
  const diffMarks = Math.round((diffPercent / 100) * totalMaxMarks);
  
  let trend: 'Significant Improvement' | 'Moderate Improvement' | 'Steady' | 'Decline' = 'Steady';
  if (diffPercent >= 8) trend = 'Significant Improvement';
  else if (diffPercent > 1) trend = 'Moderate Improvement';
  else if (diffPercent < -1) trend = 'Decline';
  else trend = 'Steady';

  const improvingSubjects: string[] = [];
  const decliningSubjects: string[] = [];

  // Group subject status relative to previous percentage baseline
  sortedSubjects.forEach((sub) => {
    if (sub.percentage > previousExamPercentage + 3) {
      improvingSubjects.push(`${sub.name} (${sub.percentage}%)`);
    } else if (sub.percentage < previousExamPercentage - 3) {
      decliningSubjects.push(`${sub.name} (${sub.percentage}%)`);
    }
  });

  let comparisonNarrative = '';
  if (diffPercent > 0) {
    comparisonNarrative = `${name} achieved a positive growth of +${diffPercent}% compared to the previous examination (${previousExamPercentage}% → ${overallPercentage}%).`;
  } else if (diffPercent < 0) {
    comparisonNarrative = `A reduction of ${Math.abs(diffPercent)}% is noted compared to the previous examination period (${previousExamPercentage}% → ${overallPercentage}%).`;
  } else {
    comparisonNarrative = `Academic performance remains identical to the previous term at ${overallPercentage}%.`;
  }

  // 4. Declining performance areas
  const decliningPerformanceAreas: string[] = [];
  if (diffPercent < 0) {
    decliningPerformanceAreas.push(`Overall exam average contracted by ${Math.abs(diffPercent)}% from previous benchmark.`);
  }
  if (classTestPerformance < overallPercentage - 5) {
    decliningPerformanceAreas.push(`Class test average (${classTestPerformance}%) is lower than overall marks, indicating exam prep inconsistency.`);
  }
  if (assignmentPerformance < overallPercentage - 5) {
    decliningPerformanceAreas.push(`Assignment submission score (${assignmentPerformance}%) indicates homework completion delays.`);
  }
  weakestList.forEach((sub) => {
    decliningPerformanceAreas.push(`${sub.name} scored ${sub.percentage}%, below minimum target standard.`);
  });
  if (decliningPerformanceAreas.length === 0) {
    decliningPerformanceAreas.push('No significant declines detected; performance is stable or trending upward across metrics.');
  }

  // 5. Overall Summary
  let overallSummary = '';
  if (overallPercentage >= 85) {
    overallSummary = `${name} demonstrates superior academic capability with an overall ${overallPercentage}% (Grade ${overallGrade}). Subject execution is thorough across major disciplines, supported by healthy engagement and diligent coursework.`;
  } else if (overallPercentage >= 70) {
    overallSummary = `${name} is maintaining a steady and commendable academic standard at ${overallPercentage}% (Grade ${overallGrade}). Core subject competency is well established, with clear opportunities for elevated performance in select topics.`;
  } else if (overallPercentage >= 50) {
    overallSummary = `${name} has achieved an average score of ${overallPercentage}% (Grade ${overallGrade}). While baseline concepts are understood, targeted reinforcement in lower-scoring subjects will be crucial ahead of terminal assessments.`;
  } else {
    overallSummary = `${name} is currently obtaining ${overallPercentage}% (Grade ${overallGrade}), indicating academic distress that requires structured teacher support, parent-teacher collaboration, and a consistent revision schedule.`;
  }

  // 6. Actionable Study Recommendations
  const studyRecommendations: string[] = [
    `Establish a dedicated 2 to 2.5 hour daily revision routine focused on priority topics.`,
    `Utilize active recall techniques (self-quizzing and formula flashcards) instead of passive reading.`,
    `Complete weekly mock quizzes within timed conditions to build test endurance.`,
    `Review teacher correction notes from assignments and class tests to eliminate recurring errors.`
  ];
  if (attendancePercentage < 80) {
    studyRecommendations.unshift(`Prioritize daily school attendance to avoid missing foundational classroom lectures.`);
  }

  // 7. Personalized Improvement Plan
  const prioritySubjects = (weakestList.length > 0 ? weakestList : sortedSubjects.slice(-2)).map((s) => {
    let dailyTime = '45 minutes daily';
    if (s.percentage < 50) dailyTime = '60 minutes daily';
    else if (s.percentage < 65) dailyTime = '45 minutes daily';
    else dailyTime = '30 minutes daily';

    return {
      subject: s.name,
      currentScore: s.percentage,
      reason: `Current percentage is ${s.percentage}% (${s.marksObtained}/${s.maxMarks}, Grade ${s.grade}).`,
      dailyTime
    };
  });

  const primaryPriorityName = prioritySubjects[0]?.subject || (sortedSubjects[0]?.name ?? 'Core Studies');
  const primaryDailyTime = prioritySubjects[0]?.dailyTime || '45 minutes';

  const weeklyTargets = [
    `Complete at least 3 topic-specific practice exercise sets in ${primaryPriorityName}.`,
    `Resolve all doubts from previous chapter tests with the subject teacher.`,
    `Achieve 100% on-time submission for weekly homework and lab assignments.`,
    `Conduct one comprehensive weekend revision test covering last 2 weeks of material.`
  ];

  const personalizedPlan = {
    prioritySubjects,
    dailyStudyRecommendation: `Allocate dedicated study blocks each evening. Begin with ${primaryPriorityName} for ${primaryDailyTime} while energy levels are high, followed by 30 minutes of lighter subject review and homework.`,
    weeklyTargets,
    revisionStrategy: `Implement spaced repetition: Review Monday's notes on Wednesday, then again on Saturday. Maintain a dedicated 'Mistake Logbook' to catalog errors in tests and review them weekly.`,
    practiceRecommendations: [
      `Solve past 3 years' examination papers under strict 60-minute time limits.`,
      `Practice step-by-step working out for multi-mark questions to secure method marks.`,
      `Review diagrams, definitions, and standard units weekly.`
    ],
    testPreparationPlan: `Begin formal revision 2 weeks prior to major exams. Schedule full syllabus mock tests 7 days before exams, reserving the final 48 hours purely for high-yield formulas, summaries, and rest.`
  };

  return {
    overallSummary,
    strongestSubjects,
    weakestSubjects,
    subjectsRequiringAttention,
    attendanceAnalysis: {
      status: attendanceStatus,
      percentage: attendancePercentage,
      narrative: attendanceNarrative,
      impactOnAcademics
    },
    examComparison: {
      previousPercentage: previousExamPercentage,
      currentPercentage: overallPercentage,
      improvementPercentage: diffPercent,
      differenceInMarks: diffMarks,
      trend,
      improvingSubjects,
      decliningSubjects,
      narrative: comparisonNarrative
    },
    decliningPerformanceAreas,
    studyRecommendations,
    personalizedPlan
  };
}
