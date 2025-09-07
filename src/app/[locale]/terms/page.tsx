"use client";

export default function TermsPage() {
    return (
        <div className="min-h-screen text-gray-800">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
                <p className="mb-4">
                    Welcome to <span className="font-semibold">NepalKamma</span>. By using our
                    platform, you agree to the following terms and conditions. Please read them
                    carefully before using our services.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
                <p className="mb-4">
                    By accessing or using NepalKamma, you agree to be bound by these Terms &
                    Conditions and our Privacy Policy. If you do not agree, you may not use our
                    services.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-2">2. Use of Services</h2>
                <p className="mb-4">
                    NepalKamma connects customers with service providers and vice-versa. You agree to use the
                    platform only for lawful purposes and not to misrepresent your identity or
                    engage in fraudulent activity.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-2">3. User Accounts</h2>
                <p className="mb-4">
                    You are responsible for maintaining the confidentiality of your account and
                    password. Any activity under your account will be deemed your responsibility.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-2">4. Payments & Bookings</h2>
                <p className="mb-4">
                    Payments made through NepalKamma are processed securely. We are not
                    responsible for disputes between customers and service providers but will
                    provide support where possible.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-2">5. Limitation of Liability</h2>
                <p className="mb-4">
                    NepalKamma is a platform for connecting users and providers. We do not
                    guarantee service quality, availability, or outcome. Our liability is limited
                    to the maximum extent permitted by law.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-2">6. Termination</h2>
                <p className="mb-4">
                    We may suspend or terminate your access to NepalKamma at any time if you
                    violate these Terms & Conditions.
                </p>
                <h2 className="text-xl font-semibold mt-8 mb-2">7. Data Privacy</h2>
                <p className="mb-4">
                    We are committed to protecting your personal information. Our Privacy Policy outlines how we collect, use, and safeguard your data.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-2">8. Changes to Terms</h2>
                <p className="mb-4">
                    We reserve the right to update these Terms & Conditions at any time. Changes
                    will be posted here, and continued use of the platform constitutes acceptance.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-2">9. Contact Us</h2>
                <p>
                    If you have any questions about these Terms & Conditions, please contact us at{" "}
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
