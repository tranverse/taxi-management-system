# Taxi Management System / Hệ thống quản lý taxi

This repository contains a full-stack Taxi Management System that simulates a technology-based taxi company. It supports Admin, Driver, and Customer roles and manages drivers, vehicles, trips, pricing, ratings, and loyalty points.

Mô tả: Đây là dự án full-stack mô phỏng một công ty taxi công nghệ, hỗ trợ các vai trò Admin, Driver và Customer, quản lý tài xế, phương tiện, chuyến đi, giá cước, đánh giá và điểm khách hàng thân thiết.

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

## 🛠️ Tech Stack

Frontend:
- React, React Router
- Axios
- Ant Design / Tailwind CSS
- Map API (simulated)

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

2. Backend configuration

Open `backend/src/main/resources/application.properties` and update your MySQL connection:

```
spring.datasource.url=jdbc:mysql://localhost:3306/taxi_management_db
spring.datasource.username=your-username
spring.datasource.password=your-password
server.port=8080
```

Replace `your-username` and `your-password` with your MySQL credentials.

3. Start the backend

```
cd backend
./mvnw spring-boot:run
```

The backend will run at: http://localhost:8080

4. Start the frontend

```
cd frontend
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
