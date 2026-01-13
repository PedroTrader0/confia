// lib/auth.ts
import { supabase } from '../supabaseClient';

// Registrar usuário
export async function signUp(email: string, password: string, nome: string) {
  if (!supabase) throw new Error("Supabase não está configurado.");
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome }
    }
  });
  
  if (error) throw error;
  return data;
}

// Login
export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Supabase não está configurado.");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Reset de senha
export async function resetPassword(email: string) {
  if (!supabase) throw new Error("Supabase não está configurado.");

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    // Usa a origem atual se disponível, fallback para localhost
    redirectTo: typeof window !== 'undefined' 
      ? `${window.location.origin}/reset-password` 
      : 'http://localhost:3000/reset-password',
  });

  if (error) throw error;
  return data;
}

// Logout
export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}