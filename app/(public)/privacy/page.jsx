import React from 'react'

export default function PrivacyPage() {
  const lastUpdated = 'July 13, 2025'

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Last updated: {lastUpdated}</p>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>1. Introduction</h2>
        <p style={{ color: '#333' }}>
          This Privacy Policy explains how Qwesi collects, uses, shares and protects personal information when you use our services.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>2. Information We Collect</h2>
        <p style={{ color: '#333' }}>
          We collect information you provide directly (account details, messages, payment info), information collected
          automatically (usage data, device and browser information, IP address), and information from third parties (payment processors,
          social logins, or partners).
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>3. How We Use Information</h2>
        <p style={{ color: '#333' }}>
          We use information to deliver services, process transactions, communicate with you, provide customer support, prevent fraud,
          and improve and personalize our offerings.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>4. Legal Basis for Processing</h2>
        <p style={{ color: '#333' }}>
          Where applicable, our legal basis for processing personal data includes performance of a contract, consent, compliance with
          legal obligations, and our legitimate interests (such as improving services and ensuring security).
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>5. Cookies and Tracking</h2>
        <p style={{ color: '#333' }}>
          We and our partners use cookies and similar technologies to provide and improve the Services, and to analyze usage.
          You can control cookies through your browser settings and opt-outs where available.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>6. Sharing and Disclosure</h2>
        <p style={{ color: '#333' }}>
          We may share information with service providers (payment processors, hosting, analytics), business partners, and as
          required by law. We do not sell personal data.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>7. Data Transfers</h2>
        <p style={{ color: '#333' }}>
          Data may be processed in countries other than your own. We will take reasonable steps to ensure appropriate safeguards
          are in place when transferring data internationally.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>8. Data Retention</h2>
        <p style={{ color: '#333' }}>
          We retain personal data for as long as necessary to provide the Services, comply with legal obligations, or resolve disputes.
          Retention periods vary by data type and purpose.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>9. Security</h2>
        <p style={{ color: '#333' }}>
          We implement administrative, technical, and physical safeguards designed to protect personal information, but no system is
          completely secure. If a data incident occurs, we will follow applicable notification requirements.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>10. Your Rights</h2>
        <p style={{ color: '#333' }}>
          Depending on your jurisdiction, you may have rights such as access, correction, deletion, objection, and data portability.
          To exercise these rights, contact info@qwesi.org.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>11. Children's Privacy</h2>
        <p style={{ color: '#333' }}>
          Our Services are not directed to children under 13. We do not knowingly collect personal information from children under 13
          without parental consent. If we learn we've collected such data, we will take steps to delete it.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>12. Changes to This Policy</h2>
        <p style={{ color: '#333' }}>
          We may update this policy to reflect changes in our practices or legal requirements. We will post the updated policy and
          update the effective date.
        </p>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>13. Contact</h2>
        <p style={{ color: '#333' }}>
          For privacy inquiries or to exercise your rights: info@qwesi.org
        </p>
      </section>
    </main>
  )
}