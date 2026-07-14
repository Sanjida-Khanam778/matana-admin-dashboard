"use client";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Send } from "lucide-react";
import { useGetPlatformUserByIdQuery } from "../../Api/dashboardApi";
import userAvatar from "../../assets/images/userAvatar.png";
const UserDetails = ({ userId, onBack }) => {
  const {
    data: user,
    isLoading,
    error,
  } = useGetPlatformUserByIdQuery(userId, { skip: !userId });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8">Failed to load user</div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-3 bg-white rounded-2xl text-grayText/50 hover:text-gray-800 transition-all shadow-sm border border-gray-50 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <div className="text-grayText tracking-widest">User Details</div>
          <div className="text-2xl font-medium text-gray-800">
            {user.full_name}
          </div>
        </div>
      </div>

      <div className="bg-primary rounded-[40px] p-10 flex items-center gap-12 text-white shadow-2xl shadow-blue-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="relative">
          <img
            src={user.profile_picture || userAvatar}
            className="w-32 h-32 rounded-[32px] object-cover"
            alt=""
          />
          <div className="mt-4 font-medium text-center text-lg">
            {user.full_name}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 flex-1">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 group hover:bg-white/15 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white/60 text-[13px] font-medium mb-1">
                  Email
                </div>
                <div className="font-medium">{user.email}</div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 group hover:bg-white/15 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white/60 text-[13px] font-medium mb-1">
                  Phone
                </div>
                <div className="font-medium">
                  {user.phone_number || user.phone}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 group hover:bg-white/15 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white/60 text-[13px] font-medium mb-1">
                  Location
                </div>
                <div className="font-medium">San Francisco, CA</div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 group hover:bg-white/15 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white/60 text-[13px] font-medium mb-1">
                  Member Since
                </div>
                <div className="font-medium">
                  {new Date(user.date_joined).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[300px] space-y-4 border-l border-white/20 pl-12 py-4">
          <div className="font-medium text-white/60 uppercase text-[12px] tracking-widest mb-6">
            Quick Actions
          </div>

       
            <a
              href={`mailto:${user.email}`}
              className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-medium flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <Send className="w-5 h-5" /> Send Email
            </a>
        
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
