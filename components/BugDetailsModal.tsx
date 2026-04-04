"use client";

import { useState, useRef, useEffect } from "react";
import BugHistoryTimeline from "./BugHistoryTimeline";

interface BugHistory {
  id: string;
  bugId: string;
  timestamp: string;
  actor: string;
  actionType: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
}

interface Bug {
  id: string;
  name: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in-progress" | "review" | "done";
  reporter: string;
  createdAt: string;
  history?: BugHistory[];
}

interface Attachment {
  id: string;
  file: File;
  url: string;
  type: "image" | "video";
}

interface Comment {
  id: string;
  text: string;
  timestamp: string;
}

const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  critical: "bg-red-100 text-red-800 border-red-300",
};

const STATUS_COLORS = {
  "todo": "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  "review": "bg-yellow-100 text-yellow-800",
  "done": "bg-green-100 text-green-800",
};

interface BugDetailsModalProps {
  bug: Bug;
  isOpen: boolean;
  onClose: () => void;
}

type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null;

export default function BugDetailsModal({
  bug,
  isOpen,
  onClose,
}: BugDetailsModalProps) {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(500);
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const MIN_WIDTH = 300;
  const MAX_WIDTH = 90;
  const MIN_HEIGHT = 300;
  const MAX_HEIGHT = 90;

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

  const handleSubmitComment = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: `${Date.now()}`,
        text: comment,
        timestamp: new Date().toLocaleString(),
      };
      setComments((prev) => [...prev, newComment]);
      console.log("Comment submitted:", comment);
      setComment("");
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup: revoke all object URLs when component unmounts
      attachments.forEach((attachment) => {
        URL.revokeObjectURL(attachment.url);
      });
    };
  }, []);

  useEffect(() => {
    if (!isResizing || !modalRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!modalRef.current) return;

      const rect = modalRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const maxWidth = (windowWidth * MAX_WIDTH) / 100;
      const maxHeight = (windowHeight * MAX_HEIGHT) / 100;

      let newWidth = width;
      let newHeight = height;

      if (isResizing.includes("e")) {
        newWidth = Math.min(
          Math.max(e.clientX - rect.left, MIN_WIDTH),
          maxWidth
        );
      }
      if (isResizing.includes("s")) {
        newHeight = Math.min(
          Math.max(e.clientY - rect.top, MIN_HEIGHT),
          maxHeight
        );
      }
      if (isResizing.includes("w")) {
        const newW = Math.min(
          Math.max(rect.right - e.clientX, MIN_WIDTH),
          maxWidth
        );
        if (newW !== width) {
          newWidth = newW;
        }
      }
      if (isResizing.includes("n")) {
        const newH = Math.min(
          Math.max(rect.bottom - e.clientY, MIN_HEIGHT),
          maxHeight
        );
        if (newH !== height) {
          newHeight = newH;
        }
      }

      setWidth(newWidth);
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, width, height]);

  const getCursorStyle = (handle: ResizeHandle): string => {
    const cursorMap: Record<string, string> = {
      nw: "nwse-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      se: "nwse-resize",
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
    };
    return cursorMap[handle || ""] || "default";
  };

  const ResizeHandle = ({ handle }: { handle: ResizeHandle }) => {
    const positionClasses: Record<string, string> = {
      nw: "top-0 left-0 cursor-nwse-resize",
      ne: "top-0 right-0 cursor-nesw-resize",
      sw: "bottom-0 left-0 cursor-nesw-resize",
      se: "bottom-0 right-0 cursor-nwse-resize",
      n: "top-0 left-1/2 -translate-x-1/2 cursor-ns-resize",
      s: "bottom-0 left-1/2 -translate-x-1/2 cursor-ns-resize",
      e: "top-1/2 right-0 -translate-y-1/2 cursor-ew-resize",
      w: "top-1/2 left-0 -translate-y-1/2 cursor-ew-resize",
    };

    const sizeClasses = {
      nw: "w-3 h-3",
      ne: "w-3 h-3",
      sw: "w-3 h-3",
      se: "w-3 h-3",
      n: "w-8 h-1",
      s: "w-8 h-1",
      e: "w-1 h-8",
      w: "w-1 h-8",
    };

    return (
      <div
        onMouseDown={() => setIsResizing(handle)}
        className={`absolute ${positionClasses[handle!]} ${
          sizeClasses[handle as keyof typeof sizeClasses]
        } bg-slate-400 hover:bg-slate-500 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-auto`}
        style={{ cursor: getCursorStyle(handle) }}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-lg bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="pointer-events-auto relative bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Resize Handles */}
          <ResizeHandle handle="nw" />
          <ResizeHandle handle="ne" />
          <ResizeHandle handle="sw" />
          <ResizeHandle handle="se" />
          <ResizeHandle handle="n" />
          <ResizeHandle handle="s" />
          <ResizeHandle handle="e" />
          <ResizeHandle handle="w" />

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-start justify-between border-b border-slate-200 flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{bug.name}</h2>
              <p className="text-slate-300 text-sm mt-1">Bug ID: {bug.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors ml-4 flex-shrink-0"
            >
              <svg
                className="w-6 h-6"
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
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
            >
              History
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="px-6 py-6 overflow-y-auto flex-1">
            {activeTab === "details" ? (
              <>
                {/* Details Tab Content */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                  PRIORITY_COLORS[bug.priority]
                }`}
              >
                {bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1)}{" "}
                Priority
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  STATUS_COLORS[bug.status as keyof typeof STATUS_COLORS]
                }`}
              >
                {bug.status.replace("-", " ").toUpperCase()}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                {bug.category}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Reporter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reported By
                </label>
                <p className="text-slate-600">{bug.reporter}</p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Created Date
                </label>
                <p className="text-slate-600">{bug.createdAt}</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <p className="text-slate-600">{bug.category}</p>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority Level
                </label>
                <p className="text-slate-600 capitalize">{bug.priority}</p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notes
              </label>
              <div className="bg-slate-50 rounded p-3 text-slate-600 text-sm border border-slate-200">
                No notes provided yet.
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Attachments
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
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Screenshot/Video
                </button>
              </div>

              {/* Attachments Grid */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
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
                        onClick={() => handleDeleteAttachment(attachment.id)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete attachment"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <p className="text-xs text-slate-600 p-1 truncate bg-slate-50">
                        {attachment.file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Display Section */}
            {comments.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Comments ({comments.length})
                </label>
                <div className="space-y-3">
                  {comments.map((cmt) => (
                    <div
                      key={cmt.id}
                      className="bg-slate-50 border border-slate-200 rounded p-3"
                    >
                      <p className="text-slate-700 text-sm">{cmt.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{cmt.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comment Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Add Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment here..."
                className="w-full min-h-20 bg-slate-50 border border-slate-200 rounded p-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!comment.trim()}
                className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
              >
                Submit Comment
              </button>
            </div>
              </>
            ) : (
              <>
                {/* History Tab Content */}
                {bug.history && bug.history.length > 0 ? (
                  <BugHistoryTimeline history={bug.history} />
                ) : (
                  <p className="text-slate-500 text-center py-8">No history available yet.</p>
                )}
              </>
            )}
          </div>

          {/* Action Buttons - Always Visible */}
          <div className="flex gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50 flex-shrink-0">
            <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
              Change Status
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
