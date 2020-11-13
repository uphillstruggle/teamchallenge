--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: teamchallenge; Type: DATABASE; Schema: -; Owner: simonb
--

CREATE DATABASE teamchallenge WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_GB.UTF-8' LC_CTYPE = 'en_GB.UTF-8';


ALTER DATABASE teamchallenge OWNER TO simonb;

\connect teamchallenge

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: teamchallenge; Type: DATABASE PROPERTIES; Schema: -; Owner: simonb
--

ALTER DATABASE teamchallenge SET search_path TO 'public', 'strava';


\connect teamchallenge

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: teamchallenge; Type: SCHEMA; Schema: -; Owner: simonb
--

CREATE SCHEMA teamchallenge;


ALTER SCHEMA teamchallenge OWNER TO simonb;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.activities (
    id bigint NOT NULL,
    athlete_id bigint NOT NULL,
    name character varying(255),
    distance numeric(10,0),
    total_elevation_gain numeric(10,0),
    type character varying(45),
    start_date timestamp with time zone,
    stage integer
);


ALTER TABLE teamchallenge.activities OWNER TO simonb;

--
-- Name: activity_types; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.activity_types (
    id integer NOT NULL,
    strava_name character varying(45),
    friendly_name character varying(45)
);


ALTER TABLE teamchallenge.activity_types OWNER TO simonb;

--
-- Name: activity_types_events; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.activity_types_events (
    event_id integer,
    activity_type_id integer
);


ALTER TABLE teamchallenge.activity_types_events OWNER TO simonb;

--
-- Name: athletes; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.athletes (
    id bigint NOT NULL,
    username character varying(45),
    firstname character varying(45),
    lastname character varying(45),
    country character varying(45),
    profile_medium character varying(255),
    profile character varying(255),
    sex character varying(2),
    access_token character varying(45),
    refresh_token character varying(45),
    teamid integer
);


ALTER TABLE teamchallenge.athletes OWNER TO simonb;

--
-- Name: charities_id_seq; Type: SEQUENCE; Schema: teamchallenge; Owner: simonb
--

CREATE SEQUENCE teamchallenge.charities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE teamchallenge.charities_id_seq OWNER TO simonb;

--
-- Name: charities; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.charities (
    id integer DEFAULT nextval('teamchallenge.charities_id_seq'::regclass) NOT NULL,
    name character varying NOT NULL,
    banner_image character varying
);


ALTER TABLE teamchallenge.charities OWNER TO simonb;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: teamchallenge; Owner: simonb
--

CREATE SEQUENCE teamchallenge.events_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER TABLE teamchallenge.events_id_seq OWNER TO simonb;

--
-- Name: events; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.events (
    id integer DEFAULT nextval('teamchallenge.events_id_seq'::regclass) NOT NULL,
    projectid integer,
    distance_goal integer,
    money_goal integer,
    currencyid integer,
    elevation_goal integer,
    name character varying(45),
    description character varying(1024),
    first_date timestamp with time zone,
    last_date timestamp with time zone,
    shortname character varying(45),
    shareimage character varying(255),
    firebase_config character varying,
    firebase_config2 character varying
);


ALTER TABLE teamchallenge.events OWNER TO simonb;

--
-- Name: projects; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.projects (
    id integer NOT NULL,
    name character varying(45),
    club integer
);


ALTER TABLE teamchallenge.projects OWNER TO simonb;

--
-- Name: session; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE teamchallenge.session OWNER TO simonb;

--
-- Name: stages_id_seq; Type: SEQUENCE; Schema: teamchallenge; Owner: simonb
--

CREATE SEQUENCE teamchallenge.stages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE teamchallenge.stages_id_seq OWNER TO simonb;

--
-- Name: stages; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.stages (
    distance integer,
    elevation integer,
    eventid integer NOT NULL,
    id integer DEFAULT nextval('teamchallenge.stages_id_seq'::regclass) NOT NULL,
    name character varying(32) NOT NULL,
    startdistance integer,
    image character varying(255),
    stage integer
);


ALTER TABLE teamchallenge.stages OWNER TO simonb;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: teamchallenge; Owner: simonb
--

