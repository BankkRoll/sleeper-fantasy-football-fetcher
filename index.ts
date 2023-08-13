import axios from 'axios';
import fs from 'fs';
import readline from 'readline';

const API_BASE_URL = 'https://api.sleeper.app/v1';

// Function to print styled log messages
function logMessage(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const styles = {
    info: '\x1b[36m%s\x1b[0m',     // Cyan
    success: '\x1b[32m%s\x1b[0m',  // Green
    error: '\x1b[31m%s\x1b[0m',    // Red
  };

  console.log(styles[type], message);
}

// Function to ask a question and get user input
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Function to ask for weeks, handling different input formats
async function askForWeeks(maxWeeks: number): Promise<number[]> {
  const input = await askQuestion(`Enter the weeks you want to fetch (e.g., 1-5 or 1,2,3,4,5) or "max" for all ${maxWeeks} weeks: `);

  if (input.toLowerCase() === 'max') {
    return Array.from({ length: maxWeeks }, (_, i) => i + 1);
  }

  if (input.includes('-')) {
    const [start, end] = input.split('-').map(Number);
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
  }

  return input.split(',').map(Number);
}

interface League {
  total_rosters: number;
  status: string;
  sport: string;
  season: string;
  roster_positions: string[];
  name: string;
  league_id: string;
}

interface Matchup {
  starters: string[];
  points: number;
  roster_id: number;
}

async function main() {
  try {
    logMessage('Starting data fetching process...', 'info');

    const username = await askQuestion('Enter your username: ');
    const seasonYear = parseInt(await askQuestion('Enter the season year: '), 10);
    const maxWeeks = parseInt(await askQuestion('Enter the maximum number of weeks for this season: '), 10); // Ask for the max weeks

    // Validate the maximum weeks
    if (isNaN(maxWeeks) || maxWeeks < 1) {
      throw new Error('Invalid maximum weeks entered.');
    }

    const selectedWeeks = await askForWeeks(maxWeeks);

    // Validate the selected weeks
    if (!selectedWeeks.every((week) => week > 0 && week <= maxWeeks)) {
      throw new Error('Invalid weeks selected.');
    }

    // Validate the season year
    if (isNaN(seasonYear) || seasonYear < 2000 || seasonYear > new Date().getFullYear()) {
      throw new Error('Invalid season year selected.');
    }

    // Define functions to handle API requests
    const getUserInfo = async () => axios.get(`${API_BASE_URL}/user/${username}`).then((res) => res.data);
    const getUserLeagues = async (user_id: string) => axios.get(`${API_BASE_URL}/user/${user_id}/leagues/nfl/${seasonYear}`).then((res) => res.data as League[]); // Use the season year in the request
    const getAllPlayers = async () => axios.get(`${API_BASE_URL}/players/nfl`).then((res) => res.data);
    const getMatchups = async (league_id: string, week: number) => axios.get(`${API_BASE_URL}/league/${league_id}/matchups/${week}`).then((res) => res.data);

    // Fetch user and player information
    const userInfo = await getUserInfo();
    const user_id = userInfo.user_id;
    const playerMapping = await getAllPlayers();

    // Fetch and process leagues
    const leagues = await getUserLeagues(user_id);
    const leaguesDir = './leagues';
    if (!fs.existsSync(leaguesDir)) {
      fs.mkdirSync(leaguesDir);
    }

    for (const league of leagues) {
      const league_id = league.league_id;
      const league_name = league.name.replace(/\s+/g, '_');
      logMessage(`Fetching data for league: ${league.name}`, 'info');

      // Directory handling for each league
      const leagueDir = `${leaguesDir}/${league_name}`;
      if (!fs.existsSync(leagueDir)) {
        fs.mkdirSync(leagueDir);
      }

      // Extract and write league details
      const leagueDetails = {
        totalRosters: league.total_rosters,
        status: league.status,
        sport: league.sport,
        season: league.season,
        rosterPositions: league.roster_positions,
        name: league.name,
        leagueId: league.league_id,
      };
      fs.writeFileSync(`${leagueDir}/league_details.json`, JSON.stringify(leagueDetails, null, 2));

      // Write league users
      const leagueUsers = await axios.get(`${API_BASE_URL}/league/${league_id}/users`).then((res) => res.data);
      fs.writeFileSync(`${leagueDir}/league_users.json`, JSON.stringify(leagueUsers, null, 2));

      // Fetch and write matchups for selected weeks
      for (const week of selectedWeeks) {
        logMessage(`Fetching matchups for week ${week}`, 'info');
        const matchupsData = await getMatchups(league_id, week);
        const matchups: { team1: Matchup; team2: Matchup }[] = [];

        for (let i = 0; i < matchupsData.length; i += 2) {
          const team1 = matchupsData[i];
          const team2 = matchupsData[i + 1];

          if (team2 && team1.matchup_id === team2.matchup_id) {
            matchups.push({
              team1: { starters: team1.starters.map((id: string | number) => playerMapping[id] || id), points: team1.points, roster_id: team1.roster_id },
              team2: { starters: team2.starters.map((id: string | number) => playerMapping[id] || id), points: team2.points, roster_id: team2.roster_id },
            });
          }
        }

        fs.writeFileSync(`${leagueDir}/matchups_week_${week}.json`, JSON.stringify(matchups, null, 2));
      }
    }

    logMessage('Data fetching complete.', 'success');
  } catch (error) {
    logMessage('An error occurred:', 'error');
  }
}

// Execution of the main function
main().catch((error) => {
  logMessage('An error occurred during execution:', 'error');
  console.error(error);
});
