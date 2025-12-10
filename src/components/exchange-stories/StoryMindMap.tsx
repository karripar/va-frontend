"use client";
import { useState } from "react";
import { ExchangeStory } from "@/hooks/exchangeStoriesHooks";
import { FaMapMarkerAlt } from "react-icons/fa";

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
    <div className="w-full min-h-[70vh] flex flex-col">
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
              {selectedCountry === country && (
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
                  <div className="w-1 h-10 bg-white"></div>
                  <div className="w-4 h-4 border-l-[3px] border-b-[3px] border-white rotate-[-45deg] translate-y-[-6px]"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Cities Level */}
      {selectedCountry && (
        <div className="flex flex-wrap justify-center gap-4 mb-8 mt-12 animate-fadeIn">
          {Array.from(countryMap.get(selectedCountry)!.cities.entries()).map(
            ([city, cityStories]) => (
              <div key={`${selectedCountry}-${city}`} className="relative">
                <button
                  onClick={() => {
                    if (cityStories.length === 1) {
                      onStorySelect(cityStories[0]);
                    } else {
                      setSelectedCity(selectedCity === city ? null : city);
                    }
                  }}
                  className={`px-4 py-3 rounded-2xl shadow transition-all relative ${
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
                  {selectedCity === city && cityStories.length > 1 && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                      <div className="w-0.5 h-6 bg-[#FF7043]"></div>
                      <div className="w-3 h-3 border-l-2 border-b-2 border-[#FF7043] rotate-[-45deg] translate-y-[-4px]"></div>
                    </div>
                  )}
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Stories Level */}
      {selectedCountry && selectedCity && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn mt-12">
          {countryMap
            .get(selectedCountry)!
            .cities.get(selectedCity)!
            .map((story) => (
              <button
                key={story.id}
                onClick={() => onStorySelect(story)}
                className="relative bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl transition-all p-8 text-center group border-3 border-gray-300 hover:border-[#FF5722]"
                style={{
                  borderRadius: '60% 40% 60% 40% / 70% 50% 50% 30%',
                  minHeight: '200px',
                  minWidth: '220px'
                }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <h4 className="font-bold text-gray-900 group-hover:text-[#FF5722] transition-colors text-lg mb-2">
                    Student&apos;s story
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    {story.title}
                  </p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
