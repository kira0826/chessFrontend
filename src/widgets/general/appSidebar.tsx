import logo from "/public/logo.png";
import logoMini from "/public/logoMini.png";

import {
  LogIn,
  UserPlus,
  Play,
  User,
  Users,
  Settings,
  ShieldAlert,
  ChevronUp,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearUser } from "@/features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

const notLoggedIn = [
  { title: "Log In", path: "/auth/sign-in", icon: LogIn },
  { title: "Sign Up", path: "/chessBack/register", icon: UserPlus },
];

const loggedInUser = [{ title: "Play", path: "/play", icon: Play }];

const loggedInAdmin = [
  { title: "Play", path: "/play", icon: Play },
  { title: "Users", path: "/chessBack/login", icon: Users },
  { title: "Roles", path: "/chessBack/login", icon: ShieldAlert },
  { title: "Permissions", path: "/chessBack/login", icon: Settings },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useSidebar();
  const user = useSelector((state: RootState) => state.user);

  let items;

  if (!user || !user.roles) {
    items = notLoggedIn;
  } else if (user.roles.length === 0) {
    items = notLoggedIn;
  } else if (user.roles.includes("ADMIN")) {
    items = loggedInAdmin;
  } else {
    items = loggedInUser;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader onClick={() => navigate("/")}>
        {state === "collapsed" ? (
          <img src={logoMini} alt="Small Logo" className="w-8 h-8 p-2" />
        ) : (
          <img src={logo} alt="Full Logo" className="w-full h-auto p-4" />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.title === "Users" ||
                    item.title === "Roles" ||
                    item.title === "Permissions" ? (
                      <a href={item.path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user?.roles?.length > 0 && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User /> {user.username}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <Link to={`/profile/${user.username}`}>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem onClick={handleLogout}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
