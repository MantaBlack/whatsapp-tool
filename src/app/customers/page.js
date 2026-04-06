'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    setLoading(true)

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching customers:', error)
    } else {
      setCustomers(data)
    }

    setLoading(false)
  }

  async function addCustomer() {
    if (!name || !phone) {
      alert('Please enter name and phone')
      return
    }

    const { error } = await supabase.from('customers').insert([
      {
        name,
        phone,
        tag: 'new',
      },
    ])

    if (error) {
      console.error('Error adding customer:', error)
    } else {
      setName('')
      setPhone('')
      fetchCustomers()
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Customers</h1>

      {/* Add Customer Form */}
      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <button
          onClick={addCustomer}
          className="bg-black text-white w-full py-2 rounded"
        >
          Add Customer
        </button>
      </div>

      {/* Customer List */}
      {loading ? (
        <p>Loading...</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-500">No customers yet</p>
      ) : (
        <ul className="space-y-3">
          {customers.map((customer) => (
            <Link key={customer.id} href={`/customers/${customer.id}`}>
              <li className="border p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{customer.name}</p>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {customer.tag}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {customer.phone}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  )
}