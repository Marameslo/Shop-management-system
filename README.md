# Shop Management System
The objective of the project is to create a shop management system that features a main screen for logging in, from which users can navigate to the registration page. Upon successful login, users are redirected to the laptops page, where they can create, edit, view, and delete laptops, as well as navigate to the orders page. On the orders page, users can create an order by selecting a laptop from the first page, change the order status, or delete it. The final page is used to update or delete profile information.

## 🛠 Technologies Used

### Database
* **MongoDB**
* **Mongoose**

### Backend
* **Node.js**
* **Express.js**

### Frontend
* **React.js**
* **Axios**
* **React Router**

---

## 🚀 Running the Application

### Using Docker CLI

```bash
# 1. Create a common network for containers
docker network create shop-network

# 2. Run the MongoDB container
docker run -d \
  --name Database \
  --network shop-network \
  -v mongo-data:/data/db \
  -p 27017:27017 \
  --health-cmd="mongosh --eval 1" \
  mongo:latest

# 3. Run the Backend Server container
docker run -d \
  --name server \
  --network shop-network \
  -p 8080:8080 \
  -e MONGO_URI=mongodb://Database:27017/magazyn \
  --health-cmd="node -e \"require('http').get('[http://127.0.0.1:8080/](http://127.0.0.1:8080/)', (res) => process.exit(0)).on('error', () => process.exit(1))\"" \
  --health-start-period=10s \
  --health-interval=15s \
  arturtrokhymenko-backend

# 4. Run the Frontend Client container
docker run -d \
  --name client \
  --network shop-network \
  -p 3000:3000 \
  --health-cmd="node -e \"require('http').get('[http://127.0.0.1:3000/](http://127.0.0.1:3000/)', (res) => process.exit(0)).on('error', () => process.exit(1))\"" \
  --health-start-period=10s \
  --health-interval=15s \
  arturtrokhymenko-frontend

# Build and start all containers simultaneously
docker-compose up --build

.
├── client/                  # Frontend application folder
│   └── src/
│       └── components/      # Files used to manage the frontend
│           ├── Routs/       # Folder that manages page access permissions
│           ├── Login/       # Each subfolder corresponds to a page of the same name
│           ├── Register/
│           ├── Laptops/
│           ├── Orders/
│           └── Profile/
│
├── server/                  # Backend application folder
│   ├── models/              # Contains the database table constructors (schemas)
│   └── routes/              # Contains the request handler functions
│
├── docker-compose.yml
└── README.md