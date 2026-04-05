import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Code2, User, Hash, Star } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useSEO } from "@/hooks/useSEO";
import { useToastStore } from "@/store/toastStore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WidgetType = "github" | "profile" | "counter";

interface GithubBadgeConfig {
  repo: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}

interface ProfileCardConfig {
  name: string;
  title: string;
  avatarUrl: string;
  github: string;
  twitter: string;
  website: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}

interface CounterConfig {
  label: string;
  startValue: number;
  endValue: number;
  duration: number;
  bgColor: string;
  textColor: string;
  accentColor: string;
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

const TABS: { key: WidgetType; label: string; icon: React.ReactNode }[] = [
  { key: "github", label: "GitHub Badge", icon: <Star size={14} /> },
  { key: "profile", label: "Profile Card", icon: <User size={14} /> },
  { key: "counter", label: "Counter", icon: <Hash size={14} /> },
];

// ---------------------------------------------------------------------------
// Default configs
// ---------------------------------------------------------------------------

const DEFAULT_GITHUB: GithubBadgeConfig = {
  repo: "facebook/react",
  bgColor: "#0d1117",
  textColor: "#e6edf3",
  accentColor: "#f59e0b",
};

const DEFAULT_PROFILE: ProfileCardConfig = {
  name: "Jackson Chen",
  title: "Full Stack Developer",
  avatarUrl: "https://github.com/sma1lboy.png",
  github: "sma1lboy",
  twitter: "",
  website: "sma1lboy.me",
  bgColor: "#0d1117",
  textColor: "#e6edf3",
  accentColor: "#6366f1",
};

const DEFAULT_COUNTER: CounterConfig = {
  label: "Happy Users",
  startValue: 0,
  endValue: 1234,
  duration: 2,
  bgColor: "#0d1117",
  textColor: "#e6edf3",
  accentColor: "#22c55e",
};

// ---------------------------------------------------------------------------
// GitHub Stars Fetcher Hook
// ---------------------------------------------------------------------------

function useGithubStars(repo: string): {
  stars: number | null;
  loading: boolean;
} {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const parts = repo.split("/");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      setStars(null);
      return;
    }

    setLoading(true);

