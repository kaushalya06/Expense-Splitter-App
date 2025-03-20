# Expense-Splitter-App
Problem Statement:

Managing shared expenses among multiple people is often complicated, leading to confusion and disputes. This project aims to develop an Expense Splitter App that allows users to split expenses among group members efficiently, track payments, and ensure seamless settlement.

Objectives:

Simplify Group Expense Management: Users can create groups and add members.
Automate Expense Splitting: Expenses are divided fairly among group members.
Track Payments & Settlements: Pending and completed payments are clearly displayed.
Secure Authentication: Users log in securely using JWT authentication.
User-Friendly Interface: Simple and interactive UI built with React and Bootstrap.

Frontend & Backend Architecture

Technology Stack:

Frontend: React, React Router, Context API, Bootstrap
Backend: ASP.NET Core Web API
Database: MS SQL Server
Authentication: JWT-based authentication

3. Component Breakdown & API Design

Frontend Components:

Authentication: Login & Signup pages with JWT token storage.
Dashboard: Displays user’s groups, pending payments, and completed expenses.
Groups: Create and manage groups.
Expenses: Add, view, and split expenses among group members.
Payments: Mark payments as completed.

API Design:

Auth API: /api/auth/signup, /api/auth/login
Dashboard API: /api/dashboard/user-dashboard
Groups API: /api/groups/create, /api/groups/user-groups
Expenses API: /api/expenses/add, /api/expenses/group/{groupName}
Payments API: /api/payment/pay

4. Database Design & Storage Optimization

Database Tables:

Users Table: Stores user information (ID, Name, Email, PasswordHash).
Groups Table: Stores group details.
GroupMembers Table: Maps users to groups.
Expenses Table: Tracks expenses, amount, paidBy, and group ID.
Payments Table: Tracks pending and completed payments.

Optimization Techniques:

Indexing on Foreign Keys for faster query performance.
Normalization to reduce data redundancy.
Efficient Querying by using JOIN operations for faster retrieval.

The Expense Splitter App successfully streamlines expense tracking and payment settlements in groups. Using a scalable architecture, secure authentication, and optimized database design, this project provides a robust and user-friendly solution for shared expense management.
