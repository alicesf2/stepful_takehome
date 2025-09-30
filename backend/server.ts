import cors from "@fastify/cors";
import fastify from "fastify";
import { db } from "./db-client";

const server = fastify();

server.register(cors, {});

const PORT = +(process.env.BACKEND_SERVER_PORT ?? 3001);

server.get("/", async (_request, _reply) => {
	return "hello world\n";
});

server.get("/users", (_request, reply) => {
	const data = db.prepare("SELECT * FROM users").all();

	return data;
});

server.get("/quizzes", (_request, reply) => {
	const data = db.prepare("SELECT * FROM assignments").all();

	return data;
});

server.get("/quizzes/:id", (request, reply) => {
	const data = db.prepare("SELECT * FROM assignments WHERE id = :id");

	return data.get(request.params);
});

server.get("/quizzes/:id/questions", (request, reply) => {
	const data = db.prepare("SELECT * FROM assignment_questions WHERE assignment_id = :id");

	return data.all(request.params);
});

server.listen({ port: PORT }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at http://localhost:${PORT}`);
});
