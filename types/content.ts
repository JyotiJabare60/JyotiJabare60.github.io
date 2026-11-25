export type ProjectCategory = 'fullstack' | 'flutter' | 'ai'
export type ProjectStatus = 'published' | 'production' | 'prototype'

export interface ProjectMedia {
  /** 'screenshot' = a real, approved application screenshot. 'plate' = designed placeholder. */
  kind: 'screenshot' | 'plate'
  src?: string
  alt?: string
  badge?: string
  /** plate only */
  plateName?: string
  plateStack?: string[]
  plateNote?: string
  /** intrinsic size, so the browser reserves the right box and nothing shifts */
  w?: number
  h?: number
}

export interface GalleryImage { src: string; alt: string; caption: string; w: number; h: number }

export interface ProjectSection { heading: string; body?: string[]; list?: string[] }

export interface Project {
  slug: string
  name: string
  cardTitle: string
  categories: ProjectCategory[]
  categoryLabel: string
  status: ProjectStatus
  statusLabel: string
  contribution: string
  role: string
  period: string
  scale: string
  employer: string
  summary: string
  tags: string[]
  media: ProjectMedia
  featured: boolean
  order: number
  lead: string
  sections: ProjectSection[]
  gallery: GalleryImage[]
  galleryNote?: string
  noAssetsNote?: string
  outcomes: string[]
  outcomeNote?: string
  stack: string[]
  platforms: string
}

export interface StatTile { value: string; label: string; note: string }
export interface SpecRow { term: string; detail: string }
export interface SkillGroup { title: string; tags: string[]; note: string }
export interface Gap { title: string; body: string }
export interface TimelineEntry {
  period: string
  role: string
  org: string
  items: string[]
}
export interface Certification { monogram: string; title: string; issuer: string; verifyUrl: string | null }
export interface SiteAssets {
  /** null until supplied — the UI hides the control rather than showing a dead link */
  resumePdf: string | null
  profilePhoto: string | null
  githubUrl: string | null
  ogImage: string | null
}
