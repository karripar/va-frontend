"use client";
import { useState } from "react";
import { FaPlane, FaShieldAlt, FaHome, FaShoppingCart, FaPencilAlt } from "react-icons/fa";
import React from "react";
import { BudgetCategory } from "va-hybrid-types/contentTypes";

interface BudgetCategoryData {
  category: BudgetCategory;
  title: string;
  description: string;
  icon: React.ReactElement;
  iconColor: string;
  bgColor: string;
}

interface BudgetCategoriesProps {
  onCategorySelect?: (category: BudgetCategory) => void;
}

export default function BudgetCategories({ onCategorySelect }: BudgetCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);

  const categories: BudgetCategoryData[] = [
    {
      category: "matkakulut",
      title: "Matkakulut",
      description: "Lennot, junat, bussit, kimppakyytit, viisumi",
      icon: <FaPlane size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50 hover:bg-orange-100"
    },
    {
      category: "vakuutukset",
      title: "Vakuutukset",
      description: "Matka- ja opiskelija­vakuutukset",
      icon: <FaShieldAlt size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50 hover:bg-orange-100"
    },
    {
      category: "asuminen",
      title: "Asuminen",
      description: "Vuokra ja -vakuus, muut asuntoon liittyvät laskut",
      icon: <FaHome size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50 hover:bg-orange-100"
    },
    {
      category: "ruoka ja arki",
      title: "Ruoka ja arki",
      description: "Kaupat ja ravintolat, hygieniä",
      icon: <FaShoppingCart size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50 hover:bg-orange-100"
    },
    {
      category: "opintovalineet",
      title: "Opintovalineet",
      description: "Kirjat, materiaalit, tietokone",
      icon: <FaPencilAlt size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50 hover:bg-orange-100"
    }
  ];

  const handleCategoryClick = (category: BudgetCategory) => {
    setSelectedCategory(category);
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  return (
    <div className="space-y-4 my-2">
      <h2 className="text-lg font-semibold text-[var(--typography)]">Mahdolliset kustannukset</h2>
      
      <div className="space-y-3 ">
        {categories.map((cat) => (
          <button
            key={cat.category}
            onClick={() => handleCategoryClick(cat.category)}
            className={`w-full p-4 rounded-lg transition-all border border-[var(--va-border)]  ${
              selectedCategory === cat.category 
                ? "border-orange-500 bg-orange-50" 
                : " bg-white hover:bg-orange-50"
            } ${cat.bgColor}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`${cat.iconColor} flex-shrink-0 mt-1`}>
                {cat.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-[var(--typography)] mb-1">{cat.title}</h3>
                <p className="text-sm text-[var(--typography)]">{cat.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
