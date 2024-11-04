// Dashboard.js
import React, { useEffect, useState } from "react";
import { Fade } from "react-reveal";
import "./Dashboard.css";
import useSWR from "swr";
import { fetchData } from "../Api/Clientfunctions";
import { useLocation } from "react-router-dom";
import { FiUsers, FiUserX } from "react-icons/fi";
import { FaUserClock } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { BiMoneyWithdraw } from "react-icons/bi";
import { AiOutlineBell } from "react-icons/ai";
import Loader from "./UserSections/Loader";
const Dashboard = () => {
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState({});

  const { data } = useSWR("/admin/dashboard", fetchData);
  useEffect(() => {
    if (data && data.data) {
      setDashboardData(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (location.pathname === "/") {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };
    }

    return () => {
      window.onpopstate = null;
    };
  }, [location]);

  if (!data) return <Loader />;
  return (
    <Fade top distance="2%" duration={700}>
      <div className="page-wrapper">
        <div className="page-content-wrapper">
          <div className="page-content">
            <div className="row">
              <DashboardCard
                title="Total Users"
                count={dashboardData.totalUsers || 0}
                todayCount={dashboardData.todayUsers}
                color="red"
                iconKey="users"
              />
              <DashboardCard
                title="Active Users"
                count={dashboardData.activeUsers || 0}
                extraText="Approved"
                color="#198754"
                iconKey="users"
              />
              <DashboardCard
                title="Rejected Users"
                count={dashboardData.rejectedUsers || 0}
                extraText="Rejected"
                color="#E15562"
                iconKey="userX"
              />
              <DashboardCard
                title="Total Aviator Bet Amount"
                count={dashboardData.totalBetAmount || 0}
                extraText="Total Bet Amount"
                color="#0D6EFD"
                iconKey="userClock"
              />
              <DashboardCard
                title="Total Wingo Bet Amount"
                count={dashboardData.totalWingoBetAmount || 0}
                extraText="Total Bet Amount"
                color="#0D6EFD"
                iconKey="userClock"
              />
              <DashboardCard
                title="Total Wingo Win Amount"
                count={dashboardData.totalWingoGetAmount || 0}
                extraText="Total Bet Amount"
                color="#0D6EFD"
                iconKey="userClock"
              />
              <DashboardCard
                title="Total Aviator Profit"
                count={dashboardData.totalProfit || 0}
                extraText="P/L"
                color="#0D6EFD"
                iconKey="userClock"
              />
              <DashboardCard
                title="Total Deposit"
                count={dashboardData.totalRechargeAmount || 0}
                todayCount={dashboardData.todayRechargeAmount}
                color="green"
                iconKey="receiveMoney"
              />
              <DashboardCard
                title="Total Withdraw"
                count={dashboardData.totalWithdrawAmount || 0}
                todayCount={dashboardData.todayWithdrawAmount}
                color="#A400ED"
                iconKey="moneyWithdraw"
              />
              <DashboardCard
                title="Total Aviator Bets"
                count={dashboardData.totalBets || 0}
                todayCount={dashboardData.todayBets}
                color="#03A9F4"
                iconKey="bell"
              />
              <DashboardCard
                title="Total Wingo Bets"
                count={dashboardData.totalWingoBet || 0}
                todayCount={dashboardData.todayWingoBet}
                color="#03A9F4"
                iconKey="bell"
              />
              <DashboardCard
                title="Total Wingo Profit"
                count={dashboardData.twpl || 0}
                extraText="P/L"
                color="#03A9F4"
                iconKey="bell"
              />
              {/* <DashboardCard
                title="Today Withdraw Requests"
                count={dashboardData.totalWithDrawRequest || 0}
                extraText="Requests"
                color="#67B08E"
                iconKey="bell"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Dashboard;

const iconStyles = { fontSize: "35px" }; // Common style for icons if needed

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
          <h5 className="text-muted fw-normal mt-0" title="Number of Customers">
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
