import { useState } from "react";
import { Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom"; // Importa el componente Link

interface User {
  username: string;
  email: string;
  name: string;
  lastName: string;
  elo: number;
}

interface Match {
  date: string;
  opponent: string;
  result: "win" | "lose";
}

export function Profile() {
  const [user, setUser] = useState<User>({
    username: "chessmaster",
    email: "chessmaster@example.com",
    name: "John",
    lastName: "Doe",
    elo: 2000,
  });

  const [matches] = useState<Match[]>([
    { date: "2023-10-05", opponent: "opponent1", result: "win" },
    { date: "2023-10-03", opponent: "opponent2", result: "lose" },
    { date: "2023-10-01", opponent: "opponent3", result: "win" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(editedUser);
    handleCloseModal();
  };

  return (
    <div className="container mx-auto p-4">
      {/* Contenedor principal con diseño de Flexbox */}
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Perfil del Usuario - Ocupa todo el espacio disponible */}
        <Card className="flex-grow mb-4 lg:mb-0">
          <CardHeader>
            <img
              src="https://via.placeholder.com/100" // URL de imagen quemada
              alt="User Avatar"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold">{user.username}</h2>
          </CardHeader>
          <CardContent>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.name} {user.lastName}</p>
            <p><strong>Elo:</strong> {user.elo}</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="secondary" onClick={handleEditClick}>
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Historial de Partidas */}
        <div className="mt-8 lg:mt-0 lg:w-1/2">
          <h3 className="text-xl font-semibold mb-4">Match History</h3>
          <div className="space-y-4">
            {matches.map((match, index) => (
              <Link to={`/match/${index}`} key={index}>
                <Card className="p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Date:</strong> {match.date}
                      </p>
                      <p className="text-sm">
                        <strong>Opponent:</strong> {match.opponent}
                      </p>
                    </div>
                    <div className="text-right">
                      {match.result === "win" ? (
                        <Trophy className="text-green-500 w-6 h-6" />
                      ) : (
                        <XCircle className="text-red-500 w-6 h-6" />
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para editar perfil */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={editedUser.username}
                  onChange={handleInputChange}
                  className="border rounded w-full p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
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
                  value={editedUser.lastName}
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
