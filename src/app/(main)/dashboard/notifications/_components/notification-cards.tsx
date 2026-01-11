/* eslint-disable sonarjs/no-commented-code */
/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, Clock, Radio, Send, XCircle } from "lucide-react";

import type { NotificationStats } from "@/app/actions/notifications";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationCardsProps {
  stats?: NotificationStats | null;
}

// Launch date - January 12, 2026
// const LAUNCH_DATE = new Date("2026-01-12T00:00:00.000Z");

function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Animated counter that counts from 0 to target since launch (one-time for small cards)
function useLaunchCounter(targetValue: number) {
  const [currentValue, setCurrentValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (targetValue <= 0) {
      setCurrentValue(0);
      setIsComplete(true);
      return;
    }

    // Animation duration based on target (faster for smaller numbers)
    const duration = Math.min(3000, Math.max(1000, targetValue * 2));
    const steps = 60;
    const stepDuration = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      // Easing function - ease out cubic
      const progress = 1 - Math.pow(1 - step / steps, 3);
      const newValue = Math.floor(targetValue * progress);
      setCurrentValue(newValue);

      if (step >= steps) {
        setCurrentValue(targetValue);
        setIsComplete(true);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [targetValue]);

  return { value: currentValue, isComplete };
}

// Continuous looping counter that resets and counts up again
function useContinuousCounter(targetValue: number, cycleDuration: number = 4000, pauseDuration: number = 2000) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (targetValue <= 0) {
      setCurrentValue(0);
      return;
    }

    const steps = 60;
    const stepDuration = cycleDuration / steps;
    let step = 0;
    let isPaused = false;
    let pauseTimeout: NodeJS.Timeout | null = null;

    const runCycle = () => {
      const interval = setInterval(() => {
        if (isPaused) return;

        step++;
        // Easing function - ease out cubic
        const progress = 1 - Math.pow(1 - step / steps, 3);
        const newValue = Math.floor(targetValue * progress);
        setCurrentValue(newValue);

        if (step >= steps) {
          setCurrentValue(targetValue);
          clearInterval(interval);
          isPaused = true;

          // Pause at target value, then reset and start again
          pauseTimeout = setTimeout(() => {
            step = 0;
            setCurrentValue(0);
            isPaused = false;
            runCycle();
          }, pauseDuration);
        }
      }, stepDuration);

      return interval;
    };

    const interval = runCycle();

    return () => {
      clearInterval(interval);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, [targetValue, cycleDuration, pauseDuration]);

  return { value: currentValue };
}

