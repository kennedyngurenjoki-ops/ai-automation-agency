import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ArrowLeftIcon,
  ArrowRightIcon,
  UserIcon,
  BuildingOfficeIcon,
  CogIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ClientOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Info
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    
    // Contact Info
    name: '',
    email: '',
    phone: '',
    role: '',
    
    // Business Needs
    currentChallenges: [],
    automationGoals: [],
    timeSpentOnTasks: '',
    budget: '',
    timeline: '',
    
    // Current Tools
    currentTools: [],
    integrationNeeds: [],
    additionalInfo: ''
  });

  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission - send to API, show success message, etc.
    alert('Thank you! We\'ll contact you within 24 hours to schedule your free consultation.');
  };

  const steps = [
    { number: 1, title: 'Company Info', icon: BuildingOfficeIcon },
    { number: 2, title: 'Contact Details', icon: UserIcon },
    { number: 3, title: 'Business Needs', icon: CogIcon },
    { number: 4, title: 'Current Setup', icon: DocumentTextIcon }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Manufacturing',
    'Education', 'Real Estate', 'Marketing/Advertising', 'Consulting', 'Other'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-1000 employees', '1000+ employees'
  ];

  const challenges = [
    'Manual data entry', 'Email management', 'Customer support',
    'Lead generation', 'Social media management', 'Report generation',
    'Invoice processing', 'Appointment scheduling', 'Inventory management'
  ];

  const automationGoals = [
    'Save time', 'Reduce errors', 'Improve customer experience',
    'Scale operations', 'Cut costs', 'Better reporting',
    'Streamline workflows', 'Integrate systems'
  ];

  const currentTools = [
    'CRM (Salesforce, HubSpot)', 'Email (Gmail, Outlook)', 'Project Management (Asana, Trello)',
    'Accounting (QuickBooks, Xero)', 'Social Media Tools', 'E-commerce Platforms',
    'Communication (Slack, Teams)', 'Google Workspace', 'Microsoft 365'
  ];

  const budgetRanges = [
    'Under $1,000/month', '$1,000-$5,000/month', '$5,000-$15,000/month',
    '$15,000-$50,000/month', 'Over $50,000/month'
  ];

  const timelines = [
    'ASAP (within 2 weeks)', '1 month', '2-3 months', '3-6 months', '6+ months'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg border-b border-white border-opacity-20">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-white hover:text-cyan-300 transition-colors">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="ml-2 text-xl font-bold text-white">AutoFlow</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  currentStep >= step.number
                    ? 'bg-cyan-500 border-cyan-500 text-white'
                    : 'border-gray-400 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-400'
                  }`}>
                    Step {step.number}
                  </div>
                  <div className={`text-sm ${
                    currentStep >= step.number ? 'text-cyan-300' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-cyan-500' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20"
        >
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Tell Us About Your Company</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Acme Corporation"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  >
                    <option value="" className="bg-gray-800">Select Industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry} className="bg-gray-800">{industry}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Size *
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => handleInputChange('companySize', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  >
                    <option value="" className="bg-gray-800">Select Company Size</option>
                    {companySizes.map(size => (
                      <option key={size} value={size} className="bg-gray-800">{size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Role *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="CEO, CTO, Operations Manager"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Business Needs & Goals</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Current Challenges (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {challenges.map(challenge => (
                      <label key={challenge} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.currentChallenges.includes(challenge)}
                          onChange={(e) => handleArrayChange('currentChallenges', challenge, e.target.checked)}
                          className="mr-2 h-4 w-4 text-cyan-500 focus:ring-cyan-400 border-gray-300 rounded"
                        />
                        <span className="text-gray-300 text-sm">{challenge}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Automation Goals (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {automationGoals.map(goal => (
                      <label key={goal} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.automationGoals.includes(goal)}
                          onChange={(e) => handleArrayChange('automationGoals', goal, e.target.checked)}
                          className="mr-2 h-4 w-4 text-cyan-500 focus:ring-cyan-400 border-gray-300 rounded"
                        />
                        <span className="text-gray-300 text-sm">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time Spent on Repetitive Tasks (per week) *
                    </label>
                    <select
                      value={formData.timeSpentOnTasks}
                      onChange={(e) => handleInputChange('timeSpentOnTasks', e.target.value)}
                      className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      required
                    >
                      <option value="" className="bg-gray-800">Select Time Range</option>
                      <option value="1-5 hours" className="bg-gray-800">1-5 hours</option>
                      <option value="6-15 hours" className="bg-gray-800">6-15 hours</option>
                      <option value="16-25 hours" className="bg-gray-800">16-25 hours</option>
                      <option value="26-40 hours" className="bg-gray-800">26-40 hours</option>
                      <option value="40+ hours" className="bg-gray-800">40+ hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Budget Range *
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      required
                    >
                      <option value="" className="bg-gray-800">Select Budget Range</option>
                      {budgetRanges.map(range => (
                        <option key={range} value={range} className="bg-gray-800">{range}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Timeline *
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  >
                    <option value="" className="bg-gray-800">Select Timeline</option>
                    {timelines.map(timeline => (
                      <option key={timeline} value={timeline} className="bg-gray-800">{timeline}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Current Setup & Integration Needs</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Current Tools & Platforms (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentTools.map(tool => (
                      <label key={tool} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.currentTools.includes(tool)}
                          onChange={(e) => handleArrayChange('currentTools', tool, e.target.checked)}
                          className="mr-2 h-4 w-4 text-cyan-500 focus:ring-cyan-400 border-gray-300 rounded"
                        />
                        <span className="text-gray-300 text-sm">{tool}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Integration Needs (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Connect CRM with email marketing',
                      'Sync data between platforms',
                      'Automate lead scoring',
                      'Customer support ticket routing',
                      'Social media posting',
                      'Report generation and distribution',
                      'E-commerce order processing',
                      'Calendar scheduling automation',
                      'Document generation',
                      'Data backup and sync'
                    ].map(need => (
                      <label key={need} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.integrationNeeds.includes(need)}
                          onChange={(e) => handleArrayChange('integrationNeeds', need, e.target.checked)}
                          className="mr-2 h-4 w-4 text-cyan-500 focus:ring-cyan-400 border-gray-300 rounded"
                        />
                        <span className="text-gray-300 text-sm">{need}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-32 resize-none"
                    placeholder="Tell us about any specific requirements, pain points, or questions you have..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                currentStep === 1
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-semibold"
              >
                Submit Application
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
              >
                Next
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientOnboarding;