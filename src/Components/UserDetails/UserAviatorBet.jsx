import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import "../Sidebar/Sidebar.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Fade } from "react-reveal";
import { fetchData, formatDateString } from "../../Api/Clientfunctions";
import { getMappedValue } from "../../Api/Clientfunctions";

const UserAviatorBet = ({ email }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState(1);
  const [finalData, setFinalData] = useState([]);
  const fetcher = (url) => fetchData(url).then((res) => res.data);

  const { data: betData, error } = useSWR(
    `/admin/allbetdata?email=${email}&page=${currentPage}&limit=10`,
    fetcher
  );

  useEffect(() => {
    if (betData && betData.data) {
      setFinalData(betData.data);
      setTotalPage(Math.ceil(betData.length / 10));
    }
  }, [betData]);
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <Fade top distance="2%" duration={700}>
        <div className="wrapper">
          <div className="page-wrapper">
            <div className="page-content-wrapper">
              <div className="page-content">
                <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                  <div className="breadcrumb-title pe-3">
                    Aviator Bet History
                  </div>
                </div>
                <div className="card">
                  <div className="cards-body">
                    <div
                      className="card-title"
                      style={{ justifyContent: "space-between" }}
                    >
                      <h4 className="mb-0">All Bet</h4>
                    </div>

                    <hr />
                    <div className="table-responsive">
                      <div className="card">
                        <div className="cards-body">
                          <div className="card-title">
                            <h4 className="mb-0">Aviator Bet </h4>
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
                                  <th> ID</th>
                                  <th>Phone no.</th>
                                  <th>Bet Amount</th>
                                  <th>Bet Time</th>
                                  <th> Withdraw Amount</th>
                                  <th>multiplier</th>
                                  <th>Withdraw Time</th>
                                </tr>
                              </thead>
                              <tbody
                                style={{
                                  fontFamily: "ubuntu-medium,sans-serif",
                                }}
                              >
                                {finalData.map((row, index) => (
                                  <tr key={index}>
                                    <td>{row.id}</td>
                                    <td>{row.phone}</td>
                                    <td>{row.betAmount}</td>
                                    <td>{formatDateString(row.betTime)}</td>
                                    <td>{row.withdrawAmount}</td>
                                    <td>{row.multiplier}</td>
                                    <td>
                                      {formatDateString(row.withdrawTime)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot></tfoot>
                            </table>
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
            {/*end page-content-wrapper*/}
          </div>
          {/*end page-wrapper*/}
          {/*start overlay*/}
          <div className="overlay toggle-btn-mobile" />
          {/*end overlay*/}
          {/*Start Back To Top Button*/}
          <a href="#" className="back-to-top">
            <i className="bx bxs-up-arrow-alt" />
          </a>
          {/*End Back To Top Button*/}
        </div>
      </Fade>
    </>
  );
};

export default UserAviatorBet;
