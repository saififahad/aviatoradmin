// UserDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Fade } from "react-reveal";
import { FiUsers, FiUserX } from "react-icons/fi";
import { FaUserClock } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { BiMoneyWithdraw } from "react-icons/bi";
import { AiOutlineBell } from "react-icons/ai";
import "../Dashboard.css";
import useSWR from "swr";
import UserWingoBet from "../UserDetails/UserWingoBet";
import UserBet from "../UserDetails/UserDeposit";
import UserAllBet from "../UserDetails/UserWithdraw";
import UserAviatorBet from "../UserDetails/UserAviatorBet";
import UserWithdraw from "../UserDetails/UserWithdraw";
import UserDeposit from "../UserDetails/UserDeposit";
import UserLevel from "../UserDetails/UserLevel";
// import Loader from "./UserSections/Loader";

const UserDetails = () => {
  const { email } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details based on email
    fetch(`/api/users?email=${email}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user details:", error));
  }, [email]);

  //   if (!user) {
  //     return <Loader />;
  //   }

  const iconComponents = {
    users: FiUsers,
    userX: FiUserX,
    userClock: FaUserClock,
    receiveMoney: GiReceiveMoney,
    moneyWithdraw: BiMoneyWithdraw,
    bell: AiOutlineBell,
  };

  const DashboardCard = ({
    title,
    count,
    todayCount,
    color,
    iconKey,
    extraText,
  }) => {
    const IconComponent = iconComponents[iconKey];
    const iconStyles = { fontSize: "35px" };

    return (
      <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div className="card widget-flat">
          <div className="card-body">
            <div className="float-end">
              <IconComponent
                color={color}
                style={iconStyles}
                className="mdi-account-multiple widget-icon"
              />
            </div>
            <h5
              className="text-muted fw-normal mt-0"
              title="Number of Customers"
            >
              {title}
            </h5>
            <h3 className="mt-3 mb-3">{count}</h3>
            <p className="mb-0 text-muted">
              {extraText && (
                <span className="text-success me-2">{extraText}</span>
              )}
              {todayCount && <span>{todayCount}</span>}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fade top distance="2%" duration={700}>
      <div className="page-wrapper">
        <div className="page-content-wrapper">
          <div className="page-content">
            <h1>User Details</h1>
            {/* <div className="row">
              <DashboardCard
                title="Total Users"
                //   count={user.totalUsers || 0}
                //   todayCount={user.todayUsers}
                color="red"
                iconKey="users"
              />
              <DashboardCard
                title="Total Users"
                //   count={user.totalUsers || 0}
                //   todayCount={user.todayUsers}
                color="red"
                iconKey="users"
              />
              <DashboardCard
                title="Total Users"
                //   count={user.totalUsers || 0}
                //   todayCount={user.todayUsers}
                color="red"
                iconKey="users"
              />
              <DashboardCard
                title="Total Users"
                //   count={user.totalUsers || 0}
                //   todayCount={user.todayUsers}
                color="red"
                iconKey="users"
              />
              <DashboardCard
                title="Total Users"
                //   count={user.totalUsers || 0}
                //   todayCount={user.todayUsers}
                color="red"
                iconKey="users"
              />
              <DashboardCard
                title="Total Users"
                //   count={user.totalUsers || 0}
                //   todayCount={user.todayUsers}
                color="red"
                iconKey="users"
              />
              <DashboardCard
                title="Total Users"
                //   count={user.totalUsers || 0}
                //   todayCount={user.todayUsers}
                color="red"
                iconKey="users"
              />
              <DashboardCard
                title="Total Users"
                //   count={user.totalUsers || 0}
                //   todayCount={user.todayUsers}
                color="red"
                iconKey="users"
              />
            </div> */}
          </div>

          {/* table of another bets */}
        </div>
        <UserWingoBet email={email} />
        <UserAviatorBet email={email} />
        <UserDeposit email={email} />
        <UserLevel email={email} />
      </div>
    </Fade>
  );
};

export default UserDetails;
