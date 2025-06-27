import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          setError(sessionError.message);
          if (mounted) setLoading(false);
          return;
        }

        if (session?.user && mounted) {
          console.log('✅ Found active session for:', session.user.email);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          console.log('ℹ️ No active session found');
          if (mounted) setLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setError(error.message);
        if (mounted) setLoading(false);
      }
    };

    // Initialize auth
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        try {
          if (session?.user) {
            setUser(session.user);
            setError(null);
            await fetchUserProfile(session.user.id);
          } else {
            setUser(null);
            setUserProfile(null);
            setAssignedProjects([]);
            setError(null);
            setLoading(false);
          }
        } catch (error) {
          console.error('❌ Auth state change error:', error);
          setError(error.message);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      setError(null);

      // First, try to find user by auth ID
      let { data: profile, error } = await supabase
        .from('user_profiles_um2024')
        .select(`
          *,
          project_assignments_um2024 (
            project_id,
            projects_um2024 (
              id,
              project_name,
              project_info,
              specialist_name,
              progress,
              emails_sent,
              meetings_booked,
              client_info,
              ideal_customer_profile
            )
          )
        `)
        .eq('auth_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // If not found by auth_id, try by email
        const { data: user } = await supabase.auth.getUser();
        if (user?.user?.email) {
          console.log('🔍 Profile not found by auth_id, trying email:', user.user.email);
          
          const { data: profileByEmail, error: emailError } = await supabase
            .from('user_profiles_um2024')
            .select(`
              *,
              project_assignments_um2024 (
                project_id,
                projects_um2024 (
                  id,
                  project_name,
                  project_info,
                  specialist_name,
                  progress,
                  emails_sent,
                  meetings_booked,
                  client_info,
                  ideal_customer_profile
                )
              )
            `)
            .eq('email', user.user.email)
            .single();

          if (emailError && emailError.code !== 'PGRST116') {
            throw emailError;
          }

          if (profileByEmail) {
            // Update the profile with auth_id
            const { error: updateError } = await supabase
              .from('user_profiles_um2024')
              .update({ auth_id: userId, status: 'active' })
              .eq('id', profileByEmail.id);

            if (updateError) {
              console.warn('⚠️ Could not update auth_id:', updateError);
            }

            profile = { ...profileByEmail, auth_id: userId, status: 'active' };
            console.log('✅ Found profile by email and updated auth_id');
          }
        }
      }

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (profile) {
        console.log('✅ Profile loaded:', profile.name, profile.role);
        setUserProfile(profile);
        
        // Extract assigned projects
        const projects = profile.project_assignments_um2024?.map(
          assignment => assignment.projects_um2024
        ) || [];
        setAssignedProjects(projects);
        console.log('📊 Assigned projects:', projects.length);
      } else {
        console.log('❌ No profile found for user');
        setUserProfile(null);
        setAssignedProjects([]);
        setError('No profile found. Please contact your administrator.');
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      setUserProfile(null);
      setAssignedProjects([]);
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('🔐 Signing in:', email);
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        setError(error.message);
        setLoading(false);
        return { data: null, error };
      }
      
      console.log('✅ Sign in successful:', data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error('❌ Sign in exception:', error);
      setError(error.message);
      setLoading(false);
      return { data: null, error };
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      console.log('📝 Signing up:', email, userData);
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        setError(error.message);
        setLoading(false);
        return { data: null, error };
      }

      if (data.user && !data.user.email_confirmed_at) {
        // For development, we'll auto-confirm the email
        console.log('📧 User created, email confirmation may be required');
      }

      if (data.user) {
        console.log('✅ User created, creating profile...');
        
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('user_profiles_um2024')
          .select('id, role')
          .eq('email', email)
          .single();

        if (existingProfile) {
          console.log('✅ Profile already exists, linking auth account');
          // Update existing profile with auth_id
          const { error: updateError } = await supabase
            .from('user_profiles_um2024')
            .update({ auth_id: data.user.id, status: 'active' })
            .eq('email', email);

          if (updateError) {
            console.error('❌ Profile update error:', updateError);
          }
        } else {
          // Create new profile
          const { error: profileError } = await supabase
            .from('user_profiles_um2024')
            .insert({
              auth_id: data.user.id,
              email,
              name: userData.name || 'New User',
              role: userData.role || 'client',
              status: 'active'
            });

          if (profileError) {
            console.error('❌ Profile creation error:', profileError);
            setError('Account created but profile setup failed. Please contact support.');
          } else {
            console.log('✅ Profile created successfully');
          }
        }
      }

      setLoading(false);
      return { data, error: null };
    } catch (error) {
      console.error('❌ Sign up exception:', error);
      setError(error.message);
      setLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        setError(error.message);
      } else {
        console.log('✅ Signed out successfully');
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Sign out exception:', error);
      setError(error.message);
      return { error };
    }
  };

  const value = {
    user,
    userProfile,
    assignedProjects,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshProfile: () => user?.id ? fetchUserProfile(user.id) : Promise.resolve()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};