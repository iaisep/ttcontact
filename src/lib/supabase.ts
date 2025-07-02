import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

// Add your Supabase URL and anon key here
// These should be replaced with your actual Supabase project credentials
const supabaseUrl = 'https://supabase.totalcontact.com.mx/';
const supabaseKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0OTI0MDg0MCwiZXhwIjo0OTA0OTE0NDQwLCJyb2xlIjoiYW5vbiJ9.xc_ZGQt1RtsRZSSqxhScWmtwOzZgoSUBy0BCPQ-3MQU';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication functions
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase signIn error:", error.message);
    toast.error(error.message);
    return { user: null, error };
  }

  return { user: data.user, error: null };
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  try {
    console.log("Attempting to register with Supabase:", { email, name });
    
    // First, try to register the user
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
      console.error("Supabase signUp error:", error.message);
      return { user: null, error };
    }

    // Check if user was created successfully
    if (!data.user) {
      console.error("No user returned from signUp");
      return { 
        user: null, 
        error: new Error("Failed to create user account") 
      };
    }

    console.log("User registered successfully:", data.user.id);

    // Create user profile in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ 
        id: data.user.id, 
        name, 
        email,
        created_at: new Date().toISOString()
      }]);

    if (profileError) {
      console.error("Error creating user profile:", profileError.message);
      
      // Don't return an error here as the user is already created
      // Just log the error and continue
      toast.warning("User created but profile setup incomplete");
    } else {
      console.log("User profile created successfully");
    }

    return { user: data.user, error: null };
  } catch (err) {
    // Handle any unexpected errors
    console.error("Unexpected error during registration:", err);
    return { 
      user: null, 
      error: err instanceof Error ? err : new Error("Unknown registration error") 
    };
  }
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
