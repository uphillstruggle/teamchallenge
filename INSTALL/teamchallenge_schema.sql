--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3 (Ubuntu 12.3-1.pgdg16.04+1)
-- Dumped by pg_dump version 12.2

-- Started on 2020-08-22 08:20:52 BST

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
-- TOC entry 7 (class 2615 OID 5832119)
-- Name: teamchallenge; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA teamchallenge;


SET default_table_access_method = heap;

--
-- TOC entry 205 (class 1259 OID 5832122)
-- Name: activities; Type: TABLE; Schema: teamchallenge; Owner: -
--

CREATE TABLE teamchallenge.activities (
    id bigint NOT NULL,
    athlete_id bigint,
    name text,
    distance numeric(10,0) DEFAULT NULL::numeric,
    total_elevation_gain numeric(10,0) DEFAULT NULL::numeric,
    type text,
    start_date timestamp with time zone,
    stage integer
);


--
-- TOC entry 206 (class 1259 OID 5832133)
-- Name: activity_types; Type: TABLE; Schema: teamchallenge; Owner: -
--

CREATE TABLE teamchallenge.activity_types (
    id integer NOT NULL,
    strava_name text,
    friendly_name text
);


--
-- TOC entry 207 (class 1259 OID 5832140)
-- Name: activity_types_events; Type: TABLE; Schema: teamchallenge; Owner: -
--

CREATE TABLE teamchallenge.activity_types_events (
    event_id integer,
    activity_type_id integer
);


--
-- TOC entry 212 (class 1259 OID 6031372)
-- Name: athletes; Type: TABLE; Schema: teamchallenge; Owner: -
--

CREATE TABLE teamchallenge.athletes (
    id bigint NOT NULL,
    teamid bigint,
    username text,
    firstname text,
    lastname text,
    country text,
    profile_medium text,
    profile text,
    sex text,
    access_token text,
    refresh_token text
);


--
-- TOC entry 208 (class 1259 OID 5832151)
-- Name: events; Type: TABLE; Schema: teamchallenge; Owner: -
--

CREATE TABLE teamchallenge.events (
    id integer NOT NULL,
    projectid integer,
    distance_goal integer,
    money_goal integer,
    currencyid integer,
    elevation_goal integer,
    name text,
    description text,
    first_date timestamp with time zone,
    last_date timestamp with time zone,
    shortname character varying(45),
    shareimage character varying(255),
    firebase_config character varying,
    firebase_config2 character varying
);


--
-- TOC entry 209 (class 1259 OID 5832157)
-- Name: projects; Type: TABLE; Schema: teamchallenge; Owner: -
--

CREATE TABLE teamchallenge.projects (
    id integer NOT NULL,
    name text,
    club integer
);


--
-- TOC entry 213 (class 1259 OID 7033351)
-- Name: stages; Type: TABLE; Schema: teamchallenge; Owner: -
--

CREATE TABLE teamchallenge.stages (
    distance integer,
    elevation integer,
    eventid integer NOT NULL,
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    startdistance integer,
    image character varying(255),
    stage integer
);


--
-- TOC entry 211 (class 1259 OID 5857739)
-- Name: webhook_messages; Type: TABLE; Schema: teamchallenge; Owner: -
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

