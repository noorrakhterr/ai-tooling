import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PassportState {
  stampedPhaseIds: string[]
  favoriteToolIds: string[]
  stampPhase: (phaseId: string) => void
  unstampPhase: (phaseId: string) => void
  toggleFavorite: (toolId: string) => void
  isPhaseStamped: (phaseId: string) => boolean
  isToolFavorited: (toolId: string) => boolean
}

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      stampedPhaseIds: [],
      favoriteToolIds: [],
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
    }),
    { name: 'ai-tooling-passport' },
  ),
)
