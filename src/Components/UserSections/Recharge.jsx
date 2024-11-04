import React, { useRef, useState, useEffect } from "react";
import "../Sidebar/Sidebar.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Fade } from "react-reveal";
import {
  formatDateString,
  formatStatusCode,
  formatTime,
  postData,
} from "../../Api/Clientfunctions";
import useSWR, { mutate } from "swr";
import { fetchData } from "../../Api/Clientfunctions";
import { toast } from "react-toastify";
import Screenshot from "./Screenshot";
import { Loader } from "react-feather";
const Recharge = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedFilters, setSelectedFilters] = useState("");
  const [rechargeData, setRechargeData] = useState([]);

  const { data, error } = useSWR(
    `/admin/getallrecharge?page=${currentPage}&limit=10`,
    fetchData
  );

  useEffect(() => {
    if (data && data.data && data.length) {
      setRechargeData(data.data);
      setTotalPages(Math.ceil(data.length / 10));
    }
  }, [data]);

  if (error) {
    console.error("Error fetching data:", error);
    toast.error("Error fetching data.");
  }

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const filteredData = rechargeData.filter((row) => {
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const [open, setOpen] = useState(1);
  // const { data: keyData } = useSWR("/admin/getgatewaykey", fetchData);
  // useEffect(() => {
  //   if (keyData && keyData.data) {
  //     setOpen(keyData.data.keyenable);
  //   }
  // }, [keyData]);

  const changeStatus = async (userId, status, amount, phone) => {
    try {
      const res = await postData(`/admin/acceptrecharge`, {
        id: userId,
        status,
        amount,
        phone,
      });
      if (res.status) {
        toast.success("successfully updated!...");
        mutate(`/admin/getnormalrechargedetails?page=${currentPage}&limit=10`);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const [reachargeData, setReachargeData] = useState([]);
  const [normalTotalPages, setNormalTotolPages] = useState(1);
  // const [normalRechargeData, setNormalRechargeData] = useState([]);
  // const { data: normalData } = useSWR(
  //   `/admin/getnormalrechargedetails?page=${currentPage}&limit=10`,
  //   fetchData // Use your custom fetcher function here
  // );

  // useEffect(() => {
  //   if (normalData && normalData.data && normalData.length) {
  //     setNormalRechargeData(normalData.data);
  //     setNormalTotolPages(Math.ceil(normalData.length / 10));
  //   }
  // }, [normalData]);
  useEffect(() => {
    if (data && data.data && data.length) {
      setReachargeData(data.data);
      setTotalPages(Math.ceil(data.length / 10));
    }
  }, [data]);
  if (error) {
    console.error("Error fetching data:", error);
  }

  const paginatenormal = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= normalTotalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: "#myTable" }); // Assuming your table has an id 'myTable'
    doc.save("table_data.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  const tableRef = useRef(null);

  const copyTable = () => {
    const range = document.createRange();
    range.selectNode(tableRef.current);
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    //   alert('Table copied to clipboard!');
  };

  const downloadTableAsCSV = () => {
    const table = document.getElementById("myTable"); // Assuming your table has an id 'myTable'

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
  if (!data) return <Loader />;

  return (
    <>
      {open && (
        <Fade top distance="2%" duration={700}>
          <div className="wrapper">
            <div className="page-wrapper">
              <div className="page-content-wrapper">
                <div className="page-content">
                  <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">
                      Recharge History
                    </div>
                  </div>
                  <div className="card">
                    <div className="cards-body">
                      <div
                        className="card-title"
                        style={{ justifyContent: "space-between" }}
                      >
                        <h4 className="mb-0">All Recharge</h4>
                      </div>
                      <div
                        className="search-and-button d-flex mt-4"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className="buttons">
                          <button onClick={copyTable}>Copy</button>
                          <button onClick={downloadTableAsCSV}>CSV</button>
                          <button onClick={downloadTableAsCSV}>Excel</button>
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
                            <div className="withdraw-status">
                              <div className="card-title">
                                <h4 className="mb-0">Recharge History</h4>
                              </div>
                              {/* <select
                                value={selectedFilters}
                                onChange={(e) =>
                                  setSelectedFilters(e.target.value)
                                }
                                style={{ borderRadius: "5px" }}
                                name=""
                                id=""
                              >
                                <option value="">Status</option>
                                <option value="1">Approved</option>
                                <option value="0">Pending</option>
                                <option value="2">Rejected</option>
                              </select> */}
                            </div>
                            <hr />
                            <div className="table-responsive">
                              <table
                                ref={tableRef}
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
                                    <th>Sender</th>
                                  </tr>
                                </thead>
                                <tbody
                                  style={{
                                    fontFamily: "ubuntu-medium,sans-serif",
                                  }}
                                >
                                  {filteredData.map((row, index) => (
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
      )}
    </>
  );
};

export default Recharge;
