import { useState, useEffect } from "react";
import "./Refer.css";
import { postData, fetchData } from "../../Api/Clientfunctions";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useSWR from "swr";

const Refer = () => {
  const [formData, setFormData] = useState({});
  const { data } = useSWR("/admin/getreferdetails", fetchData);

  useEffect(() => {
    if (data && data.data) {
      setFormData(data.data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData("/admin/setrefer", formData);
      if (res.status) {
        toast.success(res.message);
        Swal.fire("Success!", res.message, "success");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="wrapper" style={{ background: "#F2EDF3" }}>
      <div className="page-wrapper">
        <div className="page-content-wrapper">
          <div className="page-content">
            <div className="input-container">
              {/* <h2 className="Bank-headings">
                <i className="bx bxs-home"></i> Admin Setup
              </h2> */}
              <form onSubmit={handleSubmit}>
                {[
                  "parentCommission",
                  "childrenCommission",
                  // "notReferCommission",
                  "mwa",
                  "mda",
                  "usdt",
                  "nxbt",
                  "address",
                  "privatekey",
                  "level1",
                  "level2",
                  "level3",
                  "level4",
                  "level5",
                ].map((field) => (
                  <div key={field} className="Bank-lable">
                    <label>
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .toUpperCase()}
                      {field === "parentCommission" ||
                      field === "childrenCommission" ||
                      field === "level1" ||
                      field === "level2" ||
                      field === "level3" ||
                      field === "level4" ||
                      field === "level5"
                        ? " (%)"
                        : ""}
                      :
                    </label>
                    <input
                      type={
                        field.includes("Commission") ||
                        field === "usdt" ||
                        field === "nxbt" ||
                        field === "mwa"
                          ? "number"
                          : "text"
                      }
                      id={field}
                      name={field}
                      placeholder={`Enter ${field}`}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refer;
