import React, { useState } from "react";
import "./changepassword.css";
import { toast } from "react-toastify";
import { postData } from "../../Api/Clientfunctions";
import { useNavigate } from "react-router-dom";
const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Confirm password should be match to new Password");
    }
    const res = await postData("/admin/changepassword", formData);
    if (res.status) {
      toast.success("Password changed successfully!...");
      localStorage.removeItem("admin");
      navigate("/Login");
    } else {
      toast.error(res.message ? res.message : "Please enter valid input...");
    }
  };

  return (
    <div className="body">
      <div className="login-box">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="text"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
            <label>Old Password</label>
          </div>
          <div className="user-box">
            <input
              type="text"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <label>New Password</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label>Confirm Password</label>
          </div>
          <a onClick={(event) => handleSubmit(event)} type="submit" href="#">
            <span />
            <span />
            <span />
            <span />
            Submit
          </a>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
