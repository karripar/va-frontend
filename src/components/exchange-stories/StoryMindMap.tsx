"use client";
import { useState } from "react";
import { ExchangeStory } from "@/hooks/exchangeStoriesHooks";
import Image from "next/image";
import { FaStar, FaClock, FaMapMarkerAlt } from "react-icons/fa";

interface StoryMindMapProps {
  stories: ExchangeStory[];
  onStorySelect: (story: ExchangeStory) => void;
}

interface CountryNode {
  country: string;
  cities: Map<string, ExchangeStory[]>;
}

export default function StoryMindMap({ stories, onStorySelect }: StoryMindMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Group stories by country and city
  const countryMap = new Map<string, CountryNode>();
  
  stories.forEach((story) => {
    if (!countryMap.has(story.country)) {
      countryMap.set(story.country, {
        country: story.country,
        cities: new Map(),
      });
    }
    
    const node = countryMap.get(story.country)!;
    if (!node.cities.has(story.city)) {
      node.cities.set(story.city, []);
    }
    
    node.cities.get(story.city)!.push(story);
  });

  const countries = Array.from(countryMap.values());

  return (
    <div className="w-full">
      {/* Countries Level */}
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {countries.map(({ country, cities }) => (
          <button
            key={country}
            onClick={() => {
              setSelectedCountry(selectedCountry === country ? null : country);
              setSelectedCity(null);
            }}
            className={`relative group transition-all ${
              selectedCountry === country
                ? "scale-110 z-10"
                : "hover:scale-105"
            }`}
          >
            <div
              className={`px-6 py-4 rounded-xl shadow-lg transition-all ${
                selectedCountry === country
                  ? "bg-[#FF5722] text-white ring-4 ring-[#FF5722]/30"
                  : "bg-white text-gray-900 hover:shadow-xl"
              }`}
            >
              <div className="text-lg font-bold mb-1">{country}</div>
              <div className="text-sm opacity-80">
                {cities.size} {cities.size === 1 ? "city" : "cities"}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-[#FF5722]/30"></div>
            </div>
          </button>
        ))}
      </div>

      {/* Cities Level */}
      {selectedCountry && (
        <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fadeIn">
          {Array.from(countryMap.get(selectedCountry)!.cities.entries()).map(
            ([city, cityStories]) => (
              <button
                key={`${selectedCountry}-${city}`}
                onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                className={`px-4 py-3 rounded-lg shadow transition-all ${
                  selectedCity === city
                    ? "bg-[#FF7043] text-white scale-105"
                    : "bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-sm" />
                  <span className="font-semibold">{city}</span>
                  <span className="text-xs opacity-75">({cityStories.length})</span>
                </div>
              </button>
            )
          )}
        </div>
      )}

      {/* Stories Level */}
      {selectedCountry && selectedCity && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          {countryMap
            .get(selectedCountry)!
            .cities.get(selectedCity)!
            .map((story) => (
              <button
                key={story.id}
                onClick={() => onStorySelect(story)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-4 text-left group"
              >
                <div className="flex gap-3 mb-3">
                  {story.coverPhoto ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={story.coverPhoto}
                        alt={story.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#FF7043] flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 group-hover:text-[#FF5722] transition-colors line-clamp-1">
                      {story.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">{story.university}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                  {story.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className="font-semibold">{story.ratings.overall.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{story.duration}m</span>
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
