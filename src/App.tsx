import { Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { PassportPanel } from './components/PassportPanel'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { GongLibraryPage } from './pages/GongLibraryPage'
import { MyToolsPage } from './pages/MyToolsPage'
import { WorkflowsPage } from './pages/WorkflowsPage'

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/gong-library" element={<GongLibraryPage />} />
            <Route path="/my-tools" element={<MyToolsPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
          </Routes>
        </div>
      </main>
      <PassportPanel />
    </div>
  )
}

export default App
