/* eslint-disable max-lines */
/* eslint-disable prettier/prettier */
export const USD_EXCHANGE_RATES = {
    NGN: 1550, // 1 USD = 1550 NGN
    KES: 153, // 1 USD = 153 KES
    GHS: 15.2, // 1 USD = 15.2 GHS
    ZAR: 18.5, // 1 USD = 18.5 ZAR
  }

  export const CURRENCY_PAIRS = [
    // From NGN
    "NGN→KES",
    "NGN→GHS",
    "NGN→ZAR",
    // From KES
    "KES→NGN",
    "KES→GHS",
    "KES→ZAR",
    // From GHS
    "GHS→NGN",
    "GHS→KES",
    "GHS→ZAR",
    // From ZAR
    "ZAR→NGN",
    "ZAR→KES",
    "ZAR→GHS",
  ]

  export const PAIR_COLORS: Record<string, string> = {
    // NGN pairs - Orange family
    "NGN→KES": "#FD6F01",
    "NGN→GHS": "#FF8C33",
    "NGN→ZAR": "#FFB000",
    // KES pairs - Green family
    "KES→NGN": "#22C55E",
    "KES→GHS": "#4ADE80",
    "KES→ZAR": "#86EFAC",
    // GHS pairs - Blue family
    "GHS→NGN": "#3B82F6",
    "GHS→KES": "#60A5FA",
    "GHS→ZAR": "#93C5FD",
    // ZAR pairs - Purple family
    "ZAR→NGN": "#A855F7",
    "ZAR→KES": "#C084FC",
    "ZAR→GHS": "#D8B4FE",
  }

  export const metricCardsData = [
    {
      id: "gross-revenue",
      title: "Gross Revenue",
      value: "NGN 45.2M",
      change: "+12.5%",
      trend: "up" as const,
      subtitle: "Last 30 days",
      layout: "compact" as const,
    },
    {
      id: "net-revenue",
      title: "Net Revenue",
      value: "NGN 38,495,320",
      subtitle: "After all fees • Last 30 days",
      trend: "up" as const,
      change: "+8.3%",
      layout: "simple" as const,
    },
    {
      id: "transaction-fees",
      title: "Transaction Fees Generated",
      value: "NGN 2.14M",
      change: "+15.2%",
      trend: "up" as const,
      subtitle: "Platform fees",
      layout: "compact" as const,
    },
    {
      id: "fx-sales",
      title: "FX Sales",
      value: "NGN 12.4M",
      change: "+22.1%",
      trend: "up" as const,
      subtitle: "Currency exchanges",
      layout: "default" as const,
    },
    {
      id: "net-profit",
      title: "Combined Net Profit",
      value: "-82.1%",
      change: "-82.1%",
      trend: "down" as const,
      subtitle: "Net profit margin • 1 year",
      layout: "default" as const,
      size: "large" as const,
    },
    {
      id: "customer-lifetime-value",
      title: "Customer Lifetime Value",
      value: "NGN 36,959.44",
      badge: "avg. CLV",
      subtitle: "Last 30 days",
      layout: "detailed" as const,
      size: "large" as const,
      trend: "up" as const,
      change: "+4.2%",
      details: [
        { label: "Total customers", value: "12,459" },
        { label: "Active (30d)", value: "8,234 (66%)" },
        { label: "Avg. lifespan", value: "184 days" },
      ],
    },
    {
      id: "highest-rated-customer",
      title: "Highest Rated Customer",
      value: "adebayotunde",
      subtitle: "NGN 1,251,250 from 15 transactions • Last 30 days",
      layout: "simple" as const,
      size: "large" as const,
      trend: "neutral" as const,
      change: "0%",
    },
    {
      id: "top-currency-pair-profit",
      title: "Top Profit Currency Pair",
      value: "NGN→KES",
      change: "+18.5%",
      trend: "up" as const,
      subtitle: "Most profitable pair • NGN 3.2M profit",
      layout: "default" as const,
    },
    {
      id: "highest-conversion-rate",
      title: "Highest Conversion Rate",
      value: "98.7%",
      change: "+2.3%",
      trend: "up" as const,
      subtitle: "NGN/GHS • Success rate",
      layout: "compact" as const,
    },
    {
      id: "highest-failure-rate",
      title: "Highest Failure Rate",
      value: "12.3%",
      change: "+4.1%",
      trend: "down" as const,
      subtitle: "NGN/ZAR • Needs attention",
      layout: "compact" as const,
    },
    {
      id: "most-active-wallets",
      title: "Most Active Wallets",
      value: "45,234",
      change: "0%",
      trend: "neutral" as const,
      subtitle: "NGN wallets • Nigerian Naira",
      layout: "default" as const,
    },
    {
      id: "least-active-wallets",
      title: "Least Active Wallets",
      value: "8,145",
      change: "-2.1%",
      trend: "down" as const,
      subtitle: "ZAR wallets • South African Rand",
      layout: "default" as const,
    },
    {
      id: "regional-wallet-leader",
      title: "Regional Wallet Leader",
      value: "89.2%",
      change: "+5.4%",
      trend: "up" as const,
      subtitle: "KES (Kenya) • East Africa dominance",
      layout: "compact" as const,
    },
    {
      id: "highest-transaction-volume",
      title: "Highest Transaction Volume",
      value: "156,789",
      change: "+8.2%",
      trend: "up" as const,
      subtitle: "NGN transactions • This month",
      layout: "default" as const,
    },
    {
      id: "most-beneficiaries",
      title: "Most Beneficiaries",
      value: "23,456",
      change: "0%",
      trend: "neutral" as const,
      subtitle: "USD accounts • US Dollar beneficiaries",
      layout: "default" as const,
    },
    {
      id: "most-senders",
      title: "Most Transaction Initiators",
      value: "67,890",
      change: "+3.7%",
      trend: "up" as const,
      subtitle: "NGN senders • Active transaction initiators",
      layout: "default" as const,
    },
  ]

  const generateMonthlyData = (startDate: Date, months: number) => {
    const data = []
    for (let i = 0; i < months; i++) {
      const date = new Date(startDate)
      date.setMonth(date.getMonth() - (months - 1 - i))
      data.push({
        name: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        date: date,
      })
    }
    return data
  }

  const months24 = generateMonthlyData(new Date(2026, 4, 1), 24) // May 2026 going back 24 months

  export const chartsData = [
    {
      id: "currency-pair-profit",
      title: "Currency Pair Profit Analysis",
      subtitle: "Monthly profit by currency (in local currency equivalent)",
      description:
        "This chart shows profit generated from each currency. NGN leads due to our strong Nigerian market presence, followed by KES from East Africa expansion.",
      type: "bar" as const,
      currencies: ["NGN", "KES", "GHS", "ZAR"],
      showLegend: true,
      data: months24.map((m, i) => ({
        name: m.name,
        NGN: Math.round(2000000 + i * 80000 + Math.random() * 400000),
        KES: Math.round(800000 + i * 40000 + Math.random() * 200000),
        GHS: Math.round(500000 + i * 25000 + Math.random() * 150000),
        ZAR: Math.round(600000 + i * 30000 + Math.random() * 180000),
      })),
    },
    {
      id: "transaction-status",
      title: "Transaction Status Overview",
      subtitle: "Monthly transaction success, failure, and pending rates",
      description:
        "Track transaction completion status. Success (green), Failure (red), and Pending (yellow) rates. Our target is 95%+ success with less than 2% failure.",
      type: "status-bar" as const,
      currencies: [],
      showLegend: false,
      hasStatusLegend: true,
      data: months24.map((m, i) => {
        const success = Math.round(82 + i * 0.5 + Math.random() * 10)
        const failure = Math.round(4 + Math.random() * 6)
        const pending = 100 - Math.min(success, 94) - failure
        return {
          name: m.name,
          Success: Math.min(success, 94),
          Failure: Math.max(failure, 3),
          Pending: Math.max(pending, 3),
        }
      }),
    },
    {
      id: "wallet-activity",
      title: "Active Wallets by Currency",
      subtitle: "Number of active wallets per currency",
      description:
        "Monitor active wallet growth for each currency. NGN wallets dominate with 45K+ users, reflecting our Nigerian market strength.",
      type: "area" as const,
      currencies: ["NGN", "KES", "GHS", "ZAR"],
      showLegend: true,
      data: months24.map((m, i) => ({
        name: m.name,
        NGN: Math.round(25000 + i * 900 + Math.random() * 1500),
        KES: Math.round(12000 + i * 500 + Math.random() * 800),
        GHS: Math.round(8000 + i * 350 + Math.random() * 600),
        ZAR: Math.round(6000 + i * 250 + Math.random() * 500),
      })),
    },
    {
      id: "transaction-volume-trend",
      title: "Transaction Volume Trend",
      subtitle: "Monthly transaction count by currency",
      description:
        "View transaction volume trends across all 4 currencies. Seasonal spikes occur during holiday periods and month-end salary payments.",
      type: "line" as const,
      currencies: ["NGN", "KES", "GHS", "ZAR"],
      showLegend: true,
      data: months24.map((m, i) => ({
        name: m.name,
        NGN: Math.round(100000 + i * 4000 + Math.random() * 15000),
        KES: Math.round(45000 + i * 2000 + Math.random() * 8000),
        GHS: Math.round(30000 + i * 1500 + Math.random() * 6000),
        ZAR: Math.round(35000 + i * 1800 + Math.random() * 7000),
      })),
    },
    {
      id: "pair-transaction-volume",
      title: "Currency Pair Transaction Volume",
      subtitle: "Monthly transactions by currency pair corridor",
      description:
        "Track transaction volume for all 12 currency pair routes. Shows which corridors are most active. NGN→KES and NGN→GHS are typically the highest volume routes.",
      type: "pair-bar" as const,
      currencies: [],
      pairs: CURRENCY_PAIRS,
      showLegend: false,
      hasPairLegend: true,
      data: months24.map((m, i) => ({
        name: m.name,
        // NGN outbound
        "NGN→KES": Math.round(35000 + i * 1500 + Math.random() * 8000),
        "NGN→GHS": Math.round(28000 + i * 1200 + Math.random() * 6000),
        "NGN→ZAR": Math.round(18000 + i * 800 + Math.random() * 4000),
        // KES outbound
        "KES→NGN": Math.round(22000 + i * 1000 + Math.random() * 5000),
        "KES→GHS": Math.round(12000 + i * 600 + Math.random() * 3000),
        "KES→ZAR": Math.round(9000 + i * 450 + Math.random() * 2500),
        // GHS outbound
        "GHS→NGN": Math.round(15000 + i * 700 + Math.random() * 3500),
        "GHS→KES": Math.round(10000 + i * 500 + Math.random() * 2800),
        "GHS→ZAR": Math.round(7000 + i * 350 + Math.random() * 2000),
        // ZAR outbound
        "ZAR→NGN": Math.round(12000 + i * 500 + Math.random() * 3000),
        "ZAR→KES": Math.round(8500 + i * 400 + Math.random() * 2200),
        "ZAR→GHS": Math.round(6000 + i * 300 + Math.random() * 1800),
      })),
    },
    {
      id: "pair-success-failure",
      title: "Currency Pair Success vs Pending vs Failure",
      subtitle: "Transaction completion rates by currency pair",
      description:
        "Compare success, pending, and failure rates across all 12 currency pair corridors. Helps identify problematic routes that need attention.",
      type: "pair-status" as const,
      currencies: [],
      pairs: CURRENCY_PAIRS,
      showLegend: false,
      hasPairLegend: true,
      hasStatusLegend: true,
      data: months24.map((m, i) => ({
        name: m.name,
        // NGN outbound pairs
        "NGN→KES_success": Math.min(94 + i * 0.15, 97) + Math.random() * 2,
        "NGN→KES_pending": 2 + Math.random() * 3,
        "NGN→KES_failure": 2 + Math.random() * 2,
        "NGN→GHS_success": Math.min(92 + i * 0.2, 96) + Math.random() * 3,
        "NGN→GHS_pending": 3 + Math.random() * 3,
        "NGN→GHS_failure": 3 + Math.random() * 2,
        "NGN→ZAR_success": Math.min(88 + i * 0.25, 94) + Math.random() * 4,
        "NGN→ZAR_pending": 4 + Math.random() * 3,
        "NGN→ZAR_failure": 4 + Math.random() * 3,
        // KES outbound pairs
        "KES→NGN_success": Math.min(95 + i * 0.1, 98) + Math.random() * 2,
        "KES→NGN_pending": 1 + Math.random() * 2,
        "KES→NGN_failure": 1 + Math.random() * 2,
        "KES→GHS_success": Math.min(91 + i * 0.18, 95) + Math.random() * 3,
        "KES→GHS_pending": 3 + Math.random() * 3,
        "KES→GHS_failure": 3 + Math.random() * 2,
        "KES→ZAR_success": Math.min(89 + i * 0.2, 94) + Math.random() * 3,
        "KES→ZAR_pending": 4 + Math.random() * 3,
        "KES→ZAR_failure": 3 + Math.random() * 3,
        // GHS outbound pairs
        "GHS→NGN_success": Math.min(91 + i * 0.18, 95) + Math.random() * 3,
        "GHS→NGN_pending": 3 + Math.random() * 3,
        "GHS→NGN_failure": 3 + Math.random() * 3,
        "GHS→KES_success": Math.min(90 + i * 0.15, 94) + Math.random() * 3,
        "GHS→KES_pending": 4 + Math.random() * 3,
        "GHS→KES_failure": 3 + Math.random() * 2,
        "GHS→ZAR_success": Math.min(87 + i * 0.22, 93) + Math.random() * 4,
        "GHS→ZAR_pending": 5 + Math.random() * 3,
        "GHS→ZAR_failure": 4 + Math.random() * 3,
        // ZAR outbound pairs
        "ZAR→NGN_success": Math.min(89 + i * 0.22, 95) + Math.random() * 4,
        "ZAR→NGN_pending": 3 + Math.random() * 3,
        "ZAR→NGN_failure": 4 + Math.random() * 3,
        "ZAR→KES_success": Math.min(88 + i * 0.2, 94) + Math.random() * 4,
        "ZAR→KES_pending": 4 + Math.random() * 3,
        "ZAR→KES_failure": 4 + Math.random() * 3,
        "ZAR→GHS_success": Math.min(86 + i * 0.25, 92) + Math.random() * 4,
        "ZAR→GHS_pending": 5 + Math.random() * 4,
        "ZAR→GHS_failure": 5 + Math.random() * 3,
      })),
    },
    {
      id: "revenue-breakdown",
      title: "Revenue Breakdown by Currency",
      subtitle: "Monthly revenue in USD equivalent",
      description: `Revenue converted to USD for comparison. Exchange rates: NGN=${USD_EXCHANGE_RATES.NGN}, KES=${USD_EXCHANGE_RATES.KES}, GHS=${USD_EXCHANGE_RATES.GHS}, ZAR=${USD_EXCHANGE_RATES.ZAR}`,
      type: "area" as const,
      currencies: ["NGN", "KES", "GHS", "ZAR"],
      showLegend: true,
      data: months24.map((m, i) => ({
        name: m.name,
        NGN: Math.round((25000000 + i * 1200000 + Math.random() * 3000000) / USD_EXCHANGE_RATES.NGN),
        KES: Math.round((8000000 + i * 400000 + Math.random() * 1000000) / USD_EXCHANGE_RATES.KES),
        GHS: Math.round((3000000 + i * 150000 + Math.random() * 500000) / USD_EXCHANGE_RATES.GHS),
        ZAR: Math.round((4500000 + i * 200000 + Math.random() * 700000) / USD_EXCHANGE_RATES.ZAR),
      })),
    },
  ]
