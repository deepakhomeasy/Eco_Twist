import PolicyLayout from "./PolicyLayout";
import { Link } from "react-router-dom";
export default function RefundPolicy() {
  return (
    <PolicyLayout
      topLabel="Refund policy"
      title="Return and Refund Policy"
      effectiveDate="November 01, 2025"
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

      <h2>Our Commitment to Quality and Your Satisfaction</h2>
      <p>
        At Ecotwist Innovtions Private Limited, we are dedicated to offering high-quality, sustainable
        products that meet and exceed your expectations. This detailed Return and Refund Policy is
        designed to be a transparent and fair guide. This policy is governed by the principles of the
        Consumer Protection Act, 2019, and all other applicable laws in India.
      </p>

      <h2>Right to Return: Conditions and Timeframes</h2>
      <p>
        You have the right to request a return within <strong>seven (7) calendar days</strong> from
        the date your product was delivered, as verified by the delivery date recorded by our shipping
        partner.
      </p>
      <ul>
        <li>The item must be returned in its original, unused state with all tags, labels, accessories, and protective packaging intact.</li>
        <li>You must provide the original sales invoice or the unique order number associated with your purchase.</li>
      </ul>

      <h2>Valid Reasons for Initiating a Return</h2>
      <ul>
        <li><strong>Damaged or Defective Product:</strong> Product is physically damaged, broken, or has a manufacturing defect.</li>
        <li><strong>Incorrect Product Delivered:</strong> Wrong model, size, color, or other specifications.</li>
        <li><strong>Product Not as Described:</strong> Actual features differ materially from description/images on website.</li>
      </ul>

      <h2>Products Excluded from Our Return Policy</h2>
      <p>Certain products cannot be returned unless defective or damaged upon delivery:</p>
      <ul>
        <li>Used or Altered Products</li>
        <li>Custom or Personalized Items</li>
        <li>Final Sale Items</li>
      </ul>

      <h2>The Step-by-Step Return Process</h2>
      <ol>
        <li>
          <strong>Initiate Contact:</strong> Email support@ecotwist.in within 7 days with subject
          line "Return Request - Order #[Your Order Number]".
        </li>
        <li>
          <strong>Provide Necessary Information:</strong> Include product name, quantity, reason for
          return, and attach clear photos/videos.
        </li>
        <li>
          <strong>Receive RA Number:</strong> Once approved, you'll receive a Return Authorization
          number and instructions.
        </li>
        <li>
          <strong>Ship the Product:</strong> Free reverse pickup will be arranged. If unavailable,
          self-ship and we'll reimburse shipping costs.
        </li>
      </ol>

      <h2>Our Refund Procedure</h2>
      <p>Once we receive your returned item, we will conduct a thorough quality check and inspection:</p>
      <ul>
        <li><strong>Inspection and Approval:</strong> Done within 48 business hours of receipt.</li>
        <li><strong>Refund Processing:</strong> Refund to original payment method (excluding shipping fees unless error on our part).</li>
        <li><strong>Timeline:</strong> Up to 7 business days for refund to reflect.</li>
        <li><strong>COD Orders:</strong> Refunded via bank transfer.</li>
      </ul>

      <h2>Order Cancellation</h2>
      <p>
        You may cancel your order before dispatch by emailing support@ecotwist.in. Orders already
        shipped cannot be cancelled and must follow the return process.
      </p>

      <h2>Contact Information</h2>
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
      </p>
      <p style={{ marginTop: "16px", fontSize: "13px", color: "#555", fontStyle: "italic" }}>
        Disclaimer: This policy is a binding agreement between you and Ecotwist Innovtions Private
        Limited. We reserve the right to amend or update this policy at any time.
      </p>
    </PolicyLayout>
  );
}