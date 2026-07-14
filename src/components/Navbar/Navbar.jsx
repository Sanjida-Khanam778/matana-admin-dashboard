import { Search, Bell } from "lucide-react"

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold mb-2 text-[#0F172A]">Welcome back!</h1>
        <p className="text-sm text-grayText">Here&apos;s what&apos;s happening with your platform today.</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
