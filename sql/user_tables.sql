-- Table: public.user

-- DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    login character varying(10) COLLATE "C" NOT NULL,
    email character varying(200) COLLATE "C" NOT NULL,
    hash character varying(200) COLLATE "C" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    CONSTRAINT user_pkey PRIMARY KEY (id)
);

-- Table: public.userBan

-- DROP TABLE IF EXISTS public."userBan";

CREATE TABLE IF NOT EXISTS public."userBan"
(
    "userId" uuid NOT NULL,
    "isBanned" boolean NOT NULL,
    "banReason" character varying COLLATE "C",
    "banDate" timestamp with time zone,
    CONSTRAINT "userBan_pkey" PRIMARY KEY ("userId"),
    CONSTRAINT "user" FOREIGN KEY ("userId")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

-- Table: public.emailConfirmation

-- DROP TABLE IF EXISTS public."emailConfirmation";

CREATE TABLE IF NOT EXISTS public."emailConfirmation"
(
    "userId" uuid NOT NULL,
    confirmed boolean NOT NULL,
    code character varying(200) COLLATE "C",
    expiration timestamp with time zone,
    CONSTRAINT "emailConfirmation_pkey" PRIMARY KEY ("userId"),
    CONSTRAINT "user" FOREIGN KEY ("userId")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

-- Table: public.passwordRecovery

-- DROP TABLE IF EXISTS public."passwordRecovery";

CREATE TABLE IF NOT EXISTS public."passwordRecovery"
(
    "userId" uuid NOT NULL,
    code character varying COLLATE "C" NOT NULL,
    expiration timestamp with time zone NOT NULL,
    CONSTRAINT "passwordRecovery_pkey" PRIMARY KEY ("userId"),
    CONSTRAINT "user" FOREIGN KEY ("userId")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

-- Table: public.userSession

-- DROP TABLE IF EXISTS public."userSession";

CREATE TABLE IF NOT EXISTS public."userSession"
(
    "deviceId" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "deviceName" character varying(250) COLLATE "C" NOT NULL,
    ip character varying(100) COLLATE "C" NOT NULL,
    "userId" uuid NOT NULL,
    "userLogin" character varying(20) NOT NULL,
    "issuedAt" timestamp with time zone NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    CONSTRAINT "userSession_pkey" PRIMARY KEY ("deviceId"),
    CONSTRAINT "user" FOREIGN KEY ("userId")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);