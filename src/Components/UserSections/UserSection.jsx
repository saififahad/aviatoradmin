import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import DatePicker from "react-datepicker";
import { formatDateString } from "../../Api/Clientfunctions";
import "react-datepicker/dist/react-datepicker.css";
import "./UserDataSection.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../Sidebar/Sidebar.css";
import { Fade } from "react-reveal";
import { toast } from "react-toastify";
import {
  formatStatusCode,
  formatTimestamp,
  fetchData,
  postData,
} from "../../Api/Clientfunctions";
import useSWR from "swr";
import { mutate } from "swr";

const UserSection = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [allData, setAllData] = useState([]);
  const { data, error } = useSWR(
    `/admin/alluserdata?page=${currentPage}&limit=10`,
    fetchData
  );
  useEffect(() => {
    if (data && data.data && data.length && data.allData) {
      setUserData(data.data);
      setAllData(data.allData);
      setTotalPages(Math.ceil(data.length / 10));
    }
  }, [data]);
  const filteredData = allData.filter((row) => {
    const search = searchTerm.toLowerCase();

    // Define fields to search within
    const fieldsToSearch = [
      "id",
      "name",
      "phone",
      "name_user",
      "password",
      "money",
      "code",
      "invite",
      "email",
      "time",
      "gender",
      "status",
    ];

    // Check if any field contains the search term
    return fieldsToSearch.some(
      (field) =>
        typeof row[field] === "string" &&
        row[field].toLowerCase().includes(search)
    );
  });

  const handleEditWalletClick = (index) => {
    const updatedData = [...userData];
    updatedData[index].editable = true;
    setUserData(updatedData);
  };
  const handleEditWalletClick1 = (index) => {
    const updatedData = [...userData];
    updatedData[index].editable1 = true;
    setUserData(updatedData);
  };
  const handleWalletChange = (index, value) => {
    const updatedData = [...userData];
    updatedData[index].money = value;
  };
  const handleWalletChange1 = (index, value) => {
    const updatedData = [...userData];
    updatedData[index].deposit = value;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: "#myTable" });
    doc.save("table_data.pdf");
  };

  const handleSaveClick = async (index, phone, id) => {
    const updatedData = [...userData];
    updatedData[index].editable = false;
    const money = updatedData[index].money;
    const res = await postData("/admin/usersettings", {
      money,
      phone,
      id,
      deposit: undefined,
    });
    if (res.status) {
      toast.success("Data updated succesfully");
      mutate(`/admin/alluserdata?page=${currentPage}&limit=10`);
    } else {
      toast.error("Data Not updated");
    }
  };
  const handleSaveClick1 = async (index, phone, id) => {
    const updatedData = [...userData];
    updatedData[index].editable1 = false;
    const deposit = updatedData[index].deposit;
    const res = await postData("/admin/usersettings", {
      deposit,
      phone,
      id,
      money: undefined,
    });
    if (res.status) {
      toast.success("Data updated succesfully");
      mutate(`/admin/alluserdata?page=${currentPage}&limit=10`);
    } else {
      toast.error("Data Not updated");
    }
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
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (error) {
    console.error("Error fetching data:", error);
  }

  const changeStatus = async (userId, status, phone, money) => {
    try {
      const res = await postData("/admin/usersettings", {
        status,
        phone,
        id: userId,
      });
      if (res.status) {
        toast.success("Data updated succesfully");
        mutate(`/admin/alluserdata?page=${currentPage}&limit=10`);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const [selectedFilter, setSelectedFilter] = useState("");

  const selectFilterItems = userData.filter((item) => {
    const selectedFilterText = selectedFilter.toString().toLowerCase().trim();
    const isKycVerified = item?.status?.toString().toLowerCase()?.trim();
    if (selectedFilterText === "") {
      return true;
    }
    return isKycVerified.includes(selectedFilterText);
  });

  const dateFilterData = selectFilterItems
    ? selectFilterItems.filter((item) => {
        if (!startDate || !endDate) {
          return true;
        }
        return item.time >= startDate && item.time <= endDate;
      })
    : filteredData.filter((item) => {
        if (!startDate || !endDate) {
          return true;
        }
        return item.time >= startDate && item.time <= endDate;
      });

  const finalData = dateFilterData.length
    ? dateFilterData
    : selectedFilter || selectedFilter === "0"
    ? selectFilterItems
    : searchTerm.trim()
    ? filteredData
    : userData;

  return (
    <>
      <Fade top distance="2%" duration={700}>
        <div className="wrapper">
          <div className="page-wrapper">
            <div className="page-content-wrapper">
              <div className="page-content">
                <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                  <div className="breadcrumb-title pe-3">User Section</div>
                </div>
                <div className="card">
                  <div className="cards-body">
                    <div
                      className="card-title"
                      style={{ justifyContent: "space-between" }}
                    >
                      <h4 className="mb-0">All User</h4>
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
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="card-title">
                              <h4 className="mb-0">All User History</h4>
                            </div>
                            <select
                              value={selectedFilter}
                              onChange={(e) =>
                                setSelectedFilter(e.target.value)
                              }
                              style={{ borderRadius: "5px" }}
                              name=""
                              id=""
                            >
                              <option value="">Status</option>
                              <option value="1">Approved</option>
                              <option value="2">Rejected</option>
                            </select>
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
                                  <th>Phone no.</th>
                                  <th>Email</th>
                                  <th>User Name</th>
                                  <th>Code</th>
                                  <th>Status</th>
                                  <th>Time</th>
                                  <th>Earning Wallet</th>
                                  <th>Deposit Wallet</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody
                                style={{
                                  fontFamily: "ubuntu-regular,sans-serif",
                                }}
                              >
                                {finalData.map((row, index) => (
                                  <tr key={index}>
                                    <td>{row.phone}</td>
                                    <td>{row.email}</td>
                                    <td>
                                      <Link to={`/user/${row.email}`}>
                                        {row.name_user}
                                      </Link>
                                    </td>
                                    <td>{row.code}</td>
                                    <td>{formatStatusCode(row?.status)}</td>
                                    <td>{formatDateString(row.time)}</td>
                                    <td>
                                      {row.editable ? (
                                        <>
                                          <input
                                            style={{
                                              width: "100px",
                                              zIndex: "1",
                                            }}
                                            type="number"
                                            value={row.Wallet}
                                            onChange={(e) =>
                                              handleWalletChange(
                                                index,
                                                e.target.value
                                              )
                                            }
                                          />
                                          <i
                                            style={{
                                              color: "green",
                                              paddingLeft: "5px",
                                              fontSize: "20px",
                                              cursor: "pointer",
                                            }}
                                            className="bx bx-check"
                                            onClick={() =>
                                              handleSaveClick(
                                                index,
                                                row.phone,
                                                row.id
                                              )
                                            }
                                          />
                                        </>
                                      ) : (
                                        <>
                                          {row?.money}
                                          <i
                                            style={{
                                              color: "blue",
                                              cursor: "pointer",
                                              marginLeft: "5px",
                                            }}
                                            onClick={() =>
                                              handleEditWalletClick(index)
                                            }
                                            className="bx bx-edit-alt"
                                          ></i>
                                        </>
                                      )}
                                    </td>
                                    <td>
                                      {row.editable1 ? (
                                        <>
                                          <input
                                            style={{
                                              width: "100px",
                                              zIndex: "1",
                                            }}
                                            type="number"
                                            value={row.Wallet}
                                            onChange={(e) =>
                                              handleWalletChange1(
                                                index,
                                                e.target.value
                                              )
                                            }
                                          />
                                          <i
                                            style={{
                                              color: "green",
                                              paddingLeft: "5px",
                                              fontSize: "20px",
                                              cursor: "pointer",
                                            }}
                                            className="bx bx-check"
                                            onClick={() =>
                                              handleSaveClick1(
                                                index,
                                                row.phone,
                                                row.id
                                              )
                                            }
                                          />
                                        </>
                                      ) : (
                                        <>
                                          {row?.deposit}
                                          <i
                                            style={{
                                              color: "blue",
                                              cursor: "pointer",
                                              marginLeft: "5px",
                                            }}
                                            onClick={() =>
                                              handleEditWalletClick1(index)
                                            }
                                            className="bx bx-edit-alt"
                                          ></i>
                                        </>
                                      )}
                                    </td>
                                    <td>
                                      <abbr title="Rejected">
                                        <i
                                          onClick={() =>
                                            changeStatus(row.id, "2", row.phone)
                                          }
                                          style={{
                                            color: "red",
                                            paddingLeft: "5px",
                                            fontSize: "20px",
                                          }}
                                          className="bx bx-x"
                                        ></i>
                                      </abbr>
                                      <abbr title="Approved">
                                        <i
                                          onClick={() =>
                                            changeStatus(row.id, "1", row.phone)
                                          }
                                          style={{
                                            color: "green",
                                            paddingLeft: "5px",
                                            fontSize: "20px",
                                          }}
                                          className="bx bx-check"
                                        ></i>
                                      </abbr>
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

export default UserSection;
