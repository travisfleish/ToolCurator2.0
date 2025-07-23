// 'use client';
//
// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
// import Header from '../components/layout/Header';
// import Footer from '../components/layout/Footer';
// import NewsletterSection from '../components/marketing/NewsletterSection';
//
// const ResourceCard = ({ resource }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
//       <h3 className="text-lg font-bold text-gray-800 mb-2">{resource.title}</h3>
//       <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
//
//       <div className="flex flex-wrap gap-2 mb-4">
//         <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-[#9f0909]">
//           {resource.source}
//         </span>
//         <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
//           {resource.format}
//         </span>
//         <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
//           resource.cost === 'Free' ? 'bg-green-100 text-green-700' :
//           resource.cost === 'Free to audit' ? 'bg-orange-100 text-orange-700' :
//           'bg-orange-100 text-orange-700'
//         }`}>
//           {resource.cost}
//         </span>
//       </div>
//
//       <a
//         href={resource.url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="inline-flex items-center text-[#e86f0c] hover:text-[#9f0909] font-medium text-sm"
//       >
//         View Resource <ExternalLink size={14} className="ml-1" />
//       </a>
//     </div>
//   );
// };
//
// const Section = ({ title, description, icon: Icon, sectionNumber, children }) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//
//   return (
//     <div>
//       <div
//         className="flex justify-between items-center cursor-pointer"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center">
//           {sectionNumber && (
//             <span className="text-2xl md:text-3xl font-bold text-[#e86f0c] mr-3">
//               {sectionNumber}.
//             </span>
//           )}
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
//         </div>
//         <button className="text-gray-500 hover:text-gray-700">
//           {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
//         </button>
//       </div>
//       <p className="text-gray-600 mt-2 mb-6 text-lg">{description}</p>
//
//       {isExpanded && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };
//
// // Resource data
// const foundationsResources = [
//   {
//     title: "Machine Learning Crash Course",
//     description: "Google's fast-paced introduction to machine learning fundamentals, with short videos, interactive visualizations, and hands-on coding exercises.",
//     source: "Google",
//     format: "Interactive Course",
//     cost: "Free",
//     url: "https://developers.google.com/machine-learning/crash-course"
//   },
//   {
//     title: "AI for Beginners Curriculum",
//     description: "A 12-week, 24-lesson open curriculum from Microsoft that covers core AI approaches from symbolic AI to neural networks, computer vision, NLP, and more.",
//     source: "Microsoft",
//     format: "Online Course",
//     cost: "Free",
//     url: "https://microsoft.github.io/AI-For-Beginners/"
//   },
//   {
//     title: "AI 101 (MIT OpenCourseWare)",
//     description: "An introductory AI workshop designed for learners with little to no background, taught by an MIT researcher.",
//     source: "MIT",
//     format: "Video Workshop",
//     cost: "Free",
//     url: "https://ocw.mit.edu/courses/res-ll-005-ai-101-fall-2023/video_galleries/videos/"
//   },
//   {
//     title: "AI for Everyone",
//     description: "A popular non-technical course taught by AI pioneer Andrew Ng explaining artificial intelligence in plain language.",
//     source: "deeplearning.ai/Coursera",
//     format: "Video Course",
//     cost: "Free to audit",
//     url: "https://www.coursera.org/learn/ai-for-everyone"
//   }
// ];
//
// const promptEngineeringResources = [
//   {
//     title: "Google's Prompt Engineering Guide",
//     description: "A comprehensive handbook from Google on writing effective prompts for generative AI (focused on Google's Gemini AI).",
//     source: "Google",
//     format: "PDF Guide",
//     cost: "Free",
//     url: "https://ai.google.dev/docs/prompt_engineering"
//   },
//   {
//     title: "Prompt Engineering Best Practices (ChatGPT)",
//     description: "OpenAI's official guide with essential techniques for prompting ChatGPT, explaining what prompts are and sharing tips.",
//     source: "OpenAI",
//     format: "Article",
//     cost: "Free",
//     url: "https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-openai-api"
//   }
// ];
//
// const aiToolsResources = [
//   {
//     title: "How to Use ChatGPT: A Beginner's Guide",
//     description: "A step-by-step guide to help new users start with OpenAI's ChatGPT chatbot, covering account creation, entering prompts, and examples of what you can ask.",
//     source: "ZDNET",
//     format: "Article",
//     cost: "Free",
//     url: "https://www.zdnet.com/article/how-to-use-chatgpt/"
//   },
//   {
//     title: "How to Use Google Gemini",
//     description: "A thorough beginner's guide to Google's Gemini AI assistant showing how to access it on different platforms and introducing its features.",
//     source: "Zapier",
//     format: "Article",
//     cost: "Free",
//     url: "https://zapier.com/blog/how-to-use-google-gemini/"
//   },
//   {
//     title: "How to Use Claude AI: A Beginner's Guide",
//     description: "A stepwise guide to start using Claude, explaining what it is and how to sign up and communicate effectively with it.",
//     source: "Dorik",
//     format: "Article",
//     cost: "Free",
//     url: "https://dorik.com/blog/how-to-use-claude-ai"
//   }
// ];
//
// const codingResources = [
//   {
//     title: "Google Colaboratory (Colab)",
//     description: "A free online environment from Google that lets you write and run Python code in your web browser with no setup.",
//     source: "Google",
//     format: "Tool/Notebook",
//     cost: "Free",
//     url: "https://colab.research.google.com/"
//   },
//   {
//     title: "The Hugging Face Course",
//     description: "An online course that introduces you to using modern AI models with Python, covering how to load and use pre-trained models for NLP and beyond.",
//     source: "Hugging Face",
//     format: "Interactive Tutorial",
//     cost: "Free",
//     url: "https://huggingface.co/course/chapter1/1"
//   },
//   {
//     title: "Intro to Machine Learning (Kaggle Learn)",
//     description: "A beginner-friendly machine learning tutorial that combines theory and coding practice using Python libraries such as scikit-learn.",
//     source: "Google/Kaggle",
//     format: "Interactive Course",
//     cost: "Free",
//     url: "https://www.kaggle.com/learn/intro-to-machine-learning"
//   }
// ];
//
// // Model Comparison data
// const modelComparisonData = [
//   {
//     name: "GPT-4",
//     developer: "OpenAI",
//     strengths: "Versatile, strong reasoning",
//     access: "ChatGPT (Plus)"
//   },
//   {
//     name: "Gemini",
//     developer: "Google",
//     strengths: "Multimodal, integrates with Google",
//     access: "Web, Google App"
//   },
//   {
//     name: "Claude 2",
//     developer: "Anthropic",
//     strengths: "Long memory, safer by design",
//     access: "Claude.ai"
//   }
// ];
//
// const podcastResources = [
//   {
//     title: "AI Explained (YouTube)",
//     description: "Bite-sized updates and walkthroughs on the latest in AI technology.",
//     source: "YouTube",
//     format: "Video Series",
//     cost: "Free",
//     url: "https://www.youtube.com/@AIExplained-official"
//   },
//   {
//     title: "Practical AI Podcast",
//     description: "Hosted by real engineers & entrepreneurs discussing AI applications and developments.",
//     source: "Changelog",
//     format: "Podcast",
//     cost: "Free",
//     url: "https://changelog.com/practicalai"
//   },
//   {
//     title: "The AI Breakdown",
//     description: "Daily AI news and analysis covering the latest developments in artificial intelligence.",
//     source: "Independent",
//     format: "Podcast",
//     cost: "Free",
//     url: "https://www.theaibreakdown.com/"
//   }
// ];
//
// const ModelsTable = () => (
//   <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//     <table className="min-w-full divide-y divide-gray-200">
//       <thead className="bg-gray-50">
//         <tr>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Developer</th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strengths</th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access</th>
//         </tr>
//       </thead>
//       <tbody className="bg-white divide-y divide-gray-200">
//         {modelComparisonData.map((model, index) => (
//           <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{model.name}</td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.developer}</td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.strengths}</td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.access}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );
//
// export default function ResourcesPage() {
//   // Add state handler for menu toggle to pass to Header
//   const [menuState, setMenuState] = useState(false);
//
//   const handleMenuToggle = (state) => {
//     setMenuState(state);
//     // Add any additional logic needed when menu is toggled
//   };
//
//   return (
//     <main className="min-h-screen flex flex-col">
//       {/* Pass onMenuToggle prop to Header */}
//       <Header onMenuToggle={handleMenuToggle} />
//
//       {/* Hero Section - Light Gray Background (matching Foundations section) */}
//       <div className="w-full py-12 bg-gray-50 relative">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h1 className="text-4xl font-bold mb-4 text-gray-900">AI Resources Hub</h1>
//           <p className="text-xl max-w-3xl mx-auto text-gray-700">
//             The curated guide to learning and using AI—built for beginners, powered by experts.
//           </p>
//
//           <div className="flex flex-wrap justify-center gap-6 mt-8">
//             <div className="flex items-center space-x-2">
//               <span className="w-5 h-5 bg-green-100 text-green-800 rounded-full flex items-center justify-center">✓</span>
//               <span className="text-gray-700">Free + Paid resources</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <span className="w-5 h-5 bg-orange-100 text-[#9f0909] rounded-full flex items-center justify-center">🎓</span>
//               <span className="text-gray-700">Courses, guides, videos, podcasts</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <span className="w-5 h-5 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center">⚡</span>
//               <span className="text-gray-700">Official, trusted sources only</span>
//             </div>
//           </div>
//         </div>
//       </div>
//
//       {/* Foundations Section - Same Light Gray Background as Hero */}
//       <div className="w-full py-12 bg-gray-50" id="foundations-section">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Section
//             title="Foundations: What is AI & How Does It Work?"
//             description="Get familiar with core concepts, terms, and how machine learning actually works—even if you've never coded."
//             sectionNumber="1"
//           >
//             {foundationsResources.map((resource, index) => (
//               <ResourceCard key={index} resource={resource} />
//             ))}
//           </Section>
//         </div>
//       </div>
//
//       {/* Prompts Section - White Background */}
//       <div className="w-full py-12 bg-white" id="prompts-section">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Section
//             title="Get Better Results with Better Prompts"
//             description="Learn how to talk to AI more effectively using official guides from Google, OpenAI, and more."
//             sectionNumber="2"
//           >
//             {promptEngineeringResources.map((resource, index) => (
//               <ResourceCard key={index} resource={resource} />
//             ))}
//           </Section>
//         </div>
//       </div>
//
//       {/* AI Tools Section - Light Gray Background */}
//       <div className="w-full py-12 bg-gray-50" id="tools-section">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Section
//             title="How to Use ChatGPT, Gemini, Claude & More"
//             description="Step-by-step guides to help you get the most out of today's top AI tools."
//             sectionNumber="3"
//           >
//             {aiToolsResources.map((resource, index) => (
//               <ResourceCard key={index} resource={resource} />
//             ))}
//           </Section>
//         </div>
//       </div>
//
//       {/* Coding Section - White Background */}
//       <div className="w-full py-12 bg-white" id="coding-section">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Section
//             title="Start Coding with AI—No Experience Needed"
//             description="Experiment with tools like Google Colab or Hugging Face to take your first steps into AI programming."
//             sectionNumber="4"
//           >
//             {codingResources.map((resource, index) => (
//               <ResourceCard key={index} resource={resource} />
//             ))}
//           </Section>
//         </div>
//       </div>
//
//       {/* Models Comparison Section - Light Gray Background */}
//       <div className="w-full py-12 bg-gray-50" id="models-section">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="mb-6">
//             <div className="flex items-center mb-2">
//               <span className="text-2xl md:text-3xl font-bold text-[#e86f0c] mr-3">5.</span>
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-800">What&apos;s the Difference Between GPT, Gemini & Claude?</h2>
//             </div>
//             <p className="text-gray-600 mb-6 text-lg">Compare today&apos;s top AI models—and understand how they think, talk, and help you work smarter.</p>
//             <ModelsTable />
//           </div>
//         </div>
//       </div>
//
//       {/* Podcasts Section - White Background */}
//       <div className="w-full py-12 bg-white" id="podcasts-section">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Section
//             title="Top Podcasts & Playlists for AI Beginners"
//             description="Explore AI while driving, walking, or commuting."
//             sectionNumber="6"
//           >
//             {podcastResources.map((resource, index) => (
//               <ResourceCard key={index} resource={resource} />
//             ))}
//           </Section>
//         </div>
//       </div>
//
//       {/* Newsletter Section - Full Width Blue Background */}
//       <div className="w-full bg-[#e86f0c]" id="newsletter-section">
//         <NewsletterSection />
//       </div>
//
//       <Footer />
//     </main>
//   );
// }