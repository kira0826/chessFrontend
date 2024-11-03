import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { updateUser } from "@/features/user/userSlice";

export function Home() {
  
  const user = useSelector((state: RootState ) => state.user)

  const dispatch = useDispatch();

  const handleUpdateUser = () => {
    dispatch(updateUser({ 
      ...user,
      username: "pollita"
    })); // Actualiza solo el username del usuario
};
  

  return (

    <>
  
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {user.username}
    </h1>

    <button onClick={handleUpdateUser}>Actualizar usuario  </button>
      </>



  );
}
