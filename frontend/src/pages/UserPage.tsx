import React from "react";
import { useAppSelector } from "../hooks/redux";

type Props = {};

const UserPage = (props: Props) => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div>
      <div>{user.email}</div>
    </div>
  );
};

export default UserPage;
