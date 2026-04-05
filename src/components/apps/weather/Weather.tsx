import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  MapPin,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Loader2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

// WMO Weather code mapping
interface WeatherInfo {
  label: string;
  icon: React.ReactNode;
}

function getWeatherInfo(code: number, size = 24): WeatherInfo {
  if (code === 0) return { label: "Clear Sky", icon: <Sun size={size} className="text-yellow-400" /> };
  if (code <= 3) return { label: "Partly Cloudy", icon: <Cloud size={size} className="text-gray-300" /> };
  if (code <= 48) return { label: "Fog", icon: <CloudFog size={size} className="text-gray-400" /> };
  if (code <= 55) return { label: "Drizzle", icon: <CloudDrizzle size={size} className="text-blue-300" /> };
  if (code <= 65) return { label: "Rain", icon: <CloudRain size={size} className="text-blue-400" /> };
  if (code <= 75) return { label: "Snow", icon: <CloudSnow size={size} className="text-white" /> };
  if (code <= 82) return { label: "Showers", icon: <CloudRain size={size} className="text-blue-500" /> };
  if (code <= 99) return { label: "Thunderstorm", icon: <CloudLightning size={size} className="text-yellow-300" /> };
  return { label: "Unknown", icon: <Cloud size={size} className="text-gray-400" /> };
}

interface GeoResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weather_code: number;
}

interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

interface WeatherData {
  current: CurrentWeather;
  daily: DailyWeather;
}

type Unit = "celsius" | "fahrenheit";

const DEFAULT_CITY: GeoResult = {
  id: 0,
  name: "San Francisco",
  country: "United States",
  latitude: 37.7749,
  longitude: -122.4194,
};

function formatDay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function Weather() {
  useSEO({
    title: "Weather",
    description: "Check current weather conditions and 5-day forecast for any city.",
    path: "/apps/weather",
  });

  const [unit, setUnit] = useState<Unit>("fahrenheit");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState<GeoResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Geocoding search with debounce
  const searchCities = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5`,
        );
        const data = await res.json();
        setSuggestions(data.results || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  // Fetch weather for a location
  const fetchWeather = useCallback(async (lat: number, lon: number, u: Unit) => {
    setLoading(true);
    setError(null);
    try {
      const unitParams =
        u === "fahrenheit" ? "&temperature_unit=fahrenheit&wind_speed_unit=mph" : "";
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5${unitParams}`,
      );
      if (!res.ok) throw new Error("Failed to fetch weather");
      const data: WeatherData = await res.json();
      setWeather(data);
    } catch {
      setError("Could not load weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-detect geolocation on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if ("geolocation" in navigator) {
        setGeoLoading(true);
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 }),
          );
          if (cancelled) return;
          // Reverse geocode to get city name
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          try {
            const res = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=&count=1&latitude=${lat}&longitude=${lon}`,
            );
            const data = await res.json();
            if (!cancelled && data.results?.length) {
              const city = data.results[0];
              setSelectedCity({
                id: city.id,
                name: city.name,
                country: city.country,
                admin1: city.admin1,
                latitude: city.latitude,
                longitude: city.longitude,
              });
              setGeoLoading(false);
              return;
            }
          } catch {
            // reverse geocode failed, use coords directly
          }
          if (!cancelled) {
            setSelectedCity({
              id: 0,
              name: "Your Location",
              country: "",
              latitude: lat,
              longitude: lon,
            });
          }
          setGeoLoading(false);
          return;
        } catch {
          // geolocation denied or failed
        }
      }
      if (!cancelled) {
        setSelectedCity(DEFAULT_CITY);
        setGeoLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch weather when city or unit changes
  useEffect(() => {
    if (selectedCity) {
      fetchWeather(selectedCity.latitude, selectedCity.longitude, unit);
    }
  }, [selectedCity, unit, fetchWeather]);

  function selectCity(city: GeoResult) {
    setSelectedCity(city);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  }

  const windUnit = unit === "fahrenheit" ? "mph" : "km/h";
  const tempSymbol = unit === "fahrenheit" ? "°F" : "°C";

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-2xl px-6 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs />
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Weather
          </h1>
          {/* Unit toggle */}
          <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setUnit("celsius")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                unit === "celsius"
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit("fahrenheit")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                unit === "fahrenheit"
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              °F
            </button>
          </div>
        </div>

        {/* Search */}
        <div ref={searchRef} className="relative mb-8">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              searchCities(e.target.value);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600"
          />
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950"
              >
                {suggestions.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => selectCity(city)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900"
                  >
                    <MapPin size={14} className="shrink-0 text-gray-400" />
                    <span>
                      {city.name}
                      {city.admin1 ? `, ${city.admin1}` : ""}, {city.country}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Location label */}
        {selectedCity && (
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin size={14} />
            <span>
              {selectedCity.name}
              {selectedCity.admin1 ? `, ${selectedCity.admin1}` : ""}
              {selectedCity.country ? `, ${selectedCity.country}` : ""}
            </span>
          </div>
        )}

        {/* Loading / Error */}
        {(loading || geoLoading) && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gray-400" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Weather content */}
        {weather && !loading && !geoLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Current weather card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Current Weather
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  {getWeatherInfo(weather.current.weather_code, 40).icon}
                  <div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {Math.round(weather.current.temperature_2m)}
                      {tempSymbol}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getWeatherInfo(weather.current.weather_code).label}
                    </div>
                  </div>
                </div>
                <div className="ml-auto grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Droplets size={16} className="text-blue-400" />
                    <span>{weather.current.relative_humidity_2m}% humidity</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Wind size={16} className="text-gray-400" />
                    <span>
                      {Math.round(weather.current.wind_speed_10m)} {windUnit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-day forecast */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
              <div className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                5-Day Forecast
              </div>
              <div className="space-y-3">
                {weather.daily.time.map((day, i) => {
                  const info = getWeatherInfo(weather.daily.weather_code[i], 20);
                  const high = Math.round(weather.daily.temperature_2m_max[i]);
                  const low = Math.round(weather.daily.temperature_2m_min[i]);
                  return (
                    <div
                      key={day}
                      className="flex items-center gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <span className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formatDay(day)}
                      </span>
                      <span className="shrink-0">{info.icon}</span>
                      <span className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block sm:w-24">
                        {info.label}
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        <Thermometer size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {high}{tempSymbol}
                        </span>
                        <span className="text-sm text-gray-400">/</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {low}{tempSymbol}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attribution */}
            <p className="text-center text-xs text-gray-400 dark:text-gray-600">
              Weather data by{" "}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600 dark:hover:text-gray-400"
              >
                Open-Meteo
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
