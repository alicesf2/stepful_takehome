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
	const [openEndedAnswer, setOpenEndedAnswer] = useState<string>("");
	const [error, setError] = useState<Error | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [aiFeedback, setAiFeedback] = useState<string>("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);
	const [aiScore, setAiScore] = useState(0);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

	const currentQuestion = quizQuestions[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
	const isFirstQuestion = currentQuestionIndex === 0;

	const handleNext = () => {
		if (!isLastQuestion) {
			setCurrentQuestionIndex(prev => prev + 1);
		}
	};

	const handlePrevious = () => {
		if (!isFirstQuestion) {
			setCurrentQuestionIndex(prev => prev - 1);
		}
	};

	const handleAnswerChange = (questionId: number, answerIndex: number) => {
		setSelectedAnswers(prev => ({
			...prev,
			[questionId]: answerIndex
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("=== SUBMITTING QUIZ ===");
		console.log("Open ended answer:", openEndedAnswer);
		console.log("Selected answers:", selectedAnswers);
		
		setIsSubmitting(true);
		const correctCount = Object.entries(selectedAnswers).reduce((count, [questionId, selectedIndex]) => {
			const questionIndex = quizQuestions.findIndex(q => q.id === Number(questionId));
			return Number(selectedIndex) === correctAnswers[questionIndex] ? count + 1 : count;
		}, 0);

		// Grade the open-ended question (question index 4)
		const response = await fetch("http://localhost:3001/grade-answer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				question: quizQuestions[4].question_content,
				answer: openEndedAnswer,
			}),
		});

		const data = await response.json();
		console.log("AI Feedback:", data.feedback);
		setAiFeedback(data.feedback);
		
		// Extract AI score from feedback
		const scoreMatch = data.feedback.match(/(\d+(?:\.\d+)?)\s*(?:\/|out of)\s*5/i);
		const extractedAiScore = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
		setAiScore(extractedAiScore);
		
		console.log(`You got ${correctCount} out of ${quizQuestions.length} questions correct.`);
		setCorrectCount(correctCount);
		setIsSubmitted(true);
		setIsSubmitting(false);
	};

	return (
		<Card className="w-[600px] mx-auto p-4">
			<CardHeader className="pb-8">
				<CardTitle className="text-center">{title}</CardTitle>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent>
					{!isSubmitted ? (
						<>
							<div className="mb-4 text-sm text-gray-600">
								Question {currentQuestionIndex + 1} of {quizQuestions.length}
							</div>
							<div className="mb-6">
								<h3 className="font-bold text-lg mb-4">{currentQuestion.question_content}</h3>
								<div className="space-y-2">
									{quizAnswers[currentQuestionIndex]?.map((answer: string, answerIndex: number) => {
										const isSelected = selectedAnswers[currentQuestion.id] === answerIndex;
										
										return (
											<label key={answer} className="flex items-center space-x-2 cursor-pointer">
												<input 
													type="radio" 
													name={`question-${currentQuestion.id}`} 
													value={answerIndex}
													checked={isSelected}
													onChange={() => handleAnswerChange(currentQuestion.id, answerIndex)}
												/>
												<span>{answer}</span>
											</label>
										);
									})}
									{!currentQuestion.choices && (
										<textarea 
											className="w-full p-2 border rounded-md mt-2 min-h-[100px]" 
											value={openEndedAnswer}
											onChange={(e) => setOpenEndedAnswer(e.target.value)}
											placeholder="Type your answer here..."
											rows={4}
										/>
									)}
								</div>
							</div>
							<div className="flex justify-between mt-6">
								<Button 
									type="button" 
									variant="outline" 
									className="min-w-[100px]"
									onClick={handlePrevious}
									disabled={isFirstQuestion}
								>
									Previous
								</Button>
								{isLastQuestion ? (
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? "Submitting..." : "Submit Quiz"}
									</Button>
								) : (
									<Button 
										type="button" 
										className="min-w-[100px]"
										onClick={(e) => {
											e.preventDefault();
											handleNext();
										}}
									>
										Next
									</Button>
								)}
							</div>
						</>
					) : (
						<>
							<div className="mb-4 text-sm text-gray-600">
								Question {currentQuestionIndex + 1} of {quizQuestions.length}
							</div>
							<div className="mb-6">
								<h3 className="font-bold text-lg mb-4">{currentQuestion.question_content}</h3>
								<div className="space-y-2">
									{quizAnswers[currentQuestionIndex]?.map((answer: string, answerIndex: number) => {
										const isSelected = selectedAnswers[currentQuestion.id] === answerIndex;
										const isCorrect = correctAnswers[currentQuestionIndex] === answerIndex;
										const userAnsweredWrong = selectedAnswers[currentQuestion.id] !== undefined && selectedAnswers[currentQuestion.id] !== correctAnswers[currentQuestionIndex];
										const showAsCorrect = isCorrect && userAnsweredWrong;
										const showAsWrong = isSelected && !isCorrect;
										
										return (
											<label key={answer} className="flex items-center space-x-2">
												<input 
													type="radio" 
													name={`question-${currentQuestion.id}`} 
													value={answerIndex}
													checked={isSelected}
													disabled
												/>
												<span className={
													showAsWrong ? "text-red-600 font-semibold" :
													showAsCorrect ? "text-green-600 font-semibold" :
													isSelected && isCorrect ? "text-green-600 font-semibold" :
													""
												}>
													{answer}
													{showAsWrong && " ✗"}
													{(showAsCorrect || (isSelected && isCorrect)) && " ✓"}
												</span>
											</label>
										);
									})}
									{!currentQuestion.choices && (
										<>
											<textarea 
												className="w-full p-2 border rounded-md mt-2" 
												value={openEndedAnswer}
												disabled
											/>
											{aiFeedback && (
												<div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
													<p className="text-sm font-semibold text-blue-900 mb-1">AI Feedback:</p>
													<p className="text-sm text-blue-800">{aiFeedback}</p>
												</div>
											)}
										</>
									)}
								</div>
							</div>
							<div className="flex justify-between mt-6">
								<Button 
									type="button" 
									variant="outline" 
									onClick={handlePrevious}
									disabled={isFirstQuestion}
								>
									Previous
								</Button>
								<Button 
									type="button" 
									onClick={handleNext}
									disabled={isLastQuestion}
								>
									Next
								</Button>
							</div>
							<div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
								<h3 className="text-lg font-bold mb-2">Quiz Results</h3>
								<p className="mb-1">Multiple Choice: {correctCount} out of {quizQuestions.length - 1} correct ({correctCount} points)</p>
								<p className="mb-1">Free Response: {aiScore} out of 5 points</p>
								<p className="text-lg font-bold mt-3">Total Score: {correctCount + aiScore} out of 9 points</p>
							</div>
						</>
					)}
				</CardContent>
				<CardFooter className="flex justify-between pt-8">
					<Link
						to={rootPath.pattern}
						className="text-muted-foreground hover:text-blue-600"
					>
						Back to home page
					</Link>
				</CardFooter>
			</form>
		</Card>
	);
}
