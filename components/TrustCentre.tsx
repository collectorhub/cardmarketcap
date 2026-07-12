"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type PolicySection = {
  heading: string;
  paragraphs: string[];
};

type TrustDocument = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  sections: PolicySection[];
};

const TRUST_DOCUMENTS: TrustDocument[] = [
  {
    id: "about",
    title: "About CardMarketCap",
    shortTitle: "About",
    description:
      "Our story, mission, principles and long-term vision for CardMarketCap.",
    sections: [
      {
        heading: "Our Story",
        paragraphs: [
          'CardMarketCap (the "Platform") is owned and operated by Lowbridge Media Ventures Ltd ("Lowbridge", "we", "our", or "us"). We created CardMarketCap because we believe collectors deserve better market information.',
          "The trading card hobby has grown into a global market, yet reliable data often remains fragmented across multiple marketplaces, grading companies and independent resources.",
        ],
      },
      {
        heading: "Our Mission",
        paragraphs: [
          "Our mission is to build the world's most trusted market intelligence platform for trading cards and collectibles.",
          "We aim to provide collectors, retailers, investors, researchers and enthusiasts with transparent information that helps them better understand the market.",
        ],
      },
      {
        heading: "What We Build",
        paragraphs: [
          "CardMarketCap is more than a price guide. The Platform brings together market prices, historical sales, grading information, catalogue data, analytics and research tools into a single experience designed to help users make informed decisions.",
        ],
      },
      {
        heading: "Our Principles",
        paragraphs: [
          "Everything we build is guided by five principles: transparency, accuracy, independence, consistency and continuous improvement.",
          "We believe users should understand where data comes from, how it is processed and the limitations that may affect it.",
        ],
      },
      {
        heading: "Independent by Design",
        paragraphs: [
          "Lowbridge develops the Platform independently. Our methodologies, analytics and research are created without influence from card manufacturers, grading companies, marketplaces or advertisers.",
          "Where third-party information is used, it is incorporated to provide broader market context rather than to favour any organisation.",
        ],
      },
      {
        heading: "Continuous Improvement",
        paragraphs: [
          "Building a comprehensive market intelligence platform is an ongoing process.",
          "We continually refine our catalogue, improve our matching systems, expand market coverage, enhance analytics and respond to feedback from the collecting community.",
        ],
      },
      {
        heading: "Built with the Community",
        paragraphs: [
          "Constructive feedback from collectors, retailers and researchers helps improve the Platform every day.",
          "We welcome thoughtful suggestions and data corrections because they help make CardMarketCap more accurate and valuable for everyone.",
        ],
      },
      {
        heading: "Looking Ahead",
        paragraphs: [
          "Our ambition extends beyond displaying prices.",
          "As CardMarketCap evolves, Lowbridge intends to continue investing in richer market intelligence, transparency, research tools and analytical features that help users better understand the trading card market.",
        ],
      },
      {
        heading: "Thank You",
        paragraphs: [
          "Whether you visit the Platform occasionally or rely on it every day, thank you for being part of the CardMarketCap community.",
          "We appreciate your trust and remain committed to earning it through the quality of our work.",
        ],
      },
    ],
  },
  {
    id: "data-sources-methodology",
    title: "Data Sources & Methodology",
    shortTitle: "Data & Methodology",
    description:
      "Where our information comes from, how it is processed and the principles used to present market intelligence.",
    sections: [
      {
        heading: "1. Our Commitment",
        paragraphs: [
          'CardMarketCap (the "Platform") is owned and operated by Lowbridge Media Ventures Ltd ("Lowbridge", "we", "our", or "us").',
          "Lowbridge believes that trust is earned through transparency. This page explains where information displayed on the Platform comes from, how it is processed and the principles used when presenting market intelligence.",
        ],
      },
      {
        heading: "2. Our Principles",
        paragraphs: [
          "We build the Platform around five principles: accuracy, transparency, independence, consistency and continuous improvement.",
          "We continually refine our datasets, methodologies and systems as new information becomes available.",
        ],
      },
      {
        heading: "3. Data Sources",
        paragraphs: [
          "The Platform combines information from multiple sources, which may include publicly available marketplace information, historical sales, grading population reports, official product information, licensed datasets, publicly available card databases and internally developed analytics.",
          "Different datasets may have different update schedules.",
        ],
      },
      {
        heading: "4. Card Catalogue",
        paragraphs: [
          "Card information is standardised within CardMarketCap's catalogue to improve consistency across multiple data sources.",
          "This may include normalising card names, expansion information, numbering conventions, variants, languages and product classifications.",
        ],
      },
      {
        heading: "5. Market Prices",
        paragraphs: [
          "Market prices displayed on the Platform are estimates generated using available market information together with proprietary methodologies developed by Lowbridge.",
          "Factors considered may include historical sales, market activity, transaction frequency, data quality, comparable sales and other relevant indicators.",
          "Displayed prices are intended to provide market guidance and should not be interpreted as guaranteed transaction values.",
        ],
      },
      {
        heading: "6. Historical Sales",
        paragraphs: [
          "Historical sales are processed to improve quality and consistency.",
          "Depending on the source, records may be normalised, matched to catalogue entries, deduplicated, validated or excluded where clearly invalid.",
          "Historical sales remain subject to the limitations of the original data sources.",
        ],
      },
      {
        heading: "7. Population & Grading Data",
        paragraphs: [
          "Where grading population information is available, Lowbridge uses proprietary matching processes to associate grading records with the Platform's catalogue.",
          "Although we continually improve these processes, some records may remain unmatched or require manual review.",
        ],
      },
      {
        heading: "8. Analytics & Proprietary Methodologies",
        paragraphs: [
          "The Platform may provide market capitalisation estimates, liquidity metrics, rarity indicators, trend analysis and other analytics.",
          "These outputs are generated using proprietary methodologies developed by Lowbridge and may evolve over time as the Platform improves.",
        ],
      },
      {
        heading: "9. Data Quality",
        paragraphs: [
          "Maintaining high-quality data is an ongoing process.",
          "Automated validation is supported by manual review where appropriate. We investigate reported issues, improve matching systems, refine pricing methodologies and continuously enhance the quality of the Platform.",
        ],
      },
      {
        heading: "10. Known Limitations",
        paragraphs: [
          "No market intelligence platform can guarantee complete or perfect information.",
          "Market coverage, third-party data availability, inconsistent naming conventions, regional pricing differences and changing market conditions may affect the information displayed on the Platform.",
        ],
      },
      {
        heading: "11. Community Feedback",
        paragraphs: [
          "We encourage collectors, retailers, researchers and members of the community to report data issues through our Data Corrections process.",
          "Constructive feedback plays an important role in improving the Platform.",
        ],
      },
      {
        heading: "12. Related Policies",
        paragraphs: [
          "This document should be read together with our Data Corrections, Terms of Use, Disclaimer, Privacy Policy, Intellectual Property Policy and Copyright Notice & Takedown Policy.",
        ],
      },
      {
        heading: "13. Contact",
        paragraphs: [
          "If you have questions about our methodologies or believe information should be reviewed, please contact Lowbridge using the contact details published on the Platform.",
        ],
      },
    ],
  },
  {
    id: "data-corrections",
    title: "Data Corrections",
    shortTitle: "Data Corrections",
    description:
      "How to report inaccurate, incomplete or missing information displayed on CardMarketCap.",
    sections: [
      {
        heading: "1. Our Commitment to Accuracy",
        paragraphs: [
          'CardMarketCap (the "Platform") is owned and operated by Lowbridge Media Ventures Ltd ("Lowbridge", "we", "our", or "us").',
          "Lowbridge is committed to continually improving the quality, completeness and reliability of the information presented on the Platform.",
          "We recognise that maintaining a comprehensive trading card database is an ongoing process and welcome constructive feedback from the community.",
        ],
      },
      {
        heading: "2. What Can Be Reported?",
        paragraphs: [
          "You may report incorrect or missing card information, expansion details, images, historical sales, market prices, grading data, card variants, broken links, search issues, duplicate records, technical problems or any other information that appears inaccurate or incomplete.",
        ],
      },
      {
        heading: "3. How We Review Reports",
        paragraphs: [
          "Each report is reviewed by Lowbridge.",
          "Depending on the issue, we may validate it against trusted sources, compare multiple datasets, perform manual review or carry out additional investigation before making changes.",
          "Some issues can be corrected quickly, while others may require more detailed analysis.",
        ],
      },
      {
        heading: "4. Our Review Principles",
        paragraphs: [
          "We aim to make decisions that are accurate, evidence-based, transparent and consistent.",
          "Where multiple reliable sources disagree, we may retain existing information until sufficient evidence supports a change.",
        ],
      },
      {
        heading: "5. No Guarantee of Immediate Changes",
        paragraphs: [
          "Submitting a correction request does not guarantee that the reported information will be changed immediately, or at all.",
          "Some data may intentionally reflect Lowbridge's proprietary methodologies or require further verification before updates are made.",
        ],
      },
      {
        heading: "6. Community Contributions",
        paragraphs: [
          "Constructive feedback from collectors, retailers, researchers and industry professionals helps improve the Platform for everyone.",
          "We appreciate the time taken to report genuine issues and encourage submissions that are clear, specific and supported by evidence where possible.",
        ],
      },
      {
        heading: "7. Related Policies",
        paragraphs: [
          "This page should be read together with our Data Sources & Methodology, Terms of Use, Disclaimer, Privacy Policy, Intellectual Property Policy and Copyright Notice & Takedown Policy.",
        ],
      },
      {
        heading: "8. Contact",
        paragraphs: [
          "To report a data issue or suggest an improvement, please contact Lowbridge using the contact details published on the Platform.",
        ],
      },
    ],
  },
  {
    id: "terms-of-use",
    title: "Terms of Use",
    shortTitle: "Terms of Use",
    description:
      "The terms governing access to CardMarketCap, its tools, databases, content and related services.",
    sections: [
      {
        heading: "1. Introduction",
        paragraphs: [
          'Welcome to CardMarketCap (the "Platform"). The Platform is owned and operated by Lowbridge Media Ventures Ltd ("Lowbridge", "we", "our", or "us").',
          "These Terms of Use govern your access to and use of the Platform, including our website, applications, APIs, tools, content, databases, newsletters and any related services.",
          "By accessing or using the Platform, you agree to these Terms. If you do not agree, you must not use the Platform.",
        ],
      },
      {
        heading: "2. Who We Are",
        paragraphs: [
          "CardMarketCap is an independent market intelligence platform for trading cards and collectibles.",
          "Our goal is to provide reliable market information, historical sales, pricing insights, analytics and research tools.",
          "Unless expressly stated, Lowbridge is not affiliated with, endorsed by or sponsored by any card manufacturer, grading company, marketplace or intellectual property owner.",
        ],
      },
      {
        heading: "3. Eligibility",
        paragraphs: [
          "You must be at least 13 years old to use the Platform.",
          "If the laws where you live require a higher minimum age to enter into legal agreements, you may only use the Platform with the permission of a parent or legal guardian.",
        ],
      },
      {
        heading: "4. Your Account",
        paragraphs: [
          "Some features require an account.",
          "You are responsible for keeping your login credentials secure and for all activity carried out through your account.",
          "Information you provide must be accurate and kept up to date.",
        ],
      },
      {
        heading: "5. Using the Platform",
        paragraphs: [
          "We grant you a limited, non-exclusive, revocable licence to use the Platform for lawful personal or internal business purposes.",
          "You must not misuse the Platform, interfere with its operation, introduce malicious software, attempt unauthorised access, scrape substantial portions of our data without permission, reverse engineer our systems or use the Platform for unlawful purposes.",
        ],
      },
      {
        heading: "6. Market Information",
        paragraphs: [
          "The Platform provides market information for research and informational purposes only.",
          "Prices, historical sales, rankings, market capitalisation estimates, liquidity metrics, rarity indicators and analytics are estimates based on available information and proprietary methodologies.",
          "They are not guarantees, appraisals or investment advice.",
        ],
      },
      {
        heading: "7. Intellectual Property",
        paragraphs: [
          "Unless otherwise stated, all original software, databases, written content, charts, analytics, branding, designs and other original material on the Platform are owned by or licensed to Lowbridge Media Ventures Ltd and protected by applicable intellectual property laws.",
          "Third-party names, logos, card names and trademarks remain the property of their respective owners.",
        ],
      },
      {
        heading: "8. User Content",
        paragraphs: [
          "If you submit feedback, suggestions or other content to us, you grant Lowbridge a non-exclusive, worldwide, royalty-free licence to use, reproduce and improve the Platform using that content.",
          "You remain responsible for anything you submit.",
        ],
      },
      {
        heading: "9. Availability",
        paragraphs: [
          "We continually improve the Platform. Features may be added, modified or removed without notice.",
          "We do not guarantee uninterrupted availability or that the Platform will always be free from errors.",
        ],
      },
      {
        heading: "10. Disclaimers",
        paragraphs: [
          "The Platform is provided on an 'as is' and 'as available' basis.",
          "While we work to maintain accurate and useful information, we cannot guarantee that all data is complete, current or error-free.",
          "Please read our Disclaimer for further information.",
        ],
      },
      {
        heading: "11. Limitation of Liability",
        paragraphs: [
          "To the fullest extent permitted by law, Lowbridge Media Ventures Ltd will not be liable for indirect, incidental, consequential or special losses arising from your use of, or inability to use, the Platform.",
          "Nothing in these Terms excludes liability where such exclusion is prohibited by law.",
        ],
      },
      {
        heading: "12. Suspension and Termination",
        paragraphs: [
          "Lowbridge may suspend or terminate access to the Platform where reasonably necessary to protect the Platform, its users, comply with legal obligations or enforce these Terms.",
        ],
      },
      {
        heading: "13. Changes to these Terms",
        paragraphs: [
          "We may update these Terms from time to time.",
          "The latest version will always be published on the Platform together with the updated revision date.",
          "Continued use of the Platform after changes take effect constitutes acceptance of the revised Terms.",
        ],
      },
      {
        heading: "14. Governing Law",
        paragraphs: [
          "These Terms are governed by the laws of the jurisdiction in which Lowbridge Media Ventures Ltd is incorporated, except where mandatory consumer protection laws provide otherwise.",
        ],
      },
      {
        heading: "15. Related Policies",
        paragraphs: [
          "These Terms should be read together with our Privacy Policy, Cookie Policy, Disclaimer, Intellectual Property Policy, Copyright Notice & Takedown Policy and Data Sources & Methodology.",
        ],
      },
      {
        heading: "16. Contact",
        paragraphs: [
          "If you have questions about these Terms, please contact Lowbridge using the contact details published on the Platform.",
        ],
      },
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    shortTitle: "Privacy Policy",
    description:
      "How Lowbridge collects, uses, stores, protects and shares personal information.",
    sections: [
      {
        heading: "1. Introduction",
        paragraphs: [
          'CardMarketCap (the "Platform") is owned and operated by Lowbridge Media Ventures Ltd ("Lowbridge", "we", "our", or "us").',
          "This Privacy Policy explains how Lowbridge collects, uses, stores, protects and shares personal information when you access or use the Platform.",
          "By using the Platform, you acknowledge that you have read this Privacy Policy.",
        ],
      },
      {
        heading: "2. Information We Collect",
        paragraphs: [
          "We may collect information you provide directly, including your name, email address, username, profile information, support requests and communications.",
          "We may also automatically collect technical information such as IP address, browser type, device information, operating system, pages viewed, referring websites, session activity and approximate location derived from your IP address.",
          "If you create an account, we may also store watchlists, portfolios, saved preferences, favourites, alerts and subscription information.",
        ],
      },
      {
        heading: "3. How We Use Your Information",
        paragraphs: [
          "Lowbridge uses personal information to operate the Platform, create and manage accounts, authenticate users, provide requested services, personalise your experience, improve performance, develop new features, detect fraud and abuse, respond to enquiries, send requested communications, comply with legal obligations and enforce our Terms of Use.",
        ],
      },
      {
        heading: "4. Legal Bases",
        paragraphs: [
          "Where required by applicable law, we process personal information because it is necessary to provide the Platform, fulfil our contractual obligations, comply with legal requirements, protect legitimate business interests or because you have given your consent.",
        ],
      },
      {
        heading: "5. Cookies and Similar Technologies",
        paragraphs: [
          "We use cookies and similar technologies to maintain security, remember preferences, improve performance and understand how the Platform is used.",
          "Please read our Cookie Policy for more information.",
        ],
      },
      {
        heading: "6. Sharing Information",
        paragraphs: [
          "Lowbridge does not sell your personal information.",
          "We may share information with trusted service providers that help us operate the Platform, including hosting providers, authentication providers, analytics providers, payment providers, email delivery services, professional advisers or public authorities where required by law.",
        ],
      },
      {
        heading: "7. Data Security",
        paragraphs: [
          "We implement reasonable technical and organisational measures to protect personal information from unauthorised access, alteration, disclosure or destruction.",
          "However, no online service can guarantee absolute security.",
        ],
      },
      {
        heading: "8. International Transfers",
        paragraphs: [
          "Because the Platform may be accessed globally, your information may be processed in countries other than your own.",
          "Where required, Lowbridge will implement appropriate safeguards for international transfers.",
        ],
      },
      {
        heading: "9. Data Retention",
        paragraphs: [
          "We retain personal information only for as long as reasonably necessary to provide the Platform, comply with legal obligations, resolve disputes, enforce agreements and maintain legitimate business records.",
          "Information that is no longer required will be securely deleted or anonymised where appropriate.",
        ],
      },
      {
        heading: "10. Your Rights",
        paragraphs: [
          "Depending on where you live, you may have rights to access, correct, delete, restrict or object to the processing of your personal information, request portability of your data or withdraw consent where processing relies on consent.",
          "We will respond to valid requests in accordance with applicable law.",
        ],
      },
      {
        heading: "11. Children's Privacy",
        paragraphs: [
          "The Platform is not intended for children under 13 years of age, and Lowbridge does not knowingly collect personal information from children under 13.",
        ],
      },
      {
        heading: "12. Changes to this Policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time.",
          "The latest version will always be available on the Platform together with the revised 'Last Updated' date.",
        ],
      },
      {
        heading: "13. Related Policies",
        paragraphs: [
          "This Privacy Policy should be read together with our Terms of Use, Cookie Policy, Disclaimer, Intellectual Property Policy, Copyright Notice & Takedown Policy and Data Sources & Methodology.",
        ],
      },
      {
        heading: "14. Contact",
        paragraphs: [
          "If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact Lowbridge using the contact details published on the Platform.",
        ],
      },
    ],
  },
  {
    id: "cookie-policy",
    title: "Cookie Policy",
    shortTitle: "Cookie Policy",
    description:
      "How CardMarketCap uses cookies and similar technologies when operating the Platform.",
    sections: [
      {
        heading: "1. Introduction",
        paragraphs: [
          'CardMarketCap (the "Platform") is owned and operated by Lowbridge Media Ventures Ltd ("Lowbridge", "we", "our", or "us").',
          "This Cookie Policy explains how Lowbridge uses cookies and similar technologies when you access or use the Platform.",
          "It should be read together with our Privacy Policy.",
        ],
      },
      {
        heading: "2. What Are Cookies?",
        paragraphs: [
          "Cookies are small text files stored on your device by your web browser.",
          "They help websites recognise your device, remember preferences, improve performance and provide a more consistent browsing experience.",
        ],
      },
      {
        heading: "3. Why We Use Cookies",
        paragraphs: [
          "We use cookies to operate the Platform securely, remember your preferences, maintain user sessions, improve performance, understand how the Platform is used, diagnose technical issues and support future features such as accounts, watchlists and portfolios.",
        ],
      },
      {
        heading: "4. Types of Cookies We Use",
        paragraphs: [
          "Essential cookies support core functionality such as authentication and security.",
          "Preference cookies remember settings you choose.",
          "Analytics cookies help us understand how the Platform is used.",
          "Functional cookies enable enhanced features and improve your experience.",
        ],
      },
      {
        heading: "5. Third-Party Cookies",
        paragraphs: [
          "Some trusted service providers may place cookies on our behalf to support analytics, authentication, payment processing or other services required to operate the Platform.",
          "We do not control cookies placed by third-party websites that you visit through external links.",
        ],
      },
      {
        heading: "6. Managing Cookies",
        paragraphs: [
          "Most web browsers allow you to review, block or delete cookies.",
          "Disabling certain cookies may reduce the functionality of the Platform or prevent some services from operating correctly.",
        ],
      },
      {
        heading: "7. Changes to this Policy",
        paragraphs: [
          "Lowbridge may update this Cookie Policy from time to time to reflect changes in technology, legal requirements or the Platform.",
          "The latest version will always be published together with the revised 'Last Updated' date.",
        ],
      },
      {
        heading: "8. Related Policies",
        paragraphs: [
          "This Cookie Policy should be read together with our Privacy Policy, Terms of Use, Disclaimer, Intellectual Property Policy, Copyright Notice & Takedown Policy and Data Sources & Methodology.",
        ],
      },
      {
        heading: "9. Contact",
        paragraphs: [
          "If you have questions about this Cookie Policy, please contact Lowbridge using the contact details published on the Platform.",
        ],
      },
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    shortTitle: "Disclaimer",
    description:
      "Important information about market data, estimates and the intended use of CardMarketCap.",
    sections: [
      {
        heading: "1. Introduction",
        paragraphs: [
          'CardMarketCap (the "Platform") is owned and operated by Lowbridge Media Ventures Ltd ("Lowbridge", "we", "our", or "us").',
          "This Disclaimer explains the intended use of the information made available through the Platform.",
          "By using the Platform, you acknowledge and accept this Disclaimer together with our Terms of Use.",
        ],
      },
      {
        heading: "2. Information Only",
        paragraphs: [
          "The Platform is designed to provide market intelligence, pricing information, historical sales, grading information, analytics and educational resources relating to trading cards and collectibles.",
          "All information is provided for general informational purposes only.",
        ],
      },
      {
        heading: "3. No Financial or Investment Advice",
        paragraphs: [
          "Trading cards and collectibles are speculative assets.",
          "Nothing published on the Platform constitutes financial, investment, legal, tax or professional advice.",
          "You are solely responsible for your buying, selling, collecting, grading and investment decisions.",
        ],
      },
      {
        heading: "4. Market Prices",
        paragraphs: [
          "Displayed prices are estimates generated using available market information and proprietary methodologies.",
          "They are not guaranteed sale prices, formal valuations, insurance appraisals or offers to buy or sell.",
          "Actual values may differ based on condition, authenticity, rarity, timing, demand, marketplace, negotiation and other factors.",
        ],
      },
      {
        heading: "5. Historical Sales",
        paragraphs: [
          "Historical sales are presented to provide market context.",
          "Past sales should not be interpreted as predictions of future prices or future market performance.",
        ],
      },
      {
        heading: "6. Population & Grading Data",
        paragraphs: [
          "The Platform may display grading population information obtained from publicly available or licensed sources.",
          "While Lowbridge works to present accurate information, grading records may contain delays, omissions or inconsistencies originating from third parties.",
        ],
      },
      {
        heading: "7. Third-Party Information",
        paragraphs: [
          "The Platform may reference information from marketplaces, grading companies, publishers and other third parties.",
          "Lowbridge does not control these sources and cannot guarantee their accuracy, completeness or continued availability.",
        ],
      },
      {
        heading: "8. Accuracy",
        paragraphs: [
          "Lowbridge continually improves the Platform, but no large market database is perfect.",
          "Errors, omissions, duplicate records, unmatched items and outdated information may occasionally appear.",
          "Users should independently verify information before relying upon it.",
        ],
      },
      {
        heading: "9. Platform Availability",
        paragraphs: [
          "We aim to provide a reliable Platform but do not guarantee uninterrupted availability.",
          "Maintenance, technical issues, third-party outages or circumstances beyond our control may affect access.",
        ],
      },
      {
        heading: "10. Limitation of Liability",
        paragraphs: [
          "To the fullest extent permitted by law, Lowbridge Media Ventures Ltd shall not be liable for losses arising from reliance on information provided through the Platform, including pricing, analytics, historical sales, population data, technical interruptions or market movements.",
          "Nothing in this Disclaimer excludes liability where such exclusion would be unlawful.",
        ],
      },
      {
        heading: "11. Related Policies",
        paragraphs: [
          "This Disclaimer should be read together with our Terms of Use, Privacy Policy, Cookie Policy, Intellectual Property Policy, Copyright Notice & Takedown Policy and Data Sources & Methodology.",
        ],
      },
      {
        heading: "12. Contact",
        paragraphs: [
          "If you have questions regarding this Disclaimer, please contact Lowbridge using the contact details published on the Platform.",
        ],
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property Policy",
    shortTitle: "Intellectual Property",
    description:
      "Ownership and permitted use of CardMarketCap's platform, data, content and original methodologies.",
    sections: [
      {
        heading: "1. Introduction",
        paragraphs: [
          'CardMarketCap (the "Platform") is owned and operated by Lowbridge Media Ventures Ltd ("Lowbridge", "we", "our", or "us").',
          "This Policy explains the ownership and permitted use of intellectual property relating to the Platform and the material made available through it.",
        ],
      },
      {
        heading: "2. Lowbridge Intellectual Property",
        paragraphs: [
          "Unless otherwise stated, all original content created for the Platform is owned by or licensed to Lowbridge.",
          "This includes our software, databases, search technology, data models, market analytics, pricing methodologies, market capitalisation calculations, liquidity metrics, future confidence scoring methodologies, original written content, documentation, branding, logos, user interface design, graphics, charts and visualisations.",
        ],
      },
      {
        heading: "3. Platform Data",
        paragraphs: [
          "The organisation, structure and presentation of data within CardMarketCap represent substantial investment by Lowbridge.",
          "While individual facts may originate from public or licensed sources, the compilation, normalisation, matching, enrichment and presentation of those datasets form part of Lowbridge's proprietary intellectual property.",
        ],
      },
      {
        heading: "4. Third-Party Intellectual Property",
        paragraphs: [
          "The Platform may display or reference third-party names, trademarks, logos, card names, expansion names, artwork, grading information and marketplace data for identification, editorial, research and market-reference purposes.",
          "Ownership of those rights remains with their respective owners.",
        ],
      },
      {
        heading: "5. No Affiliation",
        paragraphs: [
          "Unless expressly stated otherwise, Lowbridge is not affiliated with, endorsed by or sponsored by any card manufacturer, publisher, grading company, marketplace or intellectual property owner whose products or services may be referenced on the Platform.",
        ],
      },
      {
        heading: "6. Permitted Use",
        paragraphs: [
          "You may access and use the Platform for lawful personal or internal business purposes.",
          "You must not reproduce, republish, commercially exploit, redistribute or create competing services using substantial portions of the Platform's original content or proprietary datasets without prior written permission.",
        ],
      },
      {
        heading: "7. Feedback",
        paragraphs: [
          "If you submit ideas, feature requests, corrections or suggestions relating to the Platform, you grant Lowbridge a non-exclusive, royalty-free licence to use that feedback to improve the Platform without obligation to provide compensation.",
        ],
      },
      {
        heading: "8. Enforcement",
        paragraphs: [
          "Lowbridge reserves the right to protect and enforce its intellectual property rights to the fullest extent permitted by applicable law.",
        ],
      },
      {
        heading: "9. Related Policies",
        paragraphs: [
          "This Policy should be read together with our Terms of Use, Copyright Notice & Takedown Policy, Privacy Policy, Disclaimer, Cookie Policy and Data Sources & Methodology.",
        ],
      },
      {
        heading: "10. Contact",
        paragraphs: [
          "For questions regarding intellectual property or permission requests, please contact Lowbridge using the contact details published on the Platform.",
        ],
      },
    ],
  },
  {
    id: "copyright-takedown",
    title: "Copyright Notice & Takedown Policy",
    shortTitle: "Copyright & Takedown",
    description:
      "How copyright and intellectual property concerns may be reported and reviewed.",
    sections: [
      {
        heading: "1. Introduction",
        paragraphs: [
          'CardMarketCap (the "Platform") is owned and operated by Lowbridge Media Ventures Ltd ("Lowbridge", "we", "our", or "us").',
          "Lowbridge respects the intellectual property rights of others and expects users of the Platform to do the same.",
          "This Policy explains how copyright and intellectual property concerns may be reported.",
        ],
      },
      {
        heading: "2. Reporting an Infringement",
        paragraphs: [
          "If you believe that material available through the Platform infringes your copyright or other intellectual property rights, please provide your name, contact details, a description of the work concerned, the location of the material on the Platform, evidence of your rights where appropriate, and a statement that the information supplied is accurate and made in good faith.",
        ],
      },
      {
        heading: "3. Our Review Process",
        paragraphs: [
          "Every notice received by Lowbridge is reviewed individually.",
          "We may request additional information before taking action.",
          "Depending on the circumstances, we may remove, restrict, update or retain the reported material while our review is completed.",
        ],
      },
      {
        heading: "4. Good Faith Requirement",
        paragraphs: [
          "Copyright notices should only be submitted where there is a genuine belief that rights have been infringed.",
          "Knowingly false, misleading or abusive notices may be rejected and, where appropriate, may result in further action permitted by applicable law.",
        ],
      },
      {
        heading: "5. Counter Notices",
        paragraphs: [
          "If material has been removed or restricted and the affected party believes this occurred in error, they may submit a written response explaining why the material should be restored.",
          "Lowbridge will consider all relevant information before reaching a decision.",
        ],
      },
      {
        heading: "6. Repeat Infringement",
        paragraphs: [
          "Where appropriate, Lowbridge reserves the right to suspend or terminate accounts or services associated with repeated infringement of intellectual property rights or repeated misuse of this reporting process.",
        ],
      },
      {
        heading: "7. Third-Party Rights",
        paragraphs: [
          "The Platform may reference third-party names, trademarks, logos, card names, artwork, grading information and marketplace information for identification, editorial, research and market-reference purposes.",
          "Ownership of those rights remains with their respective owners.",
        ],
      },
      {
        heading: "8. Resolution",
        paragraphs: [
          "Lowbridge believes that many intellectual property concerns can be resolved through open communication.",
          "We encourage rights holders to contact us directly so that concerns can be reviewed promptly and fairly.",
        ],
      },
      {
        heading: "9. Related Policies",
        paragraphs: [
          "This Policy should be read together with our Intellectual Property Policy, Terms of Use, Privacy Policy, Cookie Policy, Disclaimer and Data Sources & Methodology.",
        ],
      },
      {
        heading: "10. Contact",
        paragraphs: [
          "Copyright notices, permission requests and related enquiries should be submitted using the contact details published on the Platform.",
          "Lowbridge aims to acknowledge legitimate requests as soon as reasonably practicable.",
        ],
      },
    ],
  },
];

export default function TrustCentre() {

  const [activeDocumentId, setActiveDocumentId] = useState(
    TRUST_DOCUMENTS[0]?.id || ""
  );

  useEffect(() => {
    const sectionElements = TRUST_DOCUMENTS.map((trustDocument) =>
      window.document.getElementById(trustDocument.id)
    ).filter(
      (section): section is HTMLElement => section instanceof HTMLElement
    );

    if (!sectionElements.length) {
      return;
    }

    const updateActiveSectionFromScroll = () => {
      const activationOffset = 140;

      let currentSectionId = sectionElements[0]?.id || "";

      for (const section of sectionElements) {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop <= activationOffset) {
          currentSectionId = section.id;
        } else {
          break;
        }
      }

      const isNearPageBottom =
        window.innerHeight + window.scrollY >=
        window.document.documentElement.scrollHeight - 80;

      if (isNearPageBottom) {
        currentSectionId =
          sectionElements[sectionElements.length - 1]?.id ||
          currentSectionId;
      }

      setActiveDocumentId((previousId) =>
        previousId === currentSectionId
          ? previousId
          : currentSectionId
      );
    };

    const handleHashChange = () => {
      const hashId = window.location.hash.replace("#", "");

      const matchingDocument = TRUST_DOCUMENTS.find(
        (trustDocument) => trustDocument.id === hashId
      );

      if (matchingDocument) {
        setActiveDocumentId(matchingDocument.id);
      }
    };

    let ticking = false;

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(() => {
        updateActiveSectionFromScroll();
        ticking = false;
      });
    };

    handleHashChange();
    updateActiveSectionFromScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="relative isolate w-full max-w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] max-w-full bg-[radial-gradient(circle_at_top,rgba(0,186,136,0.09),transparent_70%)] sm:h-[560px]"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-10 pt-24 lg:pt-15 sm:px-5 sm:pt-28 md:px-8 md:pb-16 md:pt-32">
        <header className="w-full min-w-0 max-w-full border-b border-slate-200 pb-12 dark:border-slate-800 sm:pb-16 md:pb-20">
          <nav className="mb-5 flex min-w-0 max-w-full flex-wrap items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00BA88] sm:text-[10px]">
              CardMarketCap
            </span>

            <span className="text-[9px] text-slate-300 dark:text-slate-700 sm:text-[10px]">
              /
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 sm:text-[10px]">
              Trust Centre
            </span>
          </nav>

          <div className="grid w-full min-w-0 max-w-full gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
            <div className="w-full min-w-0 max-w-full">
              <h1 className="w-full max-w-5xl break-words text-[2.35rem] font-black leading-[1.04] tracking-[-0.04em] text-slate-950 [overflow-wrap:anywhere] dark:text-white sm:text-5xl md:text-6xl lg:text-[3.6rem]">
                Transparency and trust at the centre of{" "}
                <span className="text-[#00BA88]">
                  CardMarketCap.
                </span>
              </h1>

              <p className="mt-6 w-full max-w-4xl break-words text-[15px] font-medium leading-7 text-slate-600 [overflow-wrap:anywhere] dark:text-slate-400 sm:text-base sm:leading-8 md:text-lg">
                Explore how CardMarketCap operates, where our data comes
                from, how information is processed and the policies that
                govern the Platform.
              </p>
            </div>

            <div className="w-fit max-w-full border-l-2 border-[#00BA88] pl-4 lg:mb-2 lg:min-w-[145px]">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[10px]">
                Last updated
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                July 9, 2026
              </p>
            </div>
          </div>
        </header>

        <div className="grid w-full min-w-0 max-w-full items-start gap-10 py-10 md:py-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="w-full min-w-0 max-w-full self-start lg:sticky lg:top-28 lg:z-20 lg:h-fit">
            {/* Mobile navigation */}
            <div className="w-full min-w-0 max-w-full overflow-hidden lg:hidden">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Browse documents
              </p>

              <div className="w-full max-w-full overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-max min-w-full gap-2 pr-1">
                  {TRUST_DOCUMENTS.map((document) => {
                    const isActive =
                      activeDocumentId === document.id;

                    return (
                      <Link
                        key={document.id}
                        href={`#${document.id}`}
                        onClick={() =>
                          setActiveDocumentId(document.id)
                        }
                        aria-current={
                          isActive ? "location" : undefined
                        }
                        className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-black transition-all duration-300 ${
                          isActive
                            ? "border-[#00BA88] bg-[#00BA88]/10 text-[#00BA88] shadow-sm shadow-[#00BA88]/10"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#00BA88] hover:text-[#00BA88] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                        }`}
                      >
                        {document.shortTitle}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Desktop sticky navigation */}
            <nav
              aria-label="Trust Centre documents"
              className="hidden w-full border-t border-slate-200 dark:border-slate-800 lg:block"
            >
              {TRUST_DOCUMENTS.map((document, index) => {
                const isActive =
                  activeDocumentId === document.id;

                return (
                  <Link
                    key={document.id}
                    href={`#${document.id}`}
                    onClick={() =>
                      setActiveDocumentId(document.id)
                    }
                    aria-current={
                      isActive ? "location" : undefined
                    }
                    className={`group relative grid w-full min-w-0 grid-cols-[32px_minmax(0,1fr)] gap-3 border-b py-4 pl-3 pr-2 transition-all duration-300 ${
                      isActive
                        ? "border-[#00BA88]/20 bg-[#00BA88]/[0.07]"
                        : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-2 left-0 w-[3px] rounded-full bg-[#00BA88] transition-all duration-300 ${
                        isActive
                          ? "scale-y-100 opacity-100"
                          : "scale-y-50 opacity-0"
                      }`}
                    />

                    <span
                      className={`pt-0.5 text-[9px] font-black tracking-[0.16em] transition-colors duration-300 ${
                        isActive
                          ? "text-[#00BA88]"
                          : "text-slate-400 group-hover:text-[#00BA88] dark:text-slate-600"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`min-w-0 break-words text-sm font-bold leading-6 transition-colors duration-300 ${
                        isActive
                          ? "text-[#00BA88]"
                          : "text-slate-600 group-hover:text-[#00BA88] dark:text-slate-300"
                      }`}
                    >
                      {document.shortTitle}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="w-full min-w-0 max-w-full overflow-x-hidden">
            {TRUST_DOCUMENTS.map((document, documentIndex) => (
              <section
                key={document.id}
                id={document.id}
                className="w-full min-w-0 max-w-full scroll-mt-28 border-b border-slate-200 py-12 first:pt-0 last:border-b-0 dark:border-slate-800 sm:py-16 md:scroll-mt-32 md:py-20 lg:scroll-mt-28"
              >
                <div className="w-full min-w-0 max-w-5xl">
                  <p className="break-words text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                    Document{" "}
                    {String(documentIndex + 1).padStart(2, "0")}
                  </p>

                  <h2 className="mt-3 w-full max-w-full break-words text-[1.75rem] font-black leading-tight tracking-[-0.03em] text-slate-950 [overflow-wrap:anywhere] dark:text-white sm:text-3xl md:text-4xl">
                    {document.title}
                  </h2>

                  <p className="mt-4 w-full max-w-3xl break-words text-[15px] font-medium leading-7 text-slate-600 [overflow-wrap:anywhere] dark:text-slate-400 sm:text-base sm:leading-8">
                    {document.description}
                  </p>

                  <div className="mt-5 w-fit max-w-full border-l-2 border-[#00BA88] pl-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Last updated
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                      July 9, 2026
                    </p>
                  </div>
                </div>

                <div className="mt-10 w-full min-w-0 max-w-5xl border-t border-slate-200 dark:border-slate-800 sm:mt-12">
                  {document.sections.map((section) => (
                    <article
                      key={`${document.id}-${section.heading}`}
                      className="grid w-full min-w-0 max-w-full gap-4 border-b border-slate-200 py-7 last:border-b-0 dark:border-slate-800 sm:py-8 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-12"
                    >
                      <h3 className="w-full min-w-0 max-w-full break-words text-base font-black leading-7 text-slate-950 [overflow-wrap:anywhere] dark:text-white sm:text-lg">
                        {section.heading}
                      </h3>

                      <div className="w-full min-w-0 max-w-full space-y-4">
                        {section.paragraphs.map(
                          (paragraph, index) => (
                            <p
                              key={`${section.heading}-${index}`}
                              className="w-full min-w-0 max-w-full break-words whitespace-normal text-[15px] font-medium leading-7 text-slate-600 [overflow-wrap:anywhere] dark:text-slate-400 sm:text-base sm:leading-8"
                            >
                              {paragraph}
                            </p>
                          )
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {document.id === "data-corrections" ? (
                  <div className="mt-8 w-full min-w-0 max-w-full">
                    <Link
                      href="/contact"
                      className="group inline-flex min-h-11 max-w-full items-center gap-2 rounded-xl bg-[#00BA88] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-[#00a377]"
                    >
                      <span className="break-words">
                        Report a data issue
                      </span>

                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}