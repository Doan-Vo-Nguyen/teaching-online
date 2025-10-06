-- Migration to update language_code table for OneCompiler integration
-- This migration changes the id column from int to varchar to support OneCompiler language IDs

-- Check if language_code table exists, if not create it
CREATE TABLE IF NOT EXISTS teaching.language_code (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- First, create a backup table
CREATE TABLE IF NOT EXISTS language_code_backup AS SELECT * FROM teaching.language_code;

-- Add new columns if they don't exist
ALTER TABLE teaching.language_code
ADD COLUMN IF NOT EXISTS languageType VARCHAR(50) NULL,
ADD COLUMN IF NOT EXISTS supportedFlags VARCHAR(255) NULL;

-- Change the primary key type from INT to VARCHAR(50)
-- Drop existing primary key
ALTER TABLE teaching.language_code DROP PRIMARY KEY;

-- Alter column type
ALTER TABLE teaching.language_code MODIFY COLUMN id VARCHAR(50) NOT NULL;

-- Add primary key back
ALTER TABLE teaching.language_code ADD PRIMARY KEY (id);

-- Insert OneCompiler supported languages (only if they don't exist)
INSERT IGNORE INTO language_code (id, name, languageType, supportedFlags) VALUES
-- Programming Languages
('python', 'Python', 'programming', ''),
('python2', 'Python2', 'programming', ''),
('javascript', 'JavaScript', 'programming', ''),
('typescript', 'TypeScript', 'programming', ''),
('java', 'Java', 'programming', ''),
('c', 'C', 'programming', ''),
('cpp', 'C++', 'programming', ''),
('csharp', 'C#', 'programming', ''),
('go', 'Go', 'programming', ''),
('rust', 'Rust', 'programming', ''),
('php', 'PHP', 'programming', ''),
('ruby', 'Ruby', 'programming', ''),
('bash', 'Bash', 'programming', ''),
('lua', 'Lua', 'programming', ''),
('haskell', 'Haskell', 'programming', ''),
('ocaml', 'OCaml', 'programming', ''),
('pascal', 'Pascal', 'programming', ''),
('elixir', 'Elixir', 'programming', ''),
('erlang', 'Erlang', 'programming', ''),
('prolog', 'Prolog', 'programming', ''),
('octave', 'Octave', 'programming', ''),
('ada', 'Ada', 'programming', ''),
('assembly', 'Assembly', 'programming', ''),
('basic', 'Basic', 'programming', ''),
('brainfk', 'BrainFK', 'programming', ''),
('bun', 'Bun', 'programming', ''),
('clojure', 'Clojure', 'programming', ''),
('cobol', 'Cobol', 'programming', ''),
('coffeescript', 'CoffeeScript', 'programming', ''),
('commonlisp', 'CommonLisp', 'programming', ''),
('d', 'D', 'programming', ''),
('dart', 'Dart', 'programming', ''),
('deno', 'Deno', 'programming', ''),
('ejs', 'EJS', 'programming', ''),
('fsharp', 'F#', 'programming', ''),
('fortran', 'Fortran', 'programming', ''),
('groovy', 'Groovy', 'programming', ''),
('jshell', 'JShell', 'programming', ''),
('kotlin', 'Kotlin', 'programming', ''),
('objectivec', 'Objective-C', 'programming', ''),
('racket', 'Racket', 'programming', ''),
('scala', 'Scala', 'programming', ''),
('swift', 'Swift', 'programming', ''),
('tcl', 'Tcl', 'programming', ''),
('text', 'Text', 'programming', ''),
('vb', 'Visual Basic (VB.NET)', 'programming', ''),

-- Web Technologies
('html', 'HTML', 'web', 'persist'),
('angular', 'Angular', 'web', ''),
('backbonejs', 'BackboneJS', 'web', ''),
('bootstrap', 'Bootstrap', 'web', ''),
('bulma', 'Bulma', 'web', ''),
('foundation', 'Foundation', 'web', ''),
('jquery', 'JQuery', 'web', ''),
('materialize', 'Materialize', 'web', ''),
('milligram', 'Milligram', 'web', ''),
('paperCss', 'PaperCSS', 'web', ''),
('react', 'React', 'web', ''),
('semanticUI', 'Semantic UI', 'web', ''),
('skeleton', 'Skeleton', 'web', ''),
('uikit', 'Uikit', 'web', ''),
('vue', 'Vue', 'web', ''),

-- Database
('mariadb', 'MariaDB', 'database', ''),
('sqlserver', 'Microsoft SQL Server', 'database', ''),
('mongodb', 'MongoDB', 'database', ''),
('mysql', 'MySQL', 'database', '--table, --tabbed, --vertical'),
('oracle', 'Oracle Database', 'database', ''),
('plsql', 'Oracle PL/SQL', 'database', ''),
('postgresql', 'PostgreSQL', 'database', ''),
('redis', 'Redis', 'database', ''),
('sqlite', 'SQLite', 'database', '');

-- Create exam_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS teaching.exam_content (
  id INT NOT NULL AUTO_INCREMENT,
  exam_id INT NOT NULL,
  question VARCHAR(500) NOT NULL,
  answer VARCHAR(500) NOT NULL,
  language_id VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_exam_content_exam_id (exam_id),
  INDEX idx_exam_content_language_id (language_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add language_id column to exam_content table if it doesn't exist
ALTER TABLE teaching.exam_content 
ADD COLUMN IF NOT EXISTS language_id VARCHAR(50) NULL;

-- Add foreign key constraint for language_id in exam_content
ALTER TABLE teaching.exam_content 
ADD CONSTRAINT FK_exam_content_language 
FOREIGN KEY (language_id) REFERENCES teaching.language_code(id) 
ON DELETE SET NULL;

-- Create exam_submission_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS teaching.exam_submission_content (
  id INT NOT NULL AUTO_INCREMENT,
  exam_submission_id INT NOT NULL,
  question VARCHAR(500) NOT NULL,
  answer VARCHAR(500) NOT NULL,
  language_id VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_exam_submission_content_submission_id (exam_submission_id),
  INDEX idx_exam_submission_content_language_id (language_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add language_id column to exam_submission_content table if it doesn't exist
ALTER TABLE teaching.exam_submission_content 
ADD COLUMN IF NOT EXISTS language_id VARCHAR(50) NULL;

-- Add foreign key constraint for language_id in exam_submission_content
ALTER TABLE teaching.exam_submission_content 
ADD CONSTRAINT FK_exam_submission_content_language 
FOREIGN KEY (language_id) REFERENCES teaching.language_code(id) 
ON DELETE SET NULL;

-- Update existing language records to OneCompiler format
-- This maps old numeric IDs to new string IDs
UPDATE teaching.language_code SET id = 'python', languageType = 'programming', supportedFlags = '' WHERE id = '71';
UPDATE teaching.language_code SET id = 'python2', languageType = 'programming', supportedFlags = '' WHERE id = '70';
UPDATE teaching.language_code SET id = 'java', languageType = 'programming', supportedFlags = '' WHERE id = '62';
UPDATE teaching.language_code SET id = 'cpp', languageType = 'programming', supportedFlags = '' WHERE id = '54';
UPDATE teaching.language_code SET id = 'c', languageType = 'programming', supportedFlags = '' WHERE id = '50';
UPDATE teaching.language_code SET id = 'javascript', languageType = 'programming', supportedFlags = '' WHERE id = '63';
UPDATE teaching.language_code SET id = 'typescript', languageType = 'programming', supportedFlags = '' WHERE id = '74';
UPDATE teaching.language_code SET id = 'csharp', languageType = 'programming', supportedFlags = '' WHERE id = '51';
UPDATE teaching.language_code SET id = 'go', languageType = 'programming', supportedFlags = '' WHERE id = '60';
UPDATE teaching.language_code SET id = 'rust', languageType = 'programming', supportedFlags = '' WHERE id = '73';
UPDATE teaching.language_code SET id = 'php', languageType = 'programming', supportedFlags = '' WHERE id = '68';
UPDATE teaching.language_code SET id = 'ruby', languageType = 'programming', supportedFlags = '' WHERE id = '72';
UPDATE teaching.language_code SET id = 'bash', languageType = 'programming', supportedFlags = '' WHERE id = '46';
UPDATE teaching.language_code SET id = 'lua', languageType = 'programming', supportedFlags = '' WHERE id = '64';
UPDATE teaching.language_code SET id = 'haskell', languageType = 'programming', supportedFlags = '' WHERE id = '61';
UPDATE teaching.language_code SET id = 'ocaml', languageType = 'programming', supportedFlags = '' WHERE id = '65';
UPDATE teaching.language_code SET id = 'pascal', languageType = 'programming', supportedFlags = '' WHERE id = '67';
UPDATE teaching.language_code SET id = 'elixir', languageType = 'programming', supportedFlags = '' WHERE id = '57';
UPDATE teaching.language_code SET id = 'erlang', languageType = 'programming', supportedFlags = '' WHERE id = '58';
UPDATE teaching.language_code SET id = 'prolog', languageType = 'programming', supportedFlags = '' WHERE id = '69';
UPDATE teaching.language_code SET id = 'octave', languageType = 'programming', supportedFlags = '' WHERE id = '66';

-- Update foreign key references in other tables
UPDATE teaching.exam_content SET language_id = 'python' WHERE language_id = '71';
UPDATE teaching.exam_content SET language_id = 'python2' WHERE language_id = '70';
UPDATE teaching.exam_content SET language_id = 'java' WHERE language_id = '62';
UPDATE teaching.exam_content SET language_id = 'cpp' WHERE language_id = '54';
UPDATE teaching.exam_content SET language_id = 'c' WHERE language_id = '50';
UPDATE teaching.exam_content SET language_id = 'javascript' WHERE language_id = '63';
UPDATE teaching.exam_content SET language_id = 'typescript' WHERE language_id = '74';
UPDATE teaching.exam_content SET language_id = 'csharp' WHERE language_id = '51';
UPDATE teaching.exam_content SET language_id = 'go' WHERE language_id = '60';
UPDATE teaching.exam_content SET language_id = 'rust' WHERE language_id = '73';
UPDATE teaching.exam_content SET language_id = 'php' WHERE language_id = '68';
UPDATE teaching.exam_content SET language_id = 'ruby' WHERE language_id = '72';
UPDATE teaching.exam_content SET language_id = 'bash' WHERE language_id = '46';
UPDATE teaching.exam_content SET language_id = 'lua' WHERE language_id = '64';
UPDATE teaching.exam_content SET language_id = 'haskell' WHERE language_id = '61';
UPDATE teaching.exam_content SET language_id = 'ocaml' WHERE language_id = '65';
UPDATE teaching.exam_content SET language_id = 'pascal' WHERE language_id = '67';
UPDATE teaching.exam_content SET language_id = 'elixir' WHERE language_id = '57';
UPDATE teaching.exam_content SET language_id = 'erlang' WHERE language_id = '58';
UPDATE teaching.exam_content SET language_id = 'prolog' WHERE language_id = '69';
UPDATE teaching.exam_content SET language_id = 'octave' WHERE language_id = '66';

-- Update foreign key references in exam_submission_content table
UPDATE teaching.exam_submission_content SET language_id = 'python' WHERE language_id = '71';
UPDATE teaching.exam_submission_content SET language_id = 'python2' WHERE language_id = '70';
UPDATE teaching.exam_submission_content SET language_id = 'java' WHERE language_id = '62';
UPDATE teaching.exam_submission_content SET language_id = 'cpp' WHERE language_id = '54';
UPDATE teaching.exam_submission_content SET language_id = 'c' WHERE language_id = '50';
UPDATE teaching.exam_submission_content SET language_id = 'javascript' WHERE language_id = '63';
UPDATE teaching.exam_submission_content SET language_id = 'typescript' WHERE language_id = '74';
UPDATE teaching.exam_submission_content SET language_id = 'csharp' WHERE language_id = '51';
UPDATE teaching.exam_submission_content SET language_id = 'go' WHERE language_id = '60';
UPDATE teaching.exam_submission_content SET language_id = 'rust' WHERE language_id = '73';
UPDATE teaching.exam_submission_content SET language_id = 'php' WHERE language_id = '68';
UPDATE teaching.exam_submission_content SET language_id = 'ruby' WHERE language_id = '72';
UPDATE teaching.exam_submission_content SET language_id = 'bash' WHERE language_id = '46';
UPDATE teaching.exam_submission_content SET language_id = 'lua' WHERE language_id = '64';
UPDATE teaching.exam_submission_content SET language_id = 'haskell' WHERE language_id = '61';
UPDATE teaching.exam_submission_content SET language_id = 'ocaml' WHERE language_id = '65';
UPDATE teaching.exam_submission_content SET language_id = 'pascal' WHERE language_id = '67';
UPDATE teaching.exam_submission_content SET language_id = 'elixir' WHERE language_id = '57';
UPDATE teaching.exam_submission_content SET language_id = 'erlang' WHERE language_id = '58';
UPDATE teaching.exam_submission_content SET language_id = 'prolog' WHERE language_id = '69';
UPDATE teaching.exam_submission_content SET language_id = 'octave' WHERE language_id = '66';
