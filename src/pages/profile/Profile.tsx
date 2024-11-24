import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
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
        dispatch(updateUser({
          ...currentUser,
          name: editedUser.name,
          lastName: editedUser.lastName,
        }));
      }

      handleCloseModal();
      navigate(`/profile/${editedUser?.username}`);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const canEdit = currentUser.username === user?.username || currentUser.roles.includes("ADMIN");

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <Card className="flex-grow mb-4 lg:mb-0">
          <CardHeader>
            <img
              src="https://via.placeholder.com/100"
              alt="User Avatar"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold">{user?.username}</h2>
          </CardHeader>
          <CardContent>
            {user ? (
              <>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.name} {user.lastName}</p>
                <p><strong>Elo:</strong> {user.elo}</p>
              </>
            ) : (
              <p>Loading user data...</p>
            )}
          </CardContent>
          <CardFooter>
            {canEdit && (
              <Button size="sm" variant="secondary" onClick={handleEditClick}>
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>

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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editedUser?.name}
                  onChange={handleInputChange}
                  className="border rounded w-full p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={editedUser?.lastName}
                  onChange={handleInputChange}
                  className="border rounded w-full p-2"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
