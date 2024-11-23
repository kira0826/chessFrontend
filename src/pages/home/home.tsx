import { useSelector } from "react-redux";
import { RootState } from "@/store";


export function Home() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {`Nombre del usuario: ${user.username} `}
      </h1>
    </div>
  );
}
