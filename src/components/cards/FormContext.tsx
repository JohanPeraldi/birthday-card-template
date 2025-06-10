import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FormData {
  // Step 1: Recipient Info
  recipientName: string;
  recipientAge: string;
  cardTitle: string;

  // Step 2: Message & Design
  message: string[];
  senderName: string;
  theme: string;
  customImage?: File;
  customImagePreview?: string;

  // Step 3: Delivery
  deliveryMethod: 'magic-link' | 'qr-code';
  recipientEmail: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

interface FormContextType {
  // Form data
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;

  // Current step
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Validation
  errors: ValidationErrors;
  setErrors: (errors: ValidationErrors) => void;
  validateStep: (step: number) => boolean;

  // Navigation
  canProceed: boolean;
  completedSteps: Set<number>;
  markStepComplete: (step: number) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const initialFormData: FormData = {
  recipientName: '',
  recipientAge: '',
  cardTitle: '',
  message: [''],
  senderName: '',
  theme: 'classic-purple',
  deliveryMethod: 'magic-link',
  recipientEmail: '',
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear related errors when data is updated
    const newErrors = { ...errors };
    Object.keys(data).forEach((key) => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const markStepComplete = (step: number) => {
    setCompletedSteps((prev) => new Set(Array.from(prev).concat(step)));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 1:
        if (!formData.recipientName.trim()) {
          newErrors.recipientName = 'Recipient name is required';
        }
        if (!formData.cardTitle.trim()) {
          newErrors.cardTitle = 'Card title is required';
        }
        if (
          formData.recipientAge &&
          (isNaN(Number(formData.recipientAge)) ||
            Number(formData.recipientAge) < 1 ||
            Number(formData.recipientAge) > 150)
        ) {
          newErrors.recipientAge = 'Please enter a valid age (1-150)';
        }
        break;

      case 2:
        if (!formData.message[0]?.trim()) {
          newErrors.message = 'At least one message line is required';
        }
        if (!formData.senderName.trim()) {
          newErrors.senderName = 'Your name is required';
        }
        break;

      case 3:
        if (
          formData.deliveryMethod === 'magic-link' &&
          !formData.recipientEmail.trim()
        ) {
          newErrors.recipientEmail =
            'Email is required for magic link delivery';
        }
        if (
          formData.deliveryMethod === 'magic-link' &&
          formData.recipientEmail &&
          !isValidEmail(formData.recipientEmail)
        ) {
          newErrors.recipientEmail = 'Please enter a valid email address';
        }
        break;
    }

    const isValid = Object.keys(newErrors).length === 0;

    // Only update errors if there are validation errors OR if we're clearing previous errors
    if (!isValid || Object.keys(errors).length > 0) {
      setErrors(newErrors);
    }

    if (isValid) {
      markStepComplete(step);
    }

    return isValid;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canProceed = true; // Will be determined when user clicks Next

  const value: FormContextType = {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    errors,
    setErrors,
    validateStep,
    canProceed,
    completedSteps,
    markStepComplete,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
