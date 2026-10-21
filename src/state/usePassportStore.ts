import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CustomTool } from '../types'

interface PassportState {
  stampedPhaseIds: string[]
  favoriteToolIds: string[]
  customTools: CustomTool[]
  /** Whether the passport has been dismissed from Home (all core phases stamped + user closed it). */
  passportDismissed: boolean
  stampPhase: (phaseId: string) => void
  unstampPhase: (phaseId: string) => void
  toggleFavorite: (toolId: string) => void
  isPhaseStamped: (phaseId: string) => boolean
  isToolFavorited: (toolId: string) => boolean
  addCustomTool: (tool: CustomTool) => void
  removeCustomTool: (toolId: string) => void
  dismissPassport: () => void
}

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      stampedPhaseIds: [],
      favoriteToolIds: [],
      customTools: [],
      passportDismissed: false,
      stampPhase: (phaseId) =>
        set((state) => ({
          stampedPhaseIds: state.stampedPhaseIds.includes(phaseId)
            ? state.stampedPhaseIds
            : [...state.stampedPhaseIds, phaseId],
        })),
      unstampPhase: (phaseId) =>
        set((state) => ({
          stampedPhaseIds: state.stampedPhaseIds.filter((id) => id !== phaseId),
        })),
      toggleFavorite: (toolId) =>
        set((state) => ({
          favoriteToolIds: state.favoriteToolIds.includes(toolId)
            ? state.favoriteToolIds.filter((id) => id !== toolId)
            : [...state.favoriteToolIds, toolId],
        })),
      isPhaseStamped: (phaseId) => get().stampedPhaseIds.includes(phaseId),
      isToolFavorited: (toolId) => get().favoriteToolIds.includes(toolId),
      addCustomTool: (tool) => set((state) => ({ customTools: [...state.customTools, tool] })),
      removeCustomTool: (toolId) =>
        set((state) => ({ customTools: state.customTools.filter((tool) => tool.id !== toolId) })),
      dismissPassport: () => set({ passportDismissed: true }),
    }),
    { name: 'ai-tooling-passport' },
  ),
)
