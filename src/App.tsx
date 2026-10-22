import { Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { PassportBanner } from './components/PassportBanner'
import { HomePage } from './pages/HomePage'
import { PassportPage } from './pages/PassportPage'
import { CatalogPage } from './pages/CatalogPage'
import { GongLibraryPage } from './pages/GongLibraryPage'
import { MyToolsPage } from './pages/MyToolsPage'
import { WorkflowsPage } from './pages/WorkflowsPage'
import { AuthTestStartPage } from './pages/AuthTestStartPage'
import { AuthTestCallbackPage } from './pages/AuthTestCallbackPage'

const ROUTES_WITHOUT_BANNER = ['/', '/passport', '/auth/test-start', '/auth/callback']

function App() {
  const location = useLocation()
  const showBanner = !ROUTES_WITHOUT_BANNER.includes(location.pathname)

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          {showBanner && <PassportBanner />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/passport" element={<PassportPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/gong-library" element={<GongLibraryPage />} />
            <Route path="/my-tools" element={<MyToolsPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/auth/test-start" element={<AuthTestStartPage />} />
            <Route path="/auth/callback" element={<AuthTestCallbackPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
