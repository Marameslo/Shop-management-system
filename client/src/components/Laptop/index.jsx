import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Laptop = () => {
  const [laptops, setLaptops] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    producer: "",
    model: "",
    price: "",
    ram: "",
    storage: "",
  });
  const [editingId, setEditingId] = useState(null);

  const url = "http://localhost:8080/api/laptops";

  const navigate = useNavigate();

  const fetchLaptops = async () => {
    try {
      const { data } = await axios.get(url);
      setLaptops(data);
    } catch (error) {
      setError("Could not fetch laptops data");
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleChange = ({ currentTarget: input }) => {
    setFormData({ ...formData, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${url}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(url, formData);
      }

      setFormData({ producer: "", model: "", price: "", ram: "", storage: "" });
      fetchLaptops();
    } catch (error) {
      setError("Could not save laptop data");
    }
  };

  const handleEditClick = (laptop) => {
    setEditingId(laptop._id);
    setFormData({
      producer: laptop.producer,
      model: laptop.model,
      price: laptop.price,
      ram: laptop.ram,
      storage: laptop.storage,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this laptop?")) {
      try {
        await axios.delete(`${url}/${id}`);
        fetchLaptops();
      } catch (error) {
        setError("Could not delete laptop data");
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
          <button className={styles.white_btn} onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button className={styles.white_btn} onClick={handleLogout} style={{ marginRight: 0 }}>
            Logout
          </button>
        </div>
      </nav>

      <div className={styles.content_container}>
        {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

        <div className={styles.form_wrapper}>
          <h3>{editingId ? "Update Laptop Data" : "Add Laptop"}</h3>
          <form onSubmit={handleSubmit} className={styles.form_grid}>
            <input className={styles.input_field} type="text" name="producer" placeholder="Producent" value={formData.producer} onChange={handleChange} required />
            <input className={styles.input_field} type="text" name="model" placeholder="Model" value={formData.model} onChange={handleChange} required />
            <input className={styles.input_field} type="number" name="price" placeholder="Cena (PLN)" value={formData.price} onChange={handleChange} min="1" required />
            <input className={styles.input_field} type="number" name="ram" placeholder="RAM (GB)" value={formData.ram} onChange={handleChange} min="1" required />
            <input className={styles.input_field} type="number" name="storage" placeholder="Storage (GB)" value={formData.storage} onChange={handleChange} min="1" required />
            
            <div>
              <button type="submit" className={`${styles.btn} ${styles.submit_btn}`}>
                {editingId ? "Save Changes" : "Submit"}
              </button>
              {editingId && (
                <button type="button" className={`${styles.btn} ${styles.cancel_btn}`} onClick={() => { setEditingId(null); setFormData({ producer: "", model: "", price: "", ram: "", storage: "" }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <h3>Lista laptopów</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producent</th>
              <th>Model</th>
              <th>Cena</th>
              <th>RAM</th>
              <th>Storage</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {laptops.map((laptop) => (
              <tr key={laptop._id}>
                <td>{laptop.producer}</td>
                <td>{laptop.model}</td>
                <td>{laptop.price} PLN</td>
                <td>{laptop.ram} GB</td>
                <td>{laptop.storage} GB</td>
                <td>
                  <button onClick={() => handleEditClick(laptop)} className={`${styles.btn} ${styles.edit_btn}`}>Edytuj</button>
                  <button onClick={() => handleDelete(laptop._id)} className={`${styles.btn} ${styles.delete_btn}`}>Usuń</button>
                </td>
              </tr>
            ))}
            {laptops.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>Brak danych</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default Laptop;