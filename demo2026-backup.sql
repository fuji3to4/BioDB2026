--
-- PostgreSQL database dump
--

\restrict dLiSByOWn0Ss350rTn6hyvlIun7RrgUeiQveT5D6LLYtxmfTwCKMaDfgnSjbIOB

-- Dumped from database version 17.10 (Debian 17.10-1.pgdg13+1)
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: pdb; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.pdb (
    pdbid character(4) NOT NULL,
    method character(20) NOT NULL,
    resolution double precision,
    chain character(20) NOT NULL,
    positions character(10) NOT NULL,
    deposited date NOT NULL,
    class character(30),
    url text
);


ALTER TABLE public.pdb OWNER TO "user";

--
-- Name: pdb2protein; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.pdb2protein (
    pdbid character(4) NOT NULL,
    proteinid integer NOT NULL
);


ALTER TABLE public.pdb2protein OWNER TO "user";

--
-- Name: protein; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.protein (
    proteinid integer NOT NULL,
    name character(50) NOT NULL,
    organism character(30) NOT NULL,
    len integer NOT NULL,
    fav integer NOT NULL
);


ALTER TABLE public.protein OWNER TO "user";

--
-- Name: protein_proteinid_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.protein_proteinid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.protein_proteinid_seq OWNER TO "user";

--
-- Name: protein_proteinid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.protein_proteinid_seq OWNED BY public.protein.proteinid;


--
-- Name: protein proteinid; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.protein ALTER COLUMN proteinid SET DEFAULT nextval('public.protein_proteinid_seq'::regclass);


--
-- Data for Name: pdb; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.pdb (pdbid, method, resolution, chain, positions, deposited, class, url) FROM stdin;
1AGW	X-ray               	2.4	A/B                 	456-765   	1997-03-25	Enzyme                        	https://www.rcsb.org/structure/1AGW
1CVS	X-ray               	2.8	C/D                 	141-365   	1999-08-24	Membrane                      	https://www.rcsb.org/structure/1CVS
1A30	X-ray               	2	A/B                 	489-587   	1998-01-27	Enzyme                        	https://www.rcsb.org/structure/1A30
1MBE	NMR                 	\N	A                   	38-89     	1995-05-19	DNA-Binding                   	https://www.rcsb.org/structure/1MBE
1GUU	X-ray               	1.6	A                   	38-89     	2002-01-30	DNA-Binding                   	https://www.rcsb.org/structure/1GUU
1LMB	X-ray               	1.8	C/D                 	2-93      	1991-11-05	DNA-Binding                   	https://www.rcsb.org/structure/1LMB
4RWF	X-ray               	1.76	A                   	31-116    	2014-12-03	Membrane                      	https://www.rcsb.org/structure/4RWF
2AMA	X-ray               	1.9	A                   	655-920   	2005-08-09	Signaling Protein             	https://www.rcsb.org/structure/2AMA
3EML	X-ray               	2.6	A/B/C/D             	1-297     	2008-09-24	Membrene                      	https://www.rcsb.org/structure/3EML
4HHB	X-ray               	1.74	A/C                 	2-142     	1984-03-07	Enzyme                        	https://www.rcsb.org/structure/4HHB
5P21	X-ray               	1.35	A                   	1-166     	1990-10-15	Signaling Protein             	https://www.rcsb.org/structure/5P21
1UBQ	X-ray               	1.8	A                   	1-76      	1987-01-02	Protein Binding               	https://www.rcsb.org/structure/1UBQ
3LCK	X-ray               	1.7	A                   	231-501   	1997-04-08	Enzyme                        	https://www.rcsb.org/structure/3LCK
2DN2	X-ray               	1.25	A/C                 	2-142     	2006-04-25	Enzyme                        	https://www.rcsb.org/structure/2DN2
2XYZ	Electron Microscopy 	4	A/B/C/D/E/F/G       	1-430     	2010-11-19	Enzyme                        	https://www.rcsb.org/structure/2XYZ
3L3X	X-ray               	1.55	A                   	671-919   	2009-12-18	Signaling Protein             	https://www.rcsb.org/structure/3L3X
1IVO	X-ray               	3.3	A/B                 	25-646    	2002-03-28	Signaling Protein             	https://www.rcsb.org/structure/1IVO
1Z9I	NMR                 	\N	A                   	669-721   	2005-04-02	Signaling Protein             	https://www.rcsb.org/structure/1Z9I
1M14	X-ray               	2.6	A                   	695-1022  	2002-06-17	Signaling Protein             	https://www.rcsb.org/structure/1M14
\.


--
-- Data for Name: pdb2protein; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.pdb2protein (pdbid, proteinid) FROM stdin;
1AGW	1
1CVS	1
1A30	2
1MBE	3
1GUU	3
1LMB	4
4RWF	5
2AMA	6
3EML	7
4HHB	8
5P21	9
1UBQ	10
3LCK	11
2DN2	8
2XYZ	13
3L3X	6
1IVO	14
1Z9I	14
1M14	14
\.


--
-- Data for Name: protein; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.protein (proteinid, name, organism, len, fav) FROM stdin;
1	Fibroblast growth factor receptor 1               	Human                         	822	0
2	Gag-Pol polyprotein                               	HIV-1                         	1435	0
3	Transcriptional activator Myb                     	Mouse                         	636	0
4	Repressor protein cI                              	Bacteriophage lambda          	237	0
5	Calcitonin gene-related peptide type 1 receptor   	Human                         	461	0
6	Androgen receptor                                 	Human                         	920	0
7	Adenosine receptor A2a                            	Human                         	412	0
8	Hemoglobin subunit alpha                          	Human                         	142	0
9	GTPase HRas                                       	Human                         	189	0
10	Polyubiquitin-C                                   	Human                         	685	0
11	Tyrosine-protein kinase Lck                       	Human                         	509	0
12	Zinc finger protein                               	Human                         	87	0
13	Major capsid protein                              	Salmonella phage P22          	430	0
14	Epidermal growth factor receptor                  	Human                         	1210	0
\.


--
-- Name: protein_proteinid_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.protein_proteinid_seq', 14, true);


--
-- Name: pdb2protein pdb2protein_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.pdb2protein
    ADD CONSTRAINT pdb2protein_pkey PRIMARY KEY (pdbid, proteinid);


--
-- Name: pdb pdb_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.pdb
    ADD CONSTRAINT pdb_pkey PRIMARY KEY (pdbid);


--
-- Name: protein protein_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.protein
    ADD CONSTRAINT protein_pkey PRIMARY KEY (proteinid);


--
-- PostgreSQL database dump complete
--

\unrestrict dLiSByOWn0Ss350rTn6hyvlIun7RrgUeiQveT5D6LLYtxmfTwCKMaDfgnSjbIOB

