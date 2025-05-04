# News Scrapper Dashboard

A simple web application that scrapes news headlines from various configured websites and displays them on a central dashboard. It allows users to manage the news sources through a configuration interface.

## Features

*   Fetches news headlines from multiple sources defined in a configuration file or via a web UI.
*   Displays aggregated news headlines with links to the original articles.
*   Web interface to add, view, and delete news source configurations (website URL, CSS selector for headlines, source name).
*   Uses Puppeteer for web scraping.
*   Built with Node.js, Express, and EJS templating.
*   Styled with Tailwind CSS.

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Frontend:** EJS (Embedded JavaScript templates), Tailwind CSS
*   **Web Scraping:** Puppeteer
*   **Configuration:** JSON file ([config.json](config.json))

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd news_scrapper
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

News sources are defined in the [config.json](config.json) file or can be managed via the web interface at `/config`. Each source configuration requires:

*   `name`: A user-friendly name for the news source (e.g., "BBC News").
*   `website`: The URL of the website to scrape (e.g., "https://www.bbc.com/news").
*   `scrapingCode`: The CSS selector used to identify the news headline elements on the target website (e.g., `[data-testid="card-headline"]`).

You can manually edit [config.json](config.json) or navigate to `http://localhost:3000/config` in your browser to add or remove sources after starting the application.

## Running the Application

1.  **Compile Tailwind CSS (optional, run in a separate terminal if you want to watch for changes):**
    ```bash
    npm run dev:css
    ```
    This command watches the input CSS file ([public/src/input.css](public/src/input.css)) and recompiles the output CSS ([public/styles.css](public/styles.css)) whenever changes occur. The initial build is usually sufficient if you don't plan to modify styles.

2.  **Start the server:**
    ```bash
    npm start
    ```
3.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3000`.
    *   The main dashboard is at `/`.
    *   The configuration page is at `/config`.

## Project Structure
