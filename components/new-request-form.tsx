"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface DocumentType {
  id: string
  name: string
}

interface NewRequestFormProps {
  documentTypes: DocumentType[]
}

export default function NewRequestForm({ documentTypes }: NewRequestFormProps) {
  const [documentTypeId, setDocumentTypeId] = useState("")
  const [purpose, setPurpose] = useState("")
  const [description, setDescription] = useState("")
  const [urgency, setUrgency] = useState("NORMAL")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentTypeId, purpose, description, urgency }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create request")
        setLoading(false)
        return
      }

      router.push("/dashboard/requests")
      router.refresh()
    } catch {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Document Type</label>
        <select
          value={documentTypeId}
          onChange={(e) => setDocumentTypeId(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select document type</option>
          {documentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Purpose</label>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
          placeholder="Why do you need this document?"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Additional details..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Urgency</label>
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="LOW">Low</option>
          <option value="NORMAL">Normal</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  )
}