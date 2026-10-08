import React, { useState } from 'react';
import { StudentProvider, useStudents } from './context/StudentContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StudentListView } from './components/StudentListView';
import { StudentProfileView } from './components/StudentProfileView';
import { ClassAnalysisView } from './components/ClassAnalysisView';
import { ReportView } from './components/ReportView';
import { AddEditStudentModal } from './components/AddEditStudentModal';
import { Student } from './types/student';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

function MainApp() {
  const {
    students,
    selectedStudent,
    setSelectedStudent,
    addStudent,
    updateStudent,
    deleteStudent,
    loadDemoData,
    clearAllData,
  } = useStudents();

  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (data: any) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, data);
      showToast(`Updated student record for "${data.name}"`);
    } else {
      const created = addStudent(data);
      showToast(`Added new student record for "${created.name}"`);
      setSelectedStudent(created);
      setActiveTab('student-profile');
    }
  };

  const handleDeleteStudent = (id: string) => {
    deleteStudent(id);
    showToast('Student record deleted successfully.');
    if (activeTab === 'student-profile') {
      setActiveTab('students');
    }
  };

  const handleViewStudentProfile = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('student-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReport = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('reports');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === 'add-student') {
      handleOpenAddModal();
      return;
    }
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        studentsCount={students.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Top Navbar */}
        <Navbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onAddNew={handleOpenAddModal}
          onResetDemo={() => {
            loadDemoData();
            showToast('Loaded sample demo student records.');
          }}
          onClearData={() => {
            clearAllData();
            showToast('All student records cleared.');
          }}
          students={students}
          onSelectStudent={handleViewStudentProfile}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {/* Breadcrumb back button when in student-profile view */}
          {activeTab === 'student-profile' && selectedStudent && (
            <div className="mb-4 print:hidden">
              <button
                onClick={() => setActiveTab('students')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Student Directory
              </button>
            </div>
          )}

          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              onSelectStudent={handleViewStudentProfile}
              onNavigate={handleTabChange}
              onAddNew={handleOpenAddModal}
            />
          )}

          {/* VIEW: STUDENTS LIST */}
          {activeTab === 'students' && (
            <StudentListView
              students={students}
              onViewStudent={handleViewStudentProfile}
              onEditStudent={handleOpenEditModal}
              onDeleteStudent={handleDeleteStudent}
              onAddNew={handleOpenAddModal}
              onLoadDemo={() => {
                loadDemoData();
                showToast('Sample students loaded.');
              }}
            />
          )}

          {/* VIEW: INDIVIDUAL STUDENT PROFILE */}
          {activeTab === 'student-profile' && selectedStudent && (
            <StudentProfileView
              student={selectedStudent}
              onEdit={handleOpenEditModal}
              onOpenReport={handleOpenReport}
              onBack={() => setActiveTab('students')}
            />
          )}

          {/* VIEW: CLASS ANALYSIS */}
          {(activeTab === 'class-analysis' || activeTab === 'analysis') && (
            <ClassAnalysisView
              students={students}
              onSelectStudent={handleViewStudentProfile}
            />
          )}

          {/* VIEW: REPORTS */}
          {activeTab === 'reports' && (
            <ReportView
              students={students}
              initialStudent={selectedStudent}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

        </main>
      </div>

      {/* Add / Edit Student Modal */}
      <AddEditStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        initialData={editingStudent}
      />

    </div>
  );
}

export default function App() {
  return (
    <StudentProvider>
      <MainApp />
    </StudentProvider>
  );
}
