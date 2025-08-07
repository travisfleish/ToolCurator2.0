'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@formspree/react';

const useNewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Use Formspree hook with your form ID
  const [state, handleFormspreeSubmit] = useForm("xyzpbwbe");

  // Handle form submission
  const handleSubscribe = async (e) => {
    if (e) e.preventDefault();

    // Validate email before submission
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address');
      return { success: false, error: 'Invalid email' };
    }

    // Create form data for Formspree
    const formData = new FormData();
    formData.append('email', email);

    // Anti-spam: Add these special Formspree fields
    formData.append('_subject', 'New ToolCurator.ai Newsletter Subscription');
    formData.append('_gotcha', ''); // Honeypot field - should be empty

    // Optional: Add metadata that doesn't trigger spam filters
    formData.append('form_type', 'newsletter');
    formData.append('website', 'ToolCurator.ai');

    // Avoid fields that might trigger spam filters
    // Don't include: timestamp, page_url in the initial setup

    // Submit to Formspree
    await handleFormspreeSubmit(formData);

    return { success: true };
  };

  // Handle Formspree state changes
  useEffect(() => {
    if (state.succeeded) {
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail(''); // Clear email field

      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } else if (state.errors && state.errors.length > 0) {
      // Handle Formspree errors
      const errorMessage = state.errors
        .map(err => err.message)
        .join(', ');
      setMessage(errorMessage || 'Failed to subscribe. Please try again.');
    }
  }, [state.succeeded, state.errors]);

  return {
    email,
    setEmail,
    message,
    setMessage,
    isSubmitting: state.submitting,
    isSuccess: state.succeeded,
    error: state.errors?.[0]?.message || '',
    handleSubscribe,
    // Keep these for compatibility with existing components
    runDiagnostic: async () => ({ success: true, message: 'Using Formspree' }),
    debugInfo: null,
    formspreeState: state
  };
};

export default useNewsletterForm;