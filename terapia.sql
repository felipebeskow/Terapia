CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS aut_login (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  login TEXT,
  last_update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_update_login UUID,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  creation_login UUID,
  display_name TEXT
);
CREATE TABLE IF NOT EXISTS aut_password (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  password TEXT,
  last_update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_update_login UUID,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  creation_login UUID,
  login_id UUID references aut_login(id),
  actual_flag boolean default false
);
insert into aut_login(login, display_name) values ('admin','User default');
commit;
