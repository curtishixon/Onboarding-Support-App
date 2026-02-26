"use client";

import { useState } from "react";

// --- Constants ---

const ONBOARDING_STEPS = [
  { id: 1, label: "Contact Info" },
  { id: 2, label: "Address" },
  { id: 3, label: "Review & Submit" },
];

const COUNTRY_OPTIONS = [
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "GB", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "NL", label: "Netherlands" },
  { code: "JP", label: "Japan" },
  { code: "CN", label: "China" },
  { code: "MX", label: "Mexico" },
  { code: "BR", label: "Brazil" },
  { code: "IN", label: "India" },
  { code: "KR", label: "South Korea" },
  { code: "IT", label: "Italy" },
  { code: "ES", label: "Spain" },
];

// --- Types ---

interface FormData {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  line3: string;
  locality: string;
  administrativeAreaCode: string;
  countryCode: string;
  postalCode: string;
}

interface FormErrors {
  [key: string]: string;
}

interface SubmitResult {
  success: boolean;
  partyId?: string;
  fulfillmentCenterId?: string;
  warning?: string;
  error?: string;
}

// --- Component ---

export default function FulfillmentCenterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    line3: "",
    locality: "",
    administrativeAreaCode: "",
    countryCode: "US",
    postalCode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validateStep1(): boolean {
    const newErrors: FormErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2(): boolean {
    const newErrors: FormErrors = {};
    if (!formData.line1.trim()) newErrors.line1 = "Street address is required";
    if (!formData.locality.trim()) newErrors.locality = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!formData.countryCode) newErrors.countryCode = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  }

  function handleBack() {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/zonos/fulfillment-center-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person: {
            companyName: formData.companyName.trim(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
          },
          location: {
            line1: formData.line1.trim(),
            line2: formData.line2.trim(),
            line3: formData.line3.trim(),
            locality: formData.locality.trim(),
            administrativeAreaCode: formData.administrativeAreaCode.trim(),
            countryCode: formData.countryCode,
            postalCode: formData.postalCode.trim(),
          },
        }),
      });

      const data = await response.json();

      if (response.ok || response.status === 207) {
        setResult({
          success: true,
          partyId: data.partyId,
          fulfillmentCenterId: data.fulfillmentCenterId,
          warning: data.warning,
        });
      } else {
        setResult({
          success: false,
          error: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setResult({
        success: false,
        error: "Network error. Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setStep(1);
    setFormData({
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      line1: "",
      line2: "",
      line3: "",
      locality: "",
      administrativeAreaCode: "",
      countryCode: "US",
      postalCode: "",
    });
    setErrors({});
    setResult(null);
  }

  // If we have a result, show the result screen
  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <PageHeader />
        <div className="card p-8 text-center">
          {result.success ? (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                Fulfillment Center Created
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Your fulfillment center has been successfully set up. International orders will now use this location as the ship-from address.
              </p>
              {result.warning && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6 text-left">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-sm text-amber-600 dark:text-amber-400">{result.warning}</p>
                  </div>
                </div>
              )}
              <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 mb-6 text-left space-y-2">
                {result.partyId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-tertiary)]">Party ID</span>
                    <span className="font-mono text-[var(--text-primary)]">{result.partyId}</span>
                  </div>
                )}
                {result.fulfillmentCenterId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-tertiary)]">Fulfillment Center ID</span>
                    <span className="font-mono text-[var(--text-primary)]">{result.fulfillmentCenterId}</span>
                  </div>
                )}
              </div>
              <button onClick={handleReset} className="btn-primary px-6 py-2.5 text-sm">
                Set Up Another Center
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                Setup Failed
              </h2>
              <p className="text-[var(--text-secondary)] mb-4">{result.error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setResult(null); setStep(3); }}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Back to Review
                </button>
                <button onClick={handleSubmit} className="btn-primary px-5 py-2.5 text-sm">
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader />

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {ONBOARDING_STEPS.map((s, index) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step > s.id
                      ? "bg-emerald-500 text-white"
                      : step === s.id
                        ? "bg-blue-600 text-white"
                        : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                  }`}
                >
                  {step > s.id ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.id
                  )}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    step >= s.id ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {index < ONBOARDING_STEPS.length - 1 && (
                <div className="flex-1 mx-3">
                  <div
                    className={`h-0.5 rounded transition-colors ${
                      step > s.id ? "bg-emerald-500" : "bg-[var(--border-primary)]"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="card p-6">
        {step === 1 && (
          <StepContactInfo
            formData={formData}
            errors={errors}
            onChange={updateField}
          />
        )}

        {step === 2 && (
          <StepAddress
            formData={formData}
            errors={errors}
            onChange={updateField}
          />
        )}

        {step === 3 && <StepReview formData={formData} />}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-[var(--border-primary)]">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button onClick={handleNext} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
              Continue
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  Create Fulfillment Center
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function PageHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gradient">Fulfillment Center Setup</h1>
      <p className="text-[var(--text-tertiary)] mt-1">
        Add your warehouse or fulfillment center to enable international shipping
      </p>

      {/* Info banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm text-blue-600 dark:text-blue-400">
          <p className="font-medium mb-1">What is a fulfillment center?</p>
          <p>
            A fulfillment center is the warehouse or location where your products ship from.
            Zonos uses this as the origin address to accurately calculate duties, taxes, and
            shipping rates for international orders. You need at least one to get started.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepContactInfo({
  formData,
  errors,
  onChange,
}: {
  formData: FormData;
  errors: FormErrors;
  onChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Contact Information</h2>
      <p className="text-sm text-[var(--text-tertiary)] mb-6">
        Enter the contact details for this fulfillment location.
      </p>

      <div className="space-y-4">
        <FormField
          label="Company Name"
          required
          value={formData.companyName}
          error={errors.companyName}
          placeholder="Acme Fulfillment Inc."
          tooltip="The business name associated with this warehouse or fulfillment center."
          onChange={(v) => onChange("companyName", v)}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            required
            value={formData.firstName}
            error={errors.firstName}
            placeholder="Jane"
            onChange={(v) => onChange("firstName", v)}
          />
          <FormField
            label="Last Name"
            required
            value={formData.lastName}
            error={errors.lastName}
            placeholder="Smith"
            onChange={(v) => onChange("lastName", v)}
          />
        </div>

        <FormField
          label="Email"
          required
          type="email"
          value={formData.email}
          error={errors.email}
          placeholder="warehouse@example.com"
          tooltip="Used for shipping notifications and fulfillment communications."
          onChange={(v) => onChange("email", v)}
        />

        <FormField
          label="Phone"
          type="tel"
          value={formData.phone}
          error={errors.phone}
          placeholder="+1 (555) 123-4567"
          tooltip="Optional. May be required by some carriers for customs clearance."
          onChange={(v) => onChange("phone", v)}
        />
      </div>
    </div>
  );
}

function StepAddress({
  formData,
  errors,
  onChange,
}: {
  formData: FormData;
  errors: FormErrors;
  onChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Warehouse Address</h2>
      <p className="text-sm text-[var(--text-tertiary)] mb-6">
        Enter the physical address of your fulfillment center. This will be used as the ship-from location for international orders.
      </p>

      <div className="space-y-4">
        <FormField
          label="Address Line 1"
          required
          value={formData.line1}
          error={errors.line1}
          placeholder="1234 Warehouse Blvd"
          tooltip="Street address, P.O. box, or company name."
          onChange={(v) => onChange("line1", v)}
        />

        <FormField
          label="Address Line 2"
          value={formData.line2}
          placeholder="Suite 100, Building A"
          tooltip="Apartment, suite, unit, building, floor, etc."
          onChange={(v) => onChange("line2", v)}
        />

        <FormField
          label="Address Line 3"
          value={formData.line3}
          placeholder=""
          onChange={(v) => onChange("line3", v)}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="City"
            required
            value={formData.locality}
            error={errors.locality}
            placeholder="Salt Lake City"
            onChange={(v) => onChange("locality", v)}
          />
          <FormField
            label="State / Province"
            value={formData.administrativeAreaCode}
            error={errors.administrativeAreaCode}
            placeholder="UT"
            tooltip="Two-letter state or province code (e.g., UT, CA, ON)."
            onChange={(v) => onChange("administrativeAreaCode", v)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Country <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.countryCode}
                onChange={(e) => onChange("countryCode", e.target.value)}
                className={`w-full appearance-none px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
                  errors.countryCode
                    ? "border-red-400 bg-red-500/5"
                    : "border-[var(--border-primary)] bg-[var(--bg-secondary)]"
                } text-[var(--text-primary)]`}
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {errors.countryCode && (
              <p className="text-xs text-red-500 mt-1">{errors.countryCode}</p>
            )}
          </div>
          <FormField
            label="Postal Code"
            required
            value={formData.postalCode}
            error={errors.postalCode}
            placeholder="84101"
            onChange={(v) => onChange("postalCode", v)}
          />
        </div>
      </div>
    </div>
  );
}

function StepReview({ formData }: { formData: FormData }) {
  const countryLabel =
    COUNTRY_OPTIONS.find((c) => c.code === formData.countryCode)?.label || formData.countryCode;

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Review Your Details</h2>
      <p className="text-sm text-[var(--text-tertiary)] mb-6">
        Please confirm everything looks correct before creating your fulfillment center.
      </p>

      <div className="space-y-5">
        {/* Contact section */}
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <ReviewRow label="Company" value={formData.companyName} />
            <ReviewRow label="Name" value={`${formData.firstName} ${formData.lastName}`} />
            <ReviewRow label="Email" value={formData.email} />
            <ReviewRow label="Phone" value={formData.phone || "Not provided"} />
          </div>
        </div>

        {/* Address section */}
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Warehouse Address
          </h3>
          <div className="text-sm text-[var(--text-primary)] space-y-0.5">
            <p>{formData.line1}</p>
            {formData.line2 && <p>{formData.line2}</p>}
            {formData.line3 && <p>{formData.line3}</p>}
            <p>
              {formData.locality}
              {formData.administrativeAreaCode && `, ${formData.administrativeAreaCode}`}{" "}
              {formData.postalCode}
            </p>
            <p>{countryLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[var(--text-tertiary)]">{label}: </span>
      <span className="text-[var(--text-primary)] font-medium">{value}</span>
    </div>
  );
}

function FormField({
  label,
  required,
  value,
  error,
  placeholder,
  tooltip,
  type = "text",
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  error?: string;
  placeholder?: string;
  tooltip?: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {tooltip && (
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-tertiary)] transition-colors"
              aria-label={`Info about ${label}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 text-xs rounded-lg bg-gray-900 text-gray-100 shadow-lg z-10">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 placeholder:text-[var(--text-muted)] ${
          error
            ? "border-red-400 bg-red-500/5"
            : "border-[var(--border-primary)] bg-[var(--bg-secondary)]"
        } text-[var(--text-primary)]`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
