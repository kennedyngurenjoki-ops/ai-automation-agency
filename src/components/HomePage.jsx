import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  CogIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'Workflow Automation',
      description: 'Streamline repetitive tasks and boost productivity with intelligent automation'
    },
    {
      icon: CogIcon,
      title: 'Custom Integrations',
      description: 'Connect your existing tools and create seamless data flow between platforms'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics & Insights',
      description: 'Get detailed reports and actionable insights from your automated processes'
    },
    {
      icon: ClockIcon,
      title: 'Save Time',
      description: 'Reduce manual work by up to 80% with our intelligent automation solutions'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Support',
      description: 'Get ongoing support from our team of automation specialists'
    },
    {
      icon: CheckIcon,
      title: 'Proven Results',
      description: 'Join hundreds of businesses already saving time and money with our solutions'
    }
  ];

  const benefits = [
    'Free initial consultation and automation audit',
    'Custom automation strategy tailored to your business',
    '30-day money-back guarantee',
    'Ongoing support and optimization',
    'No long-term contracts required'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <nav className="bg-white bg-opacity-10 backdrop-blur-lg border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="ml-2 text-xl font-bold text-white">AutoFlow</span>
            </div>
            <Link
              to="/onboarding"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-semibold"
            >
              Start Free Consultation
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Automate Your Business.
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Scale Effortlessly.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your business with AI-powered automation. We help companies save 20+ hours per week 
            by automating repetitive tasks, integrating systems, and optimizing workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-semibold text-lg"
            >
              Get Free Automation Audit
            </Link>
            <button className="border-2 border-white border-opacity-30 text-white px-8 py-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all font-semibold text-lg">
              View Case Studies
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose AutoFlow?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We specialize in creating custom automation solutions that grow with your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-15 transition-all"
            >
              <feature.icon className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of businesses that have already automated their workflows and are seeing incredible results.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-center text-gray-300"
                >
                  <CheckIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Start Your Automation Journey</h3>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-cyan-400 mb-2">FREE</div>
              <div className="text-gray-300">Initial Consultation & Audit</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <CheckIcon className="h-4 w-4 text-green-400 mr-3" />
                1-hour strategy session
              </li>
              <li className="flex items-center text-gray-300">
                <CheckIcon className="h-4 w-4 text-green-400 mr-3" />
                Custom automation roadmap
              </li>
              <li className="flex items-center text-gray-300">
                <CheckIcon className="h-4 w-4 text-green-400 mr-3" />
                ROI projection report
              </li>
              <li className="flex items-center text-gray-300">
                <CheckIcon className="h-4 w-4 text-green-400 mr-3" />
                No commitment required
              </li>
            </ul>
            <Link
              to="/onboarding"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-semibold text-center block"
            >
              Schedule Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-30 border-t border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="ml-2 text-xl font-bold text-white">AutoFlow</span>
            </div>
            <p className="text-gray-400 mb-4">Transforming businesses through intelligent automation</p>
            <p className="text-sm text-gray-500">© 2026 AutoFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;