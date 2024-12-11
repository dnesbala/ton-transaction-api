# TON Transaction API

A Node.js and TypeScript API for fetching user transactions and retrieving user wallet balances on the TON blockchain.

## Features

- **Fetch Transactions**: Retrieve transaction history for a given account address and date.
- **Get Wallet Balance**: Check the wallet balance for a specific account address.

## API Endpoints

### Fetch Transactions

**GET** `/api/transactions?accountAddress=<accountAddress>&date=<date>`

- Retrieves transactions for a given account address and date.

### Get Wallet Balance

**GET** `/api/transactions/wallet-balance/<accountAddress>`

- Retrieves the wallet balance for a specified account address.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or later)
- [TypeScript](https://www.typescriptlang.org/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dnesbala/ton-transaction-api
   cd ton-transaction-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Copy the `env.example` file to `.env` at the project root.
   - Update the values as required.

     ```bash
     cp env.example .env
     ```

### Run the Project

- Development mode:

  ```bash
  npm run dev
  ```

- Production mode:
  ```bash
  npm run build
  npm start
  ```

## Project Structure

- **src/**: Contains the main application code.
  - **controllers/**: API controllers for handling requests.
  - **services/**: Business logic and interaction with TON blockchain.
  - **repositories/**: Database and ORM configurations.
- **env.example**: Example environment file with all required configuration variables.
- **dist/**: Compiled production code (generated after `npm run build`).

## Environment Variables

The `.env` file should include:

```
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
```
