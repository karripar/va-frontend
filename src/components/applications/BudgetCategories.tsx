"use client";
import { useState, useEffect } from "react";
import { FaPlane, FaShieldAlt, FaHome, FaShoppingCart, FaPencilAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations/applications";
import { useBudgetEstimate } from "@/hooks/budgetArviointiHooks";

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
  const { language } = useLanguage();
  const t = translations[language];
  const { budget, saveBudget, fetchBudget } = useBudgetEstimate();
  const [expandedCategory, setExpandedCategory] = useState<BudgetCategory | null>(null);
  const [expenses, setExpenses] = useState<Record<BudgetCategory, CategoryExpense>>({
    matkakulut: { amount: 0, notes: "" },
    vakuutukset: { amount: 0, notes: "" },
    asuminen: { amount: 0, notes: "" },
    ruoka_ja_arki: { amount: 0, notes: "" },
    opintovalineet: { amount: 0, notes: "" },
  });

  // Fetch budget data on mount
  useEffect(() => {
    fetchBudget();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load budget data when available
  useEffect(() => {
    if (budget?.categories) {
      const loadedExpenses: Record<BudgetCategory, CategoryExpense> = {
        matkakulut: { amount: 0, notes: "" },
        vakuutukset: { amount: 0, notes: "" },
        asuminen: { amount: 0, notes: "" },
        ruoka_ja_arki: { amount: 0, notes: "" },
        opintovalineet: { amount: 0, notes: "" },
      };
      
      // Map budget categories to expenses if available
      Object.entries(budget.categories || {}).forEach(([key, value]) => {
        if (key in loadedExpenses && typeof value === 'object' && value !== null) {
          loadedExpenses[key as BudgetCategory] = { 
            amount: value.estimatedCost || 0, 
            notes: value.notes || "" 
          };
        }
      });
      
      setExpenses(loadedExpenses);
    }
  }, [budget]);

  const categories: BudgetCategoryData[] = [
    {
      category: "matkakulut",
      title: t.budgetCategoryTravel,
      description: t.budgetCategoryTravelDesc,
      icon: <FaPlane size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      category: "vakuutukset",
      title: t.budgetCategoryInsurance,
      description: t.budgetCategoryInsuranceDesc,
      icon: <FaShieldAlt size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      category: "asuminen",
      title: t.budgetCategoryHousing,
      description: t.budgetCategoryHousingDesc,
      icon: <FaHome size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      category: "ruoka_ja_arki",
      title: t.budgetCategoryFood,
      description: t.budgetCategoryFoodDesc,
      icon: <FaShoppingCart size={24} />,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      category: "opintovalineet",
      title: t.budgetCategoryStudy,
      description: t.budgetCategoryStudyDesc,
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
    
    // Save to backend
    saveBudgetToBackend(updatedExpenses);
  };

  const updateNotes = (category: BudgetCategory, notes: string) => {
    const updatedExpenses = {
      ...expenses,
      [category]: { ...expenses[category], notes }
    };
    setExpenses(updatedExpenses);
    onBudgetChange?.(updatedExpenses);
    
    // Save to backend
    saveBudgetToBackend(updatedExpenses);
  };

  const saveBudgetToBackend = async (budgetExpenses: Record<BudgetCategory, CategoryExpense>) => {
    try {
      const categories: Record<string, { estimatedCost: number; notes?: string }> = {};
      Object.entries(budgetExpenses).forEach(([key, value]) => {
        categories[key] = {
          estimatedCost: value.amount,
          notes: value.notes || undefined,
        };
      });
      
      await saveBudget({
        categories,
        totalEstimate: Object.values(budgetExpenses).reduce((sum, exp) => sum + exp.amount, 0),
        destination: budget?.destination || "",
        currency: budget?.currency || "EUR",
      });
    } catch (error) {
      console.error("Error saving budget:", error);
    }
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
        <h2 className="text-xl font-semibold text-[var(--typography)]">{t.budgetTitle}</h2>
        <div className="text-right">
          <p className="text-sm text-[var(--typography)]">{t.budgetTotalLabel}</p>
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
                      {t.budgetEstimatedAmount}
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
                      {t.budgetNotesLabel}
                    </label>
                    <textarea
                      value={expense.notes}
                      onChange={(e) => updateNotes(cat.category, e.target.value)}
                      placeholder={t.budgetNotesPlaceholder}
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
