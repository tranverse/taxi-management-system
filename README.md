# Taxi Management System

A full-stack taxi management system simulating a technology-based taxi company.  
The system supports **Admin, Driver, and Customer** roles and manages drivers, vehicles, trips, pricing, and ratings.

This project is developed as an academic project and demonstrates real-world business logic used in ride-hailing platforms.

---

## ✨ Features

### 👨‍💼 Admin Account
- View real-time locations of all vehicles on the map
- View a list of vehicles currently on trips with detailed information
- Simulate vehicle tracking during trips
- View detailed driver ratings based on evaluation criteria
- Manage fare pricing rules

---

### 🚖 Driver Account
- Accept or reject trip requests
- Pick up and drop off customers
- View detailed rating scores and evaluation criteria

---

### 👤 Customer Account
- Request a taxi
- View trip details and assigned driver information
- Rate completed trips
- Earn loyalty points based on trip fare

---

### ⚙️ System Capabilities
- Automatically find available drivers for customer requests
- Manage detailed ratings per trip and per driver
- Manage loyalty customers with accumulated reward points
- Fare calculation based on distance and pricing rules

---

## 🗂️ Managed Data

- **Driver Information**
  - Full name
  - Gender
  - Phone number
  - Vehicle information (license plate, model, seat capacity)
  - Overall rating and detailed ratings per criterion

- **Trip Information**
  - Customer name and phone number
  - Pickup location
  - Destination
  - Trip rating

- **Pricing Management**
  - Base fare
  - Distance-based pricing

- **Loyalty Customers**
  - Reward points accumulated from completed trips

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Axios
- Ant Design / Tailwind CSS
- Map API (simulated)

### Backend
- Spring Boot
- Spring Data JPA
- Spring Security (JWT)
- RESTful API

### Database
- MySQL

---

## 🚀 Getting Started

Follow the steps below to set up and run the Taxi Management System locally.

git clone https://github.com/your-username/taxi-management-system.git
cd taxi-management-system
3️⃣ Application Properties

The backend configuration is defined in the following file:

backend/src/main/resources/application.properties


Open this file and configure the MySQL database connection properties:

spring.datasource.url=jdbc:mysql://localhost:3306/taxi_management_db
spring.datasource.username=your-username
spring.datasource.password=your-password


Replace your-username and your-password with your MySQL database credentials.

(Optional) To change the backend server port, update the following line:

server.port=8080


Replace 8080 with the desired port number.

Save the application.properties file after updating the values.

4️⃣ Backend Setup

Navigate to the backend directory:

cd backend


Build and run the Spring Boot application:

./mvnw spring-boot:run


The backend server should now be running at:
👉 http://localhost:8080

5️⃣ Frontend Setup

Navigate to the frontend directory:

cd frontend


Install the dependencies:

npm install


Start the React development server:

npm start


The frontend application should now be running at:
👉 http://localhost:3000

6️⃣ Access the Application

Open your web browser and visit:
👉 http://localhost:3000

Make sure both frontend and backend servers are running at the same time.

## 📦 Prerequisites

Make sure you have installed:
- Node.js >= 18
- npm
- Java 17 or higher
- Maven
- MySQL

Check versions:
```bash
node -v
npm -v
java -version
mvn -v
