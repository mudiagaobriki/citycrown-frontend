import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_USER, IS_DEMO } from 'config.js';

const initialState = {
  amount: 0,
  totalDeposit: 0,
  method: "",
};

const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {
    setDepositAmount(state, action) {
      state.amount = action.payload;
    },
    setDepositMethod: (state, action) => {
      state.method = action.payload;
    },
    setTotalDeposit: (state, action) => {
      state.totalDeposit = action.payload;
    },
  },
});

export const { setDepositAmount, setDepositMethod, setTotalDeposit } = depositSlice.actions;

export const selectDepositAmount = (state) => state.deposit.amount;
export const selectDepositMethod = (state) => state.deposit.Method;
export const selectTotalDeposit = (state) => state.deposit.totalDeposit;

const depositReducer = depositSlice.reducer;

export default depositReducer;
