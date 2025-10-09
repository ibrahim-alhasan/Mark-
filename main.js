import { AuthService } from './js/auth.js';
import { StudentsService } from './js/students.js';
import { MarksService } from './js/marks.js';
import { UIService } from './js/ui.js';

class App {
  constructor() {
    this.authService = new AuthService();
    this.studentsService = new StudentsService();
    this.marksService = new MarksService();
    this.ui = new UIService();
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkAdminSession();
  }

  setupEventListeners() {
    // أزرار التنقل الرئيسية
    document.getElementById('studentBtn').addEventListener('click', () => {
      this.ui.switchSection('studentSection');
    });

    document.getElementById('adminBtn').addEventListener('click', () => {
      this.ui.switchSection('adminSection');
    });

    // واجهة الطالب
    document.getElementById('searchMarks').addEventListener('click', () => {
      this.searchStudentMarks();
    });

    document.getElementById('studentId').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.searchStudentMarks();
      }
    });

    // تسجيل الدخول للإدارة
    document.getElementById('loginBtn').addEventListener('click', () => {
      this.loginAdmin();
    });

    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.loginAdmin();
      }
    });

    // تسجيل الخروج
    document.getElementById('logoutBtn').addEventListener('click', () => {
      this.logoutAdmin();
    });

    // تبويبات الإدارة
    document.getElementById('addStudentTab').addEventListener('click', () => {
      this.ui.switchTab('addStudentTab', 'addStudentForm');
    });

    document.getElementById('addMarksTab').addEventListener('click', () => {
      this.ui.switchTab('addMarksTab', 'addMarksForm');
    });

    // إضافة طالب جديد
    document.getElementById('addStudentBtn').addEventListener('click', () => {
      this.addNewStudent();
    });

    // إضافة درجات
    document.getElementById('addMarksBtn').addEventListener('click', () => {
      this.addStudentMarks();
    });

    // إغلاق الإشعارات
    document.getElementById('closeNotification').addEventListener('click', () => {
      this.ui.hideNotification();
    });
  }

  checkAdminSession() {
    if (this.authService.isLoggedIn()) {
      this.showAdminPanel();
    }
  }

  async searchStudentMarks() {
    const studentId = document.getElementById('studentId').value.trim();
    
    if (!studentId) {
      this.ui.showNotification('يرجى إدخال رقم الطالب', 'error');
      return;
    }

    try {
      const studentResult = await this.studentsService.getStudentById(studentId);
      
      if (!studentResult.success) {
        this.ui.showNotification('حدث خطأ في البحث عن الطالب', 'error');
        return;
      }

      if (!studentResult.student) {
        this.ui.showNotification('لم يتم العثور على طالب بهذا الرقم', 'error');
        return;
      }

      const student = studentResult.student;
      
      const marksResult = await this.marksService.getMarksByStudentId(student.id);
      
      if (!marksResult.success) {
        this.ui.showNotification('حدث خطأ في جلب الدرجات', 'error');
        return;
      }

      const organizedMarks = this.marksService.organizeMarksByYearAndSemester(marksResult.marks);
      this.ui.renderMarksResults(organizedMarks, student.name, student.student_id);
      
    } catch (error) {
      this.ui.showNotification('حدث خطأ غير متوقع', 'error');
    }
  }

  async loginAdmin() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    if (!email || !password) {
      this.ui.showNotification('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'error');
      return;
    }

    try {
      const result = await this.authService.login(email, password);
      
      if (result.success) {
        this.showAdminPanel();
        this.ui.showNotification('تم تسجيل الدخول بنجاح', 'success');
        this.ui.clearForm('loginForm');
      } else {
        this.ui.showNotification(result.error, 'error');
      }
    } catch (error) {
      this.ui.showNotification('حدث خطأ في تسجيل الدخول', 'error');
    }
  }

  logoutAdmin() {
    this.authService.logout();
    this.hideAdminPanel();
    this.ui.showNotification('تم تسجيل الخروج بنجاح', 'success');
  }

  showAdminPanel() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
  }

  hideAdminPanel() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
  }

  async addNewStudent() {
    const studentId = document.getElementById('newStudentId').value.trim();
    const name = document.getElementById('newStudentName').value.trim();
    const email = document.getElementById('newStudentEmail').value.trim();
    const branch = document.getElementById('newStudentBranch').value;
    const phone = document.getElementById('newStudentPhone').value.trim();
    
    if (!studentId || !name || !branch) {
      this.ui.showNotification('يرجى إدخال رقم الطالب والاسم والتخصص', 'error');
      return;
    }

    try {
      const studentData = {
        student_id: studentId,
        name,
        email: email || null,
        branch,
        phone: phone || null
      };

      const result = await this.studentsService.addStudent(studentData);
      
      if (result.success) {
        this.ui.showNotification('تم إضافة الطالب بنجاح', 'success');
        this.ui.clearForm('addStudentForm');
      } else {
        this.ui.showNotification(result.error || 'حدث خطأ في إضافة الطالب', 'error');
      }
    } catch (error) {
      this.ui.showNotification('حدث خطأ غير متوقع', 'error');
    }
  }

  async addStudentMarks() {
    const studentId = document.getElementById('marksStudentId').value.trim();
    const branch = document.getElementById('marksBranch').value;
    const year = parseInt(document.getElementById('marksYear').value);
    const semester = parseInt(document.getElementById('marksSemester').value);
    const subject = document.getElementById('marksSubject').value.trim();
    const marks = parseInt(document.getElementById('marksValue').value);
    
    if (!studentId || !branch || !year || !semester || !subject || isNaN(marks)) {
      this.ui.showNotification('يرجى ملء جميع الحقول', 'error');
      return;
    }

    if (marks < 0 || marks > 100) {
      this.ui.showNotification('يجب أن تكون الدرجة بين 0 و 100', 'error');
      return;
    }

    try {
      const marksData = {
        student_id: studentId, // سيتم تحويله إلى معرف داخلي في MarksService
        branch,
        year,
        semester,
        subject,
        marks
      };

      const result = await this.marksService.addMarks(marksData);
      
      if (result.success) {
        this.ui.showNotification('تم إضافة الدرجة بنجاح', 'success');
        this.ui.clearForm('addMarksForm');
      } else {
        this.ui.showNotification(result.error || 'حدث خطأ في إضافة الدرجة', 'error');
      }
    } catch (error) {
      this.ui.showNotification('حدث خطأ غير متوقع', 'error');
    }
  }
}

// تشغيل التطبيق
new App();