export type SlideType =
  | "summary"
  | "skills"
  | "experience"
  | "strengths"
  | "recommendations"
  | "ats_score"

export interface Slide {
  type: SlideType
  title: string
  body: string
  bullets: string[]
  chart_image?: string  
}

export interface SlideDeckResponse {
  candidate_name: string
  slides: Slide[]
}
