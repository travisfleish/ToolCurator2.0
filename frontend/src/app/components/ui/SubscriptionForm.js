import React from 'react';
import { useNewsletterForm } from '../../hooks/useNewsletterForm';

const SubscriptionForm = ({ className }) => {
  const {
    email,
    message,
    setEmail,
    handleSubscribe
  } = useNewsletterForm();

  return (
    <div className={className}>
      <form
        className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2"
        onSubmit={handleSubscribe}
      >
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-6 py-3 rounded-lg text-gray-900 border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-full sm:w-auto flex-grow text-base shadow-md"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-md w-full sm:w-auto whitespace-nowrap"
        >
          Request Now
        </button>
      </form>
      {message && (
        <p className="text-lg mt-2 font-medium text-center sm:text-left text-white">
          {message}
        </p>
      )}
    </div>
  );
};

export default SubscriptionForm;