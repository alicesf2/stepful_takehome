import cors from "@fastify/cors";
import fastify from "fastify";
import { db } from "./db-client";
import OpenAI from "openai";

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

server.post("/grade-answer", async (request, reply) => {
	const { question, answer } = request.body as { question: string; answer: string };

	console.log(question)
	console.log(answer)

	const openai = new OpenAI({
		apiKey: "alicesfang@gmail.com",
		baseURL: "https://interview-ai.stepful.com/v1",
	});

	const response = await openai.chat.completions.create({
		model: "gpt-4o-2024-08-06",
		messages: [
			{
				role: "user",
				content: `Please grade this response to this question out of 5 points. The question is ${question}. The response is ${answer}. The student should get 0 points for an empty submission. They shouldnot get a point for just answering, but should be awarded partial points for a partially correct answer. Limit the feedback to 1-2 sentences.`,
			},
		],
		temperature: 0.7,
	});

	return { feedback: response.choices[0].message.content };
});

server.listen({ port: PORT }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at http://localhost:${PORT}`);
});
