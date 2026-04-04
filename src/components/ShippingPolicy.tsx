import PolicyLayout from "./PolicyLayout";

export default function ShippingPolicy() {
  return (
    <PolicyLayout
      topLabel="Shipping policy"
      title="Shipping Policy"
    >
      <p>Everything you need to know about processing, delivery and tracking.</p>

      <h2>Processing &amp; Shipping: Your Order's Journey</h2>
      <p>
        We know how exciting it is to get your hands on your new products — we're just as eager to
        get them to you! As soon as you place your order, our dedicated team gets to work.
      </p>
      <ul>
        <li>Standard orders are typically processed and packed within 1–2 business days.</li>
        <li>Custom orders may take 3–7 business days depending on type and quantity.</li>
      </ul>
      <p>
        Once your package is ready, it usually arrives within 3–7 business days for standard
        deliveries across India. These are estimates — see the Disclaimer below for details.
      </p>

      <h2>Shipping Charges: Keeping it Simple</h2>
      <p>
        We offer <strong>free shipping on all prepaid orders of ₹499 and above</strong>. For orders
        below that amount, applicable shipping charges will be shown at checkout.
      </p>

      <h2>Tracking Your Package</h2>
      <p>
        As soon as your package is dispatched, we'll send you a tracking number via email or
        WhatsApp. Use that number with the carrier to follow your order in real time.
      </p>

      <h2>Undelivered Shipments</h2>
      <p>
        Sometimes shipments are returned to us due to an incorrect address or because the carrier
        couldn't reach you. If that happens, we will contact you to arrange redelivery. Please note
        that additional shipping charges may apply for reshipment.
      </p>

      <h2>Contact Information</h2>
      <p>
        If you have any questions or concerns about shipping, please reach out to our support team —
        we're happy to help.
      </p>
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

      <h2>Disclaimer</h2>
      <p style={{ fontStyle: "italic", color: "#555" }}>
        Please be aware that delivery times are estimates and may be affected by factors outside our
        control, such as carrier delays, severe weather, public holidays, or other unforeseen events.
        We appreciate your understanding.
      </p>

      <h2>Quick FAQs</h2>
      <h3>When will I get my tracking number?</h3>
      <p>You'll receive a tracking number via email or WhatsApp as soon as your order is dispatched.</p>
      <h3>My address was entered incorrectly — what should I do?</h3>
      <p>
        Contact support immediately at <a 
          href="mailto:support@ecotwist.in"
          onClick={(e) => {
            if (!navigator.userAgent.includes("Mobile")) {
              window.open("https://mail.google.com/mail/?view=cm&to=support@ecotwist.in");
            }
          }}
          className="text-blue-600 underline"
        >
          support@ecotwist.in
        </a>. If the shipment is returned, additional
        charges may apply for reshipment.
      </p>
    </PolicyLayout>
  );
}