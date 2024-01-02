import { createAsyncThunk } from "@reduxjs/toolkit";
import { addRoleAPI, deleteRoleAPI, getListRole, getRoles, updateRoleById } from "~/api/role";
import { Role } from "~/types";

export const getRoleAction = createAsyncThunk(
    'role/getRole',
    async (_, thunkAPI) => {
        return await getRoles();
    }
);

export const getRoleList = createAsyncThunk(
    'role/getRoleList',
    async () => {
        return await getListRole();
    }
);

export const updateRole = createAsyncThunk(
    'role/updateRole',
    async ({ role, navigate }: { role: Role, navigate: () => void }) => {
        await updateRoleById(role);
        navigate();
    }
);

export const addRole = createAsyncThunk(
    'role/addRole',
    async ({ role, navigate }: { role: Omit<Role, 'docId'>, navigate: () => void }, thunkAPI) => {
        await addRoleAPI(role);
        thunkAPI.dispatch(getRoleList());

        navigate();
    }
);

export const deleteRole = createAsyncThunk(
    'role/deleteRole',
    async (id: string, thunkAPI) => {
        await deleteRoleAPI(id);
        thunkAPI.dispatch(getRoleList());
    }
);