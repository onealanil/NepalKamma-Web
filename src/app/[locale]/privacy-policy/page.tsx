export default function PrivacyPage() {
  return (
    <div className="min-h-screen not-only-of-type:text-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="mb-4">
          At <span className="font-semibold">NepalKamma</span>, we value your privacy
          and are committed to protecting your personal information. This Privacy Policy
          explains how we collect, use, and safeguard your data when you use our
          services.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We may collect personal information such as your name, email address, phone
          number, payment details, and location when you register, book services, or
          interact with our platform.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>To create and manage your account.</li>
          <li>To facilitate bookings and payments.</li>
          <li>To improve our services and user experience.</li>
          <li>To send you notifications, reminders, or important updates.</li>
          <li>To ensure safety and prevent fraud.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Sharing of Information</h2>
        <p className="mb-4">
          We do not sell or rent your personal information. However, we may share data
          with trusted third-party providers (e.g., payment processors, service
          providers) strictly for the purpose of delivering our services.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Data Security</h2>
        <p className="mb-4">
          We use industry-standard security measures to protect your information.
          However, no online platform is 100% secure, and we cannot guarantee absolute
          protection against unauthorized access.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Cookies & Tracking</h2>
        <p className="mb-4">
          NepalKamma may use cookies and similar technologies to improve user
          experience, remember preferences, and analyze app performance. You can manage
          cookies through your browser settings.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal information. You
          may also request to opt-out of promotional communications at any time.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Third-Party Services</h2>
        <p className="mb-4">
          Our platform may contain links to third-party websites or services. We are not
          responsible for the privacy practices of these external sites.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">8. Changes to this Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Updates will be posted on
          this page, and continued use of our services constitutes your acceptance.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a
            href="mailto:23bhandarianil@gmail.com"
            className="text-blue-600 underline"
          >
            23bhandarianil@gmail.com
          </a>
          .
        </p>

        <p className="text-sm text-gray-500 mt-10">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
