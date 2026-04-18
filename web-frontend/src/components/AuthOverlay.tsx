import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function AuthOverlay({ session, setSession, userProfile, setUserProfile }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession])

  useEffect(() => {
    if (session?.user) {
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
      .then(({ data, error }) => {
        if (data) setUserProfile(data);
      })
    } else {
      setUserProfile(null);
    }
  }, [session, setUserProfile])

  if (loading) return null;

  if (!session) {
    return (
      <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
        <div className="w-[420px] bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-2 text-center uppercase tracking-widest flex items-center justify-center gap-3">
               <span className="material-symbols-outlined text-blue-500 text-3xl">air</span>
               VayuDrishti
            </h2>
            <p className="text-xs text-slate-400 text-center mb-8 uppercase tracking-widest font-bold">Secure Citizen Portal</p>
            
            <Auth 
                supabaseClient={supabase} 
                appearance={{ 
                    theme: ThemeSupa, 
                    variables: { 
                        default: { 
                            colors: { brand: '#3b82f6', brandAccent: '#2563eb' } 
                        } 
                    } 
                }} 
                theme="dark"
                providers={[]}
            />
            {(!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) && (
                <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                    <p className="text-xs text-rose-400 text-center font-bold uppercase tracking-wide">
                        ⚠️ Missing Supabase Credentials 
                    </p>
                    <p className="text-[10px] text-rose-400/80 text-center mt-1">
                        Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file to enable live authentication.
                    </p>
                </div>
            )}
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-6 right-6 z-[1000]">
        <button 
            onClick={() => supabase.auth.signOut()}
            className="p-3 bg-rose-500/20 border border-rose-500/50 hover:bg-rose-500/40 text-rose-400 rounded-lg transition-all shadow-lg"
            title="Secure Sign Out"
        >
            <span className="material-symbols-outlined">logout</span>
        </button>
    </div>
  )
}
