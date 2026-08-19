import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: ""
  });

  // Lấy danh sách sinh viên ban đầu
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý thay đổi dữ liệu trong ô input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Câu 49: Xử lý sự kiện gửi Form (HTTP POST)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Chặn hành vi tải lại trang mặc định của form

    try {
      // Gửi HTTP POST request kèm body dữ liệu
      const response = await axios.post(API_URL, formData);

      if (response.status === 201 || response.status === 200) {
        alert("Thêm sinh viên thành công!");
        
        // Reset form về rỗng
        setFormData({ studentId: "", name: "", email: "" });

        // Tải lại danh sách sinh viên mới nhất
        fetchStudents();
      }
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error);
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h2>Quản lý Sinh viên</h2>

      {/* Form nhập liệu */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="studentId"
          placeholder="MSSV"
          value={formData.studentId}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Thêm sinh viên
        </button>
      </form>

      {/* Danh sách hiển thị */}
      <h3>Danh sách sinh viên</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", textAlign: "left" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>MSSV</th>
            <th>Họ và tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;