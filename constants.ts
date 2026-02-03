
import { UserStage, Lesson } from './types';

export const RISK_LIMITS = {
  MAX_TRADE_RISK: 0.01, // 1%
  DAILY_DRAWDOWN_LIMIT: 0.03, // 3%
  WEEKLY_DRAWDOWN_LIMIT: 0.06, // 6%
  COOLDOWN_PERIOD_MS: 3600000, // 1 hour after "emotional" behavior
};

export const STRATEGIES = [
  {
    name: "The Liquidity Sweep (Reversal)",
    context: "Price approaches a major previous high/low where retail stop-losses are clustered.",
    logic: "Institutions push price just past the level to trigger stops, creating enough sell/buy side liquidity to fill their own counter-orders.",
    entry: "Wait for a 'Stop Hunt' (wick through level) followed by a strong displacement back into range.",
    invalidation: "A candle closing beyond the wick of the sweep.",
    expectancy: "High RR (1:3+), Win Rate ~45-55%.",
    defaultBias: "LONG",
    suggestedStopPips: 25
  },
  {
    name: "Session Imbalance (ICT/SMC)",
    context: "London or NY Open volatility spikes.",
    logic: "Initial move is often a 'Judas Swing' designed to trap traders. The real move follows a displacement that creates a Fair Value Gap (FVG).",
    entry: "Look for a Market Structure Shift (MSS) on 5m/15m charts after the first 30 mins of the session.",
    invalidation: "Price closes back through the anchor of the FVG.",
    expectancy: "Medium RR (1:2), Win Rate ~60%.",
    defaultBias: "SHORT",
    suggestedStopPips: 20
  },
  {
    name: "Internal Range Liquidity (IRL)",
    context: "Trading inside a large Daily range after a sweep has occurred.",
    logic: "Price moves from External Liquidity (Old Highs/Lows) to Internal Liquidity (Gaps/Order Blocks).",
    entry: "Look for a return to a 15m FVG after a 1H liquidity raid.",
    invalidation: "A break of the most recent swing high/low.",
    expectancy: "High RR (1:4), Win Rate ~40%.",
    defaultBias: "LONG",
    suggestedStopPips: 15
  }
];

export const LESSONS: Lesson[] = [
  {
    id: 'L-001',
    stage: UserStage.FUNDAMENTALS,
    category: 'The Foundation',
    title: 'Forex 101: The Global Grocery Store',
    content: 'LAYMAN TERMS: Imagine traveling from the USA to France. You swap Dollars for Euros. That is Forex. Trillions are swapped daily because companies need to pay for parts in different countries.\n\nPRO USE CASE: We buy a country\'s economy. If interest rates rise, that currency becomes a "high-interest account," and everyone wants it.',
    locked: false
  },
  {
    id: 'L-002',
    stage: UserStage.FUNDAMENTALS,
    category: 'The Foundation',
    title: 'The Pip & The Lot',
    content: 'LAYMAN TERMS: A "Pip" is a tiny price move. A "Lot" is the size of the box you are buying. 1 Micro Lot is $1,000 worth of currency.\n\nPRO USE CASE: Professionals calculate: "I can lose $100. If my stop is 10 pips, what lot size makes 10 pips exactly $100?" This is called Position Sizing.',
    locked: false
  },
  {
    id: 'L-101',
    stage: UserStage.FUNDAMENTALS,
    category: 'Market Mechanics',
    title: 'Market Structure: The River Flow',
    content: 'LAYMAN TERMS: A river flows downhill. Pullbacks are splashes against rocks. A "Break of Structure" is when the river starts flowing uphill.\n\nPRO USE CASE: We look for Higher Highs and Higher Lows. If price breaks the last Higher Low, the uptrend is dead. We stop buying immediately.',
    locked: false
  },
  {
    id: 'L-201',
    stage: UserStage.LIQUIDITY_CONCEPTS,
    category: 'Institutional Logic',
    title: 'Stop Hunts: The Liquidity Trap',
    content: 'LAYMAN TERMS: Banks need to buy millions. They need "Sellers" to provide them money. Where are people selling? At their "Stop Losses" below support. Banks push price through support to "buy" from your stops.\n\nPRO USE CASE: This is why price hits your stop and then goes your way. Learn to enter WHERE others get stopped out.',
    locked: false
  },
  {
    id: 'L-301',
    stage: UserStage.PATTERN_MASTERY,
    category: 'Advanced Tactics',
    title: 'Fair Value Gaps: The Vacuum',
    content: 'LAYMAN TERMS: When a bank moves price fast, it skips levels. These "holes" are like vacuums. Price will be sucked back in to "balance" the market.\n\nPRO USE CASE: Identify a FVG on the 1-hour chart. When price returns to touch the edge of this gap, it is a high-probability entry.',
    locked: false
  },
  {
    id: 'L-302',
    stage: UserStage.PATTERN_MASTERY,
    category: 'Advanced Tactics',
    title: 'Order Blocks: Bank Footprints',
    content: 'LAYMAN TERMS: Before price rockets up, banks push it down one last time to clear the way. That last "Down" candle is where their buy orders are sitting.\n\nPRO USE CASE: Mark the last bearish candle before a major bullish surge. When price returns weeks later, it will bounce as banks defend their base.',
    locked: false
  },
  {
    id: 'L-401',
    stage: UserStage.RISK_ENFORCEMENT,
    category: 'Risk Mastery',
    title: 'The Risk-of-Ruin',
    content: 'LAYMAN TERMS: If you lose 50%, you need 100% just to break even. This is the "Death Spiral." Risky 1% per trade means you can lose 10 times and still be in the game.\n\nPRO USE CASE: Use "Fixed Ratio" sizing. Only increase lots after your account grows by a set amount (e.g., $2,000 profit).',
    locked: false
  },
  {
    id: 'L-501',
    stage: UserStage.MASTER,
    category: 'Expert Strategy',
    title: 'Power of 3 (AMD)',
    content: 'LAYMAN TERMS: Most days have 3 parts: 1. Accumulation (Sideways trap). 2. Manipulation (The fake out). 3. Distribution (The real move).\n\nPRO USE CASE: During the Asian session, we Accumulate. At London Open, we look for the Manipulation (Fake out). Enter on the reversal to catch the Daily Distribution.',
    locked: false
  },
  {
    id: 'L-601',
    stage: UserStage.MASTER,
    category: 'Elite Execution',
    title: 'MT4/MT5 Bridge Protocol',
    content: 'LAYMAN TERMS: Risk Master is the "Brain," MetaTrader is the "Muscle." Calculate risk here, then manually type the Lot Size into MetaTrader. Do not execute without the "Brain\'s" approval.\n\nPRO USE CASE: This prevents "Fat Finger" errors and emotional over-leveraging. It turns trading into a mechanical business process.',
    locked: false
  },
  {
    id: 'L-701',
    stage: UserStage.MASTER,
    category: 'Elite Execution',
    title: 'Vercel Deployment Guide',
    content: 'LAYMAN TERMS: Host this app on Vercel to access it as a private trading portal on any device.\n\nPRO USE CASE: Push code to GitHub -> Create Vercel Project -> Set Gemini API Key. Use "Add to Home Screen" on iPhone for a native app experience.',
    locked: false
  }
];

export const SYMBOLS = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'XAUUSD'];
