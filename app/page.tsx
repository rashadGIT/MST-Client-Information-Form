

"use client";
import axios from "axios";
import { useState } from "react";

export default function MSTClientForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | { ok: boolean; msg: string }>(null);
  const [showModal, setShowModal] = useState(false);
  const [associatedEntities, setAssociatedEntities] = useState<number[]>([1, 2, 3]);
  const [clientServices, setClientServices] = useState<number[]>([1, 2, 3]);
  const url = "http://localhost:5678/webhook-test/2570b966-3b9d-4dd6-981d-53cf2a79e2aa";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(null);
    setShowModal(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Convert to JSON
    const data: Record<string, unknown> = {};
    fd.forEach((v, k) => {
      if (data[k]) {
        // handle arrays (checkbox groups)
        const existing = data[k];
        if (Array.isArray(existing)) {
          existing.push(v);
        } else {
          data[k] = [existing, v];
        }
      } else {
        data[k] = v;
      }
    });

    try {
      // TODO: wire this to your API route (e.g., /api/mst-client) or external endpoint
      console.log("MST Client Intake:", data);
      const res = await axios.post(url, data, { headers: { "Content-Type": "application/json" } });
      
      if (res.status === 200) console.log("Form submitted successfully");
      setSubmitted({
        ok: true,
        msg: "Thank you! Your form has been sent to our team for review.",
      });
      form.reset();
    } catch (err) {
      console.error(err);
      setSubmitted({ ok: false, msg: "Submission failed." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold tracking-tight">MST — Client Information Form</h1>
      {/* <p className="mt-1 text-sm text-gray-600">Fill out the details below. Fields mirror the original PDF.</p> */}

      <form onSubmit={onSubmit} className="mt-6 space-y-8">
        {/* Questionnaire Overview */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Questionnaire Overview</h2>
          <p className="mt-2 text-sm text-gray-700">
            Please complete this questionnaire at your earliest convenience. The information you provide will help us determine whether our services align well with your business goals and will also ensure that our initial session is as productive as possible. The questionnaire includes general questions about your goals and leadership style, along with more detailed questions about your business. Please answer as accurately and honestly as you can.
          </p>
        </section>

        {/* Date Last Updated */}
        {/* <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Meta</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Date Last Updated</span>
              <input name="date_last_updated" type="date" className="rounded-lg border p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Updated by (Full name)</span>
              <input name="updated_by" type="text" className="rounded-lg border p-2" placeholder="Full name of staff" />
            </label>
          </div>
        </section> */}

        {/* Assigned Teams */}
        {/* <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Assigned Team(s)</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Client Experience Team",
              "Accounting Manager",
              "Tax Partner",
              "Accounts Payable",
              "Payroll 1",
              "Special Projects"
            ].map((label) => (
              <label key={label} className="inline-flex items-center gap-2">
                <input type="checkbox" name="assigned_teams" value={label} className="h-4 w-4" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section> */}

        {/* Client Details */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Client Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Client Name</span>
              <input name="client_name" className="rounded-lg border p-2" required />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Client Short Name</span>
              <input name="client_short_name" className="rounded-lg border p-2" required />
            </label>
            <label className="sm:col-span-2 grid gap-1">
              <span className="text-sm font-medium">Client Address</span>
              <input name="client_address" className="rounded-lg border p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Industry</span>
              <input name="industry" className="rounded-lg border p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Software(s) Used</span>
              <input name="softwares_used" className="rounded-lg border p-2" />
            </label>
          </div>
        </section>

        {/* Client Contacts */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Client Contact(s)</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-medium">Primary Contact</h3>
              <div className="mt-2 grid gap-3">
                <input name="primary_name_title" className="rounded-lg border p-2" placeholder="Name (Title)" />
                <input name="primary_phone" className="rounded-lg border p-2" placeholder="Phone" />
                <input name="primary_email" type="email" className="rounded-lg border p-2" placeholder="Email" required/>
                <div className="grid gap-2">
                  <span className="text-sm">Contact for</span>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                    <div className="flex flex-wrap gap-3">
                      {[
                        { v: "Everything", l: "Everything" },
                        { v: "Accounting", l: "Accounting" },
                        { v: "Payroll", l: "Payroll" },
                        { v: "Other", l: "Other" }
                      ].map((o) => (
                        <label key={o.v} className="inline-flex items-center gap-2">
                          <input type="checkbox" name="primary_contact_for" value={o.v} className="h-4 w-4" />
                          <span>{o.l}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      name="primary_contact_other"
                      className="rounded-lg border p-2 sm:min-w-[220px]"
                      placeholder="If Other, describe"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Other Contacts</h3>
              <div className="mt-2 grid gap-3">
                <input name="other_name" className="rounded-lg border p-2" placeholder="Name" />
                <input name="other_phone" className="rounded-lg border p-2" placeholder="Phone" />
                <input name="other_email" type="email" className="rounded-lg border p-2" placeholder="Email" />
                <input name="other_contact_for" className="rounded-lg border p-2" placeholder="Contact for" />
              </div>
            </div>
          </div>
        </section>

        {/* Business Operations Summary */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Business Operations Summary</h2>
          <p className="mt-1 text-sm text-gray-600">
            <b>Description of Goods or Services: </b>
            Provide a concise overview of what the client's business does — 
            include the main products, services, or solutions offered. 
            Summarize this from their website or official materials, 
            focusing on what they provide, who they serve, and their core value proposition.
            Describe goods/services, customers served, and core value proposition.
          </p>
          <textarea name="business_ops_summary" className="mt-3 w-full rounded-xl border p-3" rows={5} />
        </section>

        {/* Associated Entities */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Associated Entities</h2>
          <p className="mt-1 text-sm text-gray-600">
            List all businesses, subsidiaries, brands, or related entities owned by the client that we support with recurring work.
          </p>
          <div className="mt-3 grid gap-3">
            {associatedEntities.map((id, index) => (
              <div key={id} className="flex gap-2">
                <input
                  name={`associated_entity_${id}`}
                  className="flex-1 rounded-lg border p-2"
                  placeholder={`Entity ${index + 1}`}
                />
                {associatedEntities.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setAssociatedEntities((prev) => prev.filter((x) => x !== id))
                    }
                    className="rounded-lg border px-2 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setAssociatedEntities((prev) => [
                  ...prev,
                  (prev[prev.length - 1] ?? 0) + 1,
                ])
              }
              className="inline-flex w-fit items-center justify-center rounded-lg border px-3 py-1 text-sm font-medium"
            >
              + Add another entity
            </button>
          </div>
        </section>

        {/* Services Provided by the Client */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Services Provided by the Client</h2>
          <p className="mt-1 text-sm text-gray-600">
            List the products or services the client offers to their own customers.
          </p>
          <div className="mt-3 grid gap-3">
            {clientServices.map((id, index) => (
              <div key={id} className="flex gap-2">
                <input
                  name={`client_services_${id}`}
                  className="flex-1 rounded-lg border p-2"
                  placeholder={`Service ${index + 1}`}
                />
                {clientServices.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setClientServices((prev) => prev.filter((x) => x !== id))
                    }
                    className="rounded-lg border px-2 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setClientServices((prev) => [
                  ...prev,
                  (prev[prev.length - 1] ?? 0) + 1,
                ])
              }
              className="inline-flex w-fit items-center justify-center rounded-lg border px-3 py-1 text-sm font-medium"
            >
              + Add another service
            </button>
          </div>
        </section>

        {/* Services Needed from our Team */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Services Needed from our Team</h2>
          <p className="mt-1 text-sm text-gray-600">
            List the new, ongoing, or recurring services we provide to this client.
          </p>
          <div className="mt-4 grid gap-3">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="needs_accounting" className="h-4 w-4" />
              <span>Accounting</span>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="needs_payroll" className="h-4 w-4" />
                <span>Payroll</span>
              </label>
              <input name="needs_payroll_states" className="rounded-lg border p-2" placeholder="Payroll States" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="needs_sales_tax" className="h-4 w-4" />
                <span>Sales Tax</span>
              </label>
              <input name="needs_sales_tax_states" className="rounded-lg border p-2" placeholder="Sales Tax States" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="inline-flex items-center gap-2">
                <input type="checkbox" name="needs_federal_income_tax_prep" className="h-4 w-4" />
                <span>Federal Income Tax Preparation</span>
              </div>
              <div className="flex flex-col gap-2 pl-0 sm:flex-row sm:gap-4 sm:pl-6">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="federal_tax_type" value="Business" /> Business
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="federal_tax_type" value="Personal" /> Personal
                </label>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="needs_state_income_tax_prep" className="h-4 w-4" />
                <span>State Income Tax Preparation</span>
              </label>
              <input name="needs_state_tax_states" className="rounded-lg border p-2" placeholder="States" />
            </div>
          </div>
        </section>

        {/* Accounting Method */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Accounting Method</h2>
          {[
            { key: "financial_statements", label: "Financial Statements" },
            { key: "income_tax_return", label: "Income Tax Return" },
            { key: "franchise_tax", label: "Franchise Tax" }
          ].map((row) => (
            <div key={row.key} className="mt-3 grid gap-3 sm:grid-cols-3 sm:items-center">
              <span className="text-sm font-medium">{row.label}</span>
              <label className="inline-flex items-center gap-2"><input type="radio" name={`${row.key}_method`} value="Accrual" /> Accrual</label>
              <label className="inline-flex items-center gap-2"><input type="radio" name={`${row.key}_method`} value="Cash" /> Cash</label>
            </div>
          ))}
          <div className="mt-4">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="property_tax_exemptions" className="h-4 w-4" />
              <span>Property Tax Exemptions</span>
            </label>
          </div>
        </section>

        {/* Deadlines */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Deadlines</h2>
          <p className="mt-1 text-sm text-gray-600">
            <b>Client External Reporting Requirements</b><br />
            List all key reporting or submission deadlines related to the client's external 
            obligations — e.g., loans, regulatory filings, tax reports, investor 
            updates, or compliance documents.
          </p>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <span className="text-sm font-medium">Reporting Frequency</span>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-4">
                {["Weekly", "Monthly", "Quarterly", "Annual"].map((f) => (
                  <label key={f} className="inline-flex items-center gap-2">
                    <input type="radio" name="reporting_frequency" value={f} />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="grid gap-1 sm:max-w-xs">
              <span className="text-sm font-medium">Due Date</span>
              <input type="date" name="report_due_date" className="rounded-lg border p-2" />
            </label>
            <label className="grid gap-1 sm:max-w-md">
              <span className="text-sm font-medium">Sales Tax Deadline(s)</span>
              <input name="sales_tax_deadlines" className="rounded-lg border p-2" placeholder="e.g., 20th monthly; Q1/Q2/Q3/Q4" />
            </label>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Payroll Processing Period</span>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-4">
                {["Biweekly", "1st & 15th", "15th & Last", "Monthly"].map((p) => (
                  <label key={p} className="inline-flex items-center gap-2">
                    <input type="radio" name="payroll_processing_period" value={p} />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Other Deadlines</span>
              <textarea
                name="other_deadlines"
                className="rounded-xl border p-3"
                rows={3}
                placeholder="Describe any other key dates"
              />
            </label>
          </div>
        </section>

        {/* Processes / Special Requests / Notes */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Processes / Special Requests / Notes</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div className="grid gap-3">
              <h3 className="text-sm font-semibold">Accounting Notes</h3>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Additional Client Requests</span>
                <textarea name="additional_requests" rows={4} className="rounded-xl border p-3" />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Unique GL Accounts</span>
                <textarea name="unique_gl_accounts" rows={4} className="rounded-xl border p-3" />
              </label>
            </div>
            <div className="grid gap-3">
              <h3 className="text-sm font-semibold">Payroll Notes</h3>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Client-specific Payroll Procedures</span>
                <textarea name="client_payroll_procedures" rows={4} className="rounded-xl border p-3" />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Expectations (ours & theirs)</span>
                <textarea name="expectations" rows={4} className="rounded-xl border p-3" />
              </label>
            </div>
          </div>
        </section>

        {/* QuickBooks Access */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">📝 QuickBooks Access (as needed)</h2>
          <p className="mt-2 text-sm text-gray-700">
            See below the steps required to add an accounting firm to your QuickBooks company. Please follow the steps for both of the companies that you would like to have our team maintain. Below are the steps, a link to a video that provides the same instructions (to be provided), and a note that the proposal we reviewed today during our meeting will be sent in a separate email.
          </p>

          <h3 className="mt-4 text-sm font-semibold">Invite your accountant</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700">
            <li>
              <a
                href="https://urldefense.proofpoint.com/v2/url?u=https-3A__quickbooks.intuit.com_sign-2Din-2Doffer_&d=DwMFaQ&c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&r=STQStEdfynHYDdL_KjjxM4eHxjQjXIiQGoXUUG2b8Y4&m=6J6IJM5IqYtz7Yq9ux9P_-dhxhRm3TsZPuONBdxoCCiDWn71X_Uapx2cOH8kIma8&s=OtdLe4OZb7nl_SLp8if_X2LnSRmGXdy499tYRLb8Tuk&e="
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sign in to QuickBooks Online
              </a>{" "}
              as an admin.
            </li>
            <li>Select <strong>Settings</strong>, then select <strong>Manage users</strong>.</li>
            <li>Select the <strong>Accountants</strong> or <strong>Accounting firms</strong> tab.</li>
            <li>
              Enter your accountant’s email address
              <span className="font-mono"> masturner10@sbcglobal.net</span>, then select <strong>Invite</strong>.
            </li>
          </ol>

          <h3 className="mt-4 text-sm font-semibold">What happens when you invite your accountant</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>Your accountant will receive an email about the invitation. You’ll know they accepted your request when the status on the Manage users page changes from <strong>Invited</strong> to <strong>Active</strong>.</li>
            <li>Your accountant will get a link to access your QuickBooks Online company if they already have QuickBooks Online Accountant. If they don’t, they need to sign up. Signing up lets them access all of the features available in your QuickBooks Online at no cost to you.</li>
            <li>If your accountant doesn’t receive the email:
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>Double-check the email is correct.</li>
                <li>
                  Check your user limits,
                  {" "}
                  <a
                    href="https://urldefense.proofpoint.com/v2/url?u=https-3A__quickbooks.intuit.com_learn-2Dsupport_en-2Dus_help-2Darticle_intuit-2Dsubscriptions_learn-2Dusage-2Dlimits-2Dquickbooks-2Donline_L6THMltE4-5FUS-5Fen-5FUS-3Fuid-3Dmc53brgb&d=DwMFaQ&c=euGZstcaTDllvimEN8b7jXrwqOf-v5A_CdpgnVfiiMM&r=STQStEdfynHYDdL_KjjxM4eHxjQjXIiQGoXUUG2b8Y4&m=6J6IJM5IqYtz7Yq9ux9P_-dhxhRm3TsZPuONBdxoCCiDWn71X_Uapx2cOH8kIma8&s=h695aPqpQGwy-buPAYm_IipRVTkgwWYNjKZPQVD43Bs&e="
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn about usage limits in QuickBooks Online
                  </a>
                  .
                </li>
              </ul>
            </li>
          </ul>

        </section>

        {/* Celebration / Personal */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Celebrations & Personal</h2>
          <p className="mt-1 text-sm text-gray-600">
            Lastly, would you be open to sharing your favorite cookie, birthday, and hobby—or something you love to do outside of work?</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Birthday</span>
              <input type="date" name="birthday" className="rounded-lg border p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Company Anniversary</span>
              <input type="date" name="company_anniversary" className="rounded-lg border p-2" />
            </label>
            <label className="grid gap-1 sm:col-span-2">
              <span className="text-sm font-medium">Favorite Cookie/Dessert</span>
              <input name="favorite_dessert" className="rounded-lg border p-2" />
            </label>
            <label className="grid gap-1 sm:col-span-2">
              <span className="text-sm font-medium">Hobbies / Community Involvement</span>
              <input name="hobbies" className="rounded-lg border p-2" />
            </label>
          </div><br />
          <p className="mt-1 text-sm text-gray-600">
            We like to celebrate our clients on special occasions.</p>
        </section>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg border bg-gray-900 px-4 py-2 text-white disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
          {submitted && (
            <p className={submitted.ok ? "text-green-700" : "text-red-700"}>{submitted.msg}</p>
          )}
        </div>
      </form>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex flex-col items-center gap-4 text-center">
              {submitting ? (
                // Larger animated spinner while submitting
                <div className="flex h-20 w-20 items-center justify-center">
                  <div className="h-16 w-16 rounded-full border-4 border-gray-300 border-t-gray-900 animate-spin" />
                </div>
              ) : submitted?.ok ? (
                // Larger success badge
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700 animate-pulse">
                  <span className="text-4xl">✓</span>
                </div>
              ) : (
                // Larger error badge
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-700">
                  <span className="text-4xl">!</span>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold">
                  {submitting
                    ? "Submitting your information..."
                    : submitted?.ok
                    ? "Submission complete"
                    : "Submission issue"}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {submitting
                    ? "Please wait while we send your responses to our system. This may take a few moments."
                    : submitted?.msg}
                </p>
              </div>
            </div>

            {!submitting && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const wasSuccessful = submitted?.ok;
                    setShowModal(false);
                    setSubmitted(null);
                    if (wasSuccessful && typeof window !== "undefined") {
                      window.location.href = "https://mstcpatx.com/";
                    }
                  }}
                  className="rounded-lg border px-4 py-2 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}