CREATE SEQUENCE teamchallenge.teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE teamchallenge.teams_id_seq OWNER TO simonb;

--
-- Name: teams; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.teams (
    id integer DEFAULT nextval('teamchallenge.teams_id_seq'::regclass) NOT NULL,
    name character varying NOT NULL,
    charityid integer
);


ALTER TABLE teamchallenge.teams OWNER TO simonb;

--
-- Name: webhook_messages; Type: TABLE; Schema: teamchallenge; Owner: simonb
--

CREATE TABLE teamchallenge.webhook_messages (
    id integer NOT NULL,
    aspect_type character varying(45),
    event_time integer,
    object_id bigint,
    object_type character varying(45),
    owner_id integer,
    subscription_id integer,
    updates character varying(255),
    received_at timestamp with time zone,
    http_type character varying(45)
);


ALTER TABLE teamchallenge.webhook_messages OWNER TO simonb;

--
-- Name: webhook_messages_id_seq; Type: SEQUENCE; Schema: teamchallenge; Owner: simonb
--

CREATE SEQUENCE teamchallenge.webhook_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE teamchallenge.webhook_messages_id_seq OWNER TO simonb;

--
-- Name: webhook_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: teamchallenge; Owner: simonb
--

ALTER SEQUENCE teamchallenge.webhook_messages_id_seq OWNED BY teamchallenge.webhook_messages.id;


--
-- Name: webhook_messages id; Type: DEFAULT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.webhook_messages ALTER COLUMN id SET DEFAULT nextval('teamchallenge.webhook_messages_id_seq'::regclass);


--
-- Name: activities activity_id_key; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.activities
    ADD CONSTRAINT activity_id_key PRIMARY KEY (id);


--
-- Name: athletes athlete_id_key; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.athletes
    ADD CONSTRAINT athlete_id_key PRIMARY KEY (id);


--
-- Name: charities charities_pkey; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.charities
    ADD CONSTRAINT charities_pkey PRIMARY KEY (id);


--
-- Name: activity_types_events con_ae; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.activity_types_events
    ADD CONSTRAINT con_ae UNIQUE (event_id, activity_type_id);


--
-- Name: activity_types idx_16390_primary; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.activity_types
    ADD CONSTRAINT idx_16390_primary PRIMARY KEY (id);


--
-- Name: events idx_16402_primary; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.events
    ADD CONSTRAINT idx_16402_primary PRIMARY KEY (id);


--
-- Name: projects idx_16408_primary; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.projects
    ADD CONSTRAINT idx_16408_primary PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: stages stages_pkey; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.stages
    ADD CONSTRAINT stages_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: webhook_messages webhook_messages_pkey; Type: CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.webhook_messages
    ADD CONSTRAINT webhook_messages_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: teamchallenge; Owner: simonb
--

CREATE INDEX "IDX_session_expire" ON teamchallenge.session USING btree (expire);


--
-- Name: idx_16387_id_unique; Type: INDEX; Schema: teamchallenge; Owner: simonb
--

CREATE UNIQUE INDEX idx_16387_id_unique ON teamchallenge.activities USING btree (id);


--
-- Name: idx_16393_event_id_idx; Type: INDEX; Schema: teamchallenge; Owner: simonb
--

CREATE INDEX idx_16393_event_id_idx ON teamchallenge.activity_types_events USING btree (event_id);


--
-- Name: idx_16393_event_type_id_idx; Type: INDEX; Schema: teamchallenge; Owner: simonb
--

CREATE INDEX idx_16393_event_type_id_idx ON teamchallenge.activity_types_events USING btree (activity_type_id);


--
-- Name: idx_16396_id_unique; Type: INDEX; Schema: teamchallenge; Owner: simonb
--

CREATE UNIQUE INDEX idx_16396_id_unique ON teamchallenge.athletes USING btree (id);


--
-- Name: idx_16402_projectid_idx; Type: INDEX; Schema: teamchallenge; Owner: simonb
--

CREATE INDEX idx_16402_projectid_idx ON teamchallenge.events USING btree (projectid);


