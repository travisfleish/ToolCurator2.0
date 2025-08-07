'use client';

import { useState } from 'react';

const useNewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  // Add a diagnostic function
  const runDiagnostic = async () => {
    try {
      console.log('Running API diagnostic check...');
      const response = await fetch('/api/diagnostic');
      const data = await response.json();
      console.log('Diagnostic results:', data);
      setDebugInfo(data);
      return data;
    } catch (err) {
      console.error('Diagnostic check failed:', err);
      setDebugInfo({ success: false, error: err.message });
      return { success: false, error: err.message };
    }
  };

  const handleSubscribe = async (e) => {
    if (e) e.preventDefault();

    setIsSubmitting(true);
    setError('');
    setMessage('');
    setDebugInfo(null);

    try {
      // Log request start time for performance tracking
      const startTime = performance.now();
      console.log(`Subscribe form submitted at ${new Date().toISOString()}`);

      // Validate email
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Enhanced logging with request details
      console.log('Submitting email subscription:', {
        email,
        url: window.location.href,
        apiEndpoint: '/api/subscribe'
      });

      // Make API call with detailed debugging
      let response;
      try {
        console.log('Sending fetch request to API...');
        response = await fetch(`/api/subscribe-redis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        console.log('Response received:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers])
        });
      } catch (fetchError) {
        console.error('Network error during fetch:', fetchError);
        throw new Error(`Network error: ${fetchError.message}`);
      }

      // Get response as text first
      let responseText;
      try {
        responseText = await response.text();
        console.log('Response text:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
      } catch (textError) {
        console.error('Error getting response text:', textError);
        throw new Error('Failed to read API response');
      }

      // Parse the JSON response
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('Error parsing response JSON:', parseError);
        throw new Error(`Invalid API response format: ${responseText.substring(0, 50)}...`);
      }

      // Performance tracking
      const endTime = performance.now();
      console.log(`API call completed in ${Math.round(endTime - startTime)}ms`);

      // Handle error responses
      if (!response.ok) {
        console.error('API error response:', data);
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (data.error) {
        console.error('Application error in response:', data.error);
        throw new Error(data.error);
      }

      // Handle success
      setIsSuccess(true);
      setMessage(data.message || "Thank you for subscribing!");
      setEmail("");

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
      }, 5000);

      return { success: true, data };
    } catch (err) {
      console.error('Newsletter form error:', err);
      setError(err.message || 'Failed to subscribe. Please try again later.');
      setMessage(err.message || 'Failed to subscribe. Please try again later.');
      setIsSuccess(false);

      // Run diagnostic automatically on error
      await runDiagnostic();

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    message,
    setMessage,
    isSubmitting,
    isSuccess,
    error,
    handleSubscribe,
    runDiagnostic,
    debugInfo
  };
};

export default useNewsletterForm;