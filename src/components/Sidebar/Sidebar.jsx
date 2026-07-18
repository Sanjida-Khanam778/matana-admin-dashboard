import { Link, NavLink } from "react-router-dom";
import "./Sidebar.css";
import { LuCircleUserRound, LuDollarSign, LuDumbbell } from "react-icons/lu";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";
import { TbDiamond } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
export default function Sidebar() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="bg-primary text-white h-screen sticky left-0 z-20 flex flex-col justify-between w-48 md:w-64 xl:w-72">
      {/* Ober Logo */}
      <div className="mt-12 flex justify-center">
        <div className="bg-primary rounded-2xl flex items-center justify-center">
          <img src={'/logoFooter.png'} alt="Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      <nav className="flex-1 font-nunito mt-10">
        <ul className="space-y-2">
          <li>
            <NavLink to={"/"} className="flex items-center px-8 py-4">
              <RxDashboard className="mr-3 text-2xl" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/listings"}
             className="flex items-center px-8 py-4"
            >
              <LuCircleUserRound className="mr-3 text-2xl" />
              Business Listing
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/requests"}
              className="flex items-center px-8 py-4 hover:bg-white hover:text-primary"
            >
              <TbDiamond className="mr-3 text-2xl" />
              Request Panel
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/categories"}
              className="flex items-center px-8 py-4 hover:bg-white hover:text-primary"
            >
              <LuDumbbell className="text-xl mr-3 -rotate-45" />
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/profile"}
              className="flex items-center px-8 py-4 hover:bg-white hover:text-primary"
            >
              <LuDollarSign className="text-xl mr-3" />
              Admin Profile
            </NavLink>
          </li>
     
        </ul>
      </nav>
      <Link to={"/login"}>
        <button
          onClick={handleLogout}
          className="flex items-center px-8 py-8 text-xl w-full mx-auto text-white"
        >
          <LogOut className="mr-3" />
          Logout
        </button>
      </Link>
    </div>
  );
}