--
-- Name: idx_16408_id_unique; Type: INDEX; Schema: teamchallenge; Owner: simonb
--

CREATE UNIQUE INDEX idx_16408_id_unique ON teamchallenge.projects USING btree (id);


--
-- Name: activity_types_events event_id; Type: FK CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.activity_types_events
    ADD CONSTRAINT event_id FOREIGN KEY (event_id) REFERENCES teamchallenge.events(id);


--
-- Name: activity_types_events event_type_id; Type: FK CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.activity_types_events
    ADD CONSTRAINT event_type_id FOREIGN KEY (activity_type_id) REFERENCES teamchallenge.activity_types(id);


--
-- Name: events projectid; Type: FK CONSTRAINT; Schema: teamchallenge; Owner: simonb
--

ALTER TABLE ONLY teamchallenge.events
    ADD CONSTRAINT projectid FOREIGN KEY (projectid) REFERENCES teamchallenge.projects(id);

--
-- Data for Name: activity_types; Type: TABLE DATA; Schema: teamchallenge; Owner: simonb
--

COPY teamchallenge.activity_types (id, strava_name, friendly_name) FROM stdin;
1	Ride	Ride
2	VirtualRide	Virtual Ride
3	Walk	Walk
4	Run	Run
5	Swim	Swim
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: teamchallenge; Owner: simonb
--

COPY teamchallenge.projects (id, name, club) FROM stdin;
1	Master	\N
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: teamchallenge; Owner: simonb
--

COPY teamchallenge.events (id, projectid, distance_goal, money_goal, currencyid, elevation_goal, name, description, first_date, last_date, shortname, shareimage, firebase_config, firebase_config2) FROM stdin;
6	\N	1000	\N	\N	\N	TDM	We did it! Thanks to everyone who participated in the Tour de Monterosa 2020, for your kind donations to a great cause and for all your feedback on this leaderboard app. Let's do it again soon!\r\n\r\n	2020-11-01 00:00:00+00	2020-11-30 00:00:00+00	TDM			
\.

--
-- Data for Name: activity_types_events; Type: TABLE DATA; Schema: teamchallenge; Owner: simonb
--

COPY teamchallenge.activity_types_events (event_id, activity_type_id) FROM stdin;
6	3
6	4
6	5
6	1
6	2
\.


--
-- Data for Name: charities; Type: TABLE DATA; Schema: teamchallenge; Owner: simonb
--

COPY teamchallenge.charities (id, name, banner_image) FROM stdin;
1	Blood Cancer UK	https://teamchallenge-tourdemonterosa.s3.amazonaws.com/bloodcancer.jpg
\.




--
-- Data for Name: stages; Type: TABLE DATA; Schema: teamchallenge; Owner: simonb
--

COPY teamchallenge.stages (distance, elevation, eventid, id, name, startdistance, image, stage) FROM stdin;
500	0	6	1	Minsk	0	https://teamchallenge-tourdemonterosa.s3.amazonaws.com/stages.003.png	1
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: teamchallenge; Owner: simonb
--

COPY teamchallenge.teams (id, name, charityid) FROM stdin;
7	Monterosa	1
\.



--
-- Name: charities_id_seq; Type: SEQUENCE SET; Schema: teamchallenge; Owner: simonb
--

SELECT pg_catalog.setval('teamchallenge.charities_id_seq', 1, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: teamchallenge; Owner: simonb
--

SELECT pg_catalog.setval('teamchallenge.events_id_seq', 6, true);


--
-- Name: stages_id_seq; Type: SEQUENCE SET; Schema: teamchallenge; Owner: simonb
--

SELECT pg_catalog.setval('teamchallenge.stages_id_seq', 1, false);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: teamchallenge; Owner: simonb
--

SELECT pg_catalog.setval('teamchallenge.teams_id_seq', 7, true);


--
-- Name: webhook_messages_id_seq; Type: SEQUENCE SET; Schema: teamchallenge; Owner: simonb
--

SELECT pg_catalog.setval('teamchallenge.webhook_messages_id_seq', 30, true);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump complete
--

