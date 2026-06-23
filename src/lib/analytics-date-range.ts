export type MetricsDateRange = "1w" | "2w" | "1m" | "3m" | "6m" | "12m" | "all";

export const DEFAULT_METRICS_DATE_RANGE: MetricsDateRange = "1m";
export const ALL_TIME_DATE_SENTINEL = "all_time";

export const METRICS_DATE_RANGE_OPTIONS: Array<{ value: MetricsDateRange; label: string }> = [
  { value: "1w", label: "1 Week" },
  { value: "2w", label: "2 Weeks" },
  { value: "1m", label: "1 Month" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "12m", label: "12 Months" },
  { value: "all", label: "All Time" },
];

const METRICS_DATE_RANGE_OFFSETS: Record<
  Exclude<MetricsDateRange, "all">,
  { amount: number; unit: "days" | "months" }
> = {
  "1w": { amount: 7, unit: "days" },
  "2w": { amount: 14, unit: "days" },
  "1m": { amount: 1, unit: "months" },
  "3m": { amount: 3, unit: "months" },
  "6m": { amount: 6, unit: "months" },
  "12m": { amount: 12, unit: "months" },
};

export interface MetricsDateRangeParams {
  dateFrom?: string;
  dateTo: string;
  label: string;
  range: MetricsDateRange;
}

function formatDateParam(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeMetricsDateRange(value: unknown): MetricsDateRange {
  const range = Array.isArray(value) ? value[0] : value;

  if (typeof range !== "string") {
    return DEFAULT_METRICS_DATE_RANGE;
  }

  return METRICS_DATE_RANGE_OPTIONS.some((option) => option.value === range)
    ? (range as MetricsDateRange)
    : DEFAULT_METRICS_DATE_RANGE;
}

export function getMetricsDateRangeParams(range: MetricsDateRange, now = new Date()): MetricsDateRangeParams {
  const option = METRICS_DATE_RANGE_OPTIONS.find((item) => item.value === range);
  const dateTo = formatDateParam(now);

  if (range === "all") {
    return {
      dateFrom: ALL_TIME_DATE_SENTINEL,
      dateTo,
      label: option?.label ?? "All Time",
      range,
    };
  }

  const dateFrom = new Date(now);
  const offset = METRICS_DATE_RANGE_OFFSETS[range];

  if (offset.unit === "days") {
    dateFrom.setDate(dateFrom.getDate() - offset.amount);
  } else {
    dateFrom.setMonth(dateFrom.getMonth() - offset.amount);
  }

  return {
    dateFrom: formatDateParam(dateFrom),
    dateTo,
    label: option?.label ?? "1 Month",
    range,
  };
}
