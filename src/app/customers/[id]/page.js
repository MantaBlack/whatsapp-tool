"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTemplates } from "@/hooks/useTemplates";

export default function CustomerDetailPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const { templates } = useTemplates();

  useEffect(() => {
    if (id) {
      fetchCustomer();
      fetchNotes();
    }
  }, [id]);

  async function fetchCustomer() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setCustomer(data);
    }
  }

  async function fetchNotes() {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setNotes(data);
    }

    setLoading(false);
  }

  async function addNote() {
    if (!newNote) return;

    const { error } = await supabase.from("notes").insert([
      {
        customer_id: id,
        content: newNote,
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      setNewNote("");
      fetchNotes();
    }
  }

  async function updateTag(newTag) {
    const { error } = await supabase
      .from("customers")
      .update({ tag: newTag })
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      setCustomer({ ...customer, tag: newTag });
    }
  }

  if (loading || !customer) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Customer Info */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-lg font-bold">{customer.name}</h2>
        <p className="text-gray-500">{customer.phone}</p>

        {/* Tag Selector */}
        <select
          value={customer.tag}
          onChange={(e) => updateTag(e.target.value)}
          className="mt-2 border p-2 rounded w-full"
        >
          <option value="new">New</option>
          <option value="paid">Paid</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Add Note */}
      <div className="space-y-2">
        <textarea
          placeholder="Add note (e.g. order details)"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <button
          onClick={addNote}
          className="bg-black text-white w-full py-2 rounded"
        >
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-2">
        <h3 className="font-semibold">Notes</h3>

        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="border p-2 rounded">
              <p>{note.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Quick Reply</label>

        <select
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.message}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={() => {
          const message = encodeURIComponent(selectedTemplate || "Hello!");
          window.open(`https://wa.me/${customer.phone}?text=${message}`);
        }}
        className="bg-green-600 text-white w-full py-3 rounded"
      >
        Open WhatsApp
      </button>

      <button
        onClick={() => (window.location.href = "/templates")}
        className="bg-gray-100 w-full py-2 rounded"
      >
        Open Templates
      </button>
    </div>
  );
}
