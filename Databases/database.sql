CREATE DATABASE eventhandle;

-- set extension
CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE events(
    event_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_id uuid,
    event_name VARCHAR(255) NOT NULL,
    event_date VARCHAR(11) NOT NULL,
    can_show BOOLEAN NOT NULL,
    -- PRIMARY KEY (event_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE audience(
    person_id SERIAL,
    event_id uuid,
    person_name VARCHAR(255) NOT NULL,
    person_age VARCHAR(255) NOT NULL,
    person_collage VARCHAR(255) NOT NULL,
    person_number VARCHAR(14) NOT NULL,
    person_email VARCHAR(255) NOT NULL,
    PRIMARY KEY (person_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);
