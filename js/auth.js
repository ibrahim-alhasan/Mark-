import { supabase } from './supabase.js';

export class AuthService {
  async login(email, password) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('بيانات الدخول غير صحيحة');
      }

      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminEmail', email);
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
  }

  isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }

  getCurrentUser() {
    return localStorage.getItem('adminEmail');
  }
}