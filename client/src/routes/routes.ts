import React, { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
// const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const Product = lazy(() => import("../pages/Product"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart"));
const Orders = lazy(() => import("../pages/Orders"));
const Checkout = lazy(() => import("../pages/Checkout"));
const ThankYou = lazy(() => import("../pages/Thankyou"));
const PaymentFailed = lazy(() => import("../pages/PaymentFailed"));

const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

interface RouteConfig {
  path: string;
  element: React.ComponentType;
  fullWidth?: boolean;
}

export const publicRoutes: RouteConfig[] = [
  { path: "/", element: Home, fullWidth: true },
  { path: "/products", element: Product },
  { path: "/products/:id", element: ProductDetails },
];

export const authRoutes: RouteConfig[] = [
  { path: "/login", element: Login },
  { path: "/register", element: Register },
];

export const protectedRoutes: RouteConfig[] = [
  // { path: "/admin-dashboard", element: AdminDashboard },
  { path: "/cart", element: Cart },
  { path: "/checkout", element: Checkout },
  { path: "/orders", element: Orders },
  { path: "thank-you", element: ThankYou },
  { path: "payment-failed", element: PaymentFailed },
];

export const notFoundRoute: RouteConfig = { path: "*", element: NotFound };
