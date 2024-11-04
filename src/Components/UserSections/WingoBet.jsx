import React, { useEffect, useState } from "react";
import useSWR from "swr";
import "../Sidebar/Sidebar.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Fade } from "react-reveal";
import { fetchData, formatDateString } from "../../Api/Clientfunctions";
import { getMappedValue } from "../../Api/Clientfunctions";

const WingoBet = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState(1);
  const itemsPerPage = 10;

  const { data, error } = useSWR(
    `/wingo/allbets?page=${currentPage}&limit=${itemsPerPage}`,
    fetchData
  );

  useEffect(() => {
    if (data && data.curBets) {
      setTotalPage(Math.ceil(data.total / itemsPerPage));
    }
  }, [data]);

  if (error) {
    return <div>Error loading data...</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const filteredData = data.curBets.filter(
    (row) =>
      (row.id &&
        row.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.phone &&
        row.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.email &&
        row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.stage &&
        row.stage.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.result &&
        row.result
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (row.betAmount &&
        row.betAmount
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (row.fee &&
        row.fee.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.get &&
        row.get.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.game && row.game.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.bet && row.bet.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.status &&
        row.status
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (row.time &&
        formatDateString(row.time)
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const dateFilterData = filteredData.filter((item) => {
    if (!startDate || !endDate) {
      return true;
    }
    const betTime = new Date(item.time);
    return betTime >= startDate && betTime <= endDate;
  });

  const finalData = dateFilterData.length ? dateFilterData : filteredData;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: "#myTable" });
    doc.save("table_data.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  const copyTable = () => {
    const range = document.createRange();
    range.selectNode(document.getElementById("myTable"));
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  };

  const downloadTableAsCSV = () => {
    const table = document.getElementById("myTable");

    if (!table) {
      console.error("Table not found");
      return;
    }

    const rows = table.querySelectorAll("tr");
    const csvData = [];

    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("td, th");

      cells.forEach((cell) => {
        rowData.push(cell.innerText);
      });

      csvData.push(rowData.join(","));
    });

    const csvContent = csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "table_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Win";
      case 2:
        return "Lose";
      default:
        return "";
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
                  <div className="breadcrumb-title pe-3">Wingo Bet History</div>
                </div>
                <div className="card">
                  <div className="cards-body">
                    <div
                      className="card-title"
                      style={{ justifyContent: "space-between" }}
                    >
                      <h4 className="mb-0">All Bet</h4>
                    </div>
                    <div
                      className="search-and-button d-flex mt-4"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div className="buttons">
                        <button onClick={copyTable}>Copy</button>
                        <button onClick={downloadTableAsCSV}>CSV</button>
                        <button onClick={generatePDF}>PDF</button>
                        <button onClick={handlePrint}>Print</button>
                      </div>
                      <div>
                        Search:-
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="table-responsive">
                      <div className="card">
                        <div className="cards-body">
                          <div className="card-title">
                            <h4 className="mb-0">Wingo Bet</h4>
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
                                  <th>ID</th>
                                  <th>Name</th>
                                  <th>Phone</th>
                                  <th>Email</th>
                                  <th>Period</th>
                                  <th>Result</th>
                                  <th>Bet Amount</th>
                                  <th>Fee</th>
                                  <th>Get</th>
                                  <th>Game</th>
                                  <th>Bet</th>
                                  <th>Status</th>
                                  <th>Time</th>
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
                                    <td>{row.name}</td>
                                    <td>{row.phone}</td>
                                    <td>{row.email}</td>
                                    <td>{row.stage}</td>
                                    <td>{row.result}</td>
                                    <td>{row.betAmount}</td>
                                    <td>{row.fee}</td>
                                    <td>{row.get}</td>
                                    <td>{row.game}</td>
                                    <td>{getMappedValue(row.bet)}</td>
                                    <td>{getStatusText(row.status)}</td>
                                    <td>{formatDateString(row.time)}</td>
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

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <i className="bx bx-chevron-right"></i>
                        </button>
                      </div>
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

export default WingoBet;
