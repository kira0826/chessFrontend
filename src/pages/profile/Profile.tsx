import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Trophy,
  XCircle,
  User,
  Mail,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import apiClient from "@/service/apiClient";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/features/user/userSlice";
import { RootState } from "@/store";
import type { Match } from "../../widgets/chess/types";

interface User {
  username: string;
  email: string;
  name: string;
  lastName: string;
  elo: number;
}

export function Profile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get(`api/users/${username}`);
        setUser(response.data);
        setEditedUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [username]);


  useEffect(() => {
    const fetchMatchesData = async () => {
      try {
        const response = await apiClient.get(`api/users/${username}/matches`);
        setMatches(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch matches data:", error);
      }
    };

    fetchMatchesData();
  });


  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => {
      if (prevUser) {
        return {
          ...prevUser,
          [name]: value,
        };
      }
      return null;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.patch(`api/users/${username}`, editedUser);
      setUser(editedUser);
  
      if (editedUser && user && currentUser.username === user.username) {
        dispatch(
          updateUser({
            ...currentUser,
            name: editedUser.name,
            lastName: editedUser.lastName,
          })
        );
      }
  
      handleCloseModal();
      navigate(`/profile/${editedUser?.username}`);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const canEdit =
    currentUser.username === user?.username ||
    currentUser.roles.includes("ADMIN");

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 mx-auto">
                  <img
                    src="https://i.pinimg.com/736x/5b/30/5f/5b305fca208d6162872c715f4c7643e1.jpg"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                {canEdit && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-0 right-0"
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {user ? (
                <>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary">
                      {user.username}
                    </h2>
                    <p className="text-muted-foreground">{`${user.name} ${user.lastName}`}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                      <Star className="w-5 h-5 text-primary" />
                      <span className="text-sm">ELO Rating: {user.elo}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                      <Trophy className="w-5 h-5 text-primary" />
                      <span className="text-sm">
                        Win Rate: quemado%
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-center">
                  <div className="animate-pulse space-y-4 w-full">
                    <div className="h-4 bg-primary/10 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-primary/10 rounded w-1/2 mx-auto"></div>
                    <div className="h-10 bg-primary/10 rounded w-full"></div>
                    <div className="h-10 bg-primary/10 rounded w-full"></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 lg:mt-0 lg:w-1/2">
          <h3 className="text-xl font-semibold mb-4">Match History</h3>
          <div className="space-y-4">
            {matches && matches.map((match, index) => (
              <Link to={`/match/${match.id}`} key={index}>
                <Card className="p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Date:</strong> {match.createdDate}
                      </p>
                      <p className="text-sm">
                        <strong>Game Mode:</strong> {match.gameModeName}
                      </p>
                      <p className="text-sm">
                        <strong>Players:</strong> {match.usernames.join(", ")}
                      </p>

                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>



      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-sm w-full m-4">
            <CardHeader>
              <h3 className="text-lg font-semibold">Edit Profile</h3>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name:
                  </label>
                  <input
                    placeholder="First Name"
                    type="text"
                    name="name"
                    value={editedUser?.name}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-input bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name:
                  </label>
                  <input
                    placeholder="Last Name"
                    type="text"
                    name="lastName"
                    value={editedUser?.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-input bg-background"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
