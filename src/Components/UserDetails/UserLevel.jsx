import React, { useState } from "react";
import useSWR from "swr";
import "./UserLevel.css"; // Update path if necessary
import { fetchData } from "../../Api/Clientfunctions"; // Update path if necessary
import { Link } from "react-router-dom";

const UserLevel = ({ email }) => {
  const { data, error } = useSWR(
    `/admin/adminmlmtree?email=${email}`,
    fetchData
  );
  const [currentPage, setCurrentPage] = useState({
    level1: 1,
    level2: 1,
    level3: 1,
    level4: 1,
    level5: 1,
  });
  const itemsPerPage = 5;

  const handleNextPage = (level) => {
    setCurrentPage((prev) => ({
      ...prev,
      [level]: prev[level] + 1,
    }));
  };

  const handlePrevPage = (level) => {
    setCurrentPage((prev) => ({
      ...prev,
      [level]: prev[level] - 1,
    }));
  };

  const totalMembers = (level) => data?.data?.[level]?.length ?? 0;
  const earningData = data?.data?.user;

  const paginateData = (level) => {
    const startIndex = (currentPage[level] - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data?.data?.[level]?.slice(startIndex, endIndex);
  };

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="wrapper">
      <div className="page-wrapper">
        <div className="page-content-wrapper">
          <div className="page-content">
            <div className="current-bal">
              <div className="current-bal-child">
                <h1>Parent UserName</h1>
                <span className="points">
                  {data?.data?.parentUser?.name_user}
                </span>
              </div>
              <div className="current-bal-child">
                <h1>Parent Email</h1>
                <span className="points">{data?.data?.parentUser?.email}</span>
              </div>
              <div className="current-bal-child">
                <h1>Parent Phone</h1>
                <p className="points">{data?.data?.parentUser?.phone}</p>
              </div>
            </div>
            <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
              <div className="breadcrumb-title pe-3">User Level Details</div>
            </div>
            <div className="data-table-level">
              {["level1", "level2", "level3", "level4", "level5"].map(
                (level) => (
                  <div key={level} className="table-part-level">
                    <div>
                      <h2 className="level-heading">{level.toUpperCase()}</h2>
                      <div>Earning: {earningData[level]}</div>
                      <div>Total Members: {totalMembers(level)}</div>
                    </div>
                    <table className="user-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Parent Username</th>
                          <th>Parent Email</th>
                          <th>Parent Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateData(level)?.map((item) => (
                          <tr key={item?.user?.id}>
                            <td>{item?.user?.name_user}</td>
                            <td>
                              <Link to={`/user/${item?.user?.email}`}>
                                {item?.user?.email}
                              </Link>
                            </td>
                            <td>{item?.user?.phone}</td>
                            <td>{item?.parent?.name_user}</td>
                            <td>
                              <Link to={`/user/${item?.parent?.email}`}>
                                {item?.parent?.email}
                              </Link>
                            </td>

                            <td>{item?.parent?.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {totalMembers(level) > itemsPerPage && (
                      <div className="pagination-controls">
                        <button
                          className="page-btn"
                          onClick={() => handlePrevPage(level)}
                          disabled={currentPage[level] === 1}
                        >
                          Previous
                        </button>
                        <span className="current-page">
                          {currentPage[level]}
                        </span>
                        <button
                          onClick={() => handleNextPage(level)}
                          className="page-btn"
                          disabled={
                            currentPage[level] * itemsPerPage >=
                            totalMembers(level)
                          }
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLevel;
