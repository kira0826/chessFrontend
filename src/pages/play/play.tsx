import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { updateUser } from "@/features/user/userSlice";


export function Play() {

  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const handleUpdateUser = () => {
    dispatch(
      updateUser({
        ...user,
        username: "Hola mi amor",
      })
    ); // Actualiza solo el username del usuario
  };


    return (

      <div>

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Play
      </h1>

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {`Nombre del usuario: ${user.username} `}
      </h1>

      <button onClick={handleUpdateUser}>Actualizar usuario </button>

      </div>

      
    );
  }
  