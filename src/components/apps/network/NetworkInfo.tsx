import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Globe,
  MapPin,
  Building2,
  Clock,
  Monitor,
  Wifi,
  Copy,
  Check,
  AlertCircle,
  Calculator,
  BookOpen,
  Network,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

// ─── Types ───────────────────────────────────────────────────────────

interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  org: string;
  timezone: string;
}

interface CidrResult {
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  subnetMask: string;
  wildcardMask: string;
  prefix: number;
}

// ─── CIDR Helpers ────────────────────────────────────────────────────

function ipToUint32(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function uint32ToIp(n: number): string {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join(".");
}

function parseCidr(input: string): CidrResult | string {
  const match = input.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
  if (!match) return "Invalid format. Use CIDR notation like 192.168.1.0/24";

  const ip = match[1];
  const prefix = parseInt(match[2], 10);

  if (prefix < 0 || prefix > 32) return "Prefix must be between 0 and 32";

  const parts = ip.split(".").map(Number);
  if (parts.some((p) => p < 0 || p > 255)) return "Each octet must be 0–255";

  const ipNum = ipToUint32(ip);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const wildcard = ~mask >>> 0;
  const networkNum = (ipNum & mask) >>> 0;
  const broadcastNum = (networkNum | wildcard) >>> 0;

  const totalHosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : Math.pow(2, 32 - prefix) - 2;
  const firstHost = prefix >= 31 ? networkNum : (networkNum + 1) >>> 0;
  const lastHost = prefix >= 31 ? broadcastNum : (broadcastNum - 1) >>> 0;

  return {
    network: uint32ToIp(networkNum),
    broadcast: uint32ToIp(broadcastNum),
    firstHost: uint32ToIp(firstHost),
    lastHost: uint32ToIp(lastHost),
    totalHosts,
    subnetMask: uint32ToIp(mask),
    wildcardMask: uint32ToIp(wildcard),
    prefix,
  };
}

// ─── Reference Data ──────────────────────────────────────────────────

const COMMON_PORTS = [
  { port: 20, protocol: "FTP Data", desc: "File transfer data" },
  { port: 21, protocol: "FTP", desc: "File transfer control" },
  { port: 22, protocol: "SSH", desc: "Secure shell" },
  { port: 23, protocol: "Telnet", desc: "Unencrypted text" },
  { port: 25, protocol: "SMTP", desc: "Email sending" },
  { port: 53, protocol: "DNS", desc: "Domain name resolution" },
  { port: 67, protocol: "DHCP", desc: "Dynamic IP assignment" },
  { port: 80, protocol: "HTTP", desc: "Web traffic" },
  { port: 110, protocol: "POP3", desc: "Email retrieval" },
  { port: 143, protocol: "IMAP", desc: "Email access" },
  { port: 443, protocol: "HTTPS", desc: "Secure web traffic" },
  { port: 465, protocol: "SMTPS", desc: "Secure email sending" },
  { port: 993, protocol: "IMAPS", desc: "Secure email access" },
  { port: 3306, protocol: "MySQL", desc: "MySQL database" },
  { port: 3389, protocol: "RDP", desc: "Remote desktop" },
  { port: 5432, protocol: "PostgreSQL", desc: "PostgreSQL database" },
  { port: 6379, protocol: "Redis", desc: "In-memory data store" },
  { port: 8080, protocol: "HTTP Alt", desc: "Alternative web" },
  { port: 8443, protocol: "HTTPS Alt", desc: "Alternative secure web" },
  { port: 27017, protocol: "MongoDB", desc: "MongoDB database" },
];

const PRIVATE_RANGES = [
  { range: "10.0.0.0/8", from: "10.0.0.0", to: "10.255.255.255", hosts: "16,777,214", class: "A" },
  {
    range: "172.16.0.0/12",
    from: "172.16.0.0",
    to: "172.31.255.255",
    hosts: "1,048,574",
    class: "B",
  },
  {
    range: "192.168.0.0/16",
    from: "192.168.0.0",
    to: "192.168.255.255",
    hosts: "65,534",
    class: "C",
  },
  {
    range: "127.0.0.0/8",
    from: "127.0.0.0",
    to: "127.255.255.255",
    hosts: "16,777,214",
    class: "Loopback",
  },
  {
    range: "169.254.0.0/16",
    from: "169.254.0.0",
    to: "169.254.255.255",
    hosts: "65,534",
    class: "Link-local",
  },
];

const SUBNET_CHEATSHEET = [
  { prefix: "/32", mask: "255.255.255.255", hosts: 1 },
  { prefix: "/31", mask: "255.255.255.254", hosts: 2 },
  { prefix: "/30", mask: "255.255.255.252", hosts: 2 },
  { prefix: "/29", mask: "255.255.255.248", hosts: 6 },
  { prefix: "/28", mask: "255.255.255.240", hosts: 14 },
  { prefix: "/27", mask: "255.255.255.224", hosts: 30 },
  { prefix: "/26", mask: "255.255.255.192", hosts: 62 },
  { prefix: "/25", mask: "255.255.255.128", hosts: 126 },
  { prefix: "/24", mask: "255.255.255.0", hosts: 254 },
  { prefix: "/23", mask: "255.255.254.0", hosts: 510 },
  { prefix: "/22", mask: "255.255.252.0", hosts: "1,022" },
  { prefix: "/21", mask: "255.255.248.0", hosts: "2,046" },
  { prefix: "/20", mask: "255.255.240.0", hosts: "4,094" },
  { prefix: "/19", mask: "255.255.224.0", hosts: "8,190" },
  { prefix: "/18", mask: "255.255.192.0", hosts: "16,382" },
  { prefix: "/17", mask: "255.255.128.0", hosts: "32,766" },
  { prefix: "/16", mask: "255.255.0.0", hosts: "65,534" },
  { prefix: "/12", mask: "255.240.0.0", hosts: "1,048,574" },
  { prefix: "/8", mask: "255.0.0.0", hosts: "16,777,214" },
];

// ─── Copy Button Component ──────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      title="Copy"
    >
      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
    </button>
  );
}

