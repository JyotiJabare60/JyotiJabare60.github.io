import siteData from '~/content/site.json'
import profileData from '~/content/profile.json'
import projectsData from '~/content/projects.json'
import experienceData from '~/content/experience.json'
import skillsData from '~/content/skills.json'
import certificationsData from '~/content/certifications.json'
import type { Project, ProjectCategory } from '~/types/content'

/** File-based content. Edit the JSON in content/ — no component changes needed. */
export const useSite = () => siteData
export const useProfile = () => profileData
export const useExperience = () => experienceData
export const useSkills = () => skillsData
export const useCertifications = () => certificationsData

export const useProjects = () => {
  const all = (projectsData.projects as unknown as Project[])
    .slice()
    .sort((a, b) => a.order - b.order)

  const featured = all.filter((p) => p.featured)

  const categories: { id: ProjectCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: all.length },
    { id: 'fullstack', label: 'Full-stack', count: all.filter((p) => p.categories.includes('fullstack')).length },
    { id: 'flutter', label: 'Flutter', count: all.filter((p) => p.categories.includes('flutter')).length },
    { id: 'ai', label: 'AI', count: all.filter((p) => p.categories.includes('ai')).length },
  ]

  const bySlug = (slug: string) => all.find((p) => p.slug === slug)

  return { all, featured, categories, bySlug }
}
