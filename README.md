# Taxi Management System / Hệ thống quản lý taxi

This repository contains a full-stack Taxi Management System that simulates a technology-based taxi company. It supports Admin, Driver, and Customer roles and manages drivers, vehicles, trips, pricing, ratings, and loyalty points.

Mô tả: Đây là dự án full-stack mô phỏng một công ty taxi công nghệ, hỗ trợ các vai trò Admin, Tài xế và Khách hàng, quản lý tài xế, phương tiện, chuyến đi, giá cước, đánh giá và điểm khách hàng thân thiết.

---

## ✨ Features / Tính năng

- Role-based access: Admin, Driver, Customer (Phân quyền: Admin, Tài xế, Khách hàng)
- Real-time (simulated) vehicle location and trip tracking (Theo dõi vị trí phương tiện mô phỏng)
- Trip request, assignment, accept/reject flow (Yêu cầu chuyến, phân công, chấp nhận/từ chối)
- Fare calculation with configurable pricing rules (Tính cước theo quy tắc tùy chỉnh)
- Detailed driver ratings and per-trip evaluations (Đánh giá chi tiết tài xế theo chuyến)
- Loyalty points and rewards for customers (Điểm khách hàng thân thiết)

---

## 🗂️ Managed Data / Dữ liệu quản lý

- Driver information: name, gender, phone, vehicle (plate, model, seats), overall and per-criterion ratings
- Trip information: customer, pickup, destination, fare, status, rating
- Pricing: base fare, per-distance pricing rules
- Loyalty: accumulated reward points for customers

---

## 📸 Screenshots / Hình ảnh

![Admin Vehicle Tracking](https://res.cloudinary.com/dqobwpob4/image/upload/v1767899083/Screenshot_2026-01-09_020333_mzoxzc.png)  
*Admin interface showing the real-time locations of all vehicles on a map for efficient management.*  

![Customer Nearby Drivers](https://res.cloudinary.com/dqobwpob4/image/upload/v1767899293/Screenshot_2026-01-09_020741_yphbcz.png)  
*Customer interface displaying nearby drivers within a 5 km radius on the map, enabling users to easily find available rides around their location.*

![Customer Ride Booking](https://res.cloudinary.com/dqobwpob4/image/upload/v1767899537/Screenshot_2026-01-09_021147_drh1aa.png)  
*Customer ride booking interface showing pickup and destination details, estimated distance, fare calculation, and the ability to confirm a ride request.*

![Customer Trip Route](https://res.cloudinary.com/dqobwpob4/image/upload/v1767899708/Screenshot_2026-01-09_021428_stoetw.png)  
*Customer trip route interface displaying the real-time journey on the map, including pickup point, destination, and the current vehicle position during the ride.*

![Driver Profile and Performance](https://res.cloudinary.com/dqobwpob4/image/upload/v1767900108/Screenshot_2026-01-09_022120_n1a0uy.png)  
*Driver profile interface displaying personal information, average rating, and completed trip history, providing drivers with transparent performance insights and trip records.*

## 🛠️ Tech Stack

Frontend:
- React, React Router
- Axios
- Ant Design / Tailwind CSS
- MapBox

Backend:
- Spring Boot
- Spring Data JPA
- Spring Security (JWT)
- RESTful API

Database:
- MySQL

---

## 📦 Prerequisites / Yêu cầu trước

Make sure you have installed:
- Node.js >= 18 and npm
- Java 17+
- Maven
- MySQL

Check versions:
```
node -v
npm -v
java -version
mvn -v
```

---

## 🚀 Getting Started / Cách chạy dự án

1. Clone the repository

```
git clone https://github.com/tranverse/taxi-management-system.git
cd taxi-management-system
```

2. Backend Configuration

**Create a `.env` file** in the `backend/` folder (same level as `src/`).

**Add the necessary environment variables** to `.env` (keep values private, do not commit to Git):

```env
# MySQL
DATASOURCE_URL=
DATASOURCE_USERNAME=
DATASOURCE_PASSWORD=

# App
PORT=
```
Replace `your-username` and `your-password` with your MySQL credentials.

3. Start the backend

```
cd gis_be
./mvnw spring-boot:run
```

The backend will run at: http://localhost:8080

4. Start the frontend

```
cd gis_fe
npm install
npm start
```

The frontend will run at: http://localhost:3000

Make sure both backend and frontend are running.

---

## 🔧 Useful notes / Ghi chú hữu ích

- To change the backend port, update `server.port` in application.properties.
- If you need to initialize the database, check `backend/src/main/resources` for SQL or data seeding scripts (if any).
- Environment variables and secrets should be managed securely in a production environment.

---

## 🤝 Contributing

Contributions, bug reports, and pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📫 Contact

Project maintained by the repository owner. For questions, open an issue or contact the maintainer.

---

(EN/VN) Last updated: 2026-01-08
