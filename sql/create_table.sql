CREATE TABLE teams (
  id serial PRIMARY key,
  team_id varchar(20) NOT NULL,
  access_token text NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL,
  CONSTRAINT team_id_unique UNIQUE (team_id)
);
