"use client";
import { ExchangeStory } from "@/hooks/exchangeStoriesHooks";
import { FaHeart, FaBookmark, FaStar, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";

interface StoryCardProps {
  story: ExchangeStory;
  onLike?: (storyId: string) => void;
  onSave?: (storyId: string) => void;
}

export default function StoryCard({ story, onLike, onSave }: StoryCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(story.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(story.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={story.coverPhoto}
          alt={story.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-[#FF5722]">
          {story.country}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          {story.userAvatar ? (
            <Image src={story.userAvatar} alt={story.userName} width={40} height={40} className="rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
              {story.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{story.userName}</p>
            <p className="text-xs text-gray-500">{story.exchangeDate}</p>
          </div>
        </div>

        {/* Title & University */}
        <h3 className="font-bold text-lg text-gray-900 mb-1">{story.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <FaMapMarkerAlt className="text-[#FF5722]" />
          <span>{story.university}</span>
        </div>

        {/* Summary */}
        <p className="text-sm text-gray-700 mb-3">
          {showFullSummary ? story.summary : `${story.summary.slice(0, 100)}...`}
          {story.summary.length > 100 && (
            <button
              onClick={() => setShowFullSummary(!showFullSummary)}
              className="text-[#FF5722] ml-1 font-semibold"
            >
              {showFullSummary ? "Näytä vähemmän" : "Lue lisää"}
            </button>
          )}
        </p>

        {/* Highlights */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">✨ Kohokohtia:</p>
          <div className="flex flex-wrap gap-2">
            {story.highlights.slice(0, 2).map((highlight, idx) => (
              <span key={idx} className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded-full">
                {highlight}
              </span>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-3 mb-3 pb-3 border-b">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span className="text-sm font-bold text-gray-900">{story.ratings.overall.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FaClock />
            <span>{story.duration} kuukautta</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {story.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 ${isLiked ? "text-red-500" : "text-gray-600"} hover:text-red-500 transition-colors`}
          >
            <FaHeart className={isLiked ? "fill-current" : ""} />
            <span className="text-sm">{story.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 ${isSaved ? "text-blue-500" : "text-gray-600"} hover:text-blue-500 transition-colors`}
          >
            <FaBookmark className={isSaved ? "fill-current" : ""} />
            <span className="text-sm">Tallenna</span>
          </button>
        </div>
      </div>
    </div>
  );
}
