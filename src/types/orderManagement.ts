export interface OrderDetail {
  order: Order
  offer: Offer
  offerPhases: OfferPhase[]
}

export interface Order {
  orderID: string
  customerID: string
  customerName: string
  designerID: string
  designerName: string
  totalPrice: number
  orderStatus: string
  requiredDepositAmount: number
  designerDepositAmount: number
  note: string
  deadlineAt: string
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string

  // Navigation properties
  offer?: Offer
  customer?: Account
  designer?: Account
  progressSteps?: ProgressStep[]
  deliveries?: Delivery[]
}

export interface Offer {
  offerID: string
  initPrice: number
  finalPrice: number
  designerDepositPrice: number
  note: string
  sampleImage: string
  offerStatus: string
  createdAt: string
  deadlineEndAt: string

  // Navigation properties
  projectPost?: ProjectPost
  designer?: Account
  offerPhases?: OfferPhase[]
}

export interface OfferPhase {
  offerPhaseID: string
  phase: number
  phaseName: string
  phaseDescription: string
  offerPhasePrice: number
  offerPhaseStatus: string
  startDate: string
  endDate: string
  modifyDate: string

  // Navigation properties
  progressSteps?: ProgressStep[]
}

// API Response structure for progress steps
export interface ProgressStepResponse {
  progressStep: ProgressStep
  progressImages: ProgressImage[]
}

export interface ProgressStep {
  progressStepID: string
  stepNumber: number
  stepTitle: string
  description: string
  progressStepType: string // "NewDesign", "Review", etc.
  isApprovedByCustomer: boolean | null
  customerNote?: string | null
  createdAt: string
  updateAt: string
}

export interface ProgressImage {
  progressImageID: string
  progressStepID: string
  imageUrl: string
  imageName: string
  description: string
  createdAt: string
}

export interface ProgressStepApproval {
  progressStepApprovalID: string
  totalScore: number
  isPass: boolean
  qualityScore: number
  isDesignAccurate: boolean
  isMaterialCorrect: boolean
  isColorCorrect: boolean
  isFunctionalityMet: boolean
  customerComment: string
  createdAt: string

  // Navigation properties
  progressStep?: ProgressStep
}

export interface Account {
  accountID: string
  accountName: string
  email: string
  avatar?: string
  role: string
}

export interface ProjectPost {
  projectPostID: string
  title: string
  description: string
  itemValue: number
  suggestedPrice: number
}

export interface Delivery {
  deliveryID: string
  orderID: string
  deliveryStatus: string
  trackingNumber?: string
  deliveredAt?: string
}

// Enums
export enum OrderStatusEnum {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

export enum OfferStatusEnum {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  InProgress = 3,
  Completed = 4,
}

export enum OfferPhaseEnum {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

export enum ProgressStepTypeEnum {
  Design = 0,
  Review = 1,
  Revision = 2,
  Final = 3,
}

// UI State types
export interface EvaluationCriteria {
  qualityScore: number
  isDesignAccurate: boolean
  isMaterialCorrect: boolean
  isColorCorrect: boolean
  isFunctionalityMet: boolean
  customerComment: string
}

export type AnimationPhase = "idle" | "exit" | "enter"
export type ViewMode = "normal" | "evaluation"
