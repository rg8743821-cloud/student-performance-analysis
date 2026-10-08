import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student } from '../types/student';
import { DEMO_STUDENTS } from '../data/demoStudents';
import { computeStudentMetrics } from '../utils/calculations';

interface StudentContextType {
  students: Student[];
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'totalMarks' | 'totalMaxMarks' | 'overallPercentage' | 'averageSubjectMarks' | 'overallGrade' | 'performanceStatus' | 'attendancePercentage'>) => Student;
  updateStudent: (id: string, studentData: Partial<Student>) => Student | null;
  deleteStudent: (id: string) => void;
  loadDemoData: () => void;
  clearAllData: () => void;
  getStudentById: (id: string) => Student | undefined;
}

const STORAGE_KEY = 'spa_students_records_v1';

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Recompute metrics in case formula updates
          return parsed.map((s: any) => computeStudentMetrics(s));
        }
      }
    } catch (e) {
      console.error('Failed to parse students from localStorage', e);
    }
    // Default to initial demo students on first visit for rich immediate testing
    return DEMO_STUDENTS;
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(() => {
    return students.length > 0 ? students[0] : null;
  });

  // Keep localStorage in sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  // If selectedStudent is deleted or updated, update reference
  useEffect(() => {
    if (selectedStudent) {
      const fresh = students.find((s) => s.id === selectedStudent.id);
      if (fresh) {
        setSelectedStudent(fresh);
      } else if (students.length > 0) {
        setSelectedStudent(students[0]);
      } else {
        setSelectedStudent(null);
      }
    } else if (students.length > 0) {
      setSelectedStudent(students[0]);
    }
  }, [students]);

  const addStudent = (newStudentData: any): Student => {
    const id = `stu-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    
    const computed = computeStudentMetrics({
      ...newStudentData,
      id,
      createdAt: now,
      updatedAt: now,
    });

    setStudents((prev) => [computed, ...prev]);
    setSelectedStudent(computed);
    return computed;
  };

  const updateStudent = (id: string, updatedData: Partial<Student>): Student | null => {
    let result: Student | null = null;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const merged = {
            ...s,
            ...updatedData,
            updatedAt: new Date().toISOString()
          };
          const recomputed = computeStudentMetrics(merged);
          result = recomputed;
          return recomputed;
        }
        return s;
      })
    );
    return result;
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const loadDemoData = () => {
    setStudents(DEMO_STUDENTS);
    setSelectedStudent(DEMO_STUDENTS[0]);
  };

  const clearAllData = () => {
    setStudents([]);
    setSelectedStudent(null);
  };

  const getStudentById = (id: string): Student | undefined => {
    return students.find((s) => s.id === id);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        selectedStudent,
        setSelectedStudent,
        addStudent,
        updateStudent,
        deleteStudent,
        loadDemoData,
        clearAllData,
        getStudentById,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}