    // Debounce the fetch
    timerRef.current = setTimeout(() => {
      fetch(`https://api.github.com/repos/${repo}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => {
          setStars(data.stargazers_count ?? null);
          setLoading(false);
        })
        .catch(() => {
          setStars(null);
          setLoading(false);
        });
    }, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [repo]);

  return { stars, loading };
}

// ---------------------------------------------------------------------------
// Animated Counter Component
// ---------------------------------------------------------------------------

function AnimatedCounter({
  start,
  end,
  duration,
  textColor,
  accentColor,
}: {
  start: number;
  end: number;
  duration: number;
  textColor: string;
  accentColor: string;
}) {
  const [value, setValue] = useState(start);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (end - start) * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [start, end, duration]);

  return (
    <span
      style={{ color: accentColor, fontVariantNumeric: "tabular-nums" }}
      className="text-4xl font-bold"
    >
      {value.toLocaleString()}
      <span style={{ color: textColor }} className="ml-1 text-lg font-normal opacity-60">
        {end >= 1000 ? "" : ""}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Widget HTML Generators
// ---------------------------------------------------------------------------

function generateGithubBadgeHtml(config: GithubBadgeConfig, stars: number | null): string {
  const displayStars =
    stars !== null ? (stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : String(stars)) : "---";
  return `<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:8px;background:${config.bgColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid rgba(255,255,255,0.1);">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="${config.accentColor}"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>
  <span style="color:${config.textColor};font-size:14px;font-weight:600;">${config.repo}</span>
  <span style="color:${config.accentColor};font-size:14px;font-weight:700;">${displayStars}</span>
</div>`;
}

function generateProfileCardHtml(config: ProfileCardConfig): string {
  const socialLinks: string[] = [];
  if (config.github) {
    socialLinks.push(
      `<a href="https://github.com/${config.github}" style="color:${config.accentColor};text-decoration:none;font-size:13px;" target="_blank">GitHub</a>`,
    );
  }
  if (config.twitter) {
    socialLinks.push(
      `<a href="https://twitter.com/${config.twitter}" style="color:${config.accentColor};text-decoration:none;font-size:13px;" target="_blank">Twitter</a>`,
    );
  }
  if (config.website) {
    socialLinks.push(
      `<a href="https://${config.website}" style="color:${config.accentColor};text-decoration:none;font-size:13px;" target="_blank">${config.website}</a>`,
    );
  }
  return `<div style="display:inline-block;padding:24px;border-radius:12px;background:${config.bgColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid rgba(255,255,255,0.1);text-align:center;min-width:240px;">
  ${config.avatarUrl ? `<img src="${config.avatarUrl}" width="64" height="64" style="border-radius:50%;margin-bottom:12px;border:2px solid ${config.accentColor};" alt="${config.name}" />` : ""}
  <div style="color:${config.textColor};font-size:18px;font-weight:700;margin-bottom:4px;">${config.name}</div>
  <div style="color:${config.textColor};font-size:13px;opacity:0.6;margin-bottom:16px;">${config.title}</div>
  <div style="display:flex;gap:12px;justify-content:center;">${socialLinks.join("\n    ")}</div>
</div>`;
}

function generateCounterHtml(config: CounterConfig): string {
  return `<div style="display:inline-block;padding:24px 32px;border-radius:12px;background:${config.bgColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid rgba(255,255,255,0.1);text-align:center;">
  <div style="color:${config.accentColor};font-size:36px;font-weight:700;font-variant-numeric:tabular-nums;" id="counter-value">${config.endValue.toLocaleString()}</div>
  <div style="color:${config.textColor};font-size:14px;opacity:0.7;margin-top:4px;">${config.label}</div>
</div>
<script>
(function(){
  var el=document.getElementById('counter-value');
  if(!el)return;
  var start=${config.startValue},end=${config.endValue},dur=${config.duration}*1000,t0=performance.now();
  function tick(now){
    var p=Math.min((now-t0)/dur,1);
    var e=1-Math.pow(1-p,3);
    el.textContent=Math.round(start+(end-start)*e).toLocaleString();
    if(p<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
</script>`;
}

function generateIframeCode(html: string): string {
  const encoded = encodeURIComponent(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100%;background:transparent;}</style></head><body>${html}</body></html>`,
  );
  return `<iframe src="data:text/html,${encoded}" style="border:none;width:400px;height:200px;" title="Widget"></iframe>`;
}

// ---------------------------------------------------------------------------
// Input Component
// ---------------------------------------------------------------------------

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600"
    />
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-600"
    />
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
      />
      <div className="flex-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function WidgetGenerator() {
  useSEO({
    title: "Widget Generator",
    description:
      "Create embeddable HTML widgets — GitHub badges, profile cards, and custom counters with live preview.",
    path: "/apps/widget",
  });

  const [activeTab, setActiveTab] = useState<WidgetType>("github");

  // Configs
  const [githubConfig, setGithubConfig] = useState<GithubBadgeConfig>(DEFAULT_GITHUB);
  const [profileConfig, setProfileConfig] = useState<ProfileCardConfig>(DEFAULT_PROFILE);
  const [counterConfig, setCounterConfig] = useState<CounterConfig>(DEFAULT_COUNTER);

  // GitHub stars
  const { stars, loading: starsLoading } = useGithubStars(githubConfig.repo);

  // Counter reset key
  const [counterKey, setCounterKey] = useState(0);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      useToastStore.getState().addToast(`${label} copied to clipboard`);
    });
  }, []);

  // Generate widget HTML
  const widgetHtml = useMemo(() => {
    switch (activeTab) {
      case "github":
        return generateGithubBadgeHtml(githubConfig, stars);
      case "profile":
        return generateProfileCardHtml(profileConfig);
      case "counter":
        return generateCounterHtml(counterConfig);
    }
  }, [activeTab, githubConfig, profileConfig, counterConfig, stars]);

  const iframeCode = useMemo(() => generateIframeCode(widgetHtml), [widgetHtml]);

  // Trigger counter re-animate on config change
  useEffect(() => {
    if (activeTab === "counter") {
      setCounterKey((k) => k + 1);
    }
  }, [counterConfig.startValue, counterConfig.endValue, counterConfig.duration, activeTab]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <div className="flex items-center gap-3">
            <Code2 size={24} className="text-gray-700 dark:text-gray-300" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
              Widget Generator
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create embeddable HTML widgets with live preview. Copy the code and paste it anywhere.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Configuration */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {activeTab === "github" && (
                  <GithubForm
                    config={githubConfig}
                    onChange={setGithubConfig}
                    loading={starsLoading}
                    stars={stars}
                  />
                )}
                {activeTab === "profile" && (
                  <ProfileForm config={profileConfig} onChange={setProfileConfig} />
                )}
                {activeTab === "counter" && (
                  <CounterForm config={counterConfig} onChange={setCounterConfig} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Preview + Code */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Live Preview
              </label>
              <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-gray-200 bg-gray-950 p-8 dark:border-gray-800">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab + counterKey}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "github" && (
                      <GithubBadgePreview
                        config={githubConfig}
                        stars={stars}
                        loading={starsLoading}
                      />
                    )}
                    {activeTab === "profile" && <ProfileCardPreview config={profileConfig} />}
                    {activeTab === "counter" && (
                      <CounterPreview key={counterKey} config={counterConfig} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Copy Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(widgetHtml, "HTML")}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                <Copy size={14} />
                Copy HTML
              </button>
              <button
                onClick={() => copyToClipboard(iframeCode, "iframe")}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                <Code2 size={14} />
                Copy iframe
              </button>
            </div>

            {/* Code Output */}
            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                HTML Code
              </label>
              <div className="relative">
                <pre className="max-h-64 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">
                  {widgetHtml}
                </pre>
                <button
                  onClick={() => copyToClipboard(widgetHtml, "HTML")}
                  className="absolute top-2 right-2 rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form: GitHub Badge
// ---------------------------------------------------------------------------

function GithubForm({
  config,
  onChange,
  loading,
  stars,
}: {
  config: GithubBadgeConfig;
  onChange: (c: GithubBadgeConfig) => void;
  loading: boolean;
  stars: number | null;
}) {
  const update = (patch: Partial<GithubBadgeConfig>) => onChange({ ...config, ...patch });

  return (
    <>
      <Field label="Repository (owner/repo)">
        <TextInput
          value={config.repo}
          onChange={(v) => update({ repo: v })}
          placeholder="facebook/react"
        />
        {loading && <p className="mt-1 text-xs text-gray-400">Fetching stars...</p>}
        {!loading && stars !== null && (
          <p className="mt-1 text-xs text-gray-400">{stars.toLocaleString()} stars</p>
        )}
        {!loading && stars === null && config.repo.includes("/") && (
          <p className="mt-1 text-xs text-red-400">Could not fetch repository</p>
        )}
      </Field>

      <div className="space-y-3">
        <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
          Colors
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ColorInput
            label="Background"
            value={config.bgColor}
            onChange={(v) => update({ bgColor: v })}
          />
          <ColorInput
            label="Text"
            value={config.textColor}
            onChange={(v) => update({ textColor: v })}
          />
          <ColorInput
            label="Accent"
            value={config.accentColor}
            onChange={(v) => update({ accentColor: v })}
          />
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Form: Profile Card
// ---------------------------------------------------------------------------

function ProfileForm({
  config,
  onChange,
}: {
  config: ProfileCardConfig;
  onChange: (c: ProfileCardConfig) => void;
}) {
  const update = (patch: Partial<ProfileCardConfig>) => onChange({ ...config, ...patch });

  return (
    <>
      <Field label="Name">
        <TextInput
          value={config.name}
          onChange={(v) => update({ name: v })}
          placeholder="Your Name"
        />
      </Field>
      <Field label="Title">
        <TextInput
          value={config.title}
          onChange={(v) => update({ title: v })}
          placeholder="Full Stack Developer"
        />
      </Field>
      <Field label="Avatar URL">
        <TextInput
          value={config.avatarUrl}
          onChange={(v) => update({ avatarUrl: v })}
          placeholder="https://github.com/username.png"
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="GitHub">
          <TextInput
            value={config.github}
            onChange={(v) => update({ github: v })}
            placeholder="username"
          />
        </Field>
        <Field label="Twitter">
          <TextInput
            value={config.twitter}
            onChange={(v) => update({ twitter: v })}
            placeholder="username"
          />
        </Field>
        <Field label="Website">
          <TextInput
            value={config.website}
            onChange={(v) => update({ website: v })}
            placeholder="example.com"
          />
        </Field>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
          Colors
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ColorInput
            label="Background"
            value={config.bgColor}
            onChange={(v) => update({ bgColor: v })}
          />
          <ColorInput
            label="Text"
            value={config.textColor}
            onChange={(v) => update({ textColor: v })}
          />
          <ColorInput
            label="Accent"
            value={config.accentColor}
            onChange={(v) => update({ accentColor: v })}
          />
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Form: Counter
// ---------------------------------------------------------------------------

function CounterForm({
  config,
  onChange,
}: {
  config: CounterConfig;
  onChange: (c: CounterConfig) => void;
}) {
  const update = (patch: Partial<CounterConfig>) => onChange({ ...config, ...patch });

  return (
    <>
      <Field label="Label">
        <TextInput
          value={config.label}
          onChange={(v) => update({ label: v })}
          placeholder="Happy Users"
        />
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Start Value">
          <NumberInput
            value={config.startValue}
            onChange={(v) => update({ startValue: v })}
            min={0}
          />
        </Field>
        <Field label="End Value">
          <NumberInput value={config.endValue} onChange={(v) => update({ endValue: v })} min={0} />
        </Field>
        <Field label="Duration (s)">
          <NumberInput
            value={config.duration}
            onChange={(v) => update({ duration: Math.max(0.1, v) })}
            min={0.1}
            max={10}
            step={0.1}
          />
        </Field>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
          Colors
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ColorInput
            label="Background"
            value={config.bgColor}
            onChange={(v) => update({ bgColor: v })}
          />
          <ColorInput
            label="Text"
            value={config.textColor}
            onChange={(v) => update({ textColor: v })}
          />
          <ColorInput
            label="Accent"
            value={config.accentColor}
            onChange={(v) => update({ accentColor: v })}
          />
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Preview: GitHub Badge
// ---------------------------------------------------------------------------

function GithubBadgePreview({
  config,
  stars,
  loading,
}: {
  config: GithubBadgeConfig;
  stars: number | null;
  loading: boolean;
}) {
  const displayStars =
    stars !== null ? (stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : String(stars)) : "---";

  return (
    <div
      className="inline-flex items-center gap-2 rounded-lg px-4 py-2"
      style={{
        background: config.bgColor,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Star size={16} fill={config.accentColor} color={config.accentColor} />
      <span style={{ color: config.textColor }} className="text-sm font-semibold">
        {config.repo}
      </span>
      <span style={{ color: config.accentColor }} className="text-sm font-bold">
        {loading ? (
          <span className="inline-block h-4 w-8 animate-pulse rounded bg-gray-700" />
        ) : (
          displayStars
        )}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Preview: Profile Card
// ---------------------------------------------------------------------------

function ProfileCardPreview({ config }: { config: ProfileCardConfig }) {
  return (
    <div
      className="inline-block min-w-[240px] rounded-xl p-6 text-center"
      style={{
        background: config.bgColor,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {config.avatarUrl && (
        <img
          src={config.avatarUrl}
          alt={config.name}
          className="mx-auto mb-3 h-16 w-16 rounded-full object-cover"
          style={{ border: `2px solid ${config.accentColor}` }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <div style={{ color: config.textColor }} className="text-lg font-bold">
        {config.name}
      </div>
      <div style={{ color: config.textColor }} className="mb-4 text-sm opacity-60">
        {config.title}
      </div>
      <div className="flex justify-center gap-3">
        {config.github && (
          <span style={{ color: config.accentColor }} className="text-xs font-medium">
            GitHub
          </span>
        )}
        {config.twitter && (
          <span style={{ color: config.accentColor }} className="text-xs font-medium">
            Twitter
          </span>
        )}
        {config.website && (
          <span style={{ color: config.accentColor }} className="text-xs font-medium">
            {config.website}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Preview: Counter
// ---------------------------------------------------------------------------

function CounterPreview({ config }: { config: CounterConfig }) {
  return (
    <div
      className="inline-block rounded-xl p-6 text-center"
      style={{
        background: config.bgColor,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <AnimatedCounter
        start={config.startValue}
        end={config.endValue}
        duration={config.duration}
        textColor={config.textColor}
        accentColor={config.accentColor}
      />
      <div style={{ color: config.textColor }} className="mt-1 text-sm opacity-70">
        {config.label}
      </div>
    </div>
  );
}
