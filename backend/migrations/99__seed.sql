-- Create some test usrs
INSERT INTO
  users (name, email)
VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Alice Johnson', 'alice@example.com'),
  ('Bob Brown', 'bob@example.com');

-- Create test assignments
INSERT INTO
  assignments (title)
VALUES
  ('Basic Skeletal System Quiz'),
  ('Cardiovascular System Basics'),
  ('Digestive System Overview');

-- Create questions for Skeletal System Quiz
INSERT INTO
  assignment_questions (assignment_id, question_content, choices, correct_answer)
SELECT
  a.id,
  q.question_content,
  q.choices,
  q.correct_answer
FROM
  assignments a
  JOIN (
    SELECT
      'Which bone is the longest in the human body?' AS question_content,
      'Femur;;Tibia;;Humerus;;Fibula' AS choices,
      0 AS correct_answer
    UNION ALL
    SELECT
      'How many bones are in the adult human body?',
      '206;;186;;226;;196',
      0 AS correct_answer
    UNION ALL
    SELECT
      'Which part of the skull protects the brain?',
      'Cranium;;Mandible;;Maxilla;;Hyoid',
      0 AS correct_answer
    UNION ALL
    SELECT
      'What is the common name for the clavicle?',
      'Collarbone;;Wishbone;;Shoulderblade;;Neckbone',
      0 AS correct_answer
    UNION ALL
    SELECT
      'Explain the difference between compact and spongy bone tissue:',
      NULL,
      NULL
  ) q
WHERE
  a.title = 'Basic Skeletal System Quiz';

-- Create questions for Cardiovascular Quiz
INSERT INTO
  assignment_questions (assignment_id, question_content, choices, correct_answer)
SELECT
  a.id,
  q.question_content,
  q.choices,
  q.correct_answer
FROM
  assignments a
  JOIN (
    SELECT
      'Which chamber of the heart pumps blood to the body?' AS question_content,
      'Left ventricle;;Right ventricle;;Left atrium;;Right atrium' AS choices,
      0 AS correct_answer
    UNION ALL
    SELECT
      'What is the main function of red blood cells?',
      'Carry oxygen;;Fight infection;;Form blood clots;;Produce antibodies',
      0 AS correct_answer
    UNION ALL
    SELECT
      'Which blood vessel carries oxygenated blood?',
      'Arteries;;Veins;;Capillaries;;Venules',
      0 AS correct_answer
    UNION ALL
    SELECT
      'How many chambers are in the human heart?',
      '4;;2;;3;;6',
      0 AS correct_answer
    UNION ALL
    SELECT
      'Describe the path of blood flow through the heart:',
      NULL,
      NULL
  ) q
WHERE
  a.title = 'Cardiovascular System Basics';

-- Create questions for Digestive System Quiz
INSERT INTO
  assignment_questions (assignment_id, question_content, choices, correct_answer)
SELECT
  a.id,
  q.question_content,
  q.choices,
  q.correct_answer
FROM
  assignments a
  JOIN (
    SELECT
      'Where does chemical digestion begin?' AS question_content,
      'Mouth;;Stomach;;Small intestine;;Esophagus' AS choices,
      0 AS correct_answer
    UNION ALL
    SELECT
      'Which organ produces bile?',
      'Liver;;Pancreas;;Gallbladder;;Stomach',
      0 AS correct_answer
    UNION ALL
    SELECT
      'What is the longest part of the digestive system?',
      'Small intestine;;Large intestine;;Esophagus;;Stomach',
      0 AS correct_answer
    UNION ALL
    SELECT
      'Which enzyme breaks down proteins in the stomach?',
      'Pepsin;;Amylase;;Lipase;;Trypsin',
      0 AS correct_answer
    UNION ALL
    SELECT
      'Explain the role of villi in the small intestine:',
      NULL,
      NULL
  ) q
WHERE
  a.title = 'Digestive System Overview';