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

export default function StoryMindMap({
  stories,
  onStorySelect,
}: StoryMindMapProps) {
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
            className={`relative group transition-all cursor-pointer ${
              selectedCountry === country ? "scale-110 z-10" : "hover:scale-105"
            }`}
          >
            <div
              className={`px-6 py-4 rounded-xl shadow-lg transition-all ${
                selectedCountry === country
                  ? "bg-[#FF5722] text-white ring-4 ring-[#FF5722]/30"
                  : "bg-white text-[var(--typography)] hover:shadow-xl"
              }`}
            >
              <div className="text-lg font-bold mb-1">{country}</div>
              <div className="text-sm opacity-80">
                {cities.size} {cities.size === 1 ? "city" : "cities"}
              </div>
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
                role="button"
                key={`${selectedCountry}-${city}`}
                onClick={() =>
                  setSelectedCity(selectedCity === city ? null : city)
                }
                className={`px-4 py-3 rounded-lg shadow transition-all cursor-pointer ${
                  selectedCity === city
                    ? "bg-[#FF7043] text-white scale-105"
                    : "bg-white text-[var(--typography)] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-sm" />
                  <span className="font-semibold">{city}</span>
                  <span className="text-xs opacity-75">
                    ({cityStories.length})
                  </span>
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
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-4 text-left group cursor-pointer"
              >
                <div className="flex gap-3 mb-3">
            
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[var(--typography)] group-hover:text-[#FF5722] transition-colors line-clamp-1">
                      {story.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center text-xs text-[var(--typography)]">
                  <FaMapMarkerAlt className="text-[#FF5722] mr-1" />
                  <span>{story.university}</span>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
