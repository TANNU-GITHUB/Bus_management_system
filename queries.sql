CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email varchar(200) not null,
    password VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100)
);