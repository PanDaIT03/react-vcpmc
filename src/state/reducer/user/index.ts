import { createSlice } from "@reduxjs/toolkit";

import {
  addUserThunk,
  checkLoginAction,
  getUsers,
  resetPasswordAction,
  saveUser,
  updateUserAction,
} from "~/state/thunk/user/user";
import { IUser, User } from "~/types";

interface InitType {
  currentUser: IUser;
  newUser: IUser;
  loading: boolean;
  status:
    | "loggin successfully"
    | "loggin failed"
    | "user updated"
    | "update failed"
    | "user added"
    | "";
  users: Array<User>;
}

const initialState: InitType = {
  currentUser: {} as IUser,
  newUser: {} as IUser,
  loading: false,
  status: "",
  users: [] as Array<User>,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setInitialUser: (state) => {
      state.currentUser = {} as IUser;
      state.newUser = {} as IUser;
      state.status = "";
      state.users = [] as Array<User>;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkLoginAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkLoginAction.fulfilled, (state, action) => {
        if (action.payload !== null) {
          const { roles, user, userId } = action.payload;
          if (roles && user) {
            const userRole = roles.find((item) => {
              return item.docId === user.rolesId;
            });

            state.currentUser = {
              docId: userId,
              avatar: user.avatar,
              firstName: user.firstName,
              lastName: user.lastName,
              dateOfBirth: user.dateOfBirth,
              email: user.email,
              phoneNumber: user.phoneNumber,
              userName: user.userName,
              password: user.password,
              rolesId: user.rolesId,
              role: userRole?.role,
            };
          }
        }
        state.status = Object.keys(state.currentUser).length
          ? "loggin successfully"
          : "loggin failed";
        state.loading = false;
      })
      .addCase(checkLoginAction.rejected, (state) => {
        state.status = "loggin failed";
        state.loading = false;
      })
      .addCase(resetPasswordAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPasswordAction.fulfilled, (state, action) => {
        if (action.payload !== undefined) {
          state.currentUser = {
            ...state.currentUser,
            password: action.payload.password,
          };
          state.status = "user updated";
          state.loading = false;
        }
      })
      .addCase(resetPasswordAction.rejected, (state) => {
        state.status = "update failed";
        state.loading = false;
      })
      .addCase(updateUserAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserAction.fulfilled, (state, action) => {
        if (action.payload !== undefined) {
          let { firstName, lastName, dateOfBirth, phoneNumber } =
            action.payload;

          state.currentUser = {
            ...state.currentUser,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            phoneNumber: phoneNumber,
          };
          state.status = "user updated";
          state.loading = false;
        }
      })
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        console.log(new Error(`${action.error.name}: ${action.error.message}`));
      })
      .addCase(updateUserAction.rejected, (state) => {
        state.status = "update failed";
        state.loading = false;
      })
      .addCase(saveUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveUser.rejected, (state, action) => {
        state.loading = false;
        console.log(new Error(`${action.error.name}: ${action.error.message}`));
      })
      .addCase(addUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUserThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addUserThunk.rejected, (state, action) => {
        state.loading = false;
        console.log(new Error(`${action.error.name}: ${action.error.message}`));
      })
      .addDefaultCase((state) => {
        return state;
      });
  },
});

export const { setInitialUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
