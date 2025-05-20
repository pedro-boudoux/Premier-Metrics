# EPL Stats Tracker
EPL Stats Tracker will be a website that allows you to look into any Premier League teams' and players' stats for the current season (as of now).

## To do
Tasks that must be done... or else

### Backend
- [x] Add update function that updates all the tables with latest information (added control script instead)
- [x] FIX PROBLEM WITH DUPLICATE NAMES DUE TO LOANS!!! (IMPORTANT)
- [x] Design postgresql database structure in draw.io
- [x] After designing database structure, make python function that cleans up all tables to fit said structure (annoying)
- [x] upload all the data into their designated tables in the database
- [ ] (after deciding website features) plan routes in backend express server
- [ ] write and test backend server routes
- [ ] Figure out a way to automatically deliver updates to database

#### Backend Routes

 - [ ] POST /player -> Returns stats about the player from uuid
 - [ ] POST /team -> Returns Information about a team and position on the premier league table and general stats about every player in said team
 - [ ] POST /search -> returns all players or teams with the entered names


### Frontend
- [ ] Decide website features
- [ ] Design website in Figma
- [ ] Learn react
- [ ] Like everything lmao #frontendnoob