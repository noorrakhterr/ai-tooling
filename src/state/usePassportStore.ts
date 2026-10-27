import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CustomTool } from '../types'

interface PassportState {
  stampedPhaseIds: string[]
  favoriteToolIds: string[]
  /** Gong call ids saved for later — personal, local, Gong-only (no effect on AI tools). */
  savedRecordingIds: string[]
  customTools: CustomTool[]
  /** Whether the passport has been dismissed from Home (all core phases stamped + user closed it). */
  passportDismissed: boolean
  /** Whether the user has seen (or dismissed) the "what is the passport" intro popup. */
  hasSeenPassportIntro: boolean
  /** Whether the user has seen each page's own "how to use this page" guide. */
  hasSeenCatalogGuide: boolean
  hasSeenGongGuide: boolean
  hasSeenMyToolsGuide: boolean
  stampPhase: (phaseId: string) => void
  unstampPhase: (phaseId: string) => void
  toggleFavorite: (toolId: string) => void
  toggleSavedRecording: (recordingId: string) => void
  isPhaseStamped: (phaseId: string) => boolean
  isToolFavorited: (toolId: string) => boolean
  isRecordingSaved: (recordingId: string) => boolean
  addCustomTool: (tool: CustomTool) => void
  removeCustomTool: (toolId: string) => void
  dismissPassport: () => void
  markPassportIntroSeen: () => void
  markCatalogGuideSeen: () => void
  markGongGuideSeen: () => void
  markMyToolsGuideSeen: () => void
}

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      stampedPhaseIds: [],
      favoriteToolIds: [],
      savedRecordingIds: [],
      customTools: [],
      passportDismissed: false,
      hasSeenPassportIntro: false,
      hasSeenCatalogGuide: false,
      hasSeenGongGuide: false,
      hasSeenMyToolsGuide: false,
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
      toggleSavedRecording: (recordingId) =>
        set((state) => ({
          savedRecordingIds: state.savedRecordingIds.includes(recordingId)
            ? state.savedRecordingIds.filter((id) => id !== recordingId)
            : [...state.savedRecordingIds, recordingId],
        })),
      isPhaseStamped: (phaseId) => get().stampedPhaseIds.includes(phaseId),
      isToolFavorited: (toolId) => get().favoriteToolIds.includes(toolId),
      isRecordingSaved: (recordingId) => get().savedRecordingIds.includes(recordingId),
      addCustomTool: (tool) => set((state) => ({ customTools: [...state.customTools, tool] })),
      removeCustomTool: (toolId) =>
        set((state) => ({ customTools: state.customTools.filter((tool) => tool.id !== toolId) })),
      dismissPassport: () => set({ passportDismissed: true }),
      markPassportIntroSeen: () => set({ hasSeenPassportIntro: true }),
      markCatalogGuideSeen: () => set({ hasSeenCatalogGuide: true }),
      markGongGuideSeen: () => set({ hasSeenGongGuide: true }),
      markMyToolsGuideSeen: () => set({ hasSeenMyToolsGuide: true }),
    }),
    { name: 'ai-tooling-passport' },
  ),
)
