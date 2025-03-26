
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

// Initialize with Supabase project URL and anon key
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication functions
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast.error(error.message);
    return { user: null, error };
  }

  return { user: data.user, error: null };
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    toast.error(error.message);
    return { user: null, error };
  }

  // Create user profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, name, email }]);

    if (profileError) {
      toast.error("Error creating user profile");
      return { user: data.user, error: profileError };
    }
  }

  toast.success("Registration successful! Please check your email for confirmation.");
  return { user: data.user, error: null };
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    toast.error(error.message);
    return { success: false, error };
  }

  toast.success("Password reset email sent. Please check your inbox.");
  return { success: true, error: null };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    toast.error(error.message);
    return { success: false, error };
  }
  
  return { success: true, error: null };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data?.user) {
    return null;
  }
  
  return data.user;
}
