CREATE TABLE users (
    id SERIAL PRIMARY KEY,
	email VARCHAR(100),
	password VARCHAR(100),
	tokens TEXT,
	profileImg TEXT
);

CREATE TABLE employers (
    id SERIAL PRIMARY KEY,
	email VARCHAR(100),
	password VARCHAR(100),
	tokens TEXT,
	profileImg TEXT
);

CREATE TABLE employerProfile (
    id INTEGER REFERENCES employers(id),
    companyName VARCHAR(50),
    locations VARCHAR(100),
    webLink TEXT,
    companyType VARCHAR(50),
    addRes BYTEA,
    fbLink TEXT,
    twitter TEXT,
    linkedin TEXT,
    about TEXT
);

CREATE TABLE userProfile(
    id INTEGER REFERENCES users(id),
    username VARCHAR(50),
    email VARCHAR(100),
    skills TEXT[],
    locations VARCHAR(100),
    domains TEXT[],
    portfolio TEXT,
    linkedin TEXT,
    resume BYTEA,
    experience VARCHAR(10),
    github TEXT
);

CREATE TABLE jobs (
    employer_id INTEGER, 
    job_id SERIAL PRIMARY KEY,
    title VARCHAR(50), 
    skill TEXT[], 
    location VARCHAR(100), 
    stipend VARCHAR(10), 
    enddaate VARCHAR(10), 
    no_of INTEGER, 
    experience VARCHAR(10), 
    job_desc TEXT, 
    companyName VARCHAR(50),
    applicants INTEGER
);

CREATE TABLE appliedjob(
    job_id INTEGER, 
    user_id INTEGER, 
    why TEXT, 
    what TEXT, 
    are VARCHAR(40), 
    resume BYTEA,
    status TEXT
);