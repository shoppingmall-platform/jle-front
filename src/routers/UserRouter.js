import React from 'react'

const UserMain = React.lazy(() => import("../pages/userPages/UserMain"));

export const userRouter = [
  { path: "", element: UserMain },
  
];

