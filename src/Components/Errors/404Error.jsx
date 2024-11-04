import React from "react";
import "./404Error.css";
import { useNavigate } from "react-router-dom";

const Errorfound = () => {
  const navigate = useNavigate();
  return (
    <div className="wrapper">
      <nav className="navbar navbar-expand-lg navbar-light   shadow-none border-bottom bg-white rounded fixed-top rounded-0 shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"></a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent1"
            aria-controls="navbarSupportedContent1"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            {" "}
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </nav>
      <div className="error-404 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="card radius-15 shadow-none">
            <div className="row g-0">
              <div className="col-lg-6">
                <div className="cards-body p-5">
                  <h1 className="display-1">
                    <span className="text-primary">4</span>
                    <span className="text-danger">0</span>
                    <span className="text-success">4</span>
                  </h1>
                  <h2 className="font-weight-bold display-4">Lost in Space</h2>
                  <p>
                    You have reached the edge of the universe.
                    <br />
                    The page you requested could not be found.
                    <br />
                    Dont'worry and return to the previous page.
                  </p>
                  <div className="mt-5">
                    <a
                      onClick={() => navigate("/Dashboard")}
                      className="btn btn-lg btn-primary px-md-5 radius-30"
                    >
                      Go Home
                    </a>
                    <a
                      href="javascript:;"
                      className="btn btn-lg btn-outline-dark ms-3 px-md-5 radius-30"
                    >
                      Back
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <img
                  src="assets/images/errors-images/404-error.png"
                  className="card-img"
                  alt
                />
              </div>
            </div>
            {/*end row*/}
          </div>
        </div>
      </div>
      <div className="bg-white p-3 fixed-bottom border-top">
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <ul className="list-inline mb-0">
            <li className="list-inline-item">Follow Us :</li>
            <li className="list-inline-item">
              <a
                href="https://www.linkedin.com/in/jayesh-vijay-41bb9022a/"
                target="_blank"
              >
                <i className="bx bxl-facebook me-1" />
                Linkedin
              </a>
            </li>
          </ul>
          <p className="mb-0">
            Integritygrove technology @2024 | Developed By :{" "}
            <a href="https://integritygrove.tech/" target="_blank">
              Jayesh Vijay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Errorfound;
