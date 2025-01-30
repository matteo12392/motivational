'use client'

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react'

export interface UserWithRole {
  id?: string 
  name ?: string
  surname ?: string
  company_id ?: string
  email: string | undefined
  role: string | null
  loading: boolean
  companies?: Company 
}

export function getUserInfo(type: 'admin' | 'user'): UserWithRole {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userData, setUserData] = useState<UserWithRole>({
    email: undefined,
    role: null,
    loading: true
  })
  const supabase = createClient()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const { data: userRole } = await supabase
            .from((type === "admin" ? "users" : "company_users"))
            .select('name, surname, role, company_id')
            .eq('id', user.id)
            .single()

          setUserData({
            id: user.id,
            company_id: userRole?.company_id,
            name: userRole?.name,
            surname: userRole?.surname,
            email: user.email,
            role: userRole?.role ?? null,
            loading: false
          })
        } else {
          setUserData({
            email: undefined,
            role: null,
            loading: false
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUserData(prev => ({ ...prev, loading: false }))
      }
    }

    getUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUserData()
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return userData
}

export const handleDelete = async (id: string, type: string) => {
  if (!id) return;

  try {
    const response = await fetch('/api/'+type+'/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      console.log('User deleted successfully')
      return response
    } else {
      const error = await response.json();
      console.error('Failed to delete user:', error.message)
      return response
    }
  } catch (error) {
    console.error('An error occurred:', error)
    throw error
  }
}

export interface Company {
  id: string | undefined
  name: string
  descr: string
  status: string | ''
  created_at: Date
}

export interface Access {
  questionnaire_id: string | undefined
  company_id: string
}