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
    storyText: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_CONTENT_API;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) =>
    setImage(e.target.files?.[0] || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (image) data.append("image", image);

    const res = await fetch(`${apiUrl}/exchange-stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      body: data,
    });

    if (res.ok) onSuccess();
    else alert("Failed to upload story");
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
          name="storyText"
          value={form.storyText}
          required
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFile} />
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