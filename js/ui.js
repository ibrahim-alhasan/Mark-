export class UIService {
  showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 5000);
  }

  hideNotification() {
    document.getElementById('notification').classList.add('hidden');
  }

  clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
      const inputs = form.querySelectorAll('input, select');
      inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false;
        } else {
          input.value = '';
        }
      });
    }
  }

  switchTab(activeTabId, activeContentId) {
    // إخفاء جميع محتويات التبويبات
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // إزالة الحالة النشطة من جميع أزرار التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // تفعيل التبويب والمحتوى المطلوب
    document.getElementById(activeTabId).classList.add('active');
    document.getElementById(activeContentId).classList.add('active');
  }

  switchSection(activeSectionId) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    
    // إزالة الحالة النشطة من جميع أزرار التنقل
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // تفعيل القسم المطلوب
    document.getElementById(activeSectionId).classList.add('active');
    
    // تفعيل زر التنقل المناسب
    if (activeSectionId === 'studentSection') {
      document.getElementById('studentBtn').classList.add('active');
    } else {
      document.getElementById('adminBtn').classList.add('active');
    }
  }

  renderMarksResults(organizedMarks, studentName, studentId) {
    const container = document.getElementById('marksContainer');
    const resultsSection = document.getElementById('marksResults');
    const studentInfo = document.getElementById('studentInfo');
    
    if (Object.keys(organizedMarks).length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">📊</div>
          <h3>لا توجد درجات مسجلة</h3>
          <p>لا توجد درجات مسجلة للطالب "${studentName}" (${studentId})</p>
        </div>
      `;
    } else {
      studentInfo.innerHTML = `درجات الطالب: ${studentName} (${studentId})`;
      let html = '';
      
      Object.keys(organizedMarks).forEach(year => {
        html += `<div class="year-container">
          <div class="year-title">${year}</div>`;
        
        Object.keys(organizedMarks[year]).forEach(semester => {
          html += `<div class="semester-container">
            <div class="semester-title">${semester}</div>
            <div class="marks-grid">`;
          
          organizedMarks[year][semester].forEach(mark => {
            html += `<div class="mark-item">
              <div class="subject-name">${mark.subject}</div>
              <div class="mark-value">${mark.marks}/100</div>
            </div>`;
          });
          
          html += `</div></div>`;
        });
        
        html += `</div>`;
      });
      
      container.innerHTML = html;
    }
    
    resultsSection.classList.remove('hidden');
  }
}