import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';
import { Student, SubjectScore } from '../types/student';
import { computeSubject, calculateGrade } from '../utils/calculations';

interface AddEditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: any) => void;
  initialData?: Student | null;
}

interface FormSubject {
  id: string;
  name: string;
  maxMarks: number | string;
  marksObtained: number | string;
}

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  // Form states
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('Class 10');
  const [section, setSection] = useState('A');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [parentName, setParentName] = useState('');
  const [parentContact, setParentContact] = useState('');

  // Attendance
  const [totalWorkingDays, setTotalWorkingDays] = useState<number | string>(180);
  const [daysPresent, setDaysPresent] = useState<number | string>(160);

  // Continuous assessments
  const [assignmentPerformance, setAssignmentPerformance] = useState<number | string>(85);
  const [classTestPerformance, setClassTestPerformance] = useState<number | string>(80);
  const [previousExamPercentage, setPreviousExamPercentage] = useState<number | string>(75);

  // Dynamic Subjects
  const [subjects, setSubjects] = useState<FormSubject[]>([
    { id: '1', name: 'Mathematics', maxMarks: 100, marksObtained: 85 },
    { id: '2', name: 'Science', maxMarks: 100, marksObtained: 80 },
    { id: '3', name: 'English Language', maxMarks: 100, marksObtained: 78 },
    { id: '4', name: 'Social Studies', maxMarks: 100, marksObtained: 82 },
    { id: '5', name: 'Computer Science', maxMarks: 100, marksObtained: 90 },
  ]);

  const [errors, setErrors] = useState<string[]>([]);

  // Populate when editing or reset when adding
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRollNumber(initialData.rollNumber);
      setStudentClass(initialData.class);
      setSection(initialData.section);
      setAcademicYear(initialData.academicYear);
      setDateOfBirth(initialData.dateOfBirth || '');
      setGender(initialData.gender || 'Male');
      setParentName(initialData.parentName || '');
      setParentContact(initialData.parentContact || '');
      setTotalWorkingDays(initialData.totalWorkingDays);
      setDaysPresent(initialData.daysPresent);
      setAssignmentPerformance(initialData.assignmentPerformance);
      setClassTestPerformance(initialData.classTestPerformance);
      setPreviousExamPercentage(initialData.previousExamPercentage);
      setSubjects(
        initialData.subjects.map((s) => ({
          id: s.id,
          name: s.name,
          maxMarks: s.maxMarks,
          marksObtained: s.marksObtained,
        }))
      );
    } else {
      setName('');
      setRollNumber(`STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setStudentClass('Class 10');
      setSection('A');
      setAcademicYear('2025-2026');
      setDateOfBirth('2010-05-15');
      setGender('Male');
      setParentName('');
      setParentContact('');
      setTotalWorkingDays(180);
      setDaysPresent(165);
      setAssignmentPerformance(80);
      setClassTestPerformance(78);
      setPreviousExamPercentage(75);
      setSubjects([
        { id: '1', name: 'Mathematics', maxMarks: 100, marksObtained: 85 },
        { id: '2', name: 'Science', maxMarks: 100, marksObtained: 82 },
        { id: '3', name: 'English Language', maxMarks: 100, marksObtained: 88 },
        { id: '4', name: 'Social Studies', maxMarks: 100, marksObtained: 84 },
        { id: '5', name: 'Computer Science', maxMarks: 100, marksObtained: 90 },
      ]);
    }
    setErrors([]);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Real-time automatic calculations for preview
  const numWorking = Number(totalWorkingDays) || 0;
  const numPresent = Number(daysPresent) || 0;
  const liveAttendancePct = numWorking > 0 ? Math.round(((numPresent / numWorking) * 100) * 10) / 10 : 0;

  let liveTotalMarks = 0;
  let liveMaxMarks = 0;
  subjects.forEach((sub) => {
    liveTotalMarks += Number(sub.marksObtained) || 0;
    liveMaxMarks += Number(sub.maxMarks) || 0;
  });
  const liveOverallPct = liveMaxMarks > 0 ? Math.round(((liveTotalMarks / liveMaxMarks) * 100) * 10) / 10 : 0;
  const liveGrade = calculateGrade(liveOverallPct);

  // Handlers for subject manipulation
  const handleAddSubject = () => {
    setSubjects((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: '',
        maxMarks: 100,
        marksObtained: 0,
      },
    ]);
  };

  const handleRemoveSubject = (id: string) => {
    if (subjects.length <= 1) {
      setErrors(['At least one subject is required for performance analysis.']);
      return;
    }
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubjectChange = (
    id: string,
    field: 'name' | 'maxMarks' | 'marksObtained',
    value: string
  ) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (field === 'name') return { ...s, name: value };
        return { ...s, [field]: value === '' ? '' : Number(value) };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    // Basic Validations
    if (!name.trim()) validationErrors.push('Student name is required.');
    if (!rollNumber.trim()) validationErrors.push('Roll number / Student ID is required.');
    if (!parentName.trim()) validationErrors.push('Parent or guardian name is required.');

    // Attendance validation
    const workDays = Number(totalWorkingDays);
    const presDays = Number(daysPresent);
    if (isNaN(workDays) || workDays <= 0) {
      validationErrors.push('Total working days must be a positive number.');
    }
    if (isNaN(presDays) || presDays < 0) {
      validationErrors.push('Days present cannot be negative.');
    }
    if (presDays > workDays) {
      validationErrors.push('Days present cannot exceed total working days.');
    }

    // Continuous assessment validation
    const assignScore = Number(assignmentPerformance);
    const testScore = Number(classTestPerformance);
    const prevExamScore = Number(previousExamPercentage);

    if (isNaN(assignScore) || assignScore < 0 || assignScore > 100) {
      validationErrors.push('Assignment performance must be between 0% and 100%.');
    }
    if (isNaN(testScore) || testScore < 0 || testScore > 100) {
      validationErrors.push('Class test performance must be between 0% and 100%.');
    }
    if (isNaN(prevExamScore) || prevExamScore < 0 || prevExamScore > 100) {
      validationErrors.push('Previous exam percentage must be between 0% and 100%.');
    }

    // Subjects validation
    if (subjects.length === 0) {
      validationErrors.push('Please add at least one subject.');
    }

    const processedSubjects: SubjectScore[] = [];

    subjects.forEach((sub, idx) => {
      const subName = sub.name.trim();
      const maxM = Number(sub.maxMarks);
      const obtM = Number(sub.marksObtained);

      if (!subName) {
        validationErrors.push(`Subject #${idx + 1} must have a name.`);
      }
      if (isNaN(maxM) || maxM <= 0) {
        validationErrors.push(`Maximum marks for "${subName || `Subject ${idx + 1}`}" must be greater than 0.`);
      }
      if (isNaN(obtM) || obtM < 0) {
        validationErrors.push(`Marks obtained for "${subName || `Subject ${idx + 1}`}" cannot be negative.`);
      }
      if (obtM > maxM) {
        validationErrors.push(`Marks obtained (${obtM}) cannot exceed maximum marks (${maxM}) in "${subName || `Subject ${idx + 1}`}".`);
      }

      if (subName && maxM > 0 && obtM >= 0 && obtM <= maxM) {
        processedSubjects.push(computeSubject(sub.id, subName, maxM, obtM));
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      // scroll modal to top
      const modalBody = document.getElementById('modal-scroll-body');
      if (modalBody) modalBody.scrollTop = 0;
      return;
    }

    // Prepare payload
    const studentPayload = {
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      class: studentClass.trim(),
      section: section.trim().toUpperCase(),
      academicYear: academicYear.trim(),
      dateOfBirth,
      gender,
      parentName: parentName.trim(),
      parentContact: parentContact.trim(),
      totalWorkingDays: workDays,
      daysPresent: presDays,
      assignmentPerformance: assignScore,
      classTestPerformance: testScore,
      previousExamPercentage: prevExamScore,
      subjects: processedSubjects,
    };

    onSave(studentPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? `Edit Student: ${initialData?.name}` : 'Add New Student Record'}
            </h3>
            <p className="text-xs text-slate-500">
              Input academic details, attendance counts, and subject evaluation marks.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div id="modal-scroll-body" className="p-6 overflow-y-auto space-y-6 flex-1">
          {errors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Please correct the following errors:
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 text-xs">
            <div>
              <span className="text-blue-600 font-medium block">Total Marks:</span>
              <span className="font-bold text-slate-800 text-sm">
                {liveTotalMarks} <span className="text-slate-400 font-normal">/ {liveMaxMarks}</span>
              </span>
            </div>
            <div>
              <span className="text-blue-600 font-medium block">Overall Percentage:</span>
              <span className="font-bold text-slate-800 text-sm">{liveOverallPct}%</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium block">Calculated Grade:</span>
              <span className="font-bold text-blue-700 text-sm">{liveGrade}</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium block">Attendance %:</span>
              <span className="font-bold text-slate-800 text-sm">{liveAttendancePct}%</span>
            </div>
          </div>

          <form id="student-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Student Personal & Class Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                1. General Student Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam Anderson"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Roll Number / ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 10-A-15"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g. 2025-2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Parent / Guardian Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Eleanor Anderson"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Parent Contact / Phone
                  </label>
                  <input
                    type="text"
                    value={parentContact}
                    onChange={(e) => setParentContact(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2831"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Attendance & Continuous Assessments */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                2. Attendance & Continuous Assessments
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Total Working Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalWorkingDays}
                    onChange={(e) => setTotalWorkingDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Days Present
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalWorkingDays}
                    value={daysPresent}
                    onChange={(e) => setDaysPresent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assignment Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assignmentPerformance}
                    onChange={(e) => setAssignmentPerformance(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Class Test Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={classTestPerformance}
                    onChange={(e) => setClassTestPerformance(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Previous Exam (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={previousExamPercentage}
                    onChange={(e) => setPreviousExamPercentage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Subjects Evaluation */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  3. Academic Subjects & Marks
                </h4>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Subject
                </button>
              </div>

              <div className="space-y-2.5">
                {subjects.map((sub, index) => {
                  const mObt = Number(sub.marksObtained) || 0;
                  const mMax = Number(sub.maxMarks) || 100;
                  const pct = mMax > 0 ? Math.round(((mObt / mMax) * 100) * 10) / 10 : 0;
                  const subGrade = calculateGrade(pct);

                  return (
                    <div
                      key={sub.id}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/70"
                    >
                      <div className="w-6 text-slate-400 font-mono text-xs font-bold text-center">
                        #{index + 1}
                      </div>

                      <div className="flex-1 min-w-[150px]">
                        <input
                          type="text"
                          required
                          placeholder="Subject Name (e.g. Mathematics)"
                          value={sub.name}
                          onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="w-28">
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            placeholder="Max"
                            value={sub.maxMarks}
                            onChange={(e) => handleSubjectChange(sub.id, 'maxMarks', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-medium pointer-events-none">
                            Max
                          </span>
                        </div>
                      </div>

                      <div className="w-28">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={sub.maxMarks}
                            placeholder="Obtained"
                            value={sub.marksObtained}
                            onChange={(e) => handleSubjectChange(sub.id, 'marksObtained', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-medium pointer-events-none">
                            Marks
                          </span>
                        </div>
                      </div>

                      {/* Calculated Subject Indicator */}
                      <div className="w-24 text-right flex flex-col justify-center">
                        <span className="text-xs font-bold text-slate-800 font-mono">{pct}%</span>
                        <span className="text-[10px] font-semibold text-blue-600">Grade: {subGrade}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(sub.id)}
                        disabled={subjects.length <= 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        title="Remove Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="submit"
              form="student-form"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Save Student'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
