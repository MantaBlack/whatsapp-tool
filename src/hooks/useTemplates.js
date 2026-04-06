import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    setLoading(true)

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching templates:', error)
    } else {
      setTemplates(data)
    }

    setLoading(false)
  }

  return {
    templates,
    loading,
    refresh: fetchTemplates,
  }
}