'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useTemplates } from '@/hooks/useTemplates'

export default function TemplatesPage() {
  const { templates } = useTemplates()

  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
    } else {
      setTemplates(data)
    }

    setLoading(false)
  }

  async function addTemplate() {
    if (!title || !message) {
      alert('Please fill all fields')
      return
    }

    const { error } = await supabase.from('templates').insert([
      {
        title,
        message,
      },
    ])

    if (error) {
      console.error(error)
    } else {
      setTitle('')
      setMessage('')
      fetchTemplates()
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    alert('Copied!')
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Templates</h1>

      {/* Add Template */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Template title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <button
          onClick={addTemplate}
          className="bg-black text-white w-full py-2 rounded"
        >
          Add Template
        </button>
      </div>

      {/* Template List */}
      {loading ? (
        <p>Loading...</p>
      ) : templates.length === 0 ? (
        <p className="text-gray-500">No templates yet</p>
      ) : (
        templates.map((template) => (
          <div key={template.id} className="border p-3 rounded-lg space-y-2">
            <p className="font-semibold">{template.title}</p>
            <p className="text-sm text-gray-600">{template.message}</p>

            <button
              onClick={() => copyToClipboard(template.message)}
              className="bg-gray-200 px-3 py-1 rounded text-sm"
            >
              Copy
            </button>
          </div>
        ))
      )}
    </div>
  )
}