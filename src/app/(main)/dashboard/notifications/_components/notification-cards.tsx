/* eslint-disable max-lines */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Bell, Radio } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationData {
    unique: { count: number; percentage: number };
    broadcast: { count: number; percentage: number };
}

interface NotificationsOverviewProps {
    data?: NotificationData;
}

function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function useAnimatedNumber(baseValue: number, incrementRatePerSecond: number) {
  const [value, setValue] = useState(baseValue);
  const [displayRate, setDisplayRate] = useState(incrementRatePerSecond);

  useEffect(() => {
    const updatesPerSecond = 20;
    const baseIncrement = incrementRatePerSecond / updatesPerSecond;

    const interval = setInterval(() => {
      const variation = 0.7 + Math.random() * 0.6;
      const increment = Math.max(1, Math.floor(baseIncrement * variation));
      setValue((v) => (v + increment > 900000 ? 1 : v + increment));

      const rateVariation = 0.85 + Math.random() * 0.3;
      setDisplayRate(Math.floor(incrementRatePerSecond * rateVariation));
    }, 1000 / updatesPerSecond);

    return () => clearInterval(interval);
  }, [incrementRatePerSecond]);

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

function MetricRow({ label, baseValue, incrementRate, showRate = false }: { label: string; baseValue: number; incrementRate: number; showRate?: boolean }) {
  const { value, rate } = useAnimatedNumber(baseValue, incrementRate);
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-3">
      <h3 className="m-0 font-mono font-normal text-sm text-muted-foreground uppercase">{label}</h3>
      <div className="flex items-center gap-3 md:gap-4 text-right">
        <div className="text-foreground text-sm font-mono tabular-nums">{formatNumber(value)}</div>
        {showRate && (
          <div className="w-16 text-muted-foreground text-right text-sm font-mono tabular-nums">
            <span>{formatNumber(rate)}</span><span aria-label="per second">/s</span>
          </div>
        )}
      </div>
    </li>
  );
}

function NotificationStatsCard() {
  const [showInfo, setShowInfo] = useState(false);
  const { value } = useAnimatedNumber(450000, 29000);

  const statsContent = (
    <div className="bg-card p-4 md:p-6 w-full min-h-[120px] h-full rounded-lg">
      <div className="space-y-2">
        <h2 className="my-0 font-mono font-medium text-sm tracking-tight uppercase text-muted-foreground pr-6">Notification Rate</h2>
        <div className="text-3xl md:text-4xl tracking-normal font-mono tabular-nums text-foreground">{formatNumber(value)}</div>
        <ul className="space-y-1 list-none pl-0 mt-4">
          <MetricRow label="Unique notifications" baseValue={124000} incrementRate={5400} showRate />
          <MetricRow label="General notifications" baseValue={280000} incrementRate={12300} showRate />
          <MetricRow label="Opening rate" baseValue={45000} incrementRate={1270} showRate />
        </ul>
      </div>
    </div>
  );

  const infoContentView = (
    <div className="bg-card p-4 md:p-6 w-full h-full overflow-y-auto flex flex-col gap-y-2 rounded-lg">
      <span className="my-0 font-mono font-medium text-sm tracking-tight uppercase text-foreground inline-flex gap-x-0.5 items-center w-fit shrink-0">
        Notification Rate
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M6.75011 4H6.00011V5.5H6.75011H9.43945L5.46978 9.46967L4.93945 10L6.00011 11.0607L6.53044 10.5303L10.499 6.56182V9.25V10H11.999V9.25V5C11.999 4.44772 11.5512 4 10.999 4H6.75011Z" /></svg>
      </span>
      <span className="tracking-tight text-sm text-muted-foreground leading-relaxed line-clamp-6">Track notification delivery and engagement metrics. Unique notifications are sent to specific users, while general notifications are broadcast to all users. Opening rate shows how many notifications are being read per second.</span>
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
      <span className={`text-lg font-semibold tabular-nums ${colorClass}`}>{percentage}%</span>
    </div>
  );
}

export default function NotificationCards({ data = { unique: { count: 124, percentage: 62.3 }, broadcast: { count: 75, percentage: 37.7 } } }: NotificationsOverviewProps) {
  return (
    <>
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2">
        {/* Redesigned first card - Tech Stack style */}
        <Card className="@container/card">
            <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Notification Types</CardTitle>
                <span className="text-sm text-muted-foreground">Based on delivery</span>
            </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
            <NotificationTypeRow
                icon={Bell}
                name="Unique notifications"
                percentage={data.unique.percentage}
                color="#BB1920"
                colorClass="text-spendeasebeta"
            />
            <NotificationTypeRow
                icon={Radio}
                name="Broadcast/general"
                percentage={data.broadcast.percentage}
                color="#FFB000"
                colorClass="text-spendeasecharlie"
            />
            </CardContent>
        </Card>

        {/* Animated stats card */}
        <NotificationStatsCard />
        </div>

        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
            <CardHeader>
                <CardDescription>Successful Transactions</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data.unique.count.toLocaleString()}
                </CardTitle>
                <CardAction>
                <ArrowLeftRight className="h-4 w-4" />
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">{data.unique.percentage.toFixed(1)}% success rate</div>
            </CardFooter>
            </Card>
            <Card className="@container/card">
            <CardHeader>
                <CardDescription>Successful Transactions</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data.unique.count.toLocaleString()}
                </CardTitle>
                <CardAction>
                <ArrowLeftRight className="h-4 w-4" />
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">{data.unique.percentage.toFixed(1)}% success rate</div>
            </CardFooter>
            </Card>
            <Card className="@container/card">
            <CardHeader>
                <CardDescription>Successful Transactions</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data.unique.count.toLocaleString()}
                </CardTitle>
                <CardAction>
                <ArrowLeftRight className="h-4 w-4" />
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">{data.unique.percentage.toFixed(1)}% success rate</div>
            </CardFooter>
            </Card>
            <Card className="@container/card">
            <CardHeader>
                <CardDescription>Successful Transactions</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data.unique.count.toLocaleString()}
                </CardTitle>
                <CardAction>
                <ArrowLeftRight className="h-4 w-4" />
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">{data.unique.percentage.toFixed(1)}% success rate</div>
            </CardFooter>
            </Card>
        </div>
    </>
  );
}