import PolicyLayout from "./PolicyLayout";
 import { Link } from "react-router-dom";
export default function PrivacyPolicy() {
  return (
    <PolicyLayout
      topLabel="Privacy policy"
      title="Privacy Policy"
      effectiveDate="November 01, 2025"
    >
      <h2>1. Company &amp; Contact</h2>
      <span className="pol-label">Registered Address:</span>
      <p>Near Euro Kids Play School, Mahavir Colony, Beur, Patna 800002 (Bihar)</p>
      <span className="pol-label">Office Address:</span>
      <p>B-Hub, 5th Floor, A Block, Mauryalok Complex, Patna 800001 (Bihar)</p>
      <div className="pol-inline">
        <span><strong>CIN:</strong> U16292BR2025PTC074427</span>
        <span>
          <strong>Website:</strong>{" "}
          <Link to="/" className="text-blue-600 underline">
            ecotwist.in
          </Link>
        </span>
      </div>

      <h2>2. Introduction</h2>
      <p>
        Welcome to Ecotwist Innovtions Private Limited. We're committed to protecting the privacy and
        security of your personal information. This Privacy Policy outlines how we collect, use,
        disclose, and protect the information you provide to us when you use our website,
        https://ecotwist.in, and our services. By accessing or using our website, you agree to
        the terms of this Privacy Policy.
      </p>

      <h2>3. Information We Collect</h2>
      <h3>3.1 Personal Information</h3>
      <ul>
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Phone Number</li>
        <li>Billing and Shipping Address</li>
        <li>Payment Information (processed securely via third-party gateways — not stored by us)</li>
      </ul>

      <h3>3.2 Non-Personal Information</h3>
      <ul>
        <li>IP Address</li>
        <li>Browser Type and Version</li>
        <li>Operating System</li>
        <li>Referring Website</li>
        <li>Pages You Visit</li>
        <li>Date and Time of Visit</li>
        <li>Device Information</li>
      </ul>

      <h3>3.3 Cookies and Tracking Technologies</h3>
      <p>
        We use cookies, web beacons, and similar technologies to enhance your experience, analyze
        traffic, and personalize content. You can manage cookies through your browser settings,
        but disabling them may affect website functionality.
      </p>

      <h2>4. How We Use Your Information</h2>
      <ul>
        <li><strong>To Provide Services:</strong> Process and fulfill orders, manage accounts, and deliver products.</li>
        <li><strong>To Communicate:</strong> Send confirmations, updates, and transactional emails.</li>
        <li><strong>To Improve Services:</strong> Analyze usage and customer preferences to enhance offerings.</li>
        <li><strong>Marketing:</strong> Share promotional updates (with opt-out options).</li>
        <li><strong>Security:</strong> Protect against fraud and unauthorized access.</li>
        <li><strong>Legal Compliance:</strong> Meet legal and regulatory obligations.</li>
      </ul>

      <h2>5. Disclosure of Your Information</h2>
      <ul>
        <li><strong>Service Providers:</strong> Third parties like payment gateways, shipping partners, analytics, and marketing vendors (strict confidentiality enforced).</li>
        <li><strong>Legal Compliance:</strong> Disclosures when required by law or to protect rights and safety.</li>
        <li><strong>Business Transfers:</strong> Data may transfer in case of merger, acquisition, or asset sale.</li>
      </ul>

      <h2>6. Data Security</h2>
      <p>
        We use SSL encryption and secure storage measures to safeguard your data. While we strive
        for the highest level of security, no system can be guaranteed 100% secure.
      </p>

      <h2>7. Your Rights and Choices</h2>
      <ul>
        <li><strong>Access &amp; Correction:</strong> Update personal details in account settings or request changes.</li>
        <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails anytime.</li>
        <li><strong>Withdraw Consent:</strong> Contact us to withdraw consent, subject to legal restrictions.</li>
      </ul>

      <h2>8. Grievance Officer</h2>
      <p>
        <strong>Richa Sinha</strong> — Founder &amp; CEO<br />
        Email:{ } <a 
          href="mailto:info@ecotwist.in"
          onClick={(e) => {
            if (!navigator.userAgent.includes("Mobile")) {
              window.open("https://mail.google.com/mail/?view=cm&to=info@ecotwist.in");
            }
          }}
          className="text-blue-600 underline"
        >
          info@ecotwist.in
        </a><br />
        Address: B-Hub, 5th Floor, A Block, Mauryalok Complex, Patna 800001 (Bihar)
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        Updates will be posted here with a new effective date. Please review this policy
        periodically to stay informed about how we protect your information.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        Email:{" "}
       <a 
          href="mailto:support@ecotwist.in"
          onClick={(e) => {
            if (!navigator.userAgent.includes("Mobile")) {
              window.open("https://mail.google.com/mail/?view=cm&to=support@ecotwist.in");
            }
          }}
          className="text-blue-600 underline"
        >
          support@ecotwist.in
        </a>
       &nbsp;|&nbsp; <strong>Website:</strong>{" "}
          <Link to="/" className="text-blue-600 underline">
            ecotwist.in
          </Link></p>
    </PolicyLayout>
  );
}