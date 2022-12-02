const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("Please provide the password as an argument: node mongo.js <password>");
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://seek:${password}@cluster0.et1pi4j.mongodb.net/?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
	date: Date,
	important: Boolean,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv[3]) {
	mongoose
		.connect(url)
		.then((result) => {
			const person = new Person({
				name: process.argv[3],
				number: process.argv[4],
				date: new Date(),
				important: true,
			});
			console.log(`added ${person.name} number ${person.number} to phonebook`);
			return person.save();
		})
		.then(() => {
			return mongoose.connection.close();
		})
		.catch((err) => console.log("myerror", err));
} else {
	console.log("phonebook:");
	mongoose.connect(url).then((result) =>
		Person.find({})
			.then((result) => {
				result.forEach((person) => {
					console.log(`${person.name}  ${person.number}`);
				});
				mongoose.connection.close();
			})
			.catch((err) => console.log(err)),
	);
}
