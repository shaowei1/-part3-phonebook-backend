const express = require("express");
var morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(express.static("build"));
app.use(morgan("combined"));
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
	morgan(
		":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]",
	),
);

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/", (request, response) => {
	response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
	console.log("------------------------------------------------------------");
	var start = new Date();
	console.log(start);
	response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${start}</div>`);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((person) => person.id === id);
	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});
app.get("/api/persons", (request, response) => {
	response.json(persons);
});
app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

const generateId = () => {
	const randomId = getRandomInt(100000);
	if (persons.find(({ id }) => id === randomId)) {
		return generateId();
	} else {
		return randomId;
	}
};

app.post("/api/persons", (request, response) => {
	const body = request.body;
	console.log(JSON.stringify(request.body));

	if (!body.name) {
		return response.status(400).json({
			error: "name missing",
		});
	}

	if (persons.find(({ name }) => name === body.name)) {
		return response.status(400).json({ error: "name must be unique" });
	}

	if (!body.number) {
		return response.status(400).json({
			error: "number missing",
		});
	}

	const person = {
		name: body.name,
		number: body.number,
		date: new Date(),
		id: generateId(),
	};

	persons = persons.concat(person);
	response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
