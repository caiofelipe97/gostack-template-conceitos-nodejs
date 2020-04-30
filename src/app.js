const express = require("express");
const cors = require("cors");
 const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(req, res, next) {  
  const { id } = req.params;

  if(!isUuid(id)){
    return res.status(400).json({error: 'Invalid ID.'});
  }
  return next();

}
app.use('/repositories/:id', validateId);

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const newRepository = {id: uuid(), title, url, techs, likes:0};
  repositories.push(newRepository);
  response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0 ){
    return response.status(400).json({ error: "Repository not found."});
  }
  const repository  = repositories[repositoryIndex]

  repositories[repositoryIndex] = {...repository, title, url, techs};

  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0 ){
    return response.status(400).json({ error: "Repository not found."});
  }
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0 ){
    return response.status(400).json({ error: "Repository not found."});
  }
  let updatedRepository = {...repositories[repositoryIndex]};
  updatedRepository.likes +=1;
  repositories[repositoryIndex] = updatedRepository

  return response.status(200).json(updatedRepository);
});

module.exports = app;
