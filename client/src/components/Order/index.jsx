import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [laptops, setLaptops] = useState([]); 
  const [error, setError] = useState("");


  const [formData, setFormData] = useState({
    customerName: "",
    customerSurname: "",
    customerEmail: "",
    laptop: "",
    quantity: 1,
    status: "Pending"
  });

  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const ordersUrl = "http://localhost:8080/api/orders";
  const laptopsUrl = "http://localhost:8080/api/laptops";

  const fetchData = async () => {
    try {
      const [ordersRes, laptopsRes] = await Promise.all([
        axios.get(ordersUrl),
        axios.get(laptopsUrl)
      ]);
      setOrders(ordersRes.data);
      setLaptops(laptopsRes.data);
    } catch (error) {
      setError("Could not fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    setFormData({ ...formData, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${ordersUrl}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(ordersUrl, formData);
      }

      setFormData({ customerName: "", customerSurname: "", customerEmail: "", laptop: "", quantity: 1, status: "Pending" });
      fetchData();
    } catch (error) {
      setError("Could not save order data");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`${ordersUrl}/${id}`);
        fetchData();
      } catch (error) {
        setError("Could not delete order");
      }
    }
  };

  const handleEditClick = (order) => {
    setFormData({
      customerName: order.customerName,
      customerSurname: order.customerSurname,
      customerEmail: order.customerEmail,
      laptop: order.laptop ? order.laptop._id : "",
      quantity: order.quantity,
      status: order.status
    });
    setEditingId(order._id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

 return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>Orders Manager</h1>
        <div>
          <button className={styles.white_btn} onClick={() => navigate("/")}>
            Laptops
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
          <h3>{editingId ? "Update Order Data" : "Add Order"}</h3>
          <form onSubmit={handleSubmit} className={styles.form_grid}>
            <input className={styles.input_field} type="text" name="customerName" placeholder="Imię" value={formData.customerName} onChange={handleChange} disabled={editingId !== null} required />
            <input className={styles.input_field} type="text" name="customerSurname" placeholder="Nazwisko" value={formData.customerSurname} onChange={handleChange} disabled={editingId !== null} required />
            <input className={styles.input_field} type="email" name="customerEmail" placeholder="Email" value={formData.customerEmail} onChange={handleChange} disabled={editingId !== null} required />
            
            <select className={styles.input_field} name="laptop" value={formData.laptop} onChange={handleChange} disabled={editingId !== null} required>
              <option value="" disabled>Wybierz laptop</option>
              {laptops.map((laptop) => (
                <option key={laptop._id} value={laptop._id}>
                  {laptop.producer} {laptop.model} ({laptop.price} PLN)
                </option>
              ))}
            </select>

            <input className={styles.input_field} type="number" name="quantity" placeholder="Ilość" value={formData.quantity} onChange={handleChange} min="1" max="100" disabled={editingId !== null} required />
            
            <select className={styles.input_field} name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>

            <div>
              <button type="submit" className={`${styles.btn} ${styles.submit_btn}`}>
                {editingId ? "Save Changes" : "Submit"}
              </button>
              {editingId && (
                <button type="button" className={`${styles.btn} ${styles.cancel_btn}`} onClick={() => { setEditingId(null); setFormData({ customerName: "", customerSurname: "", customerEmail: "", laptop: "", quantity: 1, status: "Pending" }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <h3>Lista Zamówień</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Klient</th>
              <th>Email</th>
              <th>Laptop</th>
              <th>Ilość</th>
              <th>Status</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.customerName} {order.customerSurname}</td>
                <td>{order.customerEmail}</td>
                <td>{order.laptop ? `${order.laptop.producer} ${order.laptop.model}` : "Laptop usunięty"}</td>
                <td>{order.quantity}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => handleEditClick(order)} className={`${styles.btn} ${styles.edit_btn}`}>Edytuj</button>
                  <button onClick={() => handleDelete(order._id)} className={`${styles.btn} ${styles.delete_btn}`}>Usuń</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>Brak danych</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
};
export default Orders;