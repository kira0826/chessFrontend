import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ProtectedRouteProps {
    requiresAuth?: boolean;
    rolesAllowed?: string[];
    redirectTo?: string;
    children: React.ReactNode;
}

const ProtectedRoute = ({
    requiresAuth = true,
    rolesAllowed = [],
    redirectTo = "/auth/sign-in",
    children,
}: ProtectedRouteProps) => {
    const user = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthenticated = user.Id !== 0;

    const hasRequiredRole =
        rolesAllowed.length === 0 || rolesAllowed.some((role) => user.roles.includes(role));

    if (!isAuthenticated && requiresAuth) {
        return <Navigate to={redirectTo} state={{ from: location }} />;
    }

    if (isAuthenticated && requiresAuth && rolesAllowed.length > 0 && !hasRequiredRole) {
        navigate(-1);
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
