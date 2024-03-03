CREATE KEYSPACE IF NOT EXISTS accounts
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};



CREATE TABLE IF NOT EXISTS accounts.users (
    id UUID PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password TEXT,
    activation_link UUID,
    external_id TEXT,
    is_activated int,
    is_verified int,
    sumsub_token text;
);

CREATE MATERIALIZED VIEW accounts.users_by_email AS
    SELECT email, id, activation_link, first_name, is_activated, last_name, password, sumsub_token, is_verified, external_id
    FROM accounts.users
    WHERE email IS NOT null AND id IS NOT null
    PRIMARY KEY (email, id);

CREATE MATERIALIZED VIEW IF NOT EXISTS accounts.users_by_activation_link AS
SELECT
activation_link,
    id,
    is_verified,
    email,
    external_id
FROM accounts.users
WHERE activation_link is not null
PRIMARY KEY (activation_link, id);

CREATE MATERIALIZED VIEW IF NOT EXISTS accounts.users_by_external_id AS
SELECT
external_id,
    id,
    is_verified,
    email
FROM accounts.users
WHERE external_id is not null
PRIMARY KEY (external_id, id);

CREATE TABLE IF NOT EXISTS accounts.tokens (
    id UUID PRIMARY KEY,
    user_id UUID,
    refresh_token TEXT,
);

CREATE MATERIALIZED VIEW IF NOT EXISTS accounts.tokents_by_user AS
SELECT
    user_id,
    id,
    refresh_token
FROM accounts.tokens
WHERE user_id is not null
PRIMARY KEY (user_id, id);

CREATE MATERIALIZED VIEW IF NOT EXISTS accounts.tokents_by_refresh AS
SELECT
    refresh_token,
    id,
    user_id
FROM accounts.tokens
WHERE refresh_token is not null
PRIMARY KEY (refresh_token, id);


