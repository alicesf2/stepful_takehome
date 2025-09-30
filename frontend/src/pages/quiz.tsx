import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { quizQuestionsApiUrl, rootPath } from "@/paths";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

export type QuizQuestion = {
	id: number;
	question_content: string;
	choices: string;
};

export function QuizPage() {
	const { id } = useParams();
	const location = useLocation();
	console.log(location);
	const title = location.state?.title || "Quiz";
	if (!id) throw new Error("Quiz id param is required");

	const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
	const [quizAnswers, setQuizAnswers] = useState<string[][]>([]);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		fetch(quizQuestionsApiUrl({ id }))
			.then((res) => res.json())
			.then((questions) => {
				setQuizQuestions(questions);
				console.log(questions);
				questions.forEach((question: QuizQuestion) => setQuizAnswers((prev) => [...prev, question.choices?.split(";;")]));
			})
			.catch(setError);
	}, [id]);

	if (error)
		return (
			<div className="text-red-500 p-4">
				<p className="font-bold mb-1">An error has occurred:</p>
				<p>{error.message}</p>
			</div>
		);

	if (!quizQuestions) return <div className="text-center p-8">Loading...</div>;

	console.log(quizQuestions);

	return (
		<Card className="w-[600px] mx-auto p-4">
			<CardHeader className="pb-8">
				<CardTitle className="text-center">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<ol className="list-decimal">
					{quizQuestions.map((question, index) => (
						<li className="mb-4" key={question.id}>
							<h3>{question.question_content}</h3>
							<ol className="list-lower-alpha ml-4">
								{quizAnswers[index]?.map((answer: string) => (
									<li key={answer}>
										<p>{answer}</p>
									</li>
								))}
							</ol>
						</li>
					))}
				</ol>
			</CardContent>
			<CardFooter className="flex justify-between pt-8">
				<Link
					to={rootPath.pattern}
					className="text-muted-foreground hover:text-blue-600"
				>
					Back to home page
				</Link>
			</CardFooter>
		</Card>
	);
}
