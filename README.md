# Node JS Project Setup

This guide will help you get started with running this Node js project locally.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/AFK247/invoice-dashboard-server
cd invoice-dashboard-server
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

## Environment Variables

Create a `.env` file in the root directory and add your environment variables:

```plaintext
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306

```

## Database Setup

After setting up the environment variables, execute the MySQL schema to initialize the database table for operation. Use the provided `invoice.sql` file in this repository.

## Running the Project

### Development Mode

To run the project in development mode with hot-reload:

```bash
npm start
```

The application will be available at `http://localhost:5000`

### Production Build

To create a production build:

```bash
npm run build:prod
```

To start the production server:

```bash
npm run start
# or
yarn start
```
