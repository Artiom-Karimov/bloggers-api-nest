-- Table: public.blog

-- DROP TABLE IF EXISTS public."blog";

CREATE TABLE IF NOT EXISTS public."blog"
(
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying(15) COLLATE "C" NOT NULL,
    "description" character varying(500) COLLATE "C" NOT NULL,
    "websiteUrl" character varying(100) COLLATE "C" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    CONSTRAINT blog_pkey PRIMARY KEY ("id")
);

-- Table: public.blogOwner

-- DROP TABLE IF EXISTS public."blogOwner";

CREATE TABLE IF NOT EXISTS public."blogOwner"
(
    "blogId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    "userLogin" character varying(15) COLLATE "C" NOT NULL,
    CONSTRAINT blogowner_pkey PRIMARY KEY ("blogId"),
    CONSTRAINT "blog" FOREIGN KEY ("blogId")
        REFERENCES public."blog" ("id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "user" FOREIGN KEY ("userId")
        REFERENCES public."user" ("id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

-- Table: public.blogBan

-- DROP TABLE IF EXISTS public."blogBan";

CREATE TABLE IF NOT EXISTS public."blogBan"
(
    "blogId" uuid NOT NULL,
    "isBanned" boolean NOT NULL DEFAULT False,
    "banDate" timestamp with time zone,
    CONSTRAINT blogban_pkey PRIMARY KEY ("blogId"),
    CONSTRAINT "blog" FOREIGN KEY ("blogId")
        REFERENCES public."blog" ("id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

-- Table: public.blogUserBan

-- DROP TABLE IF EXISTS public."blogUserBan";

CREATE TABLE IF NOT EXISTS public."blogUserBan"
(
    "blogId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    "isBanned" boolean NOT NULL,
    "banReason"  character varying(500) COLLATE "C",
    "banDate" timestamp with time zone,
    CONSTRAINT bloguserban_pkey PRIMARY KEY ("blogId", "userId"),
    CONSTRAINT "blog" FOREIGN KEY ("blogId")
        REFERENCES public."blog" ("id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "user" FOREIGN KEY ("userId")
        REFERENCES public."user" ("id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

-- Table: public.post

-- DROP TABLE IF EXISTS public."post";

CREATE TABLE IF NOT EXISTS public."post"
(
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "blogId" uuid NOT NULL,
    "blogBanned" boolean NOT NULL,
    "title" character varying(30) COLLATE "C" NOT NULL,
    "shortDescription" character varying(100) COLLATE "C" NOT NULL,
    "content" character varying(1000) COLLATE "C" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    CONSTRAINT post_pkey PRIMARY KEY ("id"),
    CONSTRAINT "blog" FOREIGN KEY ("blogId")
        REFERENCES public."blog" ("id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);