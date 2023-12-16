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
insert into aut_login(login,display_name)
select 
	'admin' login, 
	'User default' display_name
where not exists (select * from aut_login);
insert into aut_password(login_id, password, actual_flag)
select 
	(select id from aut_login where login = 'admin') login_id, 
	'7407946a7a90b037ba5e825040f184a142161e4c61d81feb83ec8c7f011a99b0d77f39c9170c3231e1003c5cf859c69bd93043b095feff5cce6f6d45ec513764' password,  --cryptoJs.SHA3("admin").toString()
	true actual_flag
where not exists (select * from aut_password);
commit;
CREATE TABLE IF NOT EXISTS public.aut_login_log(
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    login_id uuid,
    last_update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_update_login uuid,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creation_login uuid,
    log json NOT NULL
);
