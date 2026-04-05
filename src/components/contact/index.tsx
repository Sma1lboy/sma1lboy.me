import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Send,
  CheckCircle,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/Sma1lboy",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chong-chen-857214292/",
  },
  {
    icon: Twitter,
    label: "Twitter / X",
    href: "https://x.com/sma1lboy",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:541898146chen@gmail.com",
  },
];

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email address";
  }
  if (!data.message.trim()) errors.message = "Message is required";
  return errors;
}

function FloatingField({
  label,
  name,
  type = "text",
  value,
  error,
  onChange,
  multiline = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  const sharedClasses = `peer w-full rounded-lg border bg-transparent px-4 pt-5 pb-2 text-sm outline-none transition-colors duration-200
    ${
      error
        ? "border-red-400 dark:border-red-500"
        : focused
          ? "border-gray-500 dark:border-gray-400"
          : "border-gray-300 dark:border-[#2a2a2a]"
    }
    text-gray-900 dark:text-gray-100
    placeholder-transparent`;

  return (
    <motion.div
      className="relative"
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ duration: 0.2, ease }}
    >
      {/* focus glow ring */}
      <AnimatePresence>
        {focused && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-lg border border-gray-400/40 dark:border-gray-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {multiline ? (
        <textarea
          id={`field-${name}`}
          name={name}
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${sharedClasses} resize-none`}
          placeholder={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : (
        <input
          id={`field-${name}`}
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={sharedClasses}
          placeholder={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}

      {/* floating label */}
      <motion.label
        htmlFor={`field-${name}`}
        className={`pointer-events-none absolute left-4 origin-left ${
          error ? "text-red-400 dark:text-red-500" : "text-gray-500 dark:text-gray-400"
        }`}
        animate={active ? { y: 4, scale: 0.75, opacity: 1 } : { y: 14, scale: 1, opacity: 0.6 }}
        transition={{ duration: 0.2, ease }}
      >
        {label}
      </motion.label>

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${name}-error`}
            role="alert"
            className="mt-1 text-xs text-red-400 dark:text-red-500"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ContactPage() {
  useSEO({
    title: "Contact",
    description: "Get in touch.",
    path: "/contact",
  });

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof FormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12 text-gray-900 sm:px-6 lg:px-8 dark:bg-[#0a0a0a] dark:text-gray-100">
      <div className="mx-auto max-w-xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </motion.div>

        {/* Page title */}
        <motion.h1
          className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          Get in Touch
        </motion.h1>
        <motion.p
          className="mb-10 text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease }}
        >
          Have a question or want to work together? Drop me a message.
        </motion.p>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease }}
            >
              <FloatingField
                label="Name"
                name="name"
                value={form.name}
                error={errors.name}
                onChange={handleChange("name")}
              />
              <FloatingField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={handleChange("email")}
              />
              <FloatingField
                label="Message"
                name="message"
                value={form.message}
                error={errors.message}
                onChange={handleChange("message")}
                multiline
              />

              <motion.button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? (
                  <motion.div
                    className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Send size={15} />
                    Send Message
                  </>
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              className="flex flex-col items-center py-16 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
              >
                <CheckCircle size={48} className="text-emerald-500" />
              </motion.div>
              <h2 className="mt-5 text-xl font-semibold">Message Sent!</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Thanks for reaching out. I'll get back to you soon.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="mt-6 text-sm text-gray-500 underline underline-offset-4 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Send another message
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="my-12 h-px bg-gray-200 dark:bg-[#1a1a1a]" />

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
        >
          <h2 className="mb-5 text-lg font-semibold">Find me elsewhere</h2>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:border-[#1e1e1e] dark:hover:bg-[#111]"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon
                  size={16}
                  className="text-gray-500 transition-colors group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200"
                />
                <span className="text-gray-700 dark:text-gray-300">{label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          className="mt-10 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease }}
        >
          <MapPin size={14} />
          <span>Madison, WI &middot; North America</span>
        </motion.div>
      </div>
    </div>
  );
}
