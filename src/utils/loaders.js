import { redirect, Navigate } from "react-router-dom";

export const checkAuthLoader = (user, route) => {
  if (!user) {
    return redirect(route);
  }
  return user;
};
