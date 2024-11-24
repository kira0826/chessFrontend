import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {

    roles: string[];
    username: string;
    name: string;
    lastName: string;
    email: string;
    Id: number; 
    elo: number;

}

const initialState: UserState = {

    roles: [],
    username: "",
    name: "",
    lastName: "",
    email: "",
    Id: 0,
    elo: 0

}

export const SET_USER = 'user/setUser';
export const UPDATE_USER = 'user/updateUser';
export const CLEAR_USER = 'user/clearUser';

interface SetUserAction {

    type: typeof SET_USER;
    payload: UserState;

}

interface UpdateUserAction {

    type: typeof UPDATE_USER;
    payload: Partial<UserState>;

}

interface ClearUserAction {

    typr: typeof CLEAR_USER;

}

export type UserActionTypes = SetUserAction | UpdateUserAction | ClearUserAction;



const userSlice = createSlice({

    name: 'user',
    initialState,
    reducers:{

        setUser(state, action: PayloadAction<UserState> ) {

            const { roles, username, name, lastName, email, Id, elo } = action.payload;
            state.roles = roles;
            state.username = username;
            state.name = name;
            state.lastName = lastName;
            state.email = email;
            state.Id = Id;
            state.elo = elo;

        },
        updateUser(state, action:PayloadAction<UserState> ) {

            const { roles, username, name, lastName, email, Id, elo } = action.payload;
            if(roles) state.roles = roles;
            if(username) state.username = username;
            if(name) state.name = name;
            if(lastName) state.lastName = lastName;
            if(email) state.email = email;
            if(Id) state.Id = Id;
            if(elo) state.elo = elo;

        },
        clearUser(state) {

            state.roles = [];
            state.username = "";
            state.name = "";
            state.lastName = "";
            state.email = "";
            state.Id = 0;
            state.elo = 0;
        }
    }
})

export const {setUser, updateUser, clearUser} = userSlice.actions 

export default userSlice.reducer;