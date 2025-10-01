import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizQuestionsApiUrl, rootPath } from "@/paths";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

export type QuizQuestion = {
	id: number;
	question_content: string;
	choices: string;
	correct_answer: number;
};

export function QuizPage() {
	const { id } = useParams();
	const location = useLocation();
	const title = location.state?.title || "Quiz";
	if (!id) throw new Error("Quiz id param is required");

	const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
	const [quizAnswers, setQuizAnswers] = useState<string[][]>([]);
	const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
	const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		fetch(quizQuestionsApiUrl({ id }))
			.then((res) => res.json())
			.then((questions) => {
				setQuizQuestions(questions);
				console.log(questions[0]);
				questions.forEach((question: QuizQuestion) => setQuizAnswers((prev) => [...prev, question.choices?.split(";;")]));
				questions.forEach((question: QuizQuestion) => setCorrectAnswers((prev) => [...prev, question.correct_answer]));
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

	const handleAnswerChange = (questionId: number, answerIndex: number) => {
		setSelectedAnswers(prev => ({
			...prev,
			[questionId]: answerIndex
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const correctCount = Object.entries(selectedAnswers).reduce((count, [questionId, selectedIndex]) => {
			const questionIndex = quizQuestions.findIndex(q => q.id === Number(questionId));
			return Number(selectedIndex) === correctAnswers[questionIndex] ? count + 1 : count;
		}, 0);
		console.log(`You got ${correctCount} out of ${quizQuestions.length} questions correct.`);
	};

	return (
		<Card className="w-[600px] mx-auto p-4">
			<CardHeader className="pb-8">
				<CardTitle className="text-center">{title}</CardTitle>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent>
					<ol className="list-decimal">
						{quizQuestions.map((question, index) => (
							<li className="mb-4" key={question.id}>
								<h3 className="font-bold text-md mb-2">{question.question_content}</h3>
								<div className="ml-4 space-y-2">
									{quizAnswers[index]?.map((answer: string, answerIndex: number) => (
										<label key={answer} className="flex items-center space-x-2 cursor-pointer">
											<input 
												type="radio" 
												name={`question-${question.id}`} 
												value={answerIndex}
												checked={selectedAnswers[question.id] === answerIndex}
												onChange={() => handleAnswerChange(question.id, answerIndex)}
											/>
											<span>{answer}</span>
										</label>
									))}
									{!question.choices && <textarea className="w-full p-2 border rounded-md mt-2" />}
								</div>
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
					<Button type="submit">Submit Answers</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
