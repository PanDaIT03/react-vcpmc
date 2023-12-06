import { createSlice } from "@reduxjs/toolkit"

import { IUser } from "~/types";
import { checkLoginAction, resetPasswordAction, updateUserAction } from "~/state/thunk/user/user";

interface InitType {
    currentUser: IUser
    loading: boolean
    status: "loggin successfully" | "loggin failed" | "updated" |
    "update failed" | ""
};

const initialState: InitType = {
    currentUser: {} as IUser,
    loading: false,
    status: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(checkLoginAction.pending, state => {
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
                            id: userId,
                            avatar: user.avatar,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            dateOfBirth: user.dateOfBirth,
                            email: user.email,
                            phoneNumber: user.phoneNumber,
                            userName: user.userName,
                            password: user.password,
                            rolesId: user.rolesId,
                            role: userRole?.role
                        };
                        state.status = "loggin successfully";
                        state.loading = false;
                    };
                };
            })
            .addCase(checkLoginAction.rejected, state => {
                state.status = "loggin failed";
                state.loading = false;
            })
            .addCase(resetPasswordAction.pending, state => {
                state.loading = true;
            })
            .addCase(resetPasswordAction.fulfilled, (state, action) => {
                if (action.payload !== undefined) {
                    state.currentUser = {
                        ...state.currentUser,
                        password: action.payload.password
                    };
                    state.status = "updated";
                    state.loading = false;
                };
            })
            .addCase(resetPasswordAction.rejected, state => {
                state.status = "update failed";
                state.loading = false;
            })
            .addCase(updateUserAction.pending, state => {
                state.loading = true;
            })
            .addCase(updateUserAction.fulfilled, (state, action) => {
                if (action.payload !== undefined) {
                    let { firstName, lastName, dateOfBirth, phoneNumber } = action.payload;

                    state.currentUser = {
                        ...state.currentUser,
                        firstName: firstName,
                        lastName: lastName,
                        dateOfBirth: dateOfBirth,
                        phoneNumber: phoneNumber
                    };
                    state.status = "updated";
                    state.loading = false;
                };
            })
            .addCase(updateUserAction.rejected, state => {
                state.status = "update failed";
                state.loading = true;
            })
            .addDefaultCase((state) => {
                return state;
            })
    }
});

export const { } = userSlice.actions;
export const userReducer = userSlice.reducer;