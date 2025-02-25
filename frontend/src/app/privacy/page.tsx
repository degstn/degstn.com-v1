"use client";

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="flex min-h-screen bg-bgLight dark:bg-bgDark flex-col items-center justify-start p-8">
      <div className="max-w-3xl w-full mt-16">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-50">Privacy Policy</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-50">Introduction</h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            This Privacy Policy describes how your personal information is collected, used, and shared when you visit this website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-50">Information We Collect</h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-50">How We Use Your Information</h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            We use the information we collect to help us screen for potential risk and fraud, and to improve and optimize our site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-50">Sharing Your Information</h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            We do not share your Personal Information with third parties except to comply with applicable laws and regulations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-50">Data Retention</h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            We will maintain your information for our records unless and until you ask us to delete this information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-50">Changes</h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            We may update this privacy policy from time to time in order to reflect changes to our practices or for other operational, legal or regulatory reasons.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-50">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <Link href="mailto:d@degstn.com" className="text-international-orange-engineering dark:text-international-orange hover:underline">d@degstn.com</Link>.
          </p>
        </section>

        <div className="mt-12 mb-8">
          <Link 
            href="/" 
            className="text-international-orange-engineering dark:text-international-orange hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
} 