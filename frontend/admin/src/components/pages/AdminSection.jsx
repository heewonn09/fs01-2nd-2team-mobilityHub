import { User, Mail, Phone, Shield } from "lucide-react";
import "../style/AdminSection.css";
import { useEffect, useState } from "react";
import { getAdminList } from "../../api/repairAPI";

export default function AdminSection() {
  const [adminList, setAdminList] = useState([]);

  useEffect(() => {
    getAdminList()
      .then((res) => {
        setAdminList(res);
      })
      .catch((err) => console.error("관리자 정보조회 실패"));
  }, []);

  return (
    <div className="admin-wrapper">
      <div className="admin-box">
        <div className="admin-header">
          <h3>전체 관리자 목록</h3>
          <p>총 {adminList.length}명의 관리자</p>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>관리자 ID</th>
                <th>이름</th>
                <th>관리 구역</th>
                <th>연락처</th>
                <th>이메일</th>
              </tr>
            </thead>

            <tbody>
              {adminList.map((admin) => (
                <tr
                  key={admin.adminId}
                  className={admin.isCurrentUser ? "highlight-row" : ""}
                >
                  <td>
                    <div className="id-cell">
                      {admin.isCurrentUser && (
                        <Shield className="icon-shield" />
                      )}
                      {admin.adminId}
                    </div>
                  </td>

                  <td>
                    <div className="name-cell">
                      <div
                        className={`avatar ${
                          admin.isCurrentUser ? "main" : ""
                        }`}
                      >
                        <User className="avatar-icon" />
                      </div>
                      {admin.adminName}
                    </div>
                  </td>

                  <td>
                    <span>
                      {{
                        P: "주차 관리자",
                        R: "정비 관리자",
                        W: "세차 관리자",
                        T: "최고 관리자",
                      }[admin.adminId?.[0]] ?? "알 수 없음"}
                    </span>
                  </td>

                  <td>
                    <div className="info-cell">
                      <Phone className="info-icon" />
                      {admin.phone}
                    </div>
                  </td>

                  <td>
                    <div className="info-cell">
                      <Mail className="info-icon" />
                      {admin.email}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
