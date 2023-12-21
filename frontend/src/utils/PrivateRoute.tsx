import React from "react";
import { RouteProps } from "react-router-dom";
// import { Route, redirect } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  rest: RouteProps;
};

const PrivateRoute = ({ children, ...rest }: Props) => {
  const authenticated = false

  // return <Route {...rest}>{!authenticated ? redirect("/login") : children}</Route>;
};

export default PrivateRoute;
