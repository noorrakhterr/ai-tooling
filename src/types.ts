export type PhaseGroup = 'core' | 'bonus'

export interface Phase {
  id: string
  order: number
  group: PhaseGroup
  title: string
  description: string
}

export type ToolType = 'Gong resource' | 'Gem' | 'Agent' | 'Skill' | 'Prompt' | 'Notebook' | 'Other'

export interface Tool {
  id: string
  name: string
  type: ToolType
  description: string
  phaseIds: string[]
  link: string
  owner?: string
  /** Set when the tool has been announced but isn't available to use yet. */
  comingSoon?: boolean
}

export interface Recording {
  id: string
  title: string
  customer: string
  callDate: string
  phaseIds: string[]
  link: string
}

export interface ReferenceResource {
  id: string
  title: string
  description: string
  link: string
}
