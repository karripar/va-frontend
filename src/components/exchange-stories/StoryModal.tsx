"use client";
import { ExchangeStory } from "@/hooks/exchangeStoriesHooks";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";

interface StoryModalProps {
  story: ExchangeStory;
  onClose: () => void;
}

export default function StoryModal({ story, onClose }: StoryModalProps) {

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#FF5722] to-[#FF7043] p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-800" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">{story.title}</h2>
          <div className="flex items-center gap-2 text-white/90">
            <FaMapMarkerAlt />
            <span>{story.city}, {story.country}</span>
          </div>
          <div className="text-sm text-white/80 mt-1">{story.university}</div>
        </div>

        <div className="p-6">
          {/* Highlights */}
          {story.highlights && story.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">✨ Highlights</h3>
              <div className="flex flex-wrap gap-2">
                {story.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Story Content */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Story</h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {story.content}
            </div>
          </div>

          {/* Challenges */}
          {story.challenges && story.challenges.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">⚠️ Challenges</h3>
              <div className="flex flex-wrap gap-2">
                {story.challenges.map((challenge, idx) => (
                  <span
                    key={idx}
                    className="bg-red-50 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    {challenge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {story.tips && story.tips.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Tips</h3>
              <div className="flex flex-wrap gap-2">
                {story.tips.map((tip, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tip}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