CREATE TABLE teamchallenge.session (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE teamchallenge.session ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON teamchallenge.session ("expire");

CREATE TABLE teamchallenge.teams
(
    id integer NOT NULL,
    name character varying COLLATE "default" NOT NULL,
    charityid integer,
    CONSTRAINT teams_pkey PRIMARY KEY (id)
);

CREATE TABLE teamchallenge.charities
(
    id integer NOT NULL,
    name character varying COLLATE "default" NOT NULL,
    banner_image character varying COLLATE "default",
    CONSTRAINT charities_pkey PRIMARY KEY (id)
);

--
-- TOC entry 210 (class 1259 OID 5857737)
-- Name: webhook_messages_id_seq; Type: SEQUENCE; Schema: teamchallenge; Owner: -
--

CREATE SEQUENCE teamchallenge.webhook_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3893 (class 0 OID 0)
-- Dependencies: 210
-- Name: webhook_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: teamchallenge; Owner: -
--

ALTER SEQUENCE teamchallenge.webhook_messages_id_seq OWNED BY teamchallenge.webhook_messages.id;


--
-- TOC entry 3741 (class 2604 OID 5857742)
-- Name: webhook_messages id; Type: DEFAULT; Schema: teamchallenge; Owner: -
--

ALTER TABLE ONLY teamchallenge.webhook_messages ALTER COLUMN id SET DEFAULT nextval('teamchallenge.webhook_messages_id_seq'::regclass);


--
-- TOC entry 3743 (class 2606 OID 5832223)
-- Name: activities activity_id_key; Type: CONSTRAINT; Schema: teamchallenge; Owner: -
--

ALTER TABLE ONLY teamchallenge.activities
    ADD CONSTRAINT activity_id_key PRIMARY KEY (id);


--
-- TOC entry 3758 (class 2606 OID 6031379)
-- Name: athletes athlete_id_key; Type: CONSTRAINT; Schema: teamchallenge; Owner: -
--

ALTER TABLE ONLY teamchallenge.athletes
    ADD CONSTRAINT athlete_id_key PRIMARY KEY (id);


--
-- TOC entry 3746 (class 2606 OID 5832224)
-- Name: activity_types idx_16390_primary; Type: CONSTRAINT; Schema: teamchallenge; Owner: -
--

ALTER TABLE ONLY teamchallenge.activity_types
    ADD CONSTRAINT idx_16390_primary PRIMARY KEY (id);


--
-- TOC entry 3750 (class 2606 OID 5832227)
-- Name: events idx_16402_primary; Type: CONSTRAINT; Schema: teamchallenge; Owner: -
--

ALTER TABLE ONLY teamchallenge.events
    ADD CONSTRAINT idx_16402_primary PRIMARY KEY (id);


--
-- TOC entry 3754 (class 2606 OID 5832226)
-- Name: projects idx_16408_primary; Type: CONSTRAINT; Schema: teamchallenge; Owner: -
--

ALTER TABLE ONLY teamchallenge.projects
    ADD CONSTRAINT idx_16408_primary PRIMARY KEY (id);


--
-- TOC entry 3761 (class 2606 OID 7033355)
-- Name: stages stages_pkey; Type: CONSTRAINT; Schema: teamchallenge; Owner: -
--

ALTER TABLE ONLY teamchallenge.stages
    ADD CONSTRAINT stages_pkey PRIMARY KEY (id);


--
-- TOC entry 3756 (class 2606 OID 5857744)
-- Name: webhook_messages webhook_messages_pkey; Type: CONSTRAINT; Schema: teamchallenge; Owner: -
--

ALTER TABLE ONLY teamchallenge.webhook_messages
    ADD CONSTRAINT webhook_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3744 (class 1259 OID 5832178)
-- Name: idx_16387_id_unique; Type: INDEX; Schema: teamchallenge; Owner: -
--

CREATE UNIQUE INDEX idx_16387_id_unique ON teamchallenge.activities USING btree (id);


--
-- TOC entry 3747 (class 1259 OID 5832181)
-- Name: idx_16393_event_id_idx; Type: INDEX; Schema: teamchallenge; Owner: -
--

CREATE INDEX idx_16393_event_id_idx ON teamchallenge.activity_types_events USING btree (event_id);


--
-- TOC entry 3748 (class 1259 OID 5832194)
-- Name: idx_16393_event_type_id_idx; Type: INDEX; Schema: teamchallenge; Owner: -
--

CREATE INDEX idx_16393_event_type_id_idx ON teamchallenge.activity_types_events USING btree (activity_type_id);

ALTER TABLE teamchallenge.activity_types_events
    ADD CONSTRAINT con_ae UNIQUE (event_id, activity_type_id);


--
-- TOC entry 3759 (class 1259 OID 6031380)
-- Name: idx_16396_id_unique; Type: INDEX; Schema: teamchallenge; Owner: -
--

CREATE UNIQUE INDEX idx_16396_id_unique ON teamchallenge.athletes USING btree (id);


--
-- TOC entry 3751 (class 1259 OID 5832197)
-- Name: idx_16402_projectid_idx; Type: INDEX; Schema: teamchallenge; Owner: -
--

CREATE INDEX idx_16402_projectid_idx ON teamchallenge.events USING btree (projectid);


--
-- TOC entry 3752 (class 1259 OID 5832195)
-- Name: idx_16408_id_unique; Type: INDEX; Schema: teamchallenge; Owner: -
--

CREATE UNIQUE INDEX idx_16408_id_unique ON teamchallenge.projects USING btree (id);


-- Completed on 2020-08-22 08:20:59 BST

--
-- PostgreSQL database dump complete
--

