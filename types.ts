
export enum UserRole {
  PATIENT = 'PATIENT',
  CHILD = 'CHILD',
  DONOR = 'DONOR',
  CAREGIVER = 'CAREGIVER',
  SURVIVOR = 'SURVIVOR'
}

export enum PatientAgeGroup {
  CHILD = 'CHILD',
  TEEN = 'TEEN',
  ADULT = 'ADULT',
  MIDDLE_AGED = 'MIDDLE_AGED',
  SENIOR = 'SENIOR'
}

export enum EmotionalState {
  OKAY = 'OKAY',
  LOW = 'LOW',
  ANXIOUS = 'ANXIOUS',
  TIRED = 'TIRED',
  OVERWHELMED = 'OVERWHELMED'
}

export enum AppLanguage {
  ENGLISH = 'en',
  HINDI = 'hi',
  URDU = 'ur',
  TELUGU = 'te'
}

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface ChatAction {
  label: string;
  type: 'BUTTON' | 'LINK';
  action: string;
  uri?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  actions?: ChatAction[];
  timestamp: number;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  updatedAt: number;
}

export interface CareNetworkMember {
  id: string;
  name: string;
  role: 'LOGISTICS' | 'CLINICAL' | 'EMOTIONAL' | 'BACKUP';
  phone: string;
  onDuty: boolean;
}

export interface EmergencyPlan {
  hospitalName: string;
  hospitalPhone: string;
  checklist: string[];
  lastReviewDate: number;
}

export interface NotificationSettings {
  daily?: boolean;
  updates?: boolean;
  buddy?: boolean;
  supportGroups: boolean;
  docUploads: boolean;
  campaignUpdates: boolean;
  emotionalCheckins: boolean;
  caregiverFollowups: boolean;
  emailEnabled: boolean;
}

export interface MoodEntry {
  date: number;
  state: EmotionalState;
  note?: string;
}

export interface SymptomLog {
  id: string;
  date: number;
  severity: number; 
  type: 'PAIN' | 'NAUSEA' | 'FATIGUE' | 'APPETITE' | 'OTHER';
  note?: string;
}

export interface CaregiverJournalEntry {
  id: string;
  date: number;
  text: string;
  category: 'MEDICAL' | 'LOGISTICS' | 'EMOTIONAL' | 'OTHER';
  isPrivate: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  type: 'MEDICINE' | 'APPOINTMENT' | 'WATER' | 'REST' | 'SUPPORT_GROUP' | 'CHECKIN' | 'JOURNAL';
  completed: boolean;
  category: 'CLINICAL' | 'GENTLE';
  lastTriggered?: number;
}

export type ResourceType = 'ARTICLE' | 'SCHEME' | 'GROUP' | 'VIDEO' | 'SKILL';

export interface SavedResource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  thumbnail?: string;
  link?: string;
  timestamp: number;
}

export interface DonationRecord {
  id: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  timestamp: number;
  status: 'SUCCESS' | 'PENDING';
}

export interface SOSContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  ageGroup?: PatientAgeGroup;
  gender?: 'BOY' | 'GIRL';
  language: AppLanguage;
  theme: AppTheme;
  cancerType?: string;
  treatmentPhase?: 'DIAGNOSIS' | 'CHEMO' | 'RADIO' | 'SURGERY' | 'RECOVERY' | 'PALLIATIVE';
  currentMood?: EmotionalState;
  lastMoodUpdate?: number;
  moodHistory?: MoodEntry[];
  symptomLogs?: SymptomLog[];
  caregiverJournal?: CaregiverJournalEntry[];
  reminders?: Reminder[];
  savedResources?: SavedResource[];
  donationHistory?: DonationRecord[];
  xp?: number;
  level?: number;
  stickers?: string[];
  emergencyContacts?: SOSContact[];
  notificationSettings?: NotificationSettings;
  careNetwork?: CareNetworkMember[];
  emergencyPlan?: EmergencyPlan;
}

export interface ScannedDoc {
  id: string;
  name: string;
  type: 'REPORT' | 'BILL' | 'ID' | 'PRESCRIPTION' | 'OTHER';
  date: string;
  summary: string;
  analysis?: {
    terms: { term: string; explanation: string }[];
    missingDocs: string[];
    isVerified: boolean;
  };
  fileData: string; 
}

export interface MedicineScan {
  id: string;
  name: string;
  purpose: string;
  dosageInstructions: string;
  sideEffects: string[];
  warnings: string[];
  imageUrl: string;
  timestamp: number;
}

export interface CareContext {
  role: UserRole;
  ageGroup: string;
  location: string;
  cancerType: string;
  financialStatus: 'STABLE' | 'STRETCHED' | 'CRITICAL';
  priority: 'FUNDING' | 'INFORMATION' | 'EMOTIONAL' | 'LOGISTICS';
}

export interface NavigationPlan {
  roadmap: string;
  schemes: { name: string; url: string; reason: string; description: string }[];
  hospitals: { name: string; type: string; location: string }[];
  nextSteps: string[];
}

export interface Campaign {
  id: string;
  title: string;
  patientName: string;
  targetAmount: number;
  raisedAmount: number;
  category: 'MEDICAL' | 'AWARENESS' | 'ALIG_CARE';
  story: string;
  impactStory?: string;
  isVerified: boolean;
  image: string;
  donationsCount: number;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  documents: string[];
  steps: string[];
  officialUrl: string;
  type: 'GOVERNMENT' | 'INSTITUTIONAL';
  fundType: 'PM_CARE' | 'CM_CARE' | 'AYUSHMAN' | 'ALIG_CARE';
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'SYMPTOMS' | 'SCHEMES' | 'LIFESTYLE' | 'EMOTIONAL';
  imageUrl: string;
  tags: string[];
  link?: string;
}

export interface SupportGroup {
  id: string;
  name: string;
  location: string;
  type: 'IN_PERSON' | 'VIRTUAL';
  meetingTime: string;
  description: string;
}

export interface ChildVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  videoUrl: string;
  externalUrl: string;
  thumbnail: string;
  category?: string;
}

export interface AppEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'SEMINAR' | 'CIRCLE';
}

export interface HarmonyMetric {
  steps: number;
  sleepHours: number;
  heartRate: number;
  activeMinutes: number;
  lastSynced: number;
}

export interface HarmonyInsight {
  health_summary: string;
  sleep_insight: string;
  activity_insight: string;
  recovery_insight: string;
  daily_motivation: string;
}
