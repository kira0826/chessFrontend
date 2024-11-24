import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Play,
  Users,
  Trophy,
  Book,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  function handleNavigate() {
    if (sessionStorage.getItem("token")) {
      navigate("/play");
    } else {
      navigate("/auth/sign-in");
    }
  }

  const features = [
    {
      icon: <Play className="w-6 h-6" />,
      title: "Juega Ahora",
      description:
        "Encuentra una partida rápidamente y comienza a jugar contra oponentes de tu nivel.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Comunidad Activa",
      description:
        "Únete a una comunidad vibrante de jugadores de ajedrez de todo el mundo.",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Torneos",
      description:
        "Participa en torneos regulares y compite por premios y reconocimiento.",
    },
    {
      icon: <Book className="w-6 h-6" />,
      title: "Aprende",
      description:
        "Mejora tu juego con tutoriales, puzzles y análisis de partidas.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary">
                Juega Ajedrez Online
                <span className="block text-primary/80">Con Estilo</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Experimenta el juego del ajedrez como nunca antes. Juega,
                aprende y compite con jugadores de todo el mundo en nuestra
                plataforma moderna y elegante.
              </p>
              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="font-semibold"
                  onClick={handleNavigate}
                >
                  Jugar Ahora
                  <Play className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="font-semibold">
                  Explorar
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <img
                  src="/chessFront/board.png"
                  alt="Tablero de Ajedrez"
                  className="object-cover rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Todo lo que necesitas para jugar
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nuestra plataforma está diseñada para jugadores de todos los
              niveles, desde principiantes hasta maestros.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-primary/5 border-0">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    ¿Listo para empezar?
                  </h2>
                  <p className="text-muted-foreground">
                    Únete a miles de jugadores y comienza tu viaje en el ajedrez
                    hoy mismo.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Button
                    size="lg"
                    onClick={() =>
                      (window.location.href = "/chessBack/register")
                    }
                  >
                    Crear Cuenta
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Saber Más
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
