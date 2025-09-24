import React from 'react'

export default function TermsPage() {
  const lastUpdated = 'July 13, 2025'

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Terms and Conditions</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Last updated: {lastUpdated}</p>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>1. Introduction</h2>
        <p style={{ color: '#333' }}>
          These Terms and Conditions ("Terms") describe the rules and regulations for using Qwesi's website and services.
          Please read them carefully. By accessing or using our services you agree to be bound by these Terms.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>2. Definitions</h2>
        <p style={{ color: '#333' }}>
          "Services" means the website, applications, and related offerings provided by Qwesi. "User", "you" and "your" refer to anyone
          who accesses or uses the Services.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>3. Accounts and Registration</h2>
        <p style={{ color: '#333' }}>
          You may need to register for an account to access certain features. You are responsible for keeping your credentials secure
          and for all activities that occur under your account. Notify us immediately of any unauthorized use.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>4. Purchases, Payments and Refunds</h2>
        <p style={{ color: '#333' }}>
          If you purchase products or services, you agree to pay the applicable fees. Payment processing is handled by third-party
          payment processors and is subject to their terms. Refund policies will be provided at the point of sale; where not stated,
          refunds may be provided at Qwesi's discretion and in compliance with applicable law.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>5. User Conduct</h2>
        <p style={{ color: '#333' }}>
          You agree not to use the Services for unlawful purposes, to harass or defraud others, or to upload content that infringes
          third-party rights. We may suspend or terminate accounts that violate these rules.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>6. Content and Intellectual Property</h2>
        <p style={{ color: '#333' }}>
          All content provided by Qwesi is owned by or licensed to Qwesi. You may not reproduce, distribute, or create derivative works
          from our content without permission. If you provide content to the platform, you grant Qwesi a license to use it in connection
          with the Services.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>7. Third-Party Services</h2>
        <p style={{ color: '#333' }}>
          The Services may include links to third-party sites or integrate third-party services (payment processors, messaging platforms, etc.).
          Qwesi is not responsible for the content or policies of those third parties.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>8. Disclaimers</h2>
        <p style={{ color: '#333' }}>
          The Services are provided "as is" and "as available". To the fullest extent permitted by law, Qwesi disclaims all warranties,
          whether express or implied, regarding the Services.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>9. Limitation of Liability</h2>
        <p style={{ color: '#333' }}>
          Except where prohibited by law, Qwesi's liability for damages arising out of or related to these Terms is limited to direct
          damages up to the total amount paid by you in the prior 12 months, or a nominal amount if no payments were made.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>10. Indemnification</h2>
        <p style={{ color: '#333' }}>
          You agree to indemnify and hold harmless Qwesi and its affiliates from any claim, loss, liability, or expense arising from
          your use of the Services or violation of these Terms.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>11. Termination</h2>
        <p style={{ color: '#333' }}>
          We may suspend or terminate your access at any time for violations of these Terms or other policies. Termination does not
          relieve you of obligations incurred prior to termination.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>12. Governing Law and Dispute Resolution</h2>
        <p style={{ color: '#333' }}>
          These Terms are governed by the laws that apply to Qwesi's main place of business, unless local law requires otherwise.
          Disputes should be raised to our support contact before pursuing formal action.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>13. Changes to These Terms</h2>
        <p style={{ color: '#333' }}>
          We may update the Terms from time to time. Material changes will be communicated by posting a notice on the site or
          by contacting you if we have your contact information.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>14. Contact</h2>
        <p style={{ color: '#333' }}>
          For questions about these Terms, contact: info@qwesi.org
        </p>
      </section>
    </main>
  )
}