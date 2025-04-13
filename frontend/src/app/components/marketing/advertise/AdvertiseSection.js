'use client';

import React, { useState } from 'react';
import { ArrowRight, BarChart, Users, Zap, CheckCircle } from 'lucide-react';

const AdvertiseSection = () => {
  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    website: '',
    toolDescription: '',
    budget: '',
    goals: '',
    timeframe: 'short-term'
  });

  // Form status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError('There was an error submitting your advertising request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pricing plans
  const pricingPlans = [
    {
      name: "Standard",
      price: "$299",
      duration: "per month",
      features: [
        "Featured in Tools Directory",
        "1 Social Media Mention",
        "Basic Analytics Report",
        "30 Days Visibility"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Premium",
      price: "$799",
      duration: "per month",
      features: [
        "Priority Placement in Directory",
        "Homepage Feature (1 Week)",
        "3 Social Media Mentions",
        "Advanced Analytics Dashboard",
        "60 Days Visibility",
        "Newsletter Inclusion"
      ],
      cta: "Best Value",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      duration: "contact us",
      features: [
        "Featured Tool of the Month",
        "Custom Placement Options",
        "Dedicated Promotional Email",
        "Premium Analytics & Insights",
        "Custom Campaign Duration",
        "Content Partnership Options"
      ],
      cta: "Contact Us",
      highlighted: false
    }
  ];

  return (
    <section id="advertise-section" className="w-full py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Promote Your AI Tool to Our Audience
            </h1>
            <p className="text-xl text-gray-600 md:max-w-3xl mx-auto">
              Reach thousands of AI enthusiasts, developers, and business leaders looking for the latest tools
            </p>
          </div>

          {/* Audience Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users size={28} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">15,000+</h3>
              <p className="text-gray-600">Monthly Unique Visitors</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BarChart size={28} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">4.7%</h3>
              <p className="text-gray-600">Average Click-Through Rate</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Zap size={28} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">82%</h3>
              <p className="text-gray-600">Tech Decision Makers</p>
            </div>
          </div>

          {/* Pricing Plans */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Advertising Options</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden ${
                  plan.highlighted 
                    ? 'shadow-xl border-2 border-blue-500 relative' 
                    : 'shadow-md border border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 inset-x-0 bg-blue-500 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className={`p-6 ${plan.highlighted ? 'pt-8' : ''}`}>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.duration}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle size={18} className="text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium ${
                      plan.highlighted 
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition duration-200`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Success Message */}
          {isSuccess ? (
            <div className="bg-white rounded-xl shadow-xl p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Request Submitted Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in advertising with us. Our team will review your request and get back to you within 1-2 business days.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            /* Form Container */
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch About Advertising</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Tool Website *
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="toolDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Brief Tool Description *
                  </label>
                  <textarea
                    id="toolDescription"
                    name="toolDescription"
                    value={formData.toolDescription}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your AI tool in a few sentences"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Budget Range *
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="" disabled>Select a budget range</option>
                      <option value="$250 - $500">$250 - $500</option>
                      <option value="$500 - $1,000">$500 - $1,000</option>
                      <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                      <option value="$2,500+">$2,500+</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Timeframe *
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="short-term"
                          name="timeframe"
                          value="short-term"
                          checked={formData.timeframe === 'short-term'}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="short-term" className="ml-2 text-gray-700">
                          Short-term (1-3 months)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="long-term"
                          name="timeframe"
                          value="long-term"
                          checked={formData.timeframe === 'long-term'}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="long-term" className="ml-2 text-gray-700">
                          Long-term (6+ months)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="not-sure"
                          name="timeframe"
                          value="not-sure"
                          checked={formData.timeframe === 'not-sure'}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="not-sure" className="ml-2 text-gray-700">
                          Not sure yet
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                    Advertising Goals
                  </label>
                  <textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What are you hoping to achieve with your advertising campaign?"
                  />
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
                        Get Started <ArrowRight className="ml-2" size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Testimonials */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">AC</span>
                </div>
                <div>
                  <h4 className="font-semibold">Alex Chen</h4>
                  <p className="text-gray-600 text-sm">Marketing Director, DataSynth AI</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Advertising with ToolCurator.ai generated over 2,000 new sign-ups in our first month. The audience is highly targeted and converted better than any other channel we've tried."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">MJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Maya Johnson</h4>
                  <p className="text-gray-600 text-sm">Founder, IntelliDraft</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Being featured as Tool of the Month helped us secure our seed round. The exposure and credibility boost was exactly what we needed at our stage."
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-xl mb-2">How long does it take to get approved?</h3>
                <p className="text-gray-700">We review all advertising submissions within 1-2 business days and will contact you with next steps once approved.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-xl mb-2">What metrics will I receive?</h3>
                <p className="text-gray-700">All advertisers receive detailed reports on impressions, clicks, and estimated conversion metrics based on your plan level.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-xl mb-2">Can I target specific AI categories?</h3>
                <p className="text-gray-700">Yes, Premium and Enterprise plans allow for category-specific targeting to reach the most relevant audience for your tool.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-xl mb-2">What assets do I need to provide?</h3>
                <p className="text-gray-700">We'll need your logo, a product screenshot, and brief promotional copy. Our team will guide you through the exact specifications.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertiseSection;