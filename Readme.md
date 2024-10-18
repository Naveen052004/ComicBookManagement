# ComicBookManagement

## Overview

This project is a Comic Book Inventory Management system that allows users to manage comic book listings. It features a backend built with Node.js and Express, using MongoDB with Mongoose for data storage, and a frontend developed with React.

## Features

- Add, update, and delete comic book entries
- View comic book inventory with pagination and filtering options
- Detailed view of each comic book
- User-friendly interface built with React

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **API Testing**: Postman

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (or a MongoDB Atlas account)
- npm (Node package manager)

### Clone the Repository

```bash
git clone https://github.com/Naveen052004/ComicBookManagement.git
cd ComicBookManagement
```
### Backend Setup

#### Navigate to the backend directory:
```bash
cd server
```
#### Install dependencies:
```bash
npm install
```
Start the backend server:
```bash
npm run devStart
```
### Frontend Setup
#### Navigate to the frontend directory:
```bash
cd ../client
```

#### Install dependencies:
```bash
npm install
```
#### Start the frontend application:
```bash
npm start
```
### Usage

- Access the backend API at http://localhost:5000/api/books
- Access the frontend application at http://localhost:3000

### Postman Collection
- A Postman collection for testing the API is included. You can import it into Postman to test the endpoints.