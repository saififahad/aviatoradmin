import React, { useEffect, useState, useRef } from "react";
import "../Sidebar/Sidebar.css";
import "jspdf-autotable";
import { Fade } from "react-reveal";
import { formatDateString, formatTime } from "../../Api/Clientfunctions";

import useSWR from "swr";
import { fetchData } from "../../Api/Clientfunctions";
import { Loader } from "react-feather";

const UserDeposit = ({ email }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rechargeData, setRechargeData] = useState([]);

  const { data, error } = useSWR(
    `/admin/allsingleusertransaction?email=${email}&page=${currentPage}&limit=10`,
    fetchData
  );

  useEffect(() => {
    if (data && data.data && data.length) {
      setRechargeData(data.data);
      setTotalPages(Math.ceil(data.length / 10));
    }
  }, [data]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // const filteredData = rechargeData.filter((row) => {
  //   return Object.values(row).some((value) =>
  //     String(value).toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // });

  if (error) {
    console.error("Error fetching data:", error);
  }

  const paginatenormal = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= 1) {
      setCurrentPage(pageNumber);
    }
  };

  if (!data) return <Loader />;

  return (
    <>
      <Fade top distance="2%" duration={700}>
        <div className="wrapper">
          <div className="page-wrapper">
            <div className="page-content-wrapper">
              <div className="page-content">
                <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                  <div className="breadcrumb-title pe-3">
                    Transaction History
                  </div>
                </div>
                <div className="card">
                  <div className="cards-body">
                    <div
                      className="card-title"
                      style={{ justifyContent: "space-between" }}
                    >
                      <h4 className="mb-0">All Transaction</h4>
                    </div>

                    <hr />
                    <div className="table-responsive">
                      <div className="card">
                        <div className="cards-body">
                          <div className="withdraw-status">
                            <div className="card-title">
                              <h4 className="mb-0">Recharge History</h4>
                            </div>
                          </div>
                          <hr />
                          <div className="table-responsive">
                            <table
                              id="myTable"
                              className="table table-striped table-bordered"
                              style={{ width: "100%" }}
                            >
                              <thead>
                                <tr
                                  style={{
                                    fontFamily: "ubuntu-medium,sans-serif",
                                  }}
                                >
                                  <th>User ID</th>
                                  <th>User Name</th>
                                  <th>Email</th>
                                  <th>Phone no.</th>
                                  <th>Amount</th>
                                  <th>CUR</th>
                                  <th>TOKEN</th>
                                  <th>Time</th>
                                  <th>Created At</th>
                                  <th>Transaction Type</th>

                                  <th>Sender</th>
                                </tr>
                              </thead>
                              <tbody
                                style={{
                                  fontFamily: "ubuntu-medium,sans-serif",
                                }}
                              >
                                {rechargeData?.map((row, index) => (
                                  <tr key={index}>
                                    <td>{row.id}</td>
                                    <td>{row.name_user}</td>
                                    <td>{row.email}</td>
                                    <td>{row.phone}</td>
                                    <td>{row.points}</td>
                                    <td>{row.cur}</td>
                                    <td>{row.token}</td>
                                    <td>{formatTime(row?.date)}</td>

                                    <td>{formatDateString(row?.date)}</td>
                                    <td>
                                      {row.type === "w"
                                        ? "Debit"
                                        : row.type === "d"
                                        ? "Credit"
                                        : "Bonus"}
                                    </td>
                                    <td>{row.sender}</td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot></tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="paginations">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="bx bx-chevron-left"></i>
                        Previous
                      </button>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#333",
                          marginTop: "10px",
                        }}
                      >
                        {currentPage} of {totalPages}
                      </div>

                      <button onClick={() => paginate(currentPage + 1)}>
                        Next
                        <i className="bx bx-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="overlay toggle-btn-mobile" />
          <a href="#" className="back-to-top">
            <i className="bx bxs-up-arrow-alt" />
          </a>
        </div>
      </Fade>
    </>
  );
};

export default UserDeposit;
