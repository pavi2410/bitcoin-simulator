# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs TypeScript check first, then Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a Bitcoin blockchain simulator built with React, TypeScript, and Vite. The application simulates Bitcoin network operations including wallets, transactions, mining, and blockchain exploration.

### Core Components

- **BlockchainSimulator.tsx** - Main application component containing all simulation logic
- Uses React hooks for state management with localStorage persistence simulation
- Implements a tab-based interface with four main views: Overview, Wallet, Explorer, and Nodes

### Key Features

- **Blockchain State**: Manages blockchain, mempool, wallets, validators, and transaction counter
- **Mining Simulation**: Supports both manual and automatic mining with realistic delays
- **Wallet System**: Three pre-configured wallets with Bitcoin address simulation
- **Transaction Processing**: Creates transactions, adds to mempool, processes during mining
- **Validator Network**: Three mining nodes that compete to mine blocks

### State Management

The application uses a custom `useLocalStorage` hook for persistence, though localStorage functionality is disabled for Claude.ai compatibility. All state is managed through React hooks:

- `blockchain` - Array of mined blocks
- `mempool` - Pending transactions
- `wallets` - Wallet addresses and balances  
- `validators` - Mining nodes with statistics
- `txCounter` - Transaction ID counter

### UI Structure

- **Overview Tab**: Shows mempool, mining process, and recent blocks
- **Wallet Tab**: Wallet management and transaction creation
- **Explorer Tab**: Block explorer showing detailed blockchain history
- **Nodes Tab**: Validator node status and network statistics

The app uses Tailwind CSS for styling with a dark theme and responsive grid layout.