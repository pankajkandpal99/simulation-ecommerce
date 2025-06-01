/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  OrderService,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
} from "../../services/order.service";
import { IOrder } from "../../types/order";

interface OrderState {
  order: IOrder | null;
  orders: IOrder[];
  userOrders: IOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  orders: [],
  userOrders: [],
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "order/create",
  async (payload: CreateOrderPayload, { rejectWithValue }) => {
    try {
      return await OrderService.createOrder(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to create order");
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await OrderService.getOrders();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch orders");
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await OrderService.getUserOrders();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch user orders");
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchById",
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await OrderService.getOrderById(orderId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch order");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async (payload: UpdateOrderStatusPayload, { rejectWithValue }) => {
    try {
      return await OrderService.updateOrderStatus(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update order status");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await OrderService.cancelOrder(orderId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to cancel order");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.order = null;
    },
    resetOrderState: (state) => {
      state.order = null;
      state.orders = [];
      state.userOrders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        // state.userOrders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch all orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;

        // Update in orders array
        const orderIndex = state.orders.findIndex(
          (order: IOrder) => order._id === updatedOrder._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }

        // Update in userOrders array
        const userOrderIndex = state.userOrders.findIndex(
          (order: IOrder) => order._id === updatedOrder._id
        );
        if (userOrderIndex !== -1) {
          state.userOrders[userOrderIndex] = updatedOrder;
        }

        // Update current order if it matches
        if (state.order && state.order._id === updatedOrder._id) {
          state.order = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const cancelledOrder = action.payload;

        // Update in orders array
        const orderIndex = state.orders.findIndex(
          (order: IOrder) => order._id === cancelledOrder._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = cancelledOrder;
        }

        // Update in userOrders array
        const userOrderIndex = state.userOrders.findIndex(
          (order: IOrder) => order._id === cancelledOrder._id
        );
        if (userOrderIndex !== -1) {
          state.userOrders[userOrderIndex] = cancelledOrder;
        }

        // Update current order if it matches
        if (state.order && state.order._id === cancelledOrder._id) {
          state.order = cancelledOrder;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderError, clearCurrentOrder, resetOrderState } =
  orderSlice.actions;
export default orderSlice.reducer;
