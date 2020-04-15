-- CREATE DATABASE FIRST IN YOUR LOCAL POSTGRES DB
-- YOU DON'T NEET TO DO THIS WITH HEROKU POSTGRES ADDONS
CREATE DATABASE challenges;

-- create table challenge
CREATE TABLE challenge
(
    challenge_id TEXT PRIMARY KEY NOT NULL,
    title VARCHAR(100) UNIQUE,
    hash_tag VARCHAR(50),
    goal VARCHAR(100),
    date_created TIMESTAMP
);

-- create table for challenge_detail
CREATE TABLE challenge_detail
(
    parent_id TEXT REFERENCES challenge(challenge_id),
    tweet VARCHAR(280),
    date_created TIMESTAMP
);

--  create table for skill_list
CREATE TABLE skill_list
(
    skill_id TEXT,
    skill_name VARCHAR(50) NOT NULL UNIQUE,
    new_skill INTEGER,
    progress_skill INTEGER,
    complete_skill INTEGER,
    date_created TIMESTAMP
);
