// movie // director

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "moviesData.db");

let db = null;

const initializationDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3008, () => {
      console.log("Server is running at http://localhost:3008/");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};

initializationDBandServer();

//
const convertIntoResponse = (eachPlayer) => {
  return {
    movieId: eachPlayer.movie_id,
    directorId: eachPlayer.director_id,
    movieName: eachPlayer.movie_name,
    leadActor: eachPlayer.lead_actor,
  };
};
//

const convertIntoResponse2 = (eachPlayer) => {
  return {
    directorId: eachPlayer.director_id,
    directorName: eachPlayer.director_name,
  };
};

// 01
app.get("/movies/", async (request, response) => {
  const selectMovies = `SELECT movie_name FROM movie`;
  const dbresponse = await db.all(selectMovies);
  response.send(
    dbresponse.map((eachPlayer) => convertIntoResponse(eachPlayer))
  );
});

// 02
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postTheMovie = `
  INSERT INTO movie
     (director_id, movie_name, lead_actor)
  VALUES
     (${directorId},'${movieName}','${leadActor}')`;
  const dbresponse = await db.run(postTheMovie);
  response.send("Movie Successfully Added");
});

// 03
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const selectOneMovie = `SELECT * FROM movie WHERE movie_id = ${movieId}`;
  const dbresponse = await db.get(selectOneMovie);
  response.send(convertIntoResponse(dbresponse));
});

// 04
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const putMovies = `UPDATE movie SET director_id = ${directorId},movie_name = '${movieName}',lead_actor = '${leadActor}' WHERE movie_id = ${movieId}`;
  const dbresponse = await db.run(putMovies);
  response.send("Movie Details Updated");
});

// 05
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovie = `DELETE FROM movie WHERE movie_id = ${movieId}`;
  const dbresponse = await db.run(deleteMovie);
  response.send("Movie Removed");
});

// 06
app.get("/directors/", async (request, response) => {
  const selectDirectors = `SELECT * FROM director`;
  const dbresponse = await db.all(selectDirectors);
  response.send(
    dbresponse.map((eachPlayer) => convertIntoResponse2(eachPlayer))
  );
});

// 07
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const selectDirectorMovie = `SELECT movie_name FROM movie WHERE director_id = ${directorId}`;
  const dbresponse = await db.all(selectDirectorMovie);
  response.send(dbresponse);
});

//
module.exports = app;
