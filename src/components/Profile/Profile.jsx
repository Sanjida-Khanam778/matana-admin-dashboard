import { useState } from "react";
import { Camera } from "lucide-react";

export default function Profile() {
  const [firstName, setFirstName] = useState("David");
  const [lastName, setLastName] = useState("Rosen");
  const [email, setEmail] = useState("admin@matana.app");
  const [phone, setPhone] = useState("+1 718 555 0100");

  return (
    <div className="min-h-screen bg-[#F4F1EA] p-6 sm:p-10 flex justify-center">
      <div className="w-full max-w-2xl h-fit rounded-2xl bg-white shadow-sm border border-stone-100 p-8">
        <h1 className="text-xl font-bold text-stone-900">Personal information</h1>
        <p className="text-sm text-stone-500 mt-1">This information is only visible to other admins.</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              <div className="h-28 w-28 rounded-full overflow-hidden ring-4 ring-stone-100 bg-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces"
                  alt="David Rosen"
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-800 text-white flex items-center justify-center ring-2 ring-white hover:bg-emerald-900 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <div className="text-center">
              <p className="font-semibold text-stone-900">
                {firstName} {lastName}
              </p>
              <p className="text-sm text-emerald-700 font-medium">Admin</p>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">First name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">Last name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 transition-colors">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}