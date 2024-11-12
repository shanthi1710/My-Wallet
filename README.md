# MyWallet

## Overview
MyWallet is a financial management web application that enables seamless peer-to-peer (P2P) money transfers, wallet top-ups, and withdrawals. With MyWallet, users can manage their finances efficiently, tracking monthly and total spending through visual graphs. The application also allows users to generate transaction history and download their passbook. Additional features include QR-based payments (QrPay) for quick transactions.

## Features
- **P2P Money Transfers**: Send and receive money instantly with other users.
- **Wallet Top-Up and Withdrawals**: Add or withdraw money from your wallet with ease.
- **Transaction History**: Generate and view your full transaction history.
- **Spending Insights**: Visual monthly and total spend graphs.
- **Downloadable Passbook**: Export transaction details for easy tracking.
- **QrPay**: Simplified QR-based payment system.

## Tech Stack
- **Next.js**: Provides a powerful React-based framework with built-in optimizations and API routes, enabling smooth client-server interactions.
- **Prisma**: Simplifies database interactions with an easy-to-use ORM, ensuring efficient querying and data management.
- **PostgreSQL**: A reliable, SQL-compliant database system, ideal for handling complex financial transactions.
- **ShadCN UI**: Offers prebuilt, highly customizable components to enhance the UI design.
- **Firebase**: Manages image storage, enabling secure and efficient media handling.
- **Webhook Integration**: Facilitates real-time communication between MyWallet’s backend and the bank’s backend during wallet top-ups and withdrawals.
- **Twilio SMS API**: Adds secure OTP (One-Time Password) verification for improved security.
- **TurboRepo**: Manages multiple applications in a monorepo, facilitating streamlined development and deployment.

### Why This Stack?
This stack is chosen to provide a robust, efficient, and secure architecture for a financial management platform:
- **Next.js and TurboRepo** allow for a modular, performant, and scalable architecture.
- **Prisma and PostgreSQL** offer efficient data storage, retrieval, and management suited to transaction-heavy applications.
- **ShadCN UI and Firebase** ensure a responsive and secure user experience, with Firebase handling image storage needs.
- **Twilio SMS API** adds an essential layer of security with OTP verification.
- **Webhook** supports real-time communication with the bank’s backend, ensuring instant updates on wallet balance during transactions.

## Project Architecture

The application follows a modular monorepo structure using **TurboRepo**, with different parts of the app handled in separate repositories or modules. Here’s an overview of the architecture:

1. **Frontend (Next.js)**
   - UI components powered by ShadCN, designed to offer a cohesive and accessible user experience.
   - API Routes for server-side functions like wallet management and transaction history retrieval.

2. **Backend (Node.js + Prisma + PostgreSQL)**
   - Centralized database using PostgreSQL, accessed via Prisma ORM for easy querying and data management.
   - Webhook integration for communication between MyWallet and the bank’s backend during wallet top-ups and withdrawals.

3. **Authentication & Security (Firebase, Twilio)**
   - Firebase handles secure image storage and user management.
   - Twilio for OTP-based SMS verification.

4. **Real-Time Updates**
   - Webhooks and Firebase are configured to offer instant updates on transaction status and user profile images.

5. **File Management**
   - Passbook generation and export functionality, allowing users to download and manage their transaction history.

![image](https://github.com/user-attachments/assets/5ccde5f1-df8b-4195-958c-c0fb476a9258)

