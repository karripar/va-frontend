"use client";
import { ExchangeStory } from "@/hooks/exchangeStoriesHooks";
import Image from "next/image";
import { FaStar, FaClock, FaMapMarkerAlt, FaTimes, FaHeart } from "react-icons/fa";
import { useState } from "react";

interface StoryModalProps {
  story: ExchangeStory;
  onClose: () => void;
}

export default function StoryModal({ story, onClose }: StoryModalProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with cover photo */}
        <div className="relative h-64">
          <Image
            src={story.coverPhoto}
            alt={story.title}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-800" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur rounded-lg p-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{story.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-[#FF5722]" />
                  <span>{story.city}, {story.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <span className="font-semibold">{story.ratings.overall.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock />
                  <span>{story.duration} months</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Student info */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            {story.userAvatar ? (
              <Image
                src={story.userAvatar}
                alt={story.userName}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#FF5722] flex items-center justify-center text-white font-bold text-lg">
                {story.userName.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{story.userName}</p>
              <p className="text-sm text-gray-600">{story.university}</p>
              <p className="text-xs text-gray-500">{story.exchangeDate}</p>
            </div>
          </div>

          {/* Highlights */}
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

          {/* Full report */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Full Story</h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {story.fullReport}
            </div>
          </div>

          {/* Ratings breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Ratings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(story.ratings).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-[#FF5722]">{value.toFixed(1)}</div>
                  <div className="text-xs text-gray-600 capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Like button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaHeart className={isLiked ? "fill-current" : ""} />
              <span>{isLiked ? "Liked" : "Like"}</span>
              <span className="font-semibold">({story.likes + (isLiked ? 1 : 0)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