// Live animated counter for the rate display
function useAnimatedNumber(baseValue: number, incrementRatePerSecond: number) {
  const [value, setValue] = useState(baseValue);
  const [displayRate, setDisplayRate] = useState(incrementRatePerSecond);

  useEffect(() => {
    if (baseValue <= 0) return;

    const updatesPerSecond = 20;
    const baseIncrement = incrementRatePerSecond / updatesPerSecond;

    const interval = setInterval(() => {
      const variation = 0.7 + Math.random() * 0.6;
      const increment = Math.max(1, Math.floor(baseIncrement * variation));
      setValue((v) => (v + increment > baseValue * 10 ? baseValue : v + increment));

      const rateVariation = 0.85 + Math.random() * 0.3;
      setDisplayRate(Math.floor(incrementRatePerSecond * rateVariation));
    }, 1000 / updatesPerSecond);

    return () => clearInterval(interval);
  }, [baseValue, incrementRatePerSecond]);

  return { value, rate: displayRate };
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function PixelGridTransition({
  firstContent, secondContent, isActive, gridSize = 16, animationStepDuration = 0.15, className,
}: {
  firstContent: React.ReactNode; secondContent: React.ReactNode; isActive: boolean;
  gridSize?: number; animationStepDuration?: number; className?: string;
}) {
  const [showPixels, setShowPixels] = useState(false);
  const [animState, setAnimState] = useState<"idle" | "growing" | "shrinking">("idle");
  const hasActivatedRef = useRef(false);

  const pixels = useMemo(() => {
    const total = gridSize * gridSize;
    const result = [];
    for (let n = 0; n < total; n++) {
      const row = Math.floor(n / gridSize);
      const col = n % gridSize;
      const color = seededRandom(n + 42) > 0.85 ? "#FD6F01" : "hsl(var(--muted))";
      result.push({ id: n, row, col, color });
    }
    return result;
  }, [gridSize]);

  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);

  useEffect(() => {
    if (!hasActivatedRef.current && !isActive) return;
    if (isActive) hasActivatedRef.current = true;

    const shuffled = pixels.map((_, i) => i).sort(() => Math.random() - 0.5);

    requestAnimationFrame(() => {
      setShuffledOrder(shuffled);
      setShowPixels(true);
      setAnimState("growing");
    });

    const shrinkTimer = setTimeout(() => setAnimState("shrinking"), animationStepDuration * 1000);
    const hideTimer = setTimeout(() => {
      setShowPixels(false);
      setAnimState("idle");
    }, animationStepDuration * 2000);

    return () => {
      clearTimeout(shrinkTimer);
      clearTimeout(hideTimer);
    };
  }, [isActive, animationStepDuration, pixels]);

  const delayPerPixel = useMemo(() => animationStepDuration / pixels.length, [animationStepDuration, pixels.length]);
  const orderMap = useMemo(() => {
    const map = new Map<number, number>();
    shuffledOrder.forEach((idx, order) => map.set(idx, order));
    return map;
  }, [shuffledOrder]);

  return (
    <div className={`w-full overflow-hidden max-w-full relative ${className ?? ""}`}>
      <motion.div
        className="h-full"
        aria-hidden={isActive}
        initial={{ opacity: 1 }}
        animate={{ opacity: isActive ? 0 : 1 }}
        transition={{ duration: 0.1, delay: animationStepDuration * 0.5 }}
      >
        {firstContent}
      </motion.div>
      <motion.div
        className="absolute inset-0 w-full h-full z-2 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.1, delay: animationStepDuration * 0.5 }}
        style={{ pointerEvents: isActive ? "auto" : "none" }}
        aria-hidden={!isActive}
      >
        {secondContent}
      </motion.div>
      <div className="absolute inset-0 w-full h-full pointer-events-none z-3" style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        <AnimatePresence>
          {showPixels && pixels.map((pixel) => {
            const order = orderMap.get(pixel.id) ?? 0;
            return (
              <motion.div
                key={pixel.id}
                style={{ backgroundColor: pixel.color, aspectRatio: "1 / 1", gridArea: `${pixel.row + 1} / ${pixel.col + 1}` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: animState === "growing" ? 1 : 0, scale: animState === "growing" ? 1 : 0 }}
                transition={{ duration: 0.02, ease: "easeOut", delay: order * delayPerPixel }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MetricRow({ label, value, rate, showRate = false }: { label: string; value: number; rate?: number; showRate?: boolean }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-3">
      <h3 className="m-0 font-mono font-normal text-sm text-muted-foreground uppercase">{label}</h3>
      <div className="flex items-center gap-3 md:gap-4 text-right">
        <div className="text-foreground text-sm font-mono tabular-nums">{formatNumber(value)}</div>
        {showRate && rate !== undefined && (
          <div className="w-16 text-muted-foreground text-right text-sm font-mono tabular-nums">
            <span>{formatNumber(rate)}</span><span aria-label="per second">/s</span>
          </div>
        )}
      </div>
    </li>
  );
}

function NotificationStatsCard({ stats }: { stats?: NotificationStats | null }) {
  const [showInfo, setShowInfo] = useState(false);

  // Use real stats or fallback to 0
  const total = stats?.total ?? 0;
  const unique = stats?.unique ?? 0;
  const general = stats?.general ?? 0;
  const read = stats?.read ?? 0;

  // Use continuous looping counter for the main total (counts up, pauses, resets, repeat)
  const { value: animatedTotal } = useContinuousCounter(total, 3500, 2500);
  const { value: uniqueAnimated, rate: uniqueRate } = useAnimatedNumber(unique, Math.max(1, Math.floor(unique / 50)));
  const { value: generalAnimated, rate: generalRate } = useAnimatedNumber(general, Math.max(1, Math.floor(general / 30)));
  const { value: readAnimated, rate: readRate } = useAnimatedNumber(read, Math.max(1, Math.floor(read / 80)));

  const statsContent = (
    <div className="bg-card p-4 md:p-6 w-full min-h-[120px] h-full rounded-lg">
      <div className="space-y-2">
        <h2 className="my-0 font-mono font-medium text-sm tracking-tight uppercase text-muted-foreground pr-6">Total Notifications</h2>
        <div className="text-3xl md:text-4xl tracking-normal font-mono tabular-nums text-foreground">{formatNumber(animatedTotal)}</div>
        <p className="text-xs text-muted-foreground">Since launch (Jan 12, 2026)</p>
        <ul className="space-y-1 list-none pl-0 mt-4">
          <MetricRow label="Unique notifications" value={uniqueAnimated} rate={uniqueRate} showRate />
          <MetricRow label="General notifications" value={generalAnimated} rate={generalRate} showRate />
          <MetricRow label="Read/Opened" value={readAnimated} rate={readRate} showRate />
        </ul>
      </div>
    </div>
  );

  const infoContentView = (
    <div className="bg-card p-4 md:p-6 w-full h-full overflow-y-auto flex flex-col gap-y-2 rounded-lg">
      <span className="my-0 font-mono font-medium text-sm tracking-tight uppercase text-foreground inline-flex gap-x-0.5 items-center w-fit shrink-0">
        Total Notifications
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M6.75011 4H6.00011V5.5H6.75011H9.43945L5.46978 9.46967L4.93945 10L6.00011 11.0607L6.53044 10.5303L10.499 6.56182V9.25V10H11.999V9.25V5C11.999 4.44772 11.5512 4 10.999 4H6.75011Z" /></svg>
      </span>
      <span className="tracking-tight text-sm text-muted-foreground leading-relaxed line-clamp-6">
        Track all notifications sent since launch day. Unique notifications are triggered by user transactions,
        while general notifications are broadcast messages sent to all users by administrators.
      </span>
    </div>
  );

  return (
    <Card className="@container/card relative group overflow-hidden">
      <PixelGridTransition firstContent={statsContent} secondContent={infoContentView} isActive={showInfo} gridSize={16} animationStepDuration={0.15} className="h-full" />
      <div className={`absolute top-4 right-4 transition-opacity duration-150 z-20 isolate ${showInfo ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"}`}>
        <button aria-label="Learn more about Notification Rate" type="button" onClick={() => setShowInfo(!showInfo)} className="p-1 m-0 bg-transparent text-muted-foreground md:text-foreground border border-solid border-border hover:text-foreground hover:bg-muted transition-colors duration-150 flex items-center justify-center outline-none focus-visible:ring cursor-pointer rounded">
          <InfoIcon />
        </button>
      </div>
    </Card>
  );
}

// Tech Stack style notification type row
function NotificationTypeRow({ icon: Icon, name, percentage, color, colorClass }: {
  icon: React.ElementType;
  name: string;
  percentage: number;
  color: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-4">
      {/* Circular icon container */}
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2`} style={{ borderColor: color, backgroundColor: `${color}15` }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>

      {/* Name and progress bar */}
      <div className="flex-1 min-w-0 space-y-2">
        <span className="text-base font-medium text-foreground">{name}</span>
        {/* Progress bar container */}
        <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      {/* Percentage */}
      <span className={`text-lg font-semibold tabular-nums ${colorClass}`}>{percentage.toFixed(1)}%</span>
    </div>
  );
}

// Small stat card component
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-muted-foreground"
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  iconColor?: string;
}) {
  const { value: animatedValue } = useLaunchCounter(value);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatNumber(animatedValue)}
        </CardTitle>
        <CardAction>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">{subtitle}</div>
      </CardFooter>
    </Card>
  );
}

export default function NotificationCards({ stats }: NotificationCardsProps) {
  // Calculate percentages from stats
  const total = stats?.total ?? 0;
  const unique = stats?.unique ?? 0;
  const general = stats?.general ?? 0;

  // Show 0% when there's no data instead of misleading 50/50
  const uniquePercentage = total > 0 ? (unique / total) * 100 : 0;
  const generalPercentage = total > 0 ? (general / total) * 100 : 0;

  // Calculate delivery stats
  const sent = stats?.sent ?? 0;
  const read = stats?.read ?? 0;
  // const pending = stats?.pending ?? 0;

  // Calculate approval stats
  const pendingApproval = stats?.pending_approval ?? 0;
  const approved = stats?.approved ?? 0;
  const rejected = stats?.rejected ?? 0;

  // Delivery rate (read/sent percentage)
  const deliveryRate = sent > 0 ? ((read / sent) * 100).toFixed(1) : "0.0";

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2">
        {/* Notification Types Card */}
        <Card className="@container/card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Notification Types</CardTitle>
              <span className="text-sm text-muted-foreground">By category</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <NotificationTypeRow
              icon={Bell}
              name="Unique (Transaction-based)"
              percentage={uniquePercentage}
              color="#BB1920"
              colorClass="text-spendeasebeta"
            />
            <NotificationTypeRow
              icon={Radio}
              name="General (Broadcast)"
              percentage={generalPercentage}
              color="#FFB000"
              colorClass="text-spendeasecharlie"
            />
          </CardContent>
        </Card>

        {/* Animated Total Stats Card */}
        <NotificationStatsCard stats={stats} />
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <StatCard
          title="Total Delivered"
          value={sent + read}
          subtitle={`${deliveryRate}% read rate`}
          icon={Send}
          iconColor="text-green-500"
        />
        <StatCard
          title="Pending Approval"
          value={pendingApproval}
          subtitle="Awaiting admin review"
          icon={Clock}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Approved"
          value={approved}
          subtitle="Broadcasts approved"
          icon={CheckCircle}
          iconColor="text-green-500"
        />
        <StatCard
          title="Rejected"
          value={rejected}
          subtitle="Broadcasts declined"
          icon={XCircle}
          iconColor="text-red-500"
        />
      </div>
    </>
  );
}
