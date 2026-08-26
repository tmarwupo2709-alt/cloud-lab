import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: ""
  });

  const fetchStudents = async () => {
    setLoading(true);
    setApiError("");

    try {
      const response = await axios.get(API_URL);

      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else if (
        response.data &&
        Array.isArray(response.data.students)
      ) {
        setStudents(response.data.students);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
      setApiError(
        error.message || "Không thể kết nối đến Backend"
      );
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Cập nhật sinh viên (PUT)
        await axios.put(`${API_URL}/${editingId}`, formData);
        alert("Cập nhật sinh viên thành công!");
        setEditingId(null);
      } else {
        // Thêm mới sinh viên (POST)
        const response = await axios.post(API_URL, formData);
        if (response.status === 201 || response.status === 200) {
          alert("Thêm sinh viên thành công!");
        }
      }

      setFormData({
        studentId: "",
        name: "",
        email: ""
      });

      fetchStudents();
    } catch (error) {
      console.error("Lỗi thao tác sinh viên:", error);

      alert(
        "Lỗi: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Chọn sinh viên để cập nhật
  const handleEdit = (sv) => {
    setEditingId(sv._id || sv.studentId);
    setFormData({
      studentId: sv.studentId,
      name: sv.name,
      email: sv.email
    });
  };

  // Xóa sinh viên (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("Xóa sinh viên thành công!");
        fetchStudents();
      } catch (error) {
        console.error("Lỗi khi xóa sinh viên:", error);
        alert(
          "Lỗi: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <h2>Quản lý Sinh viên</h2>

      {apiError && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            marginBottom: "15px",
            borderRadius: "4px"
          }}
        >
          <strong>Lỗi kết nối API Backend:</strong>{" "}
          {apiError}
          <br />
          Vui lòng kiểm tra Backend trên cổng 5000.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "20px" }}
      >
        <input
          type="text"
          name="studentId"
          placeholder="MSSV"
          value={formData.studentId}
          onChange={handleChange}
          required
          style={{
            marginRight: "10px",
            padding: "8px"
          }}
        />

        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            marginRight: "10px",
            padding: "8px"
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            marginRight: "10px",
            padding: "8px"
          }}
        />

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: editingId ? "#28a745" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ studentId: "", name: "", email: "" });
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Hủy
          </button>
        )}
      </form>

      <h3>
        Danh sách sinh viên{" "}
        {loading && <span>(Đang tải...)</span>}
      </h3>

      <table
        border="1"
        cellPadding="8"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          textAlign: "left"
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>MSSV</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(students) &&
          students.length > 0 ? (
            students.map((sv, index) => {
              const id = sv._id || sv.studentId || index;
              return (
                <tr key={id}>
                  <td>{sv.studentId || "N/A"}</td>
                  <td>{sv.name || "N/A"}</td>
                  <td>{sv.email || "N/A"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(sv)}
                      style={{
                        marginRight: "8px",
                        padding: "4px 8px",
                        backgroundColor: "#ffc107",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(sv._id || sv.studentId)}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="4"
                style={{ textAlign: "center" }}
              >
                {loading
                  ? "Đang tải dữ liệu..."
                  : "Chưa có dữ liệu sinh viên nào"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;