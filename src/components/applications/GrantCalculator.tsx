"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTimes, FaDivide, FaEquals, FaHistory } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations/applications";
import { useCalculatorHistory } from "@/hooks/calculatorHooks";

interface GrantCalculatorProps {
  onCalculate?: (result: number) => void;
}

type Operation = "add" | "subtract" | "multiply" | "divide" | null;

export default function GrantCalculator({ onCalculate }: GrantCalculatorProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const { history: savedHistory, saveHistoryEntry, clearHistory: clearSavedHistory } = useCalculatorHistory();
  const [currentValue, setCurrentValue] = useState<string>("0");
  const [previousValue, setPreviousValue] = useState<string>("");
  const [operation, setOperation] = useState<Operation>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Load saved history when available
  useEffect(() => {
    if (savedHistory && savedHistory.length > 0) {
      setHistory(savedHistory.map(entry => entry.calculation));
    }
  }, [savedHistory]);

  const handleNumberClick = (num: string) => {
    if (currentValue === "0" && num !== ".") {
      setCurrentValue(num);
    } else if (currentValue.includes(".") && num === ".") {
      return;
    } else if (currentValue.length < 12) {
      setCurrentValue(currentValue + num);
    }
  };

  const handleOperationClick = (op: Operation) => {
    if (previousValue && operation && currentValue) {
      calculate();
    }
    setPreviousValue(currentValue);
    setCurrentValue("0");
    setOperation(op);
  };

  const calculate = () => {
    if (!previousValue || !operation) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result = 0;

    switch (operation) {
      case "add":
        result = prev + current;
        break;
      case "subtract":
        result = prev - current;
        break;
      case "multiply":
        result = prev * current;
        break;
      case "divide":
        result = current !== 0 ? prev / current : 0;
        break;
    }

    const operationSymbol = {
      add: "+",
      subtract: "-",
      multiply: "×",
      divide: "÷"
    }[operation || "add"];

    const calculation = `${prev} ${operationSymbol} ${current} = ${result.toFixed(2)}`;
    setHistory([calculation, ...history.slice(0, 4)]);
    
    // Save to backend
    saveHistoryEntry({
      calculation,
      result,
    });
    
    setCurrentValue(result.toFixed(2));
    setPreviousValue("");
    setOperation(null);
    onCalculate?.(result);
  };

  const clear = () => {
    setCurrentValue("0");
    setPreviousValue("");
    setOperation(null);
  };

  const clearHistory = async () => {
    setHistory([]);
    await clearSavedHistory();
  };

  const backspace = () => {
    if (currentValue.length > 1) {
      setCurrentValue(currentValue.slice(0, -1));
    } else {
      setCurrentValue("0");
    }
  };

  const getOperationColor = (op: Operation) => {
    return operation === op ? "bg-[#FF5722] text-white" : "bg-orange-100 text-[#FF5722] hover:bg-orange-200";
  };

  const numberButtons = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    "0", ".", "00"
  ];

  return (
    <div className="space-y-6">
      {/* Info Header */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
        <h3 className="font-semibold text-[var(--typography)] mb-1 flex items-center gap-2">
          💰 {t.budgetCalculatorTitle}
        </h3>
        <p className="text-sm text-[var(--typography)]">
          {t.budgetCalculatorDesc}
        </p>
      </div>

      {/* Calculator Display */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-[var(--va-border)]">
        <div className="mb-4">
          {previousValue && (
            <div className="text-right text-sm text-[var(--typography)] mb-1">
              {previousValue} {operation && { add: "+", subtract: "-", multiply: "×", divide: "÷" }[operation]}
            </div>
          )}
          <div className="text-right">
            <input
              type="text"
              value={currentValue}
              readOnly
              className="w-full text-4xl font-bold text-[#FF5722] bg-transparent text-right border-none focus:outline-none"
            />
            <div className="text-sm text-[var(--typography)] mt-1">€ EUR</div>
          </div>
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Clear and Backspace */}
          <button
            onClick={clear}
            className="col-span-2 py-4 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors"
          >
            {t.calculatorClear}
          </button>
          <button
            onClick={backspace}
            className="py-4 bg-gray-100 text-[var(--typography)] rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => handleOperationClick("divide")}
            className={`py-4 rounded-lg font-bold text-xl transition-colors flex items-center justify-center ${getOperationColor("divide")}`}
          >
            <FaDivide />
          </button>

          {/* Number Pad */}
          {numberButtons.slice(0, 3).map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="py-4 bg-gray-50 text-[var(--typography)] rounded-lg font-semibold text-xl hover:bg-gray-100 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperationClick("multiply")}
            className={`py-4 rounded-lg font-bold text-xl transition-colors flex items-center justify-center ${getOperationColor("multiply")}`}
          >
            <FaTimes />
          </button>

          {numberButtons.slice(3, 6).map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="py-4 bg-gray-50 text-[var(--typography)] rounded-lg font-semibold text-xl hover:bg-gray-100 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperationClick("subtract")}
            className={`py-4 rounded-lg font-bold text-xl transition-colors flex items-center justify-center ${getOperationColor("subtract")}`}
          >
            <FaMinus />
          </button>

          {numberButtons.slice(6, 9).map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="py-4 bg-gray-50 text-[var(--typography)] rounded-lg font-semibold text-xl hover:bg-gray-100 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperationClick("add")}
            className={`py-4 rounded-lg font-bold text-xl transition-colors flex items-center justify-center ${getOperationColor("add")}`}
          >
            <FaPlus />
          </button>

          {/* Bottom Row */}
          {numberButtons.slice(9).map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="py-4 bg-gray-50 text-[var(--typography)] rounded-lg font-semibold text-xl hover:bg-gray-100 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={calculate}
            className="py-4 bg-[#FF5722] text-white rounded-lg font-bold text-xl hover:bg-[#F4511E] transition-colors flex items-center justify-center"
          >
            <FaEquals />
          </button>
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 border border-[var(--va-border)]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[var(--typography)] flex items-center gap-2">
              <FaHistory className="text-orange-500" />
              {language === 'fi' ? 'Historia' : 'History'}
            </h4>
            <button
              onClick={clearHistory}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              {language === 'fi' ? 'Tyhjennä' : 'Clear'}
            </button>
          </div>
          <div className="space-y-2">
            {history.map((calc, index) => (
              <div
                key={index}
                className="text-sm text-[var(--typography)] bg-gray-50 p-2 rounded font-mono"
              >
                {calc}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">{t.calculatorTips}</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>{t.calculatorTip1}</li>
          <li>{t.calculatorTip2}</li>
          <li>{t.calculatorTip3}</li>
        </ul>
      </div>
    </div>
  );
}