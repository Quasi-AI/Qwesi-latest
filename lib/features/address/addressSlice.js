import { createSlice } from '@reduxjs/toolkit'

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [], // Remove dummy data
    },
    reducers: {
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
        setAddresses: (state, action) => {
            state.list = action.payload
        },
        updateAddress: (state, action) => {
            const index = state.list.findIndex(addr => addr.id === action.payload.id)
            if (index !== -1) {
                state.list[index] = action.payload
            }
        },
        deleteAddress: (state, action) => {
            state.list = state.list.filter(addr => addr.id !== action.payload)
        }
    }
})

export const { addAddress, setAddresses, updateAddress, deleteAddress } = addressSlice.actions

export default addressSlice.reducer
