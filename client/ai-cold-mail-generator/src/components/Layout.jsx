import Sidebar from './Sidebar.jsx'
import NavBar from './NavBar.jsx'

const Layout = ({ children, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <NavBar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}

export default Layout
