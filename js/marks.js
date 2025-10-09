import { supabase } from './supabase.js';

export class MarksService {
  async addMarks(marksData) {
    try {
      // التحقق من وجود الطالب أولاً
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('student_id', marksData.student_id)
        .single();

      if (studentError || !student) {
        throw new Error('رقم الطالب غير موجود');
      }

      // إضافة معرف الطالب الداخلي إلى البيانات
      const marksDataWithId = {
        ...marksData,
        student_id: student.id
      };

      const { data, error } = await supabase
        .from('marks')
        .insert([marksDataWithId])
        .select()
        .single();

      if (error) throw error;
      return { success: true, marks: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getMarksByStudentId(studentId) {
    try {
      const { data, error } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', studentId)
        .order('year', { ascending: true })
        .order('semester', { ascending: true });

      if (error) throw error;
      return { success: true, marks: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  organizeMarksByYearAndSemester(marks) {
    const organized = {};
    
    marks.forEach(mark => {
      const year = `السنة ${this.getYearName(mark.year)}`;
      const semester = `الفصل ${this.getSemesterName(mark.semester)}`;
      
      if (!organized[year]) {
        organized[year] = {};
      }
      
      if (!organized[year][semester]) {
        organized[year][semester] = [];
      }
      
      organized[year][semester].push(mark);
    });
    
    return organized;
  }

  getYearName(year) {
    const yearNames = {
      1: 'الأولى',
      2: 'الثانية', 
      3: 'الثالثة',
      4: 'الرابعة'
    };
    return yearNames[year] || year.toString();
  }

  getSemesterName(semester) {
    const semesterNames = {
      1: 'الأول',
      2: 'الثاني'
    };
    return semesterNames[semester] || semester.toString();
  }
}