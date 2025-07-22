import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase-client'
import { type PostgrestSingleResponse, type Session } from '@supabase/supabase-js'

interface Tasks {
  id: number
  title: string
}

function App() {
  const [tasks, setTasks] = useState<Tasks[]>([])
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      const { data }: PostgrestSingleResponse<Tasks[]> = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setTasks(data)
      }
    }
    fetchAll()

    const { data: authStateChangeListner } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      authStateChangeListner?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const channel = supabase.channel('public:tasks')

    channel
      .on<Tasks>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks'
        },
        ({ new: newTask }) => {
          setTasks((tasks) => [newTask, ...tasks])
        }
      )
      .subscribe((status) => {
        console.log('Subscription: ', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSave = async () => {
    const dateTime = new Date().toLocaleString()
    await supabase
      .from('tasks')
      .insert({
        title: `task ${dateTime}`,
        description: `description ${dateTime}`
      })
      .single()
  }

  const handleDelete = async (id: number) => {
    await supabase.from('tasks').delete().eq('id', id)
  }

  const handleUpdate = async (id: number) => {
    const dateTime = new Date().toLocaleString()

    await supabase
      .from('tasks')
      .update({
        title: `title ${dateTime}`
      })
      .eq('id', id)
  }

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email: '',
      password: ''
    })
  }

  const handleSignIn = async () => {
    const email = prompt('Enter your email:')
    const password = prompt('Enter your password:')
    if (!email || !password) {
      alert('Email and password are required')
      return
    }
    await supabase.auth.signInWithPassword({
      email,
      password
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className='flex min-h-svh flex-col items-center justify-center'>
      {!session && (
        <>
          <Button className='bg-blue-500 text-white' onClick={handleSignUp}>
            Sign Up
          </Button>
          <Button className='bg-purple-500 text-white' onClick={handleSignIn}>
            Sign In
          </Button>
        </>
      )}
      {session && (
        <>
          <p className='text-green-500'>Logged in as: {session.user.email}</p>
          <Button className='bg-red-500 text-white' onClick={handleSignOut}>
            Sign Out
          </Button>
          <Button className='bg-green-500 text-white' onClick={handleSave}>
            Add new
          </Button>
          <ul>
            {tasks?.map(({ id, title }) => (
              <li key={id} className='mt-3'>
                {id}. {title}
                <Button className='ml-3 bg-orange-500 text-white' onClick={() => handleUpdate(id)}>
                  update
                </Button>
                <Button className='ml-3 bg-red-500 text-white' onClick={() => handleDelete(id)}>
                  delete
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default App
