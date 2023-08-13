# Sleeper Fantasy Football Data Fetcher

This script is designed to fetch and save Sleeper fantasy football data, providing a comprehensive view of your league's dynamics. Get details like league rules, user profiles, match statistics, player scores, and more, all saved into easily accessible JSON files. Perfect for analysts, fantasy enthusiasts, and developers.

## Featured Information
- **League Details**: Configuration, settings, and teams.
- **User Profiles**: Usernames, display names, and avatars.
- **Matchups**: Weekly matchups, win/loss records, and scores.
- **Player Scores**: Player performance data including points, projections, and more.
- **Additional Data**: Rosters, transactions, waivers, etc.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Data Overview](#data-overview)
- [Contribution](#contribution)
- [License](#license)

## Data Overview

This section gives a detailed explanation of the data that the script fetches from the Sleeper fantasy football service:

### League Details
- **Configuration**: League type, scoring settings, etc.
- **Teams**: Team names, owners, logos, etc.

### User Profiles
- **Usernames**: Unique user identifiers.
- **Display Names**: Publicly visible names.
- **Avatars**: Profile pictures or icons.

### Matchups
- **Weekly Matchups**: Information about weekly games.
- **Win/Loss Records**: Team standings and rankings.
- **Scores**: Points scored in individual matchups.

### Player Scores
- **Points**: Actual points scored.
- **Projections**: Expected points based on analysis.

### Additional Data
- **Rosters**: Players in each team.
- **Transactions**: Trades, drops, adds, etc.
- **Waivers**: Waiver wire activities and claims.

## Installation

Follow these steps to install and set up the project:

### Via Git Clone

1. **Clone the Repository**
   ```bash
   git clone https://github.com/BankkRoll/sleeper-fantasy-football-fetcher.git
   cd sleeper-fantasy-football-fetcher
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

### Via Direct Download

1. **Download the Zip File**
2. **Extract the Zip File**
3. **Navigate to the Directory**
   ```bash
   cd path/to/sleeper-fantasy-football-fetcher
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

## Usage

Execute the script to fetch and save Sleeper fantasy football data into JSON files.

### Running the Script

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Start the Script**
   ```bash
   npm start
   ```

3. **Follow the Prompts**: The script will ask you for your username, season year, and weeks you want to fetch.

4. **Access the Data**: The fetched data will be saved into JSON files under the `./leagues` directory.

## Contribution

Contributions to the Sleeper Fantasy Football Data Fetcher are welcome! Here's how you can contribute:

1. **Fork the Repository**: Create your own fork of the project on GitHub.
2. **Clone Your Fork**: Clone your fork to your local machine.
3. **Create a Branch**: Make a new branch for your changes.
4. **Make Changes**: Implement and commit your changes.
5. **Submit a Pull Request**: Create a pull request to the main repository, describing your changes and why they should be included.

By contributing, you agree to adhere to the project's code of conduct and licensing terms.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE) file for details.

---

For any questions or concerns, please feel free to open a issue.
