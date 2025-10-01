# Solution

By Alice Fang (alicesfang@gmail.com)

## Notes on implementation

Keeping the user stories and 3-4 hour time limit in mind, I decided to focus on the features I believed should be included in an MVP. This meant a fully functional quiz taking site that provides feedback on every question and a correct grade at the end. So I focused heavily on the quiz attempt, feedback, and AI grading as these were core to the student's quiz taking experience and learning. To speed things up, I used the boilerplate as well as Cursor, which is my default text editor.

I prioritized student learning and feedback in my approach in a few ways:

- I allowed students to view previous questions before and after quiz submission. This gives the student the most flexibility when taking the quiz, and upon submission they can see which questions they got wrong and what the right answer is.
- For the AI-graded question, I made sure to count empty or gibberish submissions as 0, and award partial points for partially correct or unspecific answers.
- I created a realistic scoring system of 1 point to each multiple choice and 5 points to the free response question, for which the AI would decide how many points out of 5 the response scored.

For the sake of this takehome, I assumed a quiz would always be 5 questions with the free response question being the last one, but if I had more time I would have it support quizzes of any length with any number of free response questions.

I didn't have time to include a few things in the user stories I chose to focus on, like the timer or persisting progress if the user navigates away from the page. Even though progress persistence is important, I felt that it wasn't super necessary for an MVP so I spent more time refining the quiz and feedback UIs.

## (If you didn't go with the boilerplate) Notes on design/architecture and rationale

_Please leave notes for what languages / frameworks you chose, and why._
_Please leave instructions for how to run your solution locally._

## Feedback for Stepful

Overall, really cool takehome! I thoroughly enjoyed building it and I liked the closeness of it to the actual product and user stories. I also enjoyed being able to talk to someone acting as a PM - it helped clarify some things and is also just a great intro to working with Stepful engineers.

Some constructive criticism - the boilerplate used the terms assignments and quizzes interchangeably, but they were actually referring to the same thing. Keeping the language consistent would have made things a bit easier to understand from the beginning. Also, the boilerplate used "name" instead of "title" for quiz names. I'm not sure if that was an intentional bug, but I don't think it was necessary if it was.

## Anything else you'd like us to know?

Unfortunately, I don't have a personal website or blog up at the moment. But I've been documenting every single floss pick I see littered on the streets of NYC (I even found one going through security at JFK) and other cities around the US (I also found one on a hiking trail in LA). I thought it was funny and random at first, but then I started seeing them everywhere and now it's become a social commentary project on how prevalent single-use plastics are and how much waste they produce.
