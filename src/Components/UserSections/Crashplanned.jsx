import React, { useEffect, useState } from "react";
import "../Sidebar/Sidebar.css";
import "./Crashplanned.css";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { fetchData, postData } from "../../Api/Clientfunctions";
import io from "socket.io-client";

import Swal from "sweetalert2";
import useSWR from "swr";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";
const Crashplanned = () => {
  const [ressoNumber, setRessoNumber] = useState("");
  const [isSwitchOn, setSwitchOn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const socket = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on("gameStarted", (value) => {
        setGameStarted(value);
      });
    }
  }, [socket]);
  console.log(gameStarted);
  const toggleSwitch = () => {
    setSwitchOn(!isSwitchOn);
  };
  const [lowerRange, setLowerRange] = useState("");
  const [singleMax, setSingleMax] = useState("");
  const [crashed, setCrashed] = useState();
  function socketHandler() {
    const time = Date.now();
    console.log(socket);
    if (socket) {
      console.log(time);
      socket.emit("crashedTime", time);
    }
  }

  const { data } = useSWR("/admin/getcrashed", fetchData);
  const { data: curbetdata } = useSWR("/admin/getcurrentbet", fetchData, {
    refreshInterval: 3000,
  });

  const [curbet, setCurBet] = useState({});
  useEffect(() => {
    if (curbetdata && curbetdata.data) {
      setCurBet(curbetdata.data);
    }
  }, [curbetdata]);
  useEffect(() => {
    if (data && data.data) {
      setCrashed(data.data);
    }
  }, [data]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nl = parseFloat(document.getElementById("validationCustom01").value);
    const nh = parseFloat(document.getElementById("validationCustom02").value);
    console.log(nl, nh);
    if (!isNaN(nl) && !isNaN(nh) && nl < nh && nl >= 1 && nh <= 10000) {
    } else {
      console.error(
        " Please ensure Lower Range is less than Upper Range and both are within the range of 1 to 10000."
      );
      toast.error(
        " Please ensure Lower Range is less than Upper Range and both are within the range of 1 to 10000."
      );
      return;
    }
    const res = await postData("/admin/crashed", { nl, nh });
    Swal.fire("wow!..", res.message, "success");
  };

  const handleSubmits = async (event) => {
    event.preventDefault();
    const sl = document.getElementById("validationCustom03").value;
    const sh = document.getElementById("validationCustom04").value;
    const sp = document.getElementById("validationCustom05").value;
    const sm = document.getElementById("validationCustom06").value;
    if (isNaN(sl) && isNaN(sh) && isNaN(sp) && isNaN(sm)) {
      toast.error("Values should be a number!.");
      return;
    }
    if (sl > sh || sl < 1 || sh > 10000 || sh < 1 || sl > 10000) {
      toast.error(
        "Please ensure Lower Range is less than Upper Range and both are within the range of 1 to 10000."
      );
      return;
    }
    if (sm < sl || sm > sh) {
      toast.error("Single Max should be between Lower Range and Upper Range.");
      return;
    }
    const probabilityNumbers = parseFloat(sp);
    if (
      !isNaN(probabilityNumbers) &&
      probabilityNumbers % 10 === 0 &&
      probabilityNumbers !== 0 &&
      probabilityNumbers <= 100
    ) {
    } else {
      toast.error(
        "Probability should be a multiple of 10 and between 10 to 100 ."
      );
      return;
    }
    const res = await postData("/admin/crashed", { sl, sm, sh, sp });
    Swal.fire("wow!..", res.message, "success");
  };

  const handaleSubmit = async (event) => {
    event.preventDefault();
    const RessoNumbers = parseFloat(ressoNumber);
    if (isSwitchOn) {
      if (
        !isNaN(RessoNumbers) &&
        RessoNumbers % 10 === 0 &&
        RessoNumbers !== 0 &&
        RessoNumbers <= 100
      ) {
      } else {
        toast.error(
          " Margin Ratio should be a multiple of 10 and between 10 to 100."
        );
        return;
      }
    }

    const ml = parseFloat(document.getElementById("validationCustom07").value);
    const mh = parseFloat(document.getElementById("validationCustom08").value);
    if (!isNaN(ml) && !isNaN(mh) && ml < mh && ml >= 1 && mh <= 10000) {
    } else {
      console.error(
        "  Please ensure Lower Range is less than Upper Range and both are within the range of 1 to 10000."
      );
      toast.error(
        "  Please ensure Lower Range is less than Upper Range and both are within the range of 1 to 10000."
      );
      return; // Exit the function if the condition is not met
    }

    // Get the value of the margin ratio
    const mr = parseFloat(document.getElementById("validationCustom09").value);

    // //console.log("Submit clicked. RessoNumber:", RessoNumbers);

    const da = parseFloat(document.getElementById("validationCustom10").value);

    // Check if the value is greater than 100
    if (!isNaN(da) && da >= 100) {
      toast.error("  Margin Amount should not be greater than 100.");
      return; // Stop further processing if the condition is not met
    }
    if (isSwitchOn) {
      const ressoNumbers = parseFloat(ressoNumber);
    }
    const res = await postData("/admin/crashed", { ml, mr, da, mh });
    if (res.status) {
      Swal.fire(res.message);
    } else {
      toast.error(res.message);
    }
  };
  const [iframeWidth, setIframeWidth] = useState("100%");

  useEffect(() => {
    const handleResize = () => {
      // Adjust the width based on the window size
      const newWidth = window.innerWidth < 1000 ? "100%" : "83%";
      setIframeWidth(newWidth);
    };

    // Set initial width
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [paddingTop, setPaddingTop] = useState("56.25%"); // Default padding-top value
  const [marginLeft, setMarginLeft] = useState("180px");
  const [width, setWidth] = useState("80%");
  useEffect(() => {
    const handleResize = () => {
      const newPaddingTop = window.innerWidth >= 600 ? "30%" : "100%";
      const newMarginLeft = window.innerWidth >= 600 ? "180px" : "0";
      const newWidth = window.innerWidth >= 600 ? "80%" : "100%";
      setWidth(newWidth);
      setMarginLeft(newMarginLeft);
      setPaddingTop(newPaddingTop);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call handleResize initially to set the correct padding-top
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: paddingTop,
          width: width,
          marginLeft: marginLeft,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <iframe
          src={process.env.REACT_APP_PLANE}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: iframeWidth,
            height: "100%",
            border: 0,
            overflow: "hidden",
          }}
          allowFullScreen={true}
          title="metablock"
        ></iframe>
      </div>
      <div className="page-wrapper">
        <div className="page-content-wrapper">
          <div className="page-content">
            <div className="Bank-heading">
              <SportsEsportsIcon
                sx={{ background: "#009688", color: "white" }}
              />
              <h2>Live Game</h2>
            </div>
            <div style={{ marginTop: "20px" }} className="row">
              <div className="col-12 col-lg-3">
                <div className="card radius-15">
                  <div className="cards-body">
                    <div className="d-flex align-items-center">
                      <div className>
                        <h4 className="mb-0 font-weight-bold">
                          {curbet?.totalmoney || 0}{" "}
                        </h4>
                        <p className="mb-0">Total Money</p>
                      </div>
                      <div className="widgets-icons bg-light-primary text-primary rounded-circle ms-auto">
                        <AttachMoneyIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="card radius-15">
                  <div className="cards-body">
                    <div className="d-flex align-items-center">
                      <div className>
                        <h4 className="mb-0 font-weight-bold">
                          {curbet?.totalwithdraw || 0}
                        </h4>
                        <p className="mb-0"> Withdraw Money</p>
                      </div>
                      <div className="widgets-icons bg-light-success text-success rounded-circle ms-auto">
                        <i className="bx bx-money-withdraw"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="card radius-15">
                  <div className="cards-body">
                    <div className="d-flex align-items-center">
                      <div className>
                        <h4 className="mb-0 font-weight-bold">
                          {curbet?.totalUsers || 0}
                        </h4>
                        <p className="mb-0">Total Users</p>
                      </div>
                      <div className="widgets-icons bg-light-danger text-danger rounded-circle ms-auto">
                        <PeopleIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="card radius-15">
                  <div className="cards-body">
                    <div className="d-flex align-items-center">
                      <div className>
                        <h4 className="mb-0 font-weight-bold">
                          {curbet?.totalWithdrawUsers || 0}
                        </h4>
                        <p style={{ fontSize: "14px" }} className="mb-0">
                          Total Withdraw Users
                        </p>
                      </div>
                      <div className="widgets-icons bg-light-info text-info rounded-circle ms-auto">
                        <PeopleIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="wrapper">
              <form
                className="row g-3 needs-validation"
                onSubmit={handleSubmit}
              >
                <p style={{ fontSize: "20px", fontFamily: "cursive" }}>
                  1. If No User is Playing
                </p>

                <div className="col-md-3">
                  <label htmlFor="validationCustom01" className="form-label">
                    Lower Range
                  </label>
                  <input
                    placeholder="Enter..."
                    type="text"
                    className="form-control"
                    id="validationCustom01"
                    required
                    min="1"
                    max="10000"
                    pattern="[1-9]\d{0,3}|10000"
                    onInvalid={(e) =>
                      toast.error("Please enter a number between 1 and 10000.")
                    }
                    defaultValue={crashed?.nl}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="validationCustom02" className="form-label">
                    Upper Range
                  </label>
                  <input
                    placeholder="Enter..."
                    type="number"
                    className="form-control"
                    id="validationCustom02"
                    required
                    min="1"
                    max="10001"
                    pattern="[1-9]\d{0,3}|10000"
                    onInvalid={(e) =>
                      toast.error("Please enter a number between 1 and 10000.")
                    }
                    // onInput={(e) => e.target.setCustomValidity('')}
                    defaultValue={crashed?.nh}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>
                {gameStarted && (
                  <div
                    className="col-md-2 cursor-pointer text-center crashnow-btn"
                    onClick={socketHandler}
                  >
                    <div className="custom-btn btn-4 text-center  ">
                      Crash Now
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                </div>
              </form>

              <form
                style={{ marginTop: "10px" }}
                className="row g-3 needs-validation"
                onSubmit={handleSubmits}
              >
                <p style={{ fontSize: "20px", fontFamily: "cursive" }}>
                  2. If (1, 2) User is Playing
                </p>

                <div className="col-md-3">
                  <label htmlFor="validationCustom03" className="form-label">
                    Lower Range
                  </label>
                  <input
                    placeholder="Enter..."
                    type="text"
                    className="form-control"
                    id="validationCustom03"
                    required
                    min="1"
                    max="10000"
                    pattern="[1-9]\d{0,3}|10000"
                    onInvalid={(e) =>
                      toast.error("Please enter a number between 1 and 10000.")
                    }
                    defaultValue={crashed?.sl}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="validationCustom04" className="form-label">
                    Upper Range
                  </label>
                  <input
                    placeholder="Enter..."
                    type="number"
                    className="form-control"
                    id="validationCustom04"
                    required
                    min="1"
                    max="10001"
                    pattern="[1-9]\d{0,3}|10000"
                    onInvalid={(e) =>
                      toast.error("Please enter a number between 1 and 10000.")
                    }
                    defaultValue={crashed?.sh}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="validationCustom05" className="form-label">
                    Probability
                  </label>
                  <input
                    placeholder="Enter..."
                    type="text"
                    className="form-control"
                    id="validationCustom05"
                    required
                    min="10"
                    max="100"
                    pattern="^(10|20|30|40|50|60|70|80|90|100)$"
                    onInvalid={(e) =>
                      toast.error(
                        "Please enter a number should be multiple of 10 and between 10 and 100."
                      )
                    }
                    defaultValue={crashed?.sp}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="validationCustom06" className="form-label">
                    Single Max
                  </label>
                  <input
                    placeholder="Enter..."
                    type="text"
                    className="form-control"
                    id="validationCustom06"
                    required
                    min="1"
                    max="10000"
                    pattern="^[1-9]\d*(\.\d+)?$"
                    onChange={(e) => setSingleMax(e.target.value)}
                    defaultValue={crashed?.sm}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-12">
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                </div>
              </form>

              <form
                style={{ marginTop: "10px" }}
                className="row g-3 needs-validation"
                onSubmit={handaleSubmit}
              >
                <p style={{ fontSize: "20px", fontFamily: "cursive" }}>
                  3. If more than 2 User is Playing
                </p>

                <div className="col-md-3">
                  <label htmlFor="validationCustom07" className="form-label">
                    Lower Range
                  </label>
                  <input
                    placeholder="Enter..."
                    type="text"
                    className="form-control"
                    id="validationCustom07"
                    required
                    min="1"
                    max="10000"
                    pattern="[1-9]\d{0,3}|10000"
                    onInvalid={(e) =>
                      toast.error("Please enter a number between 1 and 10000.")
                    }
                    defaultValue={crashed?.ml}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="validationCustom08" className="form-label">
                    Upper Range
                  </label>
                  <input
                    placeholder="Enter..."
                    type="number"
                    className="form-control"
                    id="validationCustom08"
                    required
                    min="1"
                    max="10001"
                    pattern="[1-9]\d{0,3}|10000"
                    onInvalid={(e) =>
                      toast.error("Please enter a number between 1 and 10000.")
                    }
                    // onInput={(e) => e.target.setCustomValidity('')}
                    defaultValue={crashed?.mh}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="validationCustom09" className="form-label">
                    Margin Ratio
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexDirection: "column",
                      position: "relative",
                    }}
                  >
                    <input
                      placeholder="Enter..."
                      type="text"
                      className="form-control"
                      id="validationCustom09"
                      min="10"
                      max="100"
                      value={ressoNumber}
                      pattern="^(10|20|30|40|50|60|70|80|90|100)$"
                      onInvalid={(e) =>
                        e.target.setCustomValidity(
                          "Please enter a number should be a multiple of 10 and between 10 to 100 ."
                        )
                      }
                      onInput={(e) => e.target.setCustomValidity("")}
                      onChange={(e) => setRessoNumber(e.target.value)}
                      disabled={!isSwitchOn}
                      defaultValue={crashed?.mr}
                    />

                    {/* <CustomizedSwitches  onChange={handleSwitchChange}/>
                     */}

                    <div className="form-check form-switch lg-switch">
                      <input
                        onClick={toggleSwitch}
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="sound"
                      />
                      <label className="form-check-label" htmlFor="sound" />
                    </div>
                  </div>

                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="validationCustom03" className="form-label">
                    Margin Amount Percentage
                  </label>

                  <input
                    placeholder="Enter..."
                    type="text"
                    className="form-control"
                    id="validationCustom10"
                    required
                    min="1"
                    max="70"
                    pattern="^(70|[1-9][0-9]?)$"
                    onInvalid={(e) =>
                      toast.error("Please enter a number between 1 and 70.")
                    }
                    defaultValue={crashed?.da}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crashplanned;
