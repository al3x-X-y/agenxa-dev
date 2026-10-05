import { db } from "../src/lib/db";
import { v4 as uuidv4 } from "uuid";

async function main() {
  console.log("🚀 Starting Showcase Database Workflow Setup...");

  const AGENCY_OWNER_EMAIL = "sislam223216@bscse.uiu.ac.bd";
  const SUBACCOUNT_USER_EMAIL = "smi.alex.mahtab@gmail.com";

  // 1. Verify / Fetch Users
  const agencyOwner = await db.user.findUnique({
    where: { email: AGENCY_OWNER_EMAIL },
  });
  const subaccountUser = await db.user.findUnique({
    where: { email: SUBACCOUNT_USER_EMAIL },
  });

  if (!agencyOwner || !subaccountUser) {
    throw new Error(
      `Could not locate both users. Found: owner=${!!agencyOwner}, subaccountUser=${!!subaccountUser}`
    );
  }

  const agencyId = agencyOwner.agencyId || "639b4067-8777-45c0-aaa7-cd7533971d7b";

  console.log(`✅ Located Agency Owner: ${agencyOwner.name} (${agencyOwner.email})`);
  console.log(`✅ Located Subaccount User: ${subaccountUser.name} (${subaccountUser.email})`);

  // 2. Update Agency
  await db.agency.update({
    where: { id: agencyId },
    data: {
      name: "Agenxa Apex Media",
      companyEmail: AGENCY_OWNER_EMAIL,
    },
  });
  console.log("✅ Updated Agency branding to 'Agenxa Apex Media'");

  // 3. Upsert or Update Subaccount
  const subaccountId = "bd675da3-78cf-4a3a-9597-ff7a1df1ab95";
  const subaccount = await db.subAccount.upsert({
    where: { id: subaccountId },
    update: {
      name: "Apex Growth Studio",
      companyEmail: SUBACCOUNT_USER_EMAIL,
      agencyId: agencyId,
    },
    create: {
      id: subaccountId,
      name: "Apex Growth Studio",
      companyEmail: SUBACCOUNT_USER_EMAIL,
      companyPhone: "+1 (555) 234-5678",
      subAccountLogo: "https://utfs.io/f/WgMrKRdpCJtoNTir08faBjrX8M0SUGWCx2VaQJgczfNnLZeA",
      address: "100 Innovation Way",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States",
      agencyId: agencyId,
    },
  });
  console.log(`✅ Subaccount ready: ${subaccount.name} (${subaccount.id})`);

  // 4. Ensure Permissions for both users
  await db.permissions.upsert({
    where: {
      id: "75ab4be0-dc2f-42b1-967d-3f814155b420",
    },
    update: { access: true },
    create: {
      id: "75ab4be0-dc2f-42b1-967d-3f814155b420",
      email: SUBACCOUNT_USER_EMAIL,
      subAccountId: subaccountId,
      access: true,
    },
  });

  await db.permissions.upsert({
    where: {
      id: "b45b07e3-003c-4b3c-902f-72ef33cfa41e",
    },
    update: { access: true },
    create: {
      id: "b45b07e3-003c-4b3c-902f-72ef33cfa41e",
      email: AGENCY_OWNER_EMAIL,
      subAccountId: subaccountId,
      access: true,
    },
  });
  console.log("✅ Verified Subaccount permissions for both Owner and Subaccount User");

  // 5. Upsert Tags
  const tagWebsiteLead = await db.tag.upsert({
    where: { id: "tag-website-lead" },
    update: { name: "Website Lead", color: "BLUE" },
    create: {
      id: "tag-website-lead",
      name: "Website Lead",
      color: "BLUE",
      subAccountId: subaccountId,
    },
  });

  const tagHighValue = await db.tag.upsert({
    where: { id: "tag-high-value" },
    update: { name: "High Value", color: "GREEN" },
    create: {
      id: "tag-high-value",
      name: "High Value",
      color: "GREEN",
      subAccountId: subaccountId,
    },
  });

  const tagHotLead = await db.tag.upsert({
    where: { id: "tag-hot-lead" },
    update: { name: "Hot Lead", color: "ROSE" },
    create: {
      id: "tag-hot-lead",
      name: "Hot Lead",
      color: "ROSE",
      subAccountId: subaccountId,
    },
  });

  const tagStrategyCall = await db.tag.upsert({
    where: { id: "tag-strategy-call" },
    update: { name: "Strategy Call", color: "ORANGE" },
    create: {
      id: "tag-strategy-call",
      name: "Strategy Call",
      color: "ORANGE",
      subAccountId: subaccountId,
    },
  });
  console.log("✅ Configured Tags: Website Lead (BLUE), High Value (GREEN), Hot Lead (ROSE), Strategy Call (ORANGE)");

  // 6. Upsert Contacts
  const contactAlex = await db.contact.upsert({
    where: { id: "89c7b03c-fb34-405e-adb5-b65a36e3f173" },
    update: { name: "Alex Mahtab", email: SUBACCOUNT_USER_EMAIL },
    create: {
      id: "89c7b03c-fb34-405e-adb5-b65a36e3f173",
      name: "Alex Mahtab",
      email: SUBACCOUNT_USER_EMAIL,
      subAccountId: subaccountId,
    },
  });

  const contactSarah = await db.contact.upsert({
    where: { id: "contact-sarah-jenkins" },
    update: { name: "Sarah Jenkins", email: "sarah.jenkins@acmegrowth.com" },
    create: {
      id: "contact-sarah-jenkins",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@acmegrowth.com",
      subAccountId: subaccountId,
    },
  });

  const contactDavid = await db.contact.upsert({
    where: { id: "contact-david-kim" },
    update: { name: "David Kim", email: "david.kim@nexusventures.io" },
    create: {
      id: "contact-david-kim",
      name: "David Kim",
      email: "david.kim@nexusventures.io",
      subAccountId: subaccountId,
    },
  });

  const contactElena = await db.contact.upsert({
    where: { id: "contact-elena-rostova" },
    update: { name: "Elena Rostova", email: "elena.r@innovatesoft.com" },
    create: {
      id: "contact-elena-rostova",
      name: "Elena Rostova",
      email: "elena.r@innovatesoft.com",
      subAccountId: subaccountId,
    },
  });
  console.log("✅ Synced Contacts in CRM (Alex Mahtab, Sarah Jenkins, David Kim, Elena Rostova)");

  // 7. Upsert Pipeline & Lanes
  const pipelineId = "f438f809-3fe4-49b1-95ec-7a94e3251eb4";
  const pipeline = await db.pipeline.upsert({
    where: { id: pipelineId },
    update: { name: "Client Acquisition Pipeline" },
    create: {
      id: pipelineId,
      name: "Client Acquisition Pipeline",
      subAccountId: subaccountId,
    },
  });

  const laneInbound = await db.lane.upsert({
    where: { id: "33432cc8-ed6c-4a2e-af8d-801e3fc63b23" },
    update: { name: "📥 New Inbound Leads", order: 0 },
    create: {
      id: "33432cc8-ed6c-4a2e-af8d-801e3fc63b23",
      name: "📥 New Inbound Leads",
      order: 0,
      pipelineId: pipeline.id,
    },
  });

  const laneDiscovery = await db.lane.upsert({
    where: { id: "ec9276e6-8c6d-4b7c-936e-6af3cb0492d6" },
    update: { name: "📞 Discovery Scheduled", order: 1 },
    create: {
      id: "ec9276e6-8c6d-4b7c-936e-6af3cb0492d6",
      name: "📞 Discovery Scheduled",
      order: 1,
      pipelineId: pipeline.id,
    },
  });

  const laneProposal = await db.lane.upsert({
    where: { id: "lane-proposal-sent" },
    update: { name: "📄 Proposal & Quote Sent", order: 2 },
    create: {
      id: "lane-proposal-sent",
      name: "📄 Proposal & Quote Sent",
      order: 2,
      pipelineId: pipeline.id,
    },
  });

  const laneClosedWon = await db.lane.upsert({
    where: { id: "3ab08077-58c5-4a44-9976-278198edda49" },
    update: { name: "🤝 Closed Won (Active Clients)", order: 3 },
    create: {
      id: "3ab08077-58c5-4a44-9976-278198edda49",
      name: "🤝 Closed Won (Active Clients)",
      order: 3,
      pipelineId: pipeline.id,
    },
  });
  console.log("✅ Configured 4 Kanban Lanes for Pipeline");

  // 8. Upsert Tickets across the Lanes
  // Ticket 1: Inbound Lead
  await db.ticket.upsert({
    where: { id: "ticket-inbound-sarah" },
    update: {
      name: "Enterprise Web Funnel & Growth Retainer",
      value: 6500,
      description: "Inbound lead submitted via Apex landing page contact form. Requested custom quote for multi-page funnel.",
      laneId: laneInbound.id,
      order: 0,
      customerId: contactSarah.id,
      assignedUserId: subaccountUser.id,
      Tags: { set: [{ id: tagWebsiteLead.id }, { id: tagHotLead.id }] },
    },
    create: {
      id: "ticket-inbound-sarah",
      name: "Enterprise Web Funnel & Growth Retainer",
      value: 6500,
      description: "Inbound lead submitted via Apex landing page contact form. Requested custom quote for multi-page funnel.",
      laneId: laneInbound.id,
      order: 0,
      customerId: contactSarah.id,
      assignedUserId: subaccountUser.id,
      Tags: { connect: [{ id: tagWebsiteLead.id }, { id: tagHotLead.id }] },
    },
  });

  // Ticket 2: Discovery Call
  await db.ticket.upsert({
    where: { id: "ticket-discovery-david" },
    update: {
      name: "Nexus Ventures - Funnel Optimization",
      value: 3200,
      description: "Discovery call scheduled for Thursday at 2:00 PM EST. High interest in lead capture automations.",
      laneId: laneDiscovery.id,
      order: 0,
      customerId: contactDavid.id,
      assignedUserId: subaccountUser.id,
      Tags: { set: [{ id: tagStrategyCall.id }, { id: tagWebsiteLead.id }] },
    },
    create: {
      id: "ticket-discovery-david",
      name: "Nexus Ventures - Funnel Optimization",
      value: 3200,
      description: "Discovery call scheduled for Thursday at 2:00 PM EST. High interest in lead capture automations.",
      laneId: laneDiscovery.id,
      order: 0,
      customerId: contactDavid.id,
      assignedUserId: subaccountUser.id,
      Tags: { connect: [{ id: tagStrategyCall.id }, { id: tagWebsiteLead.id }] },
    },
  });

  // Ticket 3: Proposal Sent
  await db.ticket.upsert({
    where: { id: "ticket-proposal-elena" },
    update: {
      name: "InnovateSoft - Custom Platform Build",
      value: 8500,
      description: "Full scope of work sent. Legal review in progress. Expecting contract execution next week.",
      laneId: laneProposal.id,
      order: 0,
      customerId: contactElena.id,
      assignedUserId: subaccountUser.id,
      Tags: { set: [{ id: tagHighValue.id }] },
    },
    create: {
      id: "ticket-proposal-elena",
      name: "InnovateSoft - Custom Platform Build",
      value: 8500,
      description: "Full scope of work sent. Legal review in progress. Expecting contract execution next week.",
      laneId: laneProposal.id,
      order: 0,
      customerId: contactElena.id,
      assignedUserId: subaccountUser.id,
      Tags: { connect: [{ id: tagHighValue.id }] },
    },
  });

  // Ticket 4: Closed Won
  await db.ticket.upsert({
    where: { id: "a076933b-464f-432a-873f-44bd1075bbe9" },
    update: {
      name: "Acme Brand Growth Retainer",
      value: 5000,
      description: "Contract signed, deposit received. Client onboarded into Apex Growth Studio.",
      laneId: laneClosedWon.id,
      order: 0,
      customerId: contactAlex.id,
      assignedUserId: subaccountUser.id,
      Tags: { set: [{ id: tagHighValue.id }, { id: tagWebsiteLead.id }] },
    },
    create: {
      id: "a076933b-464f-432a-873f-44bd1075bbe9",
      name: "Acme Brand Growth Retainer",
      value: 5000,
      description: "Contract signed, deposit received. Client onboarded into Apex Growth Studio.",
      laneId: laneClosedWon.id,
      order: 0,
      customerId: contactAlex.id,
      assignedUserId: subaccountUser.id,
      Tags: { connect: [{ id: tagHighValue.id }, { id: tagWebsiteLead.id }] },
    },
  });
  console.log("✅ Populated Kanban Tickets across all 4 stages with values & tags");

  // 9. Website / Funnel with ALL Codebase Components
  const landingPageContent = JSON.stringify([
    {
      id: "__body",
      name: "Body",
      type: "__body",
      styles: {
        backgroundColor: "#090d16",
        color: "#ffffff",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        padding: "24px",
      },
      content: [
        {
          id: "container-hero",
          name: "Hero Container",
          type: "container",
          styles: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "40px 20px",
            maxWidth: "1200px",
            margin: "0 auto",
          },
          content: [
            {
              id: "hero-badge",
              name: "Text",
              type: "text",
              styles: {
                fontSize: "14px",
                fontWeight: "600",
                color: "#38bdf8",
                backgroundColor: "#0f2744",
                padding: "6px 16px",
                borderRadius: "20px",
                marginBottom: "16px",
                display: "inline-block",
              },
              content: {
                innerText: "🚀 NEXT-GEN AGENCY WORKFLOW PLATFORM",
              },
            },
            {
              id: "hero-headline",
              name: "Text",
              type: "text",
              styles: {
                fontSize: "44px",
                fontWeight: "800",
                color: "#ffffff",
                marginBottom: "16px",
                lineHeight: "1.2",
              },
              content: {
                innerText: "Scale Your Agency Funnels & Close Deals Faster",
              },
            },
            {
              id: "hero-subheading",
              name: "Text",
              type: "text",
              styles: {
                fontSize: "18px",
                color: "#94a3b8",
                maxWidth: "720px",
                marginBottom: "36px",
                lineHeight: "1.6",
              },
              content: {
                innerText:
                  "Empower your agency team and subaccount clients with unified drag-and-drop website building, automated lead capture, and real-time Kanban pipelines.",
              },
            },
            {
              id: "split-two-columns",
              name: "Two Columns",
              type: "2Col",
              styles: {
                display: "flex",
                flexDirection: "row",
                width: "100%",
                gap: "28px",
                alignItems: "flex-start",
                justifyContent: "center",
                marginTop: "20px",
              },
              content: [
                {
                  id: "left-column",
                  name: "Container",
                  type: "container",
                  styles: {
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",
                    backgroundColor: "#131b2e",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid #1e293b",
                  },
                  content: [
                    {
                      id: "video-heading",
                      name: "Text",
                      type: "text",
                      styles: {
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#f8fafc",
                        marginBottom: "12px",
                      },
                      content: {
                        innerText: "📺 See How Agenxa Works in 2 Minutes",
                      },
                    },
                    {
                      id: "promo-video",
                      name: "Video",
                      type: "video",
                      styles: {
                        width: "100%",
                        height: "280px",
                        borderRadius: "12px",
                        marginBottom: "20px",
                      },
                      content: {
                        src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                      },
                    },
                    {
                      id: "cta-pricing-link",
                      name: "Link",
                      type: "link",
                      styles: {
                        color: "#ffffff",
                        backgroundColor: "#2563eb",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        textDecoration: "none",
                        display: "inline-block",
                        cursor: "pointer",
                      },
                      content: {
                        href: "#pricing",
                        innerText: "Explore Retainers & Pricing ↓",
                      },
                    },
                  ],
                },
                {
                  id: "right-column",
                  name: "Container",
                  type: "container",
                  styles: {
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    textAlign: "left",
                    backgroundColor: "#131b2e",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid #1e293b",
                  },
                  content: [
                    {
                      id: "form-title",
                      name: "Text",
                      type: "text",
                      styles: {
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#f8fafc",
                        marginBottom: "8px",
                      },
                      content: {
                        innerText: "🎯 Request a Strategy Consultation",
                      },
                    },
                    {
                      id: "form-sub",
                      name: "Text",
                      type: "text",
                      styles: {
                        fontSize: "14px",
                        color: "#94a3b8",
                        marginBottom: "16px",
                      },
                      content: {
                        innerText:
                          "Enter your details below. This contact form directly synchronizes with our live Kanban pipeline!",
                      },
                    },
                    {
                      id: "interactive-contact-form",
                      name: "Contact Form",
                      type: "contactForm",
                      styles: {
                        width: "100%",
                      },
                      content: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "container-pricing",
          name: "Pricing Container",
          type: "container",
          styles: {
            maxWidth: "1200px",
            margin: "40px auto 0 auto",
            padding: "36px",
            backgroundColor: "#0f172a",
            borderRadius: "16px",
            border: "1px solid #1e293b",
            textAlign: "center",
          },
          content: [
            {
              id: "pricing-title",
              name: "Text",
              type: "text",
              styles: {
                fontSize: "28px",
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: "8px",
              },
              content: {
                innerText: "Apex Growth Client Retainer",
              },
            },
            {
              id: "pricing-desc",
              name: "Text",
              type: "text",
              styles: {
                fontSize: "16px",
                color: "#94a3b8",
                marginBottom: "24px",
              },
              content: {
                innerText:
                  "$4,500 / month — Complete full-funnel optimization, dedicated pipeline management, and white-label CRM.",
              },
            },
            {
              id: "checkout-step-link",
              name: "Link",
              type: "link",
              styles: {
                color: "#ffffff",
                backgroundColor: "#10b981",
                padding: "14px 28px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "16px",
                textDecoration: "none",
                display: "inline-block",
                cursor: "pointer",
              },
              content: {
                href: "/secondstep",
                innerText: "Proceed to Checkout Step →",
              },
            },
          ],
        },
      ],
    },
  ]);

  const paymentPageContent = JSON.stringify([
    {
      id: "__body",
      name: "Body",
      type: "__body",
      styles: {
        backgroundColor: "#090d16",
        color: "#ffffff",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        padding: "24px",
      },
      content: [
        {
          id: "payment-wrapper",
          name: "Payment Container",
          type: "container",
          styles: {
            maxWidth: "800px",
            margin: "40px auto",
            padding: "36px",
            backgroundColor: "#131b2e",
            borderRadius: "16px",
            border: "1px solid #1e293b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
          content: [
            {
              id: "checkout-title",
              name: "Text",
              type: "text",
              styles: {
                fontSize: "30px",
                fontWeight: "800",
                color: "#ffffff",
                marginBottom: "12px",
                textAlign: "center",
              },
              content: {
                innerText: "Confirm Your Strategy Retainer",
              },
            },
            {
              id: "checkout-sub",
              name: "Text",
              type: "text",
              styles: {
                fontSize: "15px",
                color: "#94a3b8",
                marginBottom: "28px",
                textAlign: "center",
              },
              content: {
                innerText:
                  "Secure Stripe Checkout integration wired directly to your subaccount payment gateway.",
              },
            },
            {
              id: "stripe-checkout-element",
              name: "Checkout",
              type: "paymentForm",
              styles: {
                width: "100%",
                maxWidth: "600px",
                marginBottom: "24px",
              },
              content: [],
            },
            {
              id: "back-link",
              name: "Link",
              type: "link",
              styles: {
                color: "#94a3b8",
                fontSize: "14px",
                textDecoration: "underline",
                cursor: "pointer",
              },
              content: {
                href: "/",
                innerText: "← Back to Main Funnel Page",
              },
            },
          ],
        },
      ],
    },
  ]);

  const funnelId = "c2fdd9ab-c7c9-4cd5-bf12-a7cfd62cdee8";
  await db.funnel.upsert({
    where: { id: funnelId },
    update: {
      name: "Apex Growth Inbound Funnel",
      subDomainName: "apex",
      description: "High-converting agency website & lead acquisition funnel built with Agenxa visual components.",
      published: true,
      subAccountId: subaccountId,
    },
    create: {
      id: funnelId,
      name: "Apex Growth Inbound Funnel",
      subDomainName: "apex",
      description: "High-converting agency website & lead acquisition funnel built with Agenxa visual components.",
      published: true,
      subAccountId: subaccountId,
    },
  });

  // Landing Page
  const landingPageId = "c5f7d83c-e993-45ee-b2e9-0b48ee91ef6d";
  await db.funnelPage.upsert({
    where: { id: landingPageId },
    update: {
      name: "Landing Page",
      pathName: "",
      order: 0,
      content: landingPageContent,
      funnelId: funnelId,
    },
    create: {
      id: landingPageId,
      name: "Landing Page",
      pathName: "",
      order: 0,
      content: landingPageContent,
      funnelId: funnelId,
    },
  });

  // Payment Page
  const paymentPageId = "5a720776-ef2e-4223-83ab-554e75124a9b";
  await db.funnelPage.upsert({
    where: { id: paymentPageId },
    update: {
      name: "Strategy Retainer & Checkout",
      pathName: "secondstep",
      order: 1,
      content: paymentPageContent,
      funnelId: funnelId,
    },
    create: {
      id: paymentPageId,
      name: "Strategy Retainer & Checkout",
      pathName: "secondstep",
      order: 1,
      content: paymentPageContent,
      funnelId: funnelId,
    },
  });
  console.log("✅ Seeded Funnel Pages with ALL 7 native components (Container, 2Col, Text, Video, Link, ContactForm, Checkout)");

  // 10. Notifications / Activity Logs
  await db.notification.createMany({
    data: [
      {
        id: uuidv4(),
        notification: `${agencyOwner.name} | Delegated permissions for subaccount Apex Growth Studio`,
        agencyId: agencyId,
        subAccountId: subaccountId,
        userId: agencyOwner.id,
      },
      {
        id: uuidv4(),
        notification: `${subaccountUser.name} | Created ticket Enterprise Web Funnel & Growth Retainer ($6,500)`,
        agencyId: agencyId,
        subAccountId: subaccountId,
        userId: subaccountUser.id,
      },
      {
        id: uuidv4(),
        notification: `${subaccountUser.name} | A New contact signed up | Sarah Jenkins`,
        agencyId: agencyId,
        subAccountId: subaccountId,
        userId: subaccountUser.id,
      },
      {
        id: uuidv4(),
        notification: `${subaccountUser.name} | Moved ticket Acme Brand Growth Retainer to Closed Won ($5,000)`,
        agencyId: agencyId,
        subAccountId: subaccountId,
        userId: subaccountUser.id,
      },
    ],
  });
  console.log("✅ Logged realistic activity events in Notification audit feed");

  console.log("\n🎉 SHOWCASE WORKFLOW SUCCESSFULLY SEEDED IN DATABASE!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🏢 Agency: Agenxa Apex Media (Owner: ${AGENCY_OWNER_EMAIL})`);
  console.log(`📁 Subaccount: Apex Growth Studio (User: ${SUBACCOUNT_USER_EMAIL})`);
  console.log(`🌐 Funnel: /subaccount/${subaccountId}/funnels/${funnelId}`);
  console.log(`✏️ Editor: /subaccount/${subaccountId}/funnels/${funnelId}/editor/${landingPageId}`);
  console.log(`📊 Kanban Pipeline: /subaccount/${subaccountId}/pipelines/${pipelineId}`);
  console.log(`👥 Contacts: /subaccount/${subaccountId}/contacts`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((err) => {
    console.error("❌ Error running showcase seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
