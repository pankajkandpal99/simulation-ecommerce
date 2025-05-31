import React, { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
// const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const Product = lazy(() => import("../pages/Product"));
const Cart = lazy(() => import("../pages/Cart"));
const Orders = lazy(() => import("../pages/Orders"));
const Checkout = lazy(() => import("../pages/Checkout"));

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
  { path: "/about", element: About },
  { path: "/cart", element: Cart },
  { path: "/products", element: Product },
  { path: "/checkout", element: Checkout },
];

export const authRoutes: RouteConfig[] = [
  { path: "/login", element: Login },
  { path: "/register", element: Register },
];

export const protectedRoutes: RouteConfig[] = [
  // { path: "/admin-dashboard", element: AdminDashboard },
  { path: "/orders", element: Orders },
];

export const notFoundRoute: RouteConfig = { path: "*", element: NotFound };
