# 🏘️ Israeli Real Estate Lottery Dashboard 

## 📖 Project Overview
This project is a comprehensive, full-stack analytical dashboard designed to visualize and simplify data from the Israeli government's "Dira BaHanacha" (Targeted Housing) program. By automatically fetching, processing, and mapping raw data from the Ministry of Construction and Housing, this platform transforms complex governmental datasets into an intuitive, actionable, and user-friendly interface.

### 🎯 Target Audience
The dashboard is built to deliver high-value insights to a diverse range of users:
* **Young Couples & First-Time Buyers:** Empowers individuals to navigate the complex lottery system, track registration deadlines, and easily find available projects in their desired cities.
* **Housing Upgraders (Meshaprey Diur):** Provides clear visibility into specific lotteries and projects.
* **Investors, Analysts & Real Estate Researchers:** Offers a macro-level view of the housing market, including geographical distribution of projects, construction statuses, and pricing trends across different municipalities.

### 💻 Tech Stack Highlights
This platform was developed using a modern, scalable architecture designed for high performance:
* **Frontend:** React (Vite) 
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Cloud-hosted on Neon.tech)
* **Deployment:** Vercel (Client) & Render (Server)

## 📊 The Data & API

### Background: "Dira BaHanacha" Program
"Dira BaHanacha" (Targeted Housing) is a flagship initiative by the Israeli government (Ministry of Construction and Housing) designed to assist first-time homebuyers and eligible citizens in purchasing apartments under preferential financial conditions. The program consolidates various housing models, including "Mehir Lamishtaken" (Buyer's Price) and "Mehir Matara" (Target Price). 

### The Government Data Source
This project leverages the official, publicly available API from the Israeli government data portal (`data.gov.il`). The external API provides periodic, automated updates containing raw statistical data regarding all open and closed lotteries across the country. 

### Data Dictionary (Database Schema)
To optimize performance and structure the raw JSON responses from the government API, the data is filtered, sanitized, and stored in a relational PostgreSQL database (`lotteries` table) with the following key schema:

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `lottery_id` | Integer | The unique government identifier for the specific lottery. |
| `city` | String | The municipality where the real estate project is located. |
| `project_name` | String | The specific plots or neighborhood name. |
| `provider_name` | String | The name of the construction company / contractor building the project. |
| `price_per_meter` | Decimal | The discounted cost per square meter in NIS. |
| `total_units` | Integer | The total number of apartments allocated for this specific lottery. |
| `total_subscribers` | Integer | The current number of households registered for the draw. |
| `status` | String | Current phase (e.g., "In Progress", "Results Published"). |
| `signup_end_date` | Timestamp | The deadline for registration. |
| `lottery_date` | Timestamp | The scheduled execution date of the lottery draw. |
| `lottery_type` | String | Eligibility type (e.g., First-time buyers). |

### 🧠 Custom Logic: Win Probability Calculation
To provide users with real-time insights, the platform calculates the **Win Probability** for each project dynamically. The percentage is derived using a straightforward formula:

**`Win Probability (%) = (Total Allocated Units / Total Subscribers) * 100`**

## ✨ Key Features

*   **🔍 Advanced Filtering & Sorting:** Users can easily filter the data by city and registration status (Open/Closed). The platform also supports advanced sorting capabilities, allowing users to rank projects by highest win probability or lowest price per square meter.
*   **🗺️ Interactive Map & Heatmap:** A geographic visualization of all project locations across Israel. Users can explore specific projects using map pins or toggle a dynamic Heatmap layer to identify regions with high concentrations of available housing.
*   **📊 Data Visualization Analytics:** Includes dynamic visual components, such as a Status Pie Chart, illustrating the distribution of projects based on their current status.
*   **🧮 Real-Time Metrics:** Computes vital insights on the fly, including the exact win probability for each project based on the latest subscriber counts.
*   **🏢 In-Depth Project Views:** Users can dive into comprehensive details for any specific project, enabling targeted searches based on unique property attributes, contractor details, and deadlines.
*   **⚙️ Automated Data Synchronization (Cron Job):** A dedicated backend Cron Job automatically runs scheduled tasks to fetch, parse, and inject new data from the official government API directly into the PostgreSQL database. **The synchronization process is scheduled to run weekly, every Sunday at 03:00 AM**, ensuring the dashboard is always up-to-date for the new week without any manual intervention.
