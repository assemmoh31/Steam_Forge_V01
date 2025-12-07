import React from 'react';
import { Shield, Lock, Eye, Server, Cpu } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-steam-bg min-h-screen text-gray-800 dark:text-steam-text transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-steam-text">
            Transparency about how we handle your data.
          </p>
        </div>
        
        <div className="bg-white dark:bg-steam-card rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-steam-accent space-y-8">
          
          {/* Introduction */}
          <div>
            <p className="leading-relaxed text-lg">
              At <strong>SteamProfileForge</strong>, we prioritize your privacy and data security. 
              We believe in transparency and want you to understand exactly how our tools process your information.
            </p>
          </div>

          <hr className="border-gray-100 dark:border-white/5" />

          {/* Client Side Processing */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Cpu className="w-6 h-6 text-blue-500" /> 
              Client-Side Processing
            </h2>
            <p>
              The majority of our tools are designed to run <strong>entirely within your browser</strong>. 
              This means your files never leave your device.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-steam-text/80">
              <li><strong>Artwork Splitter:</strong> Images you upload are sliced and processed using your computer's resources. The original files and the resulting slices are not uploaded to any server.</li>
              <li><strong>Video to GIF:</strong> Video conversion happens locally in your browser memory.</li>
              <li><strong>GIF Optimizer:</strong> Compression logic is executed client-side.</li>
              <li><strong>Avatar Borders:</strong> Your uploaded profile picture is composited with frames locally.</li>
            </ul>
          </div>

          <hr className="border-gray-100 dark:border-white/5" />

          {/* AI Features */}
          <div className="space-y-4">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Server className="w-6 h-6 text-purple-500" /> 
              AI & External Services
            </h2>
            <p>
              Some features, specifically the <strong>Theme Finder</strong>, utilize external APIs to function.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-steam-text/80">
              <li>
                <strong>Google Gemini API:</strong> When you search for themes, your text query (e.g., "Cyberpunk", "Red") and filter preferences are sent to Google's Gemini API to generate recommendations. We do not transmit any personal identifiable information (PII) during this process.
              </li>
              <li>
                <strong>Steam Content:</strong> Images displayed in search results are hotlinked directly from Steam's public content delivery networks (CDN).
              </li>
            </ul>
          </div>

          <hr className="border-gray-100 dark:border-white/5" />

          {/* Storage */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Lock className="w-6 h-6 text-green-500" /> 
              Cookies & Local Storage
            </h2>
            <p>
              We use <strong>Local Storage</strong> solely for functional purposes, such as:
            </p>
             <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-steam-text/80">
              <li>Saving your preference for <strong>Dark Mode</strong> or Light Mode.</li>
            </ul>
            <p className="mt-2">
              We do not use tracking cookies or sell user data to third parties.
            </p>
          </div>

           <div className="pt-8 mt-8 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-sm text-gray-500 dark:text-steam-text/60">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;