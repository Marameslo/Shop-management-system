import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import styles from "./styles.module.css";

const Profile = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let userId = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userId = decoded._id;
        } catch (err) {
            console.error("Invalid token format");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const url = `http://localhost:8080/api/users/${userId}`;
                const { data: res } = await axios.get(url);
                setData({
                    firstName: res.firstName,
                    lastName: res.lastName,
                    email: res.email,
                });
            } catch (error) {
                setError("Could not fetch user data");
            }
        };

        if (userId) fetchUser();
    }, [userId]);

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
        setError("");
        setSuccess("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const url = `http://localhost:8080/api/users/${userId}`;
            await axios.put(url, data);
            setSuccess("Profile updated successfully!");
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong!");
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to completely delete your account? This action cannot be undone.")) {
            try {
                const url = `http://localhost:8080/api/users/${userId}`;
                await axios.delete(url);
                localStorage.removeItem("token");
                navigate("/login");
            } catch (error) {
                setError("Could not delete account.");
            }
        }
    };

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>Laptops Manager</h1>
                <div>
                    <button className={styles.white_btn} onClick={() => navigate("/orders")}>
                        Orders
                    </button>
                    <button className={styles.white_btn} onClick={() => navigate("/")}>
                        Laptops
                    </button>
                    <button className={styles.white_btn} onClick={handleLogout} style={{ marginRight: 0 }}>
                        Logout
                    </button>
                </div>
            </nav>
            <div style={{ padding: "20px", maxWidth: "600px", margin: "40px auto", backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Profile</h2>
                <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        onChange={handleChange}
                        value={data.firstName}
                        required
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        onChange={handleChange}
                        value={data.lastName}
                        required
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        required
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                        required
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />

                    {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
                    {success && <div style={{ color: "green", textAlign: "center" }}>{success}</div>}

                    <button type="submit" style={{ padding: "10px", backgroundColor: "#3bb19b", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                        Update Profile
                    </button>
                </form>

                <hr style={{ margin: "30px 0" }} />

                <div style={{ textAlign: "center" }}>
                    <button
                        onClick={handleDelete}
                        style={{ padding: "10px", backgroundColor: "#d63031", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;