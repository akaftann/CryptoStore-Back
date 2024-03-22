CREATE KEYSPACE IF NOT EXISTS accounts
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};



CREATE TABLE IF NOT EXISTS accounts.users (
    id UUID PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password TEXT,
    activation_code int,
    external_id TEXT,
    is_activated int,
    is_verified int,
    sumsub_token text,
    otp_enabled int,
    otp_verified int,
    otp_auth_url text,
    otp_secret text,
    first_otp_passed int,
);

CREATE MATERIALIZED VIEW accounts.users_by_email AS
    SELECT email, id, activation_code, first_name, is_activated, last_name, password, sumsub_token, 
    is_verified, external_id, otp_enabled, first_otp_passed
    FROM accounts.users
    WHERE email IS NOT null AND id IS NOT null
    PRIMARY KEY (email, id);


CREATE MATERIALIZED VIEW IF NOT EXISTS accounts.users_by_external_id AS
SELECT
external_id,
    id,
    is_verified,
    email,
    first_otp_passed
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


CREATE TABLE IF NOT EXISTS accounts.wallets (
    id UUID PRIMARY KEY,
    wallet_number TEXT,
    network TEXT,
    user_id UUID,
);

CREATE MATERIALIZED VIEW IF NOT EXISTS accounts.wallet_by_user AS
SELECT
user_id,
    id,
    wallet_number,
    network
FROM accounts.wallets
WHERE user_id is not null
PRIMARY KEY (user_id, id);



