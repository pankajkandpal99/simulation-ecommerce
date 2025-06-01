import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IProduct } from "../../sections/Home/ProductCard";
import { ProductService } from "../../services/product.service";

interface ProductsState {
  products: IProduct[];
  featuredProducts: IProduct[];
  loading: boolean;
  error: string | null;
  currentProduct: IProduct | null;
  searchResults: IProduct[];
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  loading: false,
  error: null,
  currentProduct: null,
  searchResults: [],
};

export const fetchAllProducts = createAsyncThunk<IProduct[]>(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await ProductService.getAllProducts();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk<IProduct, string>(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await ProductService.getProductById(id);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch product");
    }
  }
);

export const searchProducts = createAsyncThunk<IProduct[], string>(
  "products/search",
  async (query, { rejectWithValue }) => {
    try {
      return await ProductService.searchProducts(query);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Search failed");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        // Set first 3 as featured if no featured products are set
        if (state.featuredProducts.length === 0) {
          state.featuredProducts = action.payload.slice(0, 3);
        }
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearCurrentProduct,
  clearSearchResults,
  clearError,
  setFeaturedProducts,
} = productsSlice.actions;
export default productsSlice.reducer;
