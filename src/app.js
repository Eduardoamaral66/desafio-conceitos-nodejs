const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateIdRequests(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: "The given id does not have a valid format" });
  }
  const repoIdx = repositories.findIndex((repo) => repo.id === id);

  if (repoIdx < 0) {
    return response.status(400).json({
      error: "The given id was not found in our database. Try again.",
    });
  }

  return next();
}

app.use("/repositories/:id", validateIdRequests);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {
    id: uuid(),
    title,
    techs,
    likes: 0,
    url,
  };
  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIdx = repositories.findIndex((repo) => repo.id === id);

  const actualRepo = repositories[repoIdx];
  const newRepo = Object.assign({}, actualRepo);
  if (title) {
    newRepo.title = title;
  }
  if (url) {
    newRepo.url = url;
  }
  if (techs) {
    newRepo.techs = techs;
  }

  repositories[repoIdx] = newRepo;
  return response.json(newRepo);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repoIdx = repositories.findIndex((repo) => repo.id === id);
  repositories.splice(repoIdx, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIdx = repositories.findIndex((repo) => repo.id === id);

  const repo = repositories[repoIdx];
  repo.likes = repo.likes + 1;

  repositories[repoIdx] = repo;
  return response.json({
    likes: repo.likes,
  });
});

module.exports = app;
