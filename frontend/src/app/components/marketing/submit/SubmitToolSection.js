'use client';

import React, { useState } from 'react';
import { ArrowRight, Upload, Check, ChevronDown } from 'lucide-react';

const SubmitToolSection = () => {
  // Form state
  const [formData, setFormData] = useState({
    toolName: '',
    websiteUrl: '',
    description: '',
    shortDescription: '',
    category: '',
    pricingModel: '',
    imageUrl: '',
    submitterName: '',
    submitterEmail: ''
  });

  // Form status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Category options
  const categories = [
    'Content Creation',
    'Data Analysis',
    'Coding & Development',
    'Marketing',
    'Productivity',
    'Customer Support',
    'Image Generation',
    'Video Editing',
    'Audio Processing',
    'Research',
    'Other'
  ];

  // Pricing models
  const pricingModels = [
    'Free',
    'Free Trial',
    'Freemium',
    'Subscription',
    'One-time Purchase',
    'Pay-per-use',
    'Enterprise'
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Here you would typically send the data to your API
      // For now we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);

      // Reset form after success (optional)
      // setFormData({
      //   toolName: '',
      //   websiteUrl: '',
      //   description: '',
      //   shortDescription: '',
      //   category: '',
      //   pricingModel: '',
      //   imageUrl: '',
      //   submitterName: '',
      //   submitterEmail: ''
      // });
    } catch (err) {
      setError('There was an error submitting your tool. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="submit-tool-section" className="w-full py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Submit Your AI Tool
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Help us grow the largest curated collection of AI tools
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold">
                  1
                </div>
                <span className="ml-2 text-gray-700">Complete the form</span>
              </div>
              <ArrowRight className="text-gray-400" />
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold">
                  2
                </div>
                <span className="ml-2 text-gray-700">We review your submission</span>
              </div>
              <ArrowRight className="text-gray-400" />
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold">
                  3
                </div>
                <span className="ml-2 text-gray-700">Tool gets listed</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {isSuccess ? (
            <div className="bg-white rounded-xl shadow-xl p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tool Submitted Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for your submission. Our team will review your tool and list it on ToolCurator.ai soon.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Submit Another Tool
              </button>
            </div>
          ) : (
            /* Form Container */
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Tool Information Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Tool Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="toolName" className="block text-sm font-medium text-gray-700 mb-1">
                        Tool Name *
                      </label>
                      <input
                        type="text"
                        id="toolName"
                        name="toolName"
                        value={formData.toolName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., AI Content Generator"
                      />
                    </div>

                    <div>
                      <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL *
                      </label>
                      <input
                        type="url"
                        id="websiteUrl"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description * (max 100 characters)
                    </label>
                    <input
                      type="text"
                      id="shortDescription"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="A brief one-line description of your tool"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Provide a detailed description of what your tool does, key features, and benefits"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <div className="relative">
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="appearance-none w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="" disabled>Select a category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="pricingModel" className="block text-sm font-medium text-gray-700 mb-1">
                        Pricing Model *
                      </label>
                      <div className="relative">
                        <select
                          id="pricingModel"
                          name="pricingModel"
                          value={formData.pricingModel}
                          onChange={handleChange}
                          required
                          className="appearance-none w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="" disabled>Select pricing model</option>
                          {pricingModels.map(model => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Tool Image URL (optional)
                    </label>
                    <div className="flex">
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.png"
                      />
                      <button
                        type="button"
                        className="bg-gray-100 text-gray-700 px-4 rounded-r-lg border border-l-0 border-gray-300 hover:bg-gray-200 transition"
                      >
                        <Upload size={20} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Provide a URL to your tool&apos;s logo or screenshot (min 400x400px)
                    </p>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="submitterName" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="submitterName"
                        name="submitterName"
                        value={formData.submitterName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="submitterEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        id="submitterEmail"
                        name="submitterEmail"
                        value={formData.submitterEmail}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        We&apos;ll only use this to contact you about your submission
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Tool <ArrowRight className="ml-2" size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Testimonials or Additional Information */}
          <div className="mt-16 text-center">
            <p className="text-xl text-gray-600 italic mb-4">
              &quot;Having our AI tool featured on ToolCurator.ai helped us gain over 5,000 new users in just one week!&quot;
            </p>
            <p className="text-gray-700 font-medium">
              — Sarah Chen, Founder of WordGenius AI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitToolSection;