CREATE ROLE "user" LOGIN PASSWORD 'password';

-- Keep the runtime role limited to the exercise workflow: it can recreate the
-- training databases, but it is not a superuser and cannot manage other roles.
ALTER ROLE "user" NOSUPERUSER NOCREATEROLE CREATEDB NOREPLICATION NOBYPASSRLS;

GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT ALL ON SCHEMA public TO "user";
