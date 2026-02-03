
export enum UserStage {
  FUNDAMENTALS = 'Fundamentals',
  LIQUIDITY_CONCEPTS = 'Liquidity & Flow',
  PATTERN_MASTERY = 'Pattern Mastery',
  RISK_ENFORCEMENT = 'Risk Enforcement',
  CONSISTENCY_DRILLS = 'Consistency Drills',
  LIVE_PREP = 'Live Prep',
  MASTER = 'Institutional Master'
}

export interface UserProfile {
  id: string;
  name: string;
  stage: UserStage;
  experienceLevel: number; // 0 to 100
  totalTrades: number;
  ruleAdherenceRate: number; // Percentage
  currentCapital: number;
  maxDrawdown: number;
  dailyLossLimit: number;
  behavioralScore: number; // 0 to 100
}

export interface TradeSetup {
  symbol: string;
  bias: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskAmount: number;
  logic: string;
  patternType: string;
}

export interface Trade {
  id: string;
  timestamp: number;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  exit?: number;
  stopLoss: number;
  takeProfit: number;
  riskPercent: number;
  status: 'OPEN' | 'CLOSED';
  outcome?: 'PROFIT' | 'LOSS' | 'BREAKEVEN';
  profitAmount?: number;
  behavioralTags: string[];
  logic: string;
  mentorCritique?: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  content: string;
  locked: boolean;
  stage: UserStage;
}

export interface Strategy {
  name: string;
  context: string;
  logic: string;
  entry: string;
  invalidation: string;
  expectancy: string;
  defaultBias?: 'LONG' | 'SHORT';
  suggestedStopPips?: number;
}
