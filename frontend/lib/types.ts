export type SlideType =
  | "summary"
  | "skills"
  | "experience"
  | "strengths"
  | "recommendations"

export interface Slide {
  type: SlideType
  title: string
  body: string
  bullets: string[]
}

export interface SlideDeckResponse {
  candidate_name: string
  slides: Slide[]
}