// ─── Collapsible Section ─────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <h2 className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
          {icon}
          {title}
        </h2>
        {open ? (
          <ChevronUp size={14} className="text-gray-400" />
        ) : (
          <ChevronDown size={14} className="text-gray-400" />
        )}
      </button>
      {open && children}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────

export default function NetworkInfo() {
  useSEO({
    title: "IP & Network Info",
    description:
      "View your public IP, location, and browser info. Calculate CIDR subnets and reference common ports, private ranges, and subnet masks.",
    path: "/apps/network",
  });

  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [ipLoading, setIpLoading] = useState(true);
  const [ipError, setIpError] = useState("");
  const [cidrInput, setCidrInput] = useState("192.168.1.0/24");

  // Fetch IP info on mount
  useEffect(() => {
    const controller = new AbortController();
    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch IP info");
        return res.json();
      })
      .then((data: IpInfo) => {
        setIpInfo(data);
        setIpLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setIpError("Could not fetch IP info. Try refreshing.");
          setIpLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  // Browser info
  const browserInfo = useMemo(() => {
    const nav = typeof navigator !== "undefined" ? navigator : null;
    const conn =
      nav && "connection" in nav
        ? (nav as unknown as Record<string, Record<string, unknown>>).connection
        : null;
    return {
      userAgent: nav?.userAgent ?? "Unknown",
      platform: nav?.platform ?? "Unknown",
      language: nav?.language ?? "Unknown",
      screenRes: typeof screen !== "undefined" ? `${screen.width} × ${screen.height}` : "Unknown",
      connectionType: (conn?.effectiveType as string) ?? "Unknown",
      downlink: conn?.downlink ? `${conn.downlink} Mbps` : null,
    };
  }, []);

  // CIDR calculation
  const cidrResult = useMemo(() => {
    const trimmed = cidrInput.trim();
    if (!trimmed) return null;
    return parseCidr(trimmed);
  }, [cidrInput]);

  const handleExampleCidr = useCallback((cidr: string) => {
    setCidrInput(cidr);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-2xl px-6 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Globe size={28} className="text-cyan-500" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                IP & Network Info
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your network details, subnet calculator, and quick reference
              </p>
            </div>
          </div>

          {/* ── Section 1: Your Network Info ── */}
          <Section title="Your Network Info" icon={<Wifi size={12} />} defaultOpen={true}>
            {ipLoading ? (
              <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                  Detecting your network...
                </div>
              </div>
            ) : ipError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-400">{ipError}</p>
                </div>
              </div>
            ) : ipInfo ? (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800">
                {[
                  {
                    icon: <Globe size={13} className="text-cyan-500" />,
                    label: "Public IP",
                    value: ipInfo.ip,
                  },
                  {
                    icon: <MapPin size={13} className="text-cyan-500" />,
                    label: "Location",
                    value: [ipInfo.city, ipInfo.region, ipInfo.country_name]
                      .filter(Boolean)
                      .join(", "),
                  },
                  {
                    icon: <Building2 size={13} className="text-cyan-500" />,
                    label: "ISP / Org",
                    value: ipInfo.org,
                  },
                  {
                    icon: <Clock size={13} className="text-cyan-500" />,
                    label: "Timezone",
                    value: ipInfo.timezone,
                  },
                  {
                    icon: <Monitor size={13} className="text-cyan-500" />,
                    label: "Platform",
                    value: browserInfo.platform,
                  },
                  {
                    icon: <Monitor size={13} className="text-cyan-500" />,
                    label: "Screen",
                    value: browserInfo.screenRes,
                  },
                  {
                    icon: <Wifi size={13} className="text-cyan-500" />,
                    label: "Connection",
                    value: browserInfo.downlink
                      ? `${browserInfo.connectionType} (${browserInfo.downlink})`
                      : browserInfo.connectionType,
                  },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-4 py-2.5 ${
                      i !== 0 ? "border-t border-gray-100 dark:border-gray-800/50" : ""
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      {row.icon}
                      <span className="mr-3 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                        {row.label}
                      </span>
                      <span className="truncate font-mono text-sm text-gray-900 dark:text-gray-100">
                        {row.value}
                      </span>
                    </div>
                    <CopyButton text={row.value} />
                  </div>
                ))}
                {/* User Agent — full row */}
                <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Monitor size={13} className="shrink-0 text-cyan-500" />
                    <span className="mr-3 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                      User Agent
                    </span>
                    <CopyButton text={browserInfo.userAgent} />
                  </div>
                  <p className="mt-1 pl-5 font-mono text-xs break-all text-gray-600 dark:text-gray-400">
                    {browserInfo.userAgent}
                  </p>
                </div>
              </div>
            ) : null}
          </Section>

          {/* ── Section 2: CIDR/Subnet Calculator ── */}
          <Section
            title="CIDR / Subnet Calculator"
            icon={<Calculator size={12} />}
            defaultOpen={true}
          >
            <div className="mb-3">
              <input
                type="text"
                value={cidrInput}
                onChange={(e) => setCidrInput(e.target.value)}
                placeholder="e.g. 192.168.1.0/24"
                spellCheck={false}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-mono text-lg text-gray-900 placeholder-gray-300 transition-colors outline-none focus:border-cyan-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-600 dark:focus:border-cyan-600"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "10.0.0.0/8",
                  "172.16.0.0/12",
                  "192.168.1.0/24",
                  "192.168.0.0/16",
                  "10.0.0.0/24",
                ].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleExampleCidr(ex)}
                    className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {typeof cidrResult === "string" && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-400">{cidrResult}</p>
                </div>
              </div>
            )}

            {cidrResult && typeof cidrResult !== "string" && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800">
                {[
                  { label: "Network", value: `${cidrResult.network}/${cidrResult.prefix}` },
                  { label: "Subnet Mask", value: cidrResult.subnetMask },
                  { label: "Wildcard Mask", value: cidrResult.wildcardMask },
                  { label: "Broadcast", value: cidrResult.broadcast },
                  { label: "First Host", value: cidrResult.firstHost },
                  { label: "Last Host", value: cidrResult.lastHost },
                  { label: "Usable Hosts", value: cidrResult.totalHosts.toLocaleString() },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-4 py-2.5 ${
                      i !== 0 ? "border-t border-gray-100 dark:border-gray-800/50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="mr-3 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                        {row.label}
                      </span>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        {row.value}
                      </span>
                    </div>
                    <CopyButton text={row.value} />
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* ── Section 3: Networking Reference ── */}
          <Section title="Networking Reference" icon={<BookOpen size={12} />} defaultOpen={false}>
            {/* Common Ports */}
            <div className="mb-5">
              <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                <Network size={11} />
                Common Ports
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                      <th className="px-4 py-2 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                        Port
                      </th>
                      <th className="px-4 py-2 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                        Protocol
                      </th>
                      <th className="hidden px-4 py-2 text-xs font-medium tracking-wider text-gray-400 uppercase sm:table-cell dark:text-gray-500">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMMON_PORTS.map((row, i) => (
                      <tr
                        key={row.port}
                        className={i !== 0 ? "border-t border-gray-50 dark:border-gray-800/50" : ""}
                      >
                        <td className="px-4 py-1.5 font-mono text-cyan-600 dark:text-cyan-400">
                          {row.port}
                        </td>
                        <td className="px-4 py-1.5 font-medium text-gray-900 dark:text-gray-100">
                          {row.protocol}
                        </td>
                        <td className="hidden px-4 py-1.5 text-gray-500 sm:table-cell dark:text-gray-400">
                          {row.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Private IP Ranges */}
            <div className="mb-5">
              <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                <Network size={11} />
                Private IP Ranges
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                      <th className="px-4 py-2 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                        Range
                      </th>
                      <th className="hidden px-4 py-2 text-xs font-medium tracking-wider text-gray-400 uppercase sm:table-cell dark:text-gray-500">
                        From
                      </th>
                      <th className="hidden px-4 py-2 text-xs font-medium tracking-wider text-gray-400 uppercase sm:table-cell dark:text-gray-500">
                        To
                      </th>
                      <th className="px-4 py-2 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                        Hosts
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIVATE_RANGES.map((row, i) => (
                      <tr
                        key={row.range}
                        className={i !== 0 ? "border-t border-gray-50 dark:border-gray-800/50" : ""}
                      >
                        <td className="px-4 py-1.5">
                          <button
                            onClick={() => handleExampleCidr(row.range)}
                            className="font-mono text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400"
                          >
                            {row.range}
                          </button>
                        </td>
                        <td className="hidden px-4 py-1.5 font-mono text-gray-600 sm:table-cell dark:text-gray-400">
                          {row.from}
                        </td>
                        <td className="hidden px-4 py-1.5 font-mono text-gray-600 sm:table-cell dark:text-gray-400">
                          {row.to}
                        </td>
                        <td className="px-4 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                          {row.hosts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subnet Cheat Sheet */}
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                <Calculator size={11} />
                Subnet Cheat Sheet
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                      <th className="px-4 py-2 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                        Prefix
                      </th>
                      <th className="px-4 py-2 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                        Subnet Mask
                      </th>
                      <th className="px-4 py-2 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                        Usable Hosts
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SUBNET_CHEATSHEET.map((row, i) => (
                      <tr
                        key={row.prefix}
                        className={i !== 0 ? "border-t border-gray-50 dark:border-gray-800/50" : ""}
                      >
                        <td className="px-4 py-1.5 font-mono font-medium text-cyan-600 dark:text-cyan-400">
                          {row.prefix}
                        </td>
                        <td className="px-4 py-1.5 font-mono text-gray-600 dark:text-gray-400">
                          {row.mask}
                        </td>
                        <td className="px-4 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                          {typeof row.hosts === "number" ? row.hosts.toLocaleString() : row.hosts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        </motion.div>
      </div>
    </div>
  );
}
