"use client";
import { ExchangeStory } from "@/hooks/exchangeStoriesHooks";
import { FaMapMarkerAlt } from "react-icons/fa";

interface StoryCardProps {
  story: ExchangeStory;
  onClick?: (story: ExchangeStory) => void;
}

export default function StoryCard({ story, onClick }: StoryCardProps) {

  return (
    <button
      onClick={() => onClick?.(story)}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all p-5 text-left w-full"
    >
      <div className="flex items-center gap-2 text-sm text-[#FF5722] font-semibold mb-2">
        <FaMapMarkerAlt />
        <span>{story.country}</span>
      </div>

      <h3 className="font-bold text-lg text-gray-900 mb-1">{story.title}</h3>
      
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <span>{story.city}, {story.university}</span>
      </div>

      <p className="text-sm text-gray-700 line-clamp-3">
        {story.content?.slice(0, 150)}...
      </p>

      {story.highlights && story.highlights.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {story.highlights.slice(0, 2).map((highlight, idx) => (
              <span key={idx} className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded-full">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      )}
    </button>
  );
}
