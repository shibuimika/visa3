"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type FormData = {
    // Step N1
    nameRomaji?: string;
    nameNative?: string;
    birthDate?: string;
    nationality?: string;
    homeAddress?: string;
    homePhone?: string;
    email?: string;
    // Step N2
    passportNumber?: string;
    passportIssueDate?: string;
    passportExpiryDate?: string;
    // Add other fields as needed
    [key: string]: unknown;
};

type FormContextType = {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
    const [formData, setFormData] = useState<FormData>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("visa-form-data");
        if (saved) {
            try {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                setFormData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse form data", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("visa-form-data", JSON.stringify(formData));
        }
    }, [formData, isLoaded]);

    const updateFormData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData }}>
            {children}
        </FormContext.Provider>
    );
}

export function useFormContext() {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
}
