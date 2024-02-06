CREATE KEYSPACE IF NOT EXISTS accounts
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};



CREATE TABLE IF NOT EXISTS accounts.users (
    id UUID PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password TEXT,
    activation_link UUID,
    is_activated int,
);

CREATE MATERIALIZED VIEW IF NOT EXISTS accounts.users_by_activation_link AS
SELECT
activation_link,
    id
FROM accounts.users
WHERE activation_link is not null
PRIMARY KEY (activation_link, id);

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


