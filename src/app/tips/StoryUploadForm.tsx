"use client";
import { useState } from "react";

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function StoryUploadForm({ onSuccess, onCancel }: Props) {
  const [form, setForm] = useState({
    country: "",
    city: "",
    university: "",
    title: "",
    content: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_CONTENT_API;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to submit a story");
      return;
    }

    try {
      const payload = {
        country: form.country,
        city: form.city,
        university: form.university,
        title: form.title,
        content: form.content,
      };

      const res = await fetch(`${apiUrl}/exchange-stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await res.json();
        onSuccess();
      } else {
        const error = await res.json().catch(() => ({ error: "Failed to upload story" }));
        console.error("Story upload failed:", error);
        alert(error.error || "Failed to upload story");
      }
    } catch (error) {
      console.error("Error submitting story:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Country" name="country" value={form.country} onChange={handleChange} />
      <Input label="City" name="city" value={form.city} onChange={handleChange} />
      <Input label="University" name="university" value={form.university} onChange={handleChange} />
      <Input label="Title" name="title" value={form.title} onChange={handleChange} />

      <div>
        <label className="block mb-1 font-medium">Story Text</label>
        <textarea
          name="content"
          value={form.content}
          required
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onCancel} type="button" className="px-4 py-2 rounded-lg bg-gray-200">
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[#FF5722] text-white hover:bg-[#E64A19]"
        >
          Submit Story
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        required
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}