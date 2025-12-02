"use client";
import fetchData from "@/lib/fetchData";
import { useState } from "react";
import {BudgetEstimateData } from "va-hybrid-types/contentTypes";

const useBudgetEstimate = () => {
  const [budget, setBudget] = useState<BudgetEstimateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = async (destination?: string) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const query = destination ? `?destination=${destination}` : '';
      const data = await fetchData<BudgetEstimateData>(
        `${apiUrl}/budgets/estimate${query}`
      );

      setBudget(data);
    } catch (err: unknown) {
      console.error("Error fetching budget:", err);
      setError("Failed to fetch budget");
    } finally {
      setLoading(false);
    }
  };

  const saveBudget = async (budgetData: BudgetEstimateData) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
      const response = await fetch(`${apiUrl}/budgets/estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(budgetData),
      });

      if (!response.ok) {
        throw new Error('Failed to save budget');
      }

      const result = await response.json();
      setBudget(result);
      
      return result;
    } catch (err: unknown) {
      console.error("Error saving budget:", err);
      setError("Failed to save budget");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    budget, 
    loading, 
    error, 
    fetchBudget, 
    saveBudget 
  };
};

export {useBudgetEstimate};