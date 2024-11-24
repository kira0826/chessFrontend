import Timer from "./timer";

interface MatchInfoProps {
  username: string;
  elo: number;
  profilePicture: string | undefined;
}

const MatchInfo: React.FC<MatchInfoProps> = ({
  username,
  elo,
  profilePicture,
}) => {
  return (
    <div className="flex flex-row  justify-between items-center w-full h-12">
      <main className=" flex flex-row items-center justify-center ">
        <img
          src={
            profilePicture ||
            "https://i.pinimg.com/736x/5b/30/5f/5b305fca208d6162872c715f4c7643e1.jpg"
          }
          alt="profile"
          className="w-8 h-8 object-cover rounded-full mr-2" // Asegúrate de que la imagen tenga un tamaño fijo y se ajuste
        />

        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight mr-2">
          {username}
        </h1>
        <h2 className="text-sm text-muted-foreground">{`(${elo})`}</h2>
      </main>

      <Timer time="3:16" />
    </div>
  );
};

export default MatchInfo;
