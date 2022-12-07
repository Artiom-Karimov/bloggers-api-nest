-- Table: public.user

-- DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    login character varying(10) COLLATE pg_catalog."default" NOT NULL,
    email character varying(200) COLLATE pg_catalog."default" NOT NULL,
    hash character varying(200) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    CONSTRAINT user_pkey PRIMARY KEY (id)
)

-- Table: public.userBan

-- DROP TABLE IF EXISTS public."userBan";

CREATE TABLE IF NOT EXISTS public."userBan"
(
    "userId" uuid NOT NULL,
    "isBanned" boolean NOT NULL,
    "banReason" character varying COLLATE pg_catalog."default",
    "banDate" timestamp without time zone,
    CONSTRAINT "userBan_pkey" PRIMARY KEY ("userId"),
    CONSTRAINT "user" FOREIGN KEY ("userId")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)

-- Table: public.emailConfirmation

-- DROP TABLE IF EXISTS public."emailConfirmation";

CREATE TABLE IF NOT EXISTS public."emailConfirmation"
(
    "userId" uuid NOT NULL,
    confirmed boolean NOT NULL,
    code character varying(200) COLLATE pg_catalog."default",
    expiration timestamp without time zone,
    CONSTRAINT "emailConfirmation_pkey" PRIMARY KEY ("userId"),
    CONSTRAINT "user" FOREIGN KEY ("userId")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)

-- Table: public.passwordRecovery

-- DROP TABLE IF EXISTS public."passwordRecovery";

CREATE TABLE IF NOT EXISTS public."passwordRecovery"
(
    "userId" uuid NOT NULL,
    code character varying COLLATE pg_catalog."default" NOT NULL,
    expiration timestamp without time zone NOT NULL,
    CONSTRAINT "passwordRecovery_pkey" PRIMARY KEY ("userId"),
    CONSTRAINT "user" FOREIGN KEY ("userId")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)

-- Table: public.userSession

-- DROP TABLE IF EXISTS public."userSession";

CREATE TABLE IF NOT EXISTS public."userSession"
(
    "deviceId" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "deviceName" character varying(250) COLLATE pg_catalog."default" NOT NULL,
    ip character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "userId" uuid NOT NULL,
    "issuedAt" timestamp without time zone NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    CONSTRAINT "userSession_pkey" PRIMARY KEY ("deviceId"),
    CONSTRAINT "user" FOREIGN KEY ("userId")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)
