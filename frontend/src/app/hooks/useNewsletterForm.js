// hooks/useNewsletterForm.js
import { useState } from 'react';

const useNewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setMessage('');
    setError(null);

    try {
      // Use the Next.js API route
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setMessage(data.message || 'Thanks! You are on the list ✨');
        setEmail('');
      } else {
        setMessage(data.message || 'Oops! Something went wrong. Try again later.');

        if (data.error) {
          setError(new Error(data.error));
        }
      }
    } catch (err) {
      console.error(err);
      setError(err);
      setMessage('Oops! Something went wrong. Try again later.');
    }

    setIsSubmitting(false);
  };

  return {
    email,
    setEmail,
    message,
    isSubmitting,
    isSuccess,
    error,
    handleSubscribe,
  };
};

export default useNewsletterForm;