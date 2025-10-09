import { supabase } from './supabase.js';

export class StudentsService {
  async addStudent(studentData) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, student: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) throw error;
      return { success: true, students: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getStudentByName(name) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .ilike('name', `%${name}%`);

      if (error) throw error;
      return { success: true, students: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getStudentById(studentId) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (error) throw error;
      return { success: true, student: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}