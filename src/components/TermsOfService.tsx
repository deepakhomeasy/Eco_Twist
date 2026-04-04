import PolicyLayout from "./PolicyLayout";
import { Link } from "react-router-dom";
export default function TermsOfService() {
  return (
    <PolicyLayout
      topLabel="Terms of service"
      title="Terms of Service"
      company="Ecotwist Innovtions Private Limited"
    >
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

      <h2>1. Introduction and Acceptance of Terms</h2>
      <p>
        Welcome to Ecotwist Innovtions Private Limited ("the Company," "we," "us," or "our").
        These Terms of Service ("ToS") govern your access to and use of our website, https://ecotwist.in,
        and all related services, products, content, and functionalities (collectively, the "Services").
      </p>
      <p>
        By accessing or using our Services, you agree to be bound by these ToS and our Privacy Policy.
        If you do not agree with any part of these terms, you must not use our Services. These ToS
        constitute a legally binding agreement between you and the Company.
      </p>

      <h2>2. User Accounts</h2>
      <h3>2.1 Account Creation</h3>
      <p>
        To access certain features of our Services, you may be required to create an account. You agree
        to provide accurate, current, and complete information during the registration process and to
        update such information to keep it accurate and current.
      </p>
      <h3>2.2 Account Security</h3>
      <p>
        You are solely responsible for maintaining the confidentiality of your account password and for
        all activities that occur under your account. You agree to notify us immediately of any
        unauthorized use of your account. We are not liable for any loss or damage arising from your
        failure to protect your password or account information.
      </p>
      <h3>2.3 Eligibility</h3>
      <p>
        By using our Services, you represent that you are at least 18 years of age or have the consent
        of a legal guardian. The Services are not intended for use by individuals under the age of 18
        without parental supervision.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        All content, including but not limited to text, graphics, logos, images, product designs, and
        software on the website, is the exclusive property of Ecotwist Innovtions Private Limited or
        its content suppliers and is protected by Indian and international copyright, trademark, and
        other intellectual property laws.
      </p>
      <p>
        You are granted a limited, non-exclusive, non-transferable license to access and use the Services
        for your personal, non-commercial use. Any unauthorized use — including reproduction, modification,
        distribution, or republication — without our prior written consent, is strictly prohibited.
      </p>

      <h2>4. Product Information and Pricing</h2>
      <h3>4.1 Product Descriptions</h3>
      <p>
        We strive to provide accurate and detailed product descriptions. However, we do not guarantee
        that the product descriptions, colors, or other content are entirely accurate, complete, or
        error-free. The actual product may vary slightly from the images displayed on the website.
      </p>
      <h3>4.2 Pricing</h3>
      <p>
        All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated
        otherwise. We reserve the right to change prices at any time without prior notice. The price
        charged to you will be the price listed on the website at the time of your order.
      </p>

      <h2>5. Orders, Shipping, and Returns</h2>
      <h3>5.1 Order Acceptance</h3>
      <p>
        Your order is an offer to purchase a product. We reserve the right to accept or reject this
        offer for any reason, including but not limited to product availability, an error in the product
        description or price, or a security issue.
      </p>
      <h3>5.2 Shipping</h3>
      <p>
        We will ship your order to the address provided by you. We are not responsible for delays or
        non-delivery due to incorrect or incomplete address information. For more details on shipping,
        please refer to our Shipping Policy.
      </p>
      <h3>5.3 Returns and Refunds</h3>
      <p>
        All returns and refunds are governed by our Return and Refund Policy, which is incorporated by
        reference into these ToS. By placing an order, you agree to the terms of that policy.
      </p>

      <h2>6. Prohibited Conduct</h2>
      <ul>
        <li>Violating any applicable laws or regulations.</li>
        <li>Submitting false, misleading, or fraudulent information.</li>
        <li>Hacking, attempting to hack, or interfering with the website.</li>
        <li>Transmitting any viruses, worms, or malicious code.</li>
        <li>Collecting or tracking the personal information of others.</li>
        <li>Engaging in any activity that could disable, overburden, or impair the website's functionality.</li>
      </ul>

      <h2>7. Disclaimer of Warranties</h2>
      <p>
        Our Services are provided on an "as-is" and "as-available" basis. We make no representations
        or warranties of any kind, express or implied, as to the operation of the Services or the
        information, content, materials, or products included on the website. To the fullest extent
        permissible by applicable law, we disclaim all warranties, including but not limited to implied
        warranties of merchantability and fitness for a particular purpose.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Ecotwist Innovtions Private Limited, its directors,
        employees, or agents shall not be liable for any indirect, incidental, special, consequential,
        or punitive damages, including but not limited to loss of profits, data, or goodwill. Our total
        liability shall not exceed the amount paid by you for the products or services giving rise to
        the claim.
      </p>

      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Ecotwist Innovtions Private Limited and its
        affiliates, directors, officers, employees, and agents from and against any and all claims,
        liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or
        in any way connected with your access to or use of the Services or your violation of these ToS.
      </p>

      <h2>10. Governing Law and Jurisdiction</h2>
      <p>
        These ToS are governed by and construed in accordance with the laws of India. You agree that
        any dispute or claim arising out of or in connection with these ToS shall be subject to the
        exclusive jurisdiction of the courts in Patna, Bihar.
      </p>

      <h2>11. Changes to the Terms of Service</h2>
      <p>
        We reserve the right to modify these ToS at any time, effective upon posting the updated terms
        on the website. Your continued use of the Services after any such changes constitutes your
        acceptance of the new ToS.
      </p>

      <h2>12. Contact Information</h2>
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
      </p>    </PolicyLayout>
  );
}