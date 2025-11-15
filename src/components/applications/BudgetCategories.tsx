"use client";
import { useState } from "react";
import { FaPlane, FaShieldAlt, FaHome, FaShoppingCart, FaPencilAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import React from "react";

export type BudgetCategory = 
  | "matkakulut"
  | "vakuutukset"
  | "asuminen"
  | "ruoka_ja_arki"
  | "opintovalineet";

interface CategoryExpense {
  amount: number;
  notes: string;
}

interface BudgetCategoryData {
  category: BudgetCategory;
  title: string;
  description: string;
  icon: React.ReactElement;
  iconColor: string;
  bgColor: string;
}

interface BudgetCategoriesProps {
  onBudgetChange?: (expenses: Record<BudgetCategory, CategoryExpense>) => void;
}

export default function BudgetCategories({ onBudgetChange }: BudgetCategoriesProps) {
  const [expandedCategory, setExpandedCategory] = useState<BudgetCategory | null>(null);
  const [expenses, setExpenses] = useState<Record<BudgetCategory, CategoryExpense>>({
    matkakulut: { amount: 0, notes: "" },
    vakuutukset: { amount: 0, notes: "" },
    asuminen: { amount: 0, notes: "" },
    ruoka_ja_arki: { amount: 0, notes: "" },
    opintovalineet: { amount: 0, notes: "" },
  });

  const categories: BudgetCategoryData[] = [
    {
      category: "matkakulut",
      title: "Matkakulut",
      description: "Lennot, junat, bussit, kimppakyytit, viisumi",
      icon: <FaPlane size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      category: "vakuutukset",
      title: "Vakuutukset",
      description: "Matka- ja opiskelija­vakuutukset",
      icon: <FaShieldAlt size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      category: "asuminen",
      title: "Asuminen",
      description: "Vuokra ja -vakuus, muut asuntoon liittyvät laskut",
      icon: <FaHome size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      category: "ruoka_ja_arki",
      title: "Ruoka ja arki",
      description: "Kaupat ja ravintolat, hygieniä",
      icon: <FaShoppingCart size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      category: "opintovalineet",
      title: "Opintovalineet",
      description: "Kirjat, materiaalit, tietokone",
      icon: <FaPencilAlt size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ];

  const handleCategoryClick = (category: BudgetCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const updateAmount = (category: BudgetCategory, newAmount: number) => {
    const updatedExpenses = {
      ...expenses,
      [category]: { ...expenses[category], amount: Math.max(0, newAmount) }
    };
    setExpenses(updatedExpenses);
    onBudgetChange?.(updatedExpenses);
  };

  const updateNotes = (category: BudgetCategory, notes: string) => {
    const updatedExpenses = {
      ...expenses,
      [category]: { ...expenses[category], notes }
    };
    setExpenses(updatedExpenses);
    onBudgetChange?.(updatedExpenses);
  };

  const adjustAmount = (category: BudgetCategory, delta: number) => {
    const currentAmount = expenses[category].amount;
    updateAmount(category, currentAmount + delta);
  };

  const getTotalAmount = () => {
    return Object.values(expenses).reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--typography)]">Budjetti</h2>
        <div className="text-right">
          <p className="text-sm text-[var(--typography)]">Kokonaissumma</p>
          <p className="text-2xl font-bold text-[#FF5722]">{getTotalAmount()}€</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {categories.map((cat) => {
          const isExpanded = expandedCategory === cat.category;
          const expense = expenses[cat.category];
          
          return (
            <div key={cat.category} className="bg-white rounded-lg border border-[var(--va-border)] overflow-hidden shadow-sm">
              <button
                onClick={() => handleCategoryClick(cat.category)}
                className={`w-full p-4 transition-all ${isExpanded ? cat.bgColor : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`${cat.iconColor} flex-shrink-0`}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-[var(--typography)] mb-1">{cat.title}</h3>
                    <p className="text-sm text-[var(--typography)]">{cat.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-[#FF5722]">{expense.amount}€</span>
                    {isExpanded ? <FaChevronUp className="text-[var(--typography)]" /> : <FaChevronDown className="text-[var(--typography)]" />}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 border-t border-[var(--va-border)] bg-gray-50 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--typography)] mb-2">
                      Arvioitu summa (€)
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => adjustAmount(cat.category, -50)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-[var(--typography)] transition-colors"
                      >
                        -50
                      </button>
                      <input
                        type="number"
                        value={expense.amount}
                        onChange={(e) => updateAmount(cat.category, parseInt(e.target.value) || 0)}
                        className="flex-1 px-4 py-2 border border-[var(--va-border)] rounded-lg focus:ring-2 focus:ring-[#FF5722] focus:border-transparent text-center text-lg font-semibold"
                        min="0"
                      />
                      <button
                        onClick={() => adjustAmount(cat.category, 50)}
                        className="px-3 py-2 bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-lg font-medium transition-colors"
                      >
                        +50
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--typography)] mb-2">
                      Muistiinpanot
                    </label>
                    <textarea
                      value={expense.notes}
                      onChange={(e) => updateNotes(cat.category, e.target.value)}
                      placeholder="Lisää tarkempia tietoja kustannuksista..."
                      className="w-full px-4 py-2 border border-[var(--va-border)] rounded-lg focus:ring-2 focus:ring-[#FF5722] focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
