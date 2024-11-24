import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setUser, UserState } from "@/features/user/userSlice";
import apiClient from "@/service/apiClient";
import { User, Lock } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "/public/logo.png";

export function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await apiClient.post("token", {
        username,
        password,
      });

      const token = response.headers.authorization;
      sessionStorage.setItem("token", token);

      const userData: UserState = {
        roles: response.data.roles,
        username: response.data.username,
        name: response.data.name,
        lastName: response.data.lastName,
        email: response.data.email,
        Id: response.data.id,
        elo: response.data.elo,
    };
      dispatch(setUser(userData));
      console.log("Login successful", response.data);
      navigate("/");
    } catch (error) {
      setError("Invalid credentials, please try again.");
      console.error("Login error", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="">
        <header className="w-64 h-32">
          <img src={logo} alt="Full Logo" className="w-full h-full object-contain p-4" />
        </header>

        <main className="">
          <div className="">
            <form onSubmit={handleSubmit} className="">
              <div id="username-input-field" className="mb-4 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <Input
                  type="text"
                  placeholder="Username"
                  id="username"
                  name="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div id="password-input-field" className="mb-4 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <Input
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>

              {error && <div className="text-red-500 mb-4">{error}</div>}

              <Button
                type="submit"
                id="login"
                name="login"
                size="lg"
                className="w-full mt-4"
              >
                Log In
              </Button>

              <h4 className="mt-4 text-center">
                <a href="">
                  <span className="">New? </span>
                  <span className="">Sign up - and start playing chess!</span>
                </a>
              </h4>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
