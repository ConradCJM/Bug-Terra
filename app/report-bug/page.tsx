"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  reporter?: string;
}

interface Attachment {
  id: string;
  file: File;
  url: string;
  type: "image" | "video";
}

interface FormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  reporter: string;
}

export default function ReportBug() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "Frontend",
    priority: "medium",
    reporter: "",
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const categories = ["Frontend", "Backend", "Content", "Infrastructure", "Database"];
  const priorities = ["low", "medium", "high", "critical"];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Bug title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!formData.reporter.trim()) {
      newErrors.reporter = "Reporter name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        alert("Please upload only images or videos");
        continue;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 10) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        continue;
      }

      const url = URL.createObjectURL(file);
      const attachment: Attachment = {
        id: `${Date.now()}-${i}`,
        file,
        url,
        type: isImage ? "image" : "video",
      };

      setAttachments((prev) => [...prev, attachment]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteAttachment = (id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Log form data (would normally send to API)
    console.log("Bug Report Submitted:", {
      formData,
      attachments: attachments.map((a) => ({
        name: a.file.name,
        type: a.type,
        size: a.file.size,
      })),
    });

    setIsSubmitting(false);
    setSuccessMessage("Bug report submitted successfully!");

    // Reset form after success
    setTimeout(() => {
      setFormData({
        title: "",
        description: "",
        category: "Frontend",
        priority: "medium",
        reporter: "",
      });
      setAttachments([]);
      setSuccessMessage("");
    }, 2000);
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      category: "Frontend",
      priority: "medium",
      reporter: "",
    });
    setAttachments([]);
    setErrors({});
    setSuccessMessage("");
    attachments.forEach((a) => URL.revokeObjectURL(a.url));
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Report a Bug</h1>
          <p className="text-slate-400 mt-2">Help us improve by reporting issues you encounter</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Two-column grid on desktop, one column on mobile */}
            <div className="space-y-6">
              {/* First Row - Title and Reporter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bug Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                    Bug Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief description of the bug"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black ${
                      errors.title ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Reporter Name */}
                <div>
                  <label
                    htmlFor="reporter"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Your Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="reporter"
                    name="reporter"
                    value={formData.reporter}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black ${
                      errors.reporter ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                  />
                  {errors.reporter && (
                    <p className="text-red-600 text-sm mt-1">{errors.reporter}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the bug in detail (minimum 10 characters)"
                  rows={5}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none text-black ${
                    errors.description ? "border-red-500 bg-red-50" : "border-slate-300"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
                <p className="text-slate-500 text-xs mt-1">
                  {formData.description.length} characters
                </p>
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black ${
                      errors.category ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Priority <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black ${
                      errors.priority ? "border-red-500 bg-red-50" : "border-slate-300"
                    }`}
                  >
                    {priorities.map((pri) => (
                      <option key={pri} value={pri}>
                        {pri.charAt(0).toUpperCase() + pri.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.priority && (
                    <p className="text-red-600 text-sm mt-1">{errors.priority}</p>
                  )}
                </div>
              </div>

              {/* Attachments Section */}
              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Add Attachments
                </label>
                <div className="mb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Upload Screenshot/Video
                  </button>
                  <p className="text-slate-500 text-xs mt-2">
                    Maximum 10MB per file. Supported formats: images and videos
                  </p>
                </div>

                {/* Attachments Grid */}
                {attachments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">
                      Attachments ({attachments.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="relative group bg-slate-100 rounded overflow-hidden border border-slate-200"
                        >
                          {attachment.type === "image" ? (
                            <img
                              src={attachment.url}
                              alt="Screenshot"
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <video
                              src={attachment.url}
                              className="w-full h-32 object-cover bg-black"
                              controls
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteAttachment(attachment.id)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete attachment"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                          <p className="text-xs text-slate-600 p-1 truncate bg-slate-50 border-t border-slate-200">
                            {attachment.file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end mt-8 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-slate-300 text-slate-700 font-semibold rounded hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-slate-300 text-slate-700 font-semibold rounded hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 text-white font-semibold rounded transition-colors flex items-center gap-2 ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Bug Report"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 text-sm">
            <span className="font-semibold">Pro Tip:</span> Include as many details as possible,
            such as steps to reproduce the bug, expected vs actual behavior, and screenshots or
            videos when applicable.
          </p>
        </div>
      </main>
    </div>
  );
}
