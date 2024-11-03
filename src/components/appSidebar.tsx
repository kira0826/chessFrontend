import { LogIn, UserPlus, Play, User, Users, Settings, ShieldAlert, ChevronUp } from "lucide-react";
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
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

const notLoggedIn = [
    { title: "Log In", path: "#", icon: LogIn },
    { title: "Sign Up", path: "#", icon: UserPlus },
];

const loggedInUser = [
    { title: "Play", path: "#", icon: Play },
    { title: "Profile", path: "#", icon: User },
];

const loggedInAdmin = [
    { title: "Play", path: "#", icon: Play },
    { title: "Users", path: "#", icon: Users },
    { title: "Roles", path: "#", icon: ShieldAlert },
    { title: "Permissions", path: "#", icon: Settings },
];

export function AppSidebar() {
    const { state } = useSidebar();
    const authState: number = 2 // 0 (Not logged in) - 1 (User) - 2 (Admin)

    const items = authState === 0
        ? notLoggedIn
        : authState === 1
        ? loggedInUser
        : loggedInAdmin;

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                {state === "collapsed" ? (
                    <img src="logoMini.png" alt="Small Logo" className="w-8 h-8 p-2" />
                ) : (
                    <img src="logo.png" alt="Full Logo" className="w-full h-auto p-4" />
                )}
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.path}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {authState !== 0 && (
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <User /> Username
                                        <ChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className="w-[--radix-popper-anchor-width]"
                                >
                                    <DropdownMenuItem>
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
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
