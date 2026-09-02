import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { Calculator, IndianRupee, Percent, Calendar, Info, ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { site, waLink } from "@/data/site";

interface EmiInputs {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  tenureYears: number;
}

interface EmiResult {
  loanAmount: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayable: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);

function calculateEmi(inputs: EmiInputs): EmiResult {
  const loanAmount = Math.max(0, inputs.propertyPrice - inputs.downPayment);
  const monthlyRate = inputs.interestRate / 12 / 100;
  const months = inputs.tenureYears * 12;

  let monthlyEmi = 0;
  if (monthlyRate === 0) {
    monthlyEmi = months > 0 ? loanAmount / months : 0;
  } else if (months > 0) {
    monthlyEmi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  const totalPayable = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayable - loanAmount);

  return {
    loanAmount,
    monthlyEmi,
    totalInterest,
    totalPayable,
  };
}

function InputField({
  label,
  icon: Icon,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  const [raw, setRaw] = useState(value.toString());

  useEffect(() => {
    setRaw(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRaw(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  const handleBlur = () => {
    setRaw(value.toString());
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Icon className="size-4 text-gold" />
          {label}
        </label>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={raw}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20",
            prefix && "pl-9",
            suffix && "pr-10",
          )}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-sm text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-gold"
        aria-label={`${label} slider`}
      />
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
  delay = 0,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-6 transition-all duration-500",
        highlight
          ? "border-gold/30 bg-gradient-to-br from-gold/10 to-gold/5"
          : "border-border bg-card",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className={cn("mt-2 font-display text-2xl sm:text-3xl", highlight ? "text-gold" : "text-foreground")}>
        {value}
      </p>
    </div>
  );
}

export function EmiCalculator({ className }: { className?: string }) {
  const [inputs, setInputs] = useState<EmiInputs>({
    propertyPrice: 5000000,
    downPayment: 1000000,
    interestRate: 8.5,
    tenureYears: 20,
  });

  const result = useMemo(() => calculateEmi(inputs), [inputs]);

  const setLoanAmount = useCallback((loanAmount: number) => {
    setInputs((prev) => ({ ...prev, downPayment: Math.max(0, prev.propertyPrice - loanAmount) }));
  }, []);

  const setDownPayment = useCallback((downPayment: number) => {
    setInputs((prev) => ({ ...prev, downPayment: Math.min(prev.propertyPrice, downPayment) }));
  }, []);

  const affordabilityMessage = useMemo(() => {
    const emiToPriceRatio = inputs.propertyPrice > 0 ? (result.monthlyEmi / inputs.propertyPrice) * 100 : 0;
    if (emiToPriceRatio < 0.5) return "This EMI looks comfortable for most buyers.";
    if (emiToPriceRatio < 0.8) return "Manageable, but review your monthly cash flow.";
    return "This EMI is aggressive — consider a larger down payment or longer tenure.";
  }, [result.monthlyEmi, inputs.propertyPrice]);

  const contactMessage = useMemo(() => {
    return `Hello Mohit, I used your EMI calculator for a property worth ${formatCompact(inputs.propertyPrice)}. My estimated EMI is ${formatCompact(result.monthlyEmi)} per month. Can you help me find the right property and loan options?`;
  }, [inputs.propertyPrice, result.monthlyEmi]);

  return (
    <div className={cn("mx-auto w-full max-w-5xl", className)}>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        {/* Inputs */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Calculator className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-lg">Loan Details</h3>
              <p className="text-xs text-muted-foreground">Adjust values to estimate your EMI</p>
            </div>
          </div>

          <div className="space-y-6">
            <InputField
              label="Property Price"
              icon={IndianRupee}
              value={inputs.propertyPrice}
              onChange={(v) => {
                setInputs((prev) => {
                  const price = Math.max(prev.downPayment, v);
                  return { ...prev, propertyPrice: price };
                });
              }}
              min={100000}
              max={100000000}
              step={100000}
              prefix="₹"
              hint="Max ₹10 Cr"
            />

            <InputField
              label="Down Payment"
              icon={IndianRupee}
              value={inputs.downPayment}
              onChange={setDownPayment}
              min={0}
              max={inputs.propertyPrice}
              step={50000}
              prefix="₹"
              hint={`Up to ${formatCompact(inputs.propertyPrice)}`}
            />

            <InputField
              label="Loan Amount"
              icon={IndianRupee}
              value={result.loanAmount}
              onChange={setLoanAmount}
              min={0}
              max={inputs.propertyPrice}
              step={100000}
              prefix="₹"
              hint="Auto-calculated"
            />

            <InputField
              label="Interest Rate"
              icon={Percent}
              value={inputs.interestRate}
              onChange={(v) => setInputs((prev) => ({ ...prev, interestRate: v }))}
              min={1}
              max={20}
              step={0.1}
              suffix="% p.a."
            />

            <InputField
              label="Loan Tenure"
              icon={Calendar}
              value={inputs.tenureYears}
              onChange={(v) => setInputs((prev) => ({ ...prev, tenureYears: v }))}
              min={1}
              max={30}
              step={1}
              suffix="Years"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
            <h3 className="font-display text-lg">EMI Summary</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <ResultCard label="Monthly EMI" value={formatCurrency(result.monthlyEmi)} highlight delay={0} />
              <ResultCard label="Total Interest Payable" value={formatCurrency(result.totalInterest)} delay={100} />
              <ResultCard label="Total Amount Payable" value={formatCurrency(result.totalPayable)} delay={200} />
              <ResultCard label="Loan Principal" value={formatCurrency(result.loanAmount)} delay={300} />
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-accent/50 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
              <p className="text-sm leading-relaxed text-foreground">
                {affordabilityMessage} Results are estimates — actual EMI depends on lender terms, processing fees and
                credit profile.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-gold/5 p-6 sm:p-8">
            <h3 className="font-display text-lg text-foreground">Can I Afford This Property?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A good rule of thumb: your monthly EMI should ideally be under 30–40% of your monthly income. Let me help
              you find options that fit your budget.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                search={{ property: `EMI estimate: ${formatCompact(result.monthlyEmi)}/month` }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Discuss My Budget <ArrowRight className="size-4" />
              </Link>
              <a
                href={waLink(contactMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-4" /> WhatsApp Me
              </a>
            </div>
          </div>

          <a
            href={`tel:${site.phone}`}
            className="flex items-center justify-center gap-2 rounded-3xl border border-border bg-card p-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Prefer a quick call? Reach me at <span className="font-semibold">{site.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
