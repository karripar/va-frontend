"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "fi" | "en";

interface LanguageContextProps {
    language: Language;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>("fi");

    useEffect(() => {
        const storedLanguage = localStorage.getItem("language") as Language;
        if (storedLanguage === "fi" || storedLanguage === "en") {
            setLanguage(storedLanguage);
        }
    }, []);

    const toggleLanguage = () => {
        const newLanguage = language === "fi" ? "en" : "fi";
        setLanguage(newLanguage);
        localStorage.setItem("language", newLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

    