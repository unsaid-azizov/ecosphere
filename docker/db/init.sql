--
-- PostgreSQL database dump
--

\restrict avvne4Tohuh8zMPUYN3Y4wWUdQQPD8apQIZra9Eob7vyzTOFqZQDFLxFYIrn1uu

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

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

ALTER TABLE IF EXISTS ONLY public.user_special_prices DROP CONSTRAINT IF EXISTS "user_special_prices_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS "posts_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public.personal_discounts DROP CONSTRAINT IF EXISTS "personal_discounts_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.personal_discounts DROP CONSTRAINT IF EXISTS "personal_discounts_createdBy_fkey";
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS "orders_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS "order_items_orderId_fkey";
ALTER TABLE IF EXISTS ONLY public.favorites DROP CONSTRAINT IF EXISTS "favorites_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS "cart_items_userId_fkey";
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public."user_special_prices_userId_productId_key";
DROP INDEX IF EXISTS public."product_inventory_productId_key";
DROP INDEX IF EXISTS public."product_discounts_productId_key";
DROP INDEX IF EXISTS public.posts_slug_key;
DROP INDEX IF EXISTS public."orders_orderNumber_key";
DROP INDEX IF EXISTS public."favorites_userId_productId_key";
DROP INDEX IF EXISTS public."cart_items_userId_productId_key";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.user_special_prices DROP CONSTRAINT IF EXISTS user_special_prices_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_inventory DROP CONSTRAINT IF EXISTS product_inventory_pkey;
ALTER TABLE IF EXISTS ONLY public.product_discounts DROP CONSTRAINT IF EXISTS product_discounts_pkey;
ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS posts_pkey;
ALTER TABLE IF EXISTS ONLY public.personal_discounts DROP CONSTRAINT IF EXISTS personal_discounts_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.favorites DROP CONSTRAINT IF EXISTS favorites_pkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.user_special_prices;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.product_inventory;
DROP TABLE IF EXISTS public.product_discounts;
DROP TABLE IF EXISTS public.posts;
DROP TABLE IF EXISTS public.personal_discounts;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.favorites;
DROP TABLE IF EXISTS public.cart_items;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TYPE IF EXISTS public."UserType";
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."PostStatus";
DROP TYPE IF EXISTS public."OrderStatus";
DROP TYPE IF EXISTS public."DiscountType";
--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PRODUCT',
    'CATEGORY',
    'ALL'
);


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


--
-- Name: PostStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PostStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'MANAGER',
    'ADMIN'
);


--
-- Name: UserType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserType" AS ENUM (
    'INDIVIDUAL',
    'IP',
    'OOO'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "productName" text NOT NULL,
    "productArticle" text NOT NULL,
    "productCategories" text[]
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "userId" text NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "totalAmount" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "contactEmail" text NOT NULL,
    "contactPhone" text,
    "deliveryAddress" text
);


--
-- Name: personal_discounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personal_discounts (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "userId" text,
    "userType" public."UserType",
    "discountType" public."DiscountType" NOT NULL,
    "productId" text,
    category text,
    "discountPercent" integer NOT NULL,
    "validFrom" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "validUntil" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text NOT NULL
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    "coverImage" text,
    images text[],
    status public."PostStatus" DEFAULT 'DRAFT'::public."PostStatus" NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    category text,
    tags text[],
    "metaTitle" text,
    "metaDescription" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "authorId" text NOT NULL,
    blocks jsonb,
    "contentType" text DEFAULT 'markdown'::text NOT NULL
);


--
-- Name: product_discounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_discounts (
    id text NOT NULL,
    "productId" text NOT NULL,
    "discountPercent" integer NOT NULL,
    "validFrom" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "validUntil" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: product_inventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_inventory (
    id text NOT NULL,
    "productId" text NOT NULL,
    "stockQuantity" integer DEFAULT 0 NOT NULL,
    "minStock" integer DEFAULT 5 NOT NULL,
    "maxStock" integer DEFAULT 100 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price double precision NOT NULL,
    images text[],
    article text NOT NULL,
    "stockQuantity" integer DEFAULT 0 NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    categories text[]
);


--
-- Name: user_special_prices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_special_prices (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text,
    "userType" public."UserType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "firstName" text,
    "lastName" text,
    phone text,
    "ipName" text,
    "companyName" text,
    "legalAddress" text,
    inn text,
    kpp text,
    "discountPercent" integer DEFAULT 0 NOT NULL,
    "isVip" boolean DEFAULT false NOT NULL,
    "loyaltyPoints" integer DEFAULT 0 NOT NULL,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "ipActualAddress" text,
    "ipBankName" text,
    "ipBik" text,
    "ipCheckingAccount" text,
    "ipCorrAccount" text,
    "ipFullName" text,
    "ipOgrnip" text,
    "ipOkved" text,
    "ipRegistrationAddress" text,
    "ipShortName" text,
    "ipTaxSystem" text,
    "ipVatStatus" text,
    "isGuest" boolean DEFAULT false NOT NULL,
    "oooAccountant" text,
    "oooActualAddress" text,
    "oooAuthorizedPerson" text,
    "oooBankName" text,
    "oooBik" text,
    "oooCheckingAccount" text,
    "oooCorrAccount" text,
    "oooDirector" text,
    "oooFullName" text,
    "oooLegalAddress" text,
    "oooOgrn" text,
    "oooOkved" text,
    "oooShortName" text,
    "oooTaxSystem" text,
    "oooVatStatus" text
);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4ee78023-641b-4141-a828-447d961041aa	85e8878ec8c8098fe0e80161d404b85dd1850ab294fae2d1d3c3182164f42c44	2025-09-05 09:34:18.139213+00	20250905093418_init	\N	\N	2025-09-05 09:34:18.049376+00	1
12e25934-4fa4-4366-8ea6-8df8fd56d370	456fcf7cf0eb128611a80eec8d72df524b72f872ae36415290e7aa6318d9cdf1	2025-09-05 10:48:18.26959+00	20250905104818_add_products_table	\N	\N	2025-09-05 10:48:18.238287+00	1
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, "userId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorites (id, "userId", "productId", "createdAt") FROM stdin;
cmf88c0j4000l6id07nqank1g	cmf6nd64v00006i31kbsfio11	1	2025-09-06 12:17:52.049
cmf88c38g000n6id0zk0hr6or	cmf6nd64v00006i31kbsfio11	101	2025-09-06 12:17:55.552
cmf88c4ez000p6id05ok0vu5e	cmf6nd64v00006i31kbsfio11	100	2025-09-06 12:17:57.083
cmf88fyct000r6id07m5j37lf	cmf6nd64v00006i31kbsfio11	102	2025-09-06 12:20:55.853
cmf88fygc000t6id09xrw288y	cmf6nd64v00006i31kbsfio11	103	2025-09-06 12:20:55.98
cmf88fygl000x6id094sx2vzw	cmf6nd64v00006i31kbsfio11	104	2025-09-06 12:20:55.989
cmf88fygh000v6id0vtz2v6t3	cmf6nd64v00006i31kbsfio11	105	2025-09-06 12:20:55.984
cmf88fyh2000z6id0tfg58lf1	cmf6nd64v00006i31kbsfio11	106	2025-09-06 12:20:56.006
cmf89xils00116id0zpr18blx	cmf6nd64v00006i31kbsfio11	112	2025-09-06 13:02:34.863
cmf89xm4400136id05gck6w1n	cmf6nd64v00006i31kbsfio11	120	2025-09-06 13:02:39.412
cmfe5hb8m00016i3fosydgn4p	cmf6nd64v00006i31kbsfio11	10	2025-09-10 15:44:37.413
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, "orderId", "productId", quantity, price, "createdAt", "productName", "productArticle", "productCategories") FROM stdin;
cmfca4er000076i28p8rbt36h	cmfca4eqo00056i28a8e8lgp3	1	2	19	2025-09-09 08:19:01.164	Зубной набор ЭкоСфера Крафт (ламинированная) JME 3 гр	ЭС001	\N
cmfca4er000096i282yxwayyk	cmfca4eqo00056i28a8e8lgp3	101	1	649	2025-09-09 08:19:01.164	UN Spray Universal Spray  универсальное моющее и чистящее средство. Готовое к применению. 5 л	ЭС023	\N
cmfca4er0000b6i28jvfeqd79	cmfca4eqo00056i28a8e8lgp3	120	1	509	2025-09-09 08:19:01.164	Duty Universal  Средство для удаления клейкой ленты, клея, наклеек 400 мл	ЭС042	\N
cmfca4er0000d6i2843t7je5i	cmfca4eqo00056i28a8e8lgp3	106	1	1239	2025-09-09 08:19:01.164	UN Uni+ Universal Uni+ Универсальное низкопенное кислотное моющее средство  для удаления минеральных загрязнений\nКонцентрат (1:20) 5 л	ЭС028	\N
cmfdy2n0j00096ilj359uclww	cmfdy2n0c00076iljk62bx4z0	107	1	1099	2025-09-10 12:17:15.523	MP Neutral + Multipower Neutral средство для мытья полов всех типов. Концентрат(1:64 - 1:500)	ЭС029	\N
cmfdy2n0j000b6iljfmy9yee7	cmfdy2n0c00076iljk62bx4z0	109	1	729	2025-09-10 12:17:15.523	MP Kerama + Multipower Kerama,Средство для мытья плитки и керамогранита\nКонцентрат (1:130) 5л	ЭС031	\N
cmfdy2n0k000d6iljxr706uwc	cmfdy2n0c00076iljk62bx4z0	108	1	1209	2025-09-10 12:17:15.523	MP Bright + Multipower Bright средство для мытья полов с полимерным покрытием.  Концентрат(1:65-1:500)	ЭС030	\N
cmfl6880200036i6fv5jjh5ei	cmfl687zu00016i6f5nezxomf	10	1	3.5	2025-09-15 13:39:56.162	Шампунь саше Fleur de Lis 2012 кор.	1825	\N
cmfl6880200056i6fvabxjk7t	cmfl687zu00016i6f5nezxomf	1	2	19	2025-09-15 13:39:56.162	Зубной набор ЭкоСфера Крафт (ламинированная) JME 3 гр	ЭС001	\N
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, "orderNumber", "userId", status, "totalAmount", "createdAt", "updatedAt", "contactEmail", "contactPhone", "deliveryAddress") FROM stdin;
cmfl687zu00016i6f5nezxomf	ORD-1757943596147	cmf6nd64v00006i31kbsfio11	DELIVERED	41.5	2025-09-15 13:39:56.154	2026-02-19 09:23:39.798	stazizovs@gmail.com	+7936111860	home
cmfdy2n0c00076iljk62bx4z0	ORD-1757506635509	cmf6nd64v00006i31kbsfio11	DELIVERED	3037	2025-09-10 12:17:15.516	2026-02-19 09:23:41.733	stazizovs@gmail.com	+79361111860	\N
cmfca4eqo00056i28a8e8lgp3	ORD-1757405941136	cmf6nd64v00006i31kbsfio11	DELIVERED	2435	2025-09-09 08:19:01.152	2026-02-19 09:23:43.824	stazizovs@gmail.com	+79361111860	\N
\.


--
-- Data for Name: personal_discounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.personal_discounts (id, name, description, "userId", "userType", "discountType", "productId", category, "discountPercent", "validFrom", "validUntil", "isActive", "createdAt", "updatedAt", "createdBy") FROM stdin;
cmfcnh2ux00016i0exjnd5uvh	Тестовая скидка на освежители	\N	cmf6nd64v00006i31kbsfio11	\N	CATEGORY	\N	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	15	2025-09-09 14:25:34.967	2025-09-10 21:00:00	t	2025-09-09 14:32:47.288	2025-09-09 14:32:47.288	cmf6nd64v00006i31kbsfio11
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts (id, title, slug, excerpt, content, "coverImage", images, status, featured, views, category, tags, "metaTitle", "metaDescription", "publishedAt", "createdAt", "updatedAt", "authorId", blocks, "contentType") FROM stdin;
cmfioffxh00016ichltye0tzb	Добро пожаловать в EcoSphere: Ваш партнер в устойчивом развитии	добро-пожаловать-в-ecosphere-ваш-партнер-в-устойчивом-развитии	Узнайте, как EcoSphere помогает компаниям и частным лицам делать\n  экологически осознанный выбор и создавать более устойчивое будущее.	# Добро пожаловать в мир экологических решений\n\n  Мы рады приветствовать вас на страницах нашего блога! **EcoSphere** —\n  это больше, чем просто каталог товаров. Это ваш надежный проводник в\n  мире экологически чистых решений и устойчивого развития.\n\n  ## Наша миссия\n\n  В современном мире забота об окружающей среде становится не просто\n  трендом, а жизненной необходимостью. Мы верим, что каждый человек и\n  каждая компания могут внести свой вклад в создание более чистого и\n  здорового будущего.\n\n  ### Что мы предлагаем:\n\n  - **Экологически чистые продукты** для дома и офиса\n  - **Инновационные решения** для бизнеса\n  - **Консультации** по внедрению зеленых технологий\n  - **Образовательные материалы** о sustainable развитии\n\n  ## Почему выбирают EcoSphere?\n\n  > "Изменения начинаются с малого. Каждый экологически осознанный выбор\n   — это шаг к лучшему будущему."\n\n  1. **Качество и сертификация** — все наши товары имеют необходимые\n  экологические сертификаты\n  2. **Широкий ассортимент** — от бытовых товаров до промышленных\n  решений\n  3. **Экспертная поддержка** — наши специалисты помогут подобрать\n  оптимальное решение\n  4. **Конкурентные цены** — экологичность не должна быть дорогой\n\n  ## Что вас ждет в нашем блоге\n\n  В наших будущих статьях мы будем делиться:\n\n  - Актуальными новостями из мира экологии\n  - Практическими советами по внедрению эко-решений\n  - Обзорами инновационных продуктов\n  - Историями успеха наших клиентов\n  - Экспертными мнениями о будущем зеленых технологий\n\n  ## Присоединяйтесь к нам!\n\n  Станьте частью сообщества людей, которые заботятся о планете.\n  Подписывайтесь на наши обновления, делитесь статьями и оставляйте\n  комментарии — вместе мы сможем больше!\n\n  ---\n\n  *Готовы начать свой путь к более экологичному образу жизни? Исследуйте\n   наш каталог и найдите решения, которые подходят именно вам.*\n\n  Этот текст содержит все необходимые элементы для первой статьи блога и\n   демонстрирует возможности Markdown-редактора, включая заголовки,\n  списки, цитаты и выделение текста.\n\n![](https://plus.unsplash.com/premium_photo-1757343190565-3b99182167e3?q=80&w=2428&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)	https://plus.unsplash.com/premium_photo-1757343190565-3b99182167e3?q=80&w=2428&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D	{}	PUBLISHED	t	13	Экология	{экология,"устойчивое развитие","зеленые технологии"}			2025-09-13 19:46:07.584	2025-09-13 19:46:07.589	2025-09-14 14:16:01.353	cmf6nd64v00006i31kbsfio11	[{"id": "block_1757792674369_9nbd2b11z", "data": {"content": "# Добро пожаловать в мир экологических решений\\n\\n  Мы рады приветствовать вас на страницах нашего блога! **EcoSphere** —\\n  это больше, чем просто каталог товаров. Это ваш надежный проводник в\\n  мире экологически чистых решений и устойчивого развития.\\n\\n  ## Наша миссия\\n\\n  В современном мире забота об окружающей среде становится не просто\\n  трендом, а жизненной необходимостью. Мы верим, что каждый человек и\\n  каждая компания могут внести свой вклад в создание более чистого и\\n  здорового будущего.\\n\\n  ### Что мы предлагаем:\\n\\n  - **Экологически чистые продукты** для дома и офиса\\n  - **Инновационные решения** для бизнеса\\n  - **Консультации** по внедрению зеленых технологий\\n  - **Образовательные материалы** о sustainable развитии\\n\\n  ## Почему выбирают EcoSphere?\\n\\n  > \\"Изменения начинаются с малого. Каждый экологически осознанный выбор\\n   — это шаг к лучшему будущему.\\"\\n\\n  1. **Качество и сертификация** — все наши товары имеют необходимые\\n  экологические сертификаты\\n  2. **Широкий ассортимент** — от бытовых товаров до промышленных\\n  решений\\n  3. **Экспертная поддержка** — наши специалисты помогут подобрать\\n  оптимальное решение\\n  4. **Конкурентные цены** — экологичность не должна быть дорогой\\n\\n  ## Что вас ждет в нашем блоге\\n\\n  В наших будущих статьях мы будем делиться:\\n\\n  - Актуальными новостями из мира экологии\\n  - Практическими советами по внедрению эко-решений\\n  - Обзорами инновационных продуктов\\n  - Историями успеха наших клиентов\\n  - Экспертными мнениями о будущем зеленых технологий\\n\\n  ## Присоединяйтесь к нам!\\n\\n  Станьте частью сообщества людей, которые заботятся о планете.\\n  Подписывайтесь на наши обновления, делитесь статьями и оставляйте\\n  комментарии — вместе мы сможем больше!\\n\\n  ---\\n\\n  *Готовы начать свой путь к более экологичному образу жизни? Исследуйте\\n   наш каталог и найдите решения, которые подходят именно вам.*\\n\\n  Этот текст содержит все необходимые элементы для первой статьи блога и\\n   демонстрирует возможности Markdown-редактора, включая заголовки,\\n  списки, цитаты и выделение текста."}, "type": "text"}, {"id": "block_1757792758109_vj1f5a9n9", "data": {"alt": "", "url": "https://plus.unsplash.com/premium_photo-1757343190565-3b99182167e3?q=80&w=2428&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "caption": ""}, "type": "image"}]	blocks
\.


--
-- Data for Name: product_discounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_discounts (id, "productId", "discountPercent", "validFrom", "validUntil", "isActive", "createdAt") FROM stdin;
\.


--
-- Data for Name: product_inventory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_inventory (id, "productId", "stockQuantity", "minStock", "maxStock", "updatedAt") FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, description, price, images, article, "stockQuantity", "isAvailable", "createdAt", "updatedAt", categories) FROM stdin;
42	EFFECT АЛЬФА 105 Средство санитарно-гигиеническое для сложных загрязнений, 5 л (ВЕРСИЯ 2023)	5 л	619	{/uploads/products/product_42_1.jpg}	25994	296	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
10	Шампунь саше Fleur de Lis 2012 кор.	саше	3.5	{/uploads/products/product_10_1.jpg}	1825	77	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
15	Губка для обуви круглая d-60 мм с бесцветной пропиткой	штука	29	{/uploads/products/product_15_1.jpg}	491531	411	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
36	EFFECT АЛЬФА 108 концентрированное средство чистящее для удаления известкового налета и ржавчины, 5л	5 л	2299	{/uploads/products/product_36_1.jpg}	24612	46	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
65	SANITA спрей для стекол, Горная свежесть, 500 мл (НОВЫЙ ДИЗАЙН ВЕРСИЯ 2020)	500 мл	217	{/uploads/products/product_65_1.jpg}	14123	119	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
77	SANITA чистящее средство спрей УНИВЕРСАЛЬНЫЙ для всех поверхностей и текстиля, 500 мл (ВЕРСИЯ 2023)	500 мл	227	{/uploads/products/product_77_1.jpg}	25382	211	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
92	Dolphin: Юниверсал Экстра 5л для ежедневного ухода за полами и мебелью (шт.	5 л	1089	{/uploads/products/product_92_1.jpg}	D015-5	50	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
107	MP Neutral + Multipower Neutral средство для мытья полов всех типов. Концентрат(1:64 - 1:500)	5 л	1099	{/uploads/products/product_107_1.jpg}	ЭС029	35	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
167	Мыло жидкое биоразлагаемое для мытья рук и тела Миндальное молочко торговая марка SYNERGETIC 0.5л	500 мл	166	{/uploads/products/product_167_1.jpg}	105058/6	471	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
180	Натуральный биоразлагаемый гель для душа SYNERGETIC Сандал и ягоды можжевельника, 750мл	750 мл	357	{/uploads/products/product_180_1.jpg}	400011	360	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
192	Гипоаллергенный биоразлагаемый освежитель воздуха, нейтрализатор запахов SYNERGETIC  Горные травы и эдельвейс, 380 мл	380 мл	219	{/uploads/products/product_192_1.jpg}	900006	314	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
253	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом алоэ, 1л	1 л	209	{/uploads/products/product_253_1.jpg}	103103/8	99	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
257	Биоразлагаемое универсальное чистящее средство для удаления жира, копоти, нагара с плит, сковородок, духовых шкафов, гриля и других кухонных поверхностей «Антижир» SYNERGETIC 0,5л	0,5 л	249	{/uploads/products/product_257_1.jpg}	106055	213	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
279	Crystal Rinser Экзотические цветы, Кондиционер для белья с ароматом экзотических цветов\nКонцентрат 2 л	2 л	269	{/uploads/products/product_279_1.jpg}	ЭС080	137	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
308	Перчатки нитриловые хлорированные неопудренные 100 шт/50 пар S голубой	50 пар/ S голубой	459	{/uploads/products/product_308_1.jpg}	ME6BB306BS82	80	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
338	Vileda: Ручка алюминиевая с цветовой кодировкой 150см для держателей и сгонов,	шт	1719	{/uploads/products/product_338_1.jpg}	512413	90	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
361	Бумага туалетная PAPIA PROFESSIONAL 8 рул/упак (125*95 мм - 140 л, 20 м) 3 слоя	8 рул/пачка; 125*95 мм - 140 л, 20 м, 3 слоя	237	{/uploads/products/product_361_1.jpg}	5060404/5080998	20	t	2025-09-06 11:27:47.43	2025-09-10 09:27:35.822	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
20	BT Bath Extra гелеобразное средство усиленного действия для удаления ржавчины и минеральных отложений.  Концентрат(1:10-1:100)	1 л	239	{/uploads/products/product_20_1.jpg}	ЭС010	150	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
28	BT Bath Fungi+ средство для удаления плесени  с дезинфицирующим эффектом. Концентрат(1:50-1:100) 500 мл	500 мл	219	{/uploads/products/product_28_1.jpg}	ЭС018	134	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
34	EFFECT Super Средство чистящее универсальное для стеклянных поверхностей, 500 мл	500 мл	154	{/uploads/products/product_34_1.jpg}	25698	162	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
39	EFFECT АЛЬФА 104 Средство для очистки канализационных труб, 5 л (ВЕРСИЯ 2023)	5 л	659	{/uploads/products/product_39_1.jpg}	26216	302	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ"}
44	EFFECT АЛЬФА 106 Универсал, универсальное чистящее средство, 750 мл (ВЕРСИЯ 2023)	750 мл	129	{/uploads/products/product_44_1.jpg}	26196	388	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
48	EFFECT ДЕЛЬТА 401 Средство универсальное высокопенное для мытья поверхностей, 5 л (ВЕРСИЯ 2023)	5 л	689	{/uploads/products/product_48_1.jpg}	26002	295	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
50	EFFECT ДЕЛЬТА 404 средство чистящее универсальное для стекол и зеркал, 500 мл (ВЕРСИЯ 2023)	500 мл	149	{/uploads/products/product_50_1.jpg}	25689	114	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
59	Sanfor Универсал, 1 кг, летний дождь	1 кг	250	{/uploads/products/product_59_1.jpg}	1956	279	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
61	Средство чистящее для унитаза SANFOR WC gel super power, 1 кг	1 кг	309	{/uploads/products/product_61_1.jpg}	10008	22	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
68	Sanfor Универсал, 750 г, зеленое яблоко	750 гр	189	{/uploads/products/product_68_1.jpg}	1542	64	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
71	SANFOR для мытья полов УЛЬТРА БЛЕСК, Забота о доме, 1 л	1 л	269	{/uploads/products/product_71_1.jpg}	22157	443	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
76	SANITA спрей для стекол с нашатырным спиртом, 500 мл (ВЕРСИЯ 2023)	500 мл	209	{/uploads/products/product_76_1.jpg}	24608	334	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
81	SANFOR Универсал, Зеленое яблоко, 1,5 л	1,5 л	289	{/uploads/products/product_81_1.jpg}	26285	188	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
83	SANFOR для труб, прочистка труб на кухне, 1 кг (250 г бесплатно)	1 кг	269	{/uploads/products/product_83_1.jpg}	26400	137	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ"}
88	Средство чистящее для сантехники Санокс   10*1100 г	1100 г	169	{/uploads/products/product_88_1.jpg}	4303010014	113	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
93	Dolphin: Юниверсал Клин 5л для ежедневного ухода за интерьером (шт.)	5 л	859	{/uploads/products/product_93_1.jpg}	D016-5	183	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
97	TX Shampoo + Carpet Shampoo шампунь для чистки ковров и мягкой мебели. Концентрат (1:20 - 1:120) 5 л	5 л	1699	{/uploads/products/product_97_1.webp}	ЭС 019	147	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
100	TX Candy Универсальный пятновыводитель. Готов к применению 500 мл	500 мл	319	{/uploads/products/product_100_1.jpg}	ЭС022	84	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
103	UN Spray+ Universal Spray + универсальное моющее и чистящее средство. Концентрат 5 л	5 л	1319	{/uploads/products/product_103_1.jpg}	ЭС025	415	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
106	UN Uni+ Universal Uni+ Универсальное низкопенное кислотное моющее средство  для удаления минеральных загрязнений\nКонцентрат (1:20) 5 л	5 л	1239	{/uploads/products/product_106_1.jpg}	ЭС028	171	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
171	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ИНТЕНСИВНОЕ УВЛАЖНЕНИЕ И БЛЕСК	флакон 0,4л	289	{/uploads/products/product_171_1.jpg}	701401	9	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
176	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ЭКСТРАМЯГКИЙ ДЛЯ ЕЖЕДНЕВНОГО УХОДА 2 В 1	флакон 0,75л	459	{/uploads/products/product_176_1.jpg}	701753	128	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
183	Натуральный крем для рук и тела SYNERGETIC Сандал и ягоды можжевельника 380мл	380 мл	252	{/uploads/products/product_183_1.jpg}	300010/6	74	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
186	FL Flox FLOX PROF Нейтрализатор запахов с антибактериальным компонентом, без запаха. Готов к применению 500 мл	500 мл	245	{/uploads/products/product_186_1.jpg}	ЭС054	155	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
191	Гипоаллергенный биоразлагаемый освежитель воздуха, нейтрализатор запахов SYNERGETIC «Пачули и нероли» 380мл	380 мл	219	{/uploads/products/product_191_1.jpg}	900003	427	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
277	Crystal Rinser Лепестки Сакуры, Кондиционер для белья с ароматом лепестков Сакуры\nКонцентрат 2 л	2 л	287	{/uploads/products/product_277_1.jpg}	ЭС078	313	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
280	Crystal Rinser Японский чай, Кондиционер для белья с ароматом Японского чая\nКонцентрат 2 л	2 л	269	{/uploads/products/product_280_1.jpg}	ЭС081	206	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
287	EFFECT ОМЕГА 502 пятновыводитель с активным кислородом, 5 л (ВЕРСИЯ 2023)	5 л	886	{/uploads/products/product_287_1.jpg}	25996	105	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
290	Биоразлагаемый концентрированный  универсальный гипоаллергенный гель для стирки SYNERGETIC 3,75л (зеленая этикетка)	3,75  л	929	{/uploads/products/product_290_1.jpg}	109803	326	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
299	PACLAN GREEN MOP SOFT ШВАБРА С ПЛОСКОЙ НАСАДКОЙ ШЕНИЛЛ И ТЕЛЕСКОПИЧЕСКОЙ РУЧКОЙ, 1 ШТ.	телескоп ручка	989	{/uploads/products/product_299_1.jpg}	135921	25	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
302	Вик: Набор совок-ленивка и щетка /AF201/ 36CL/1	шт	639	{/uploads/products/product_302_1.jpg}	1037844	90	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
305	PACLAN UNIVERSAL ПАРА РЕЗИНОВЫХ ПЕРЧАТОК (M) ЖЕЛТЫЕ	пара	99	{/uploads/products/product_305_1.jpg}	407897	152	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
315	Vileda: Губка с системой ПурАктив 6,3х14 см красный (10 шт/уп)	(10 шт/уп)	185	{/uploads/products/product_315_1.jpg}	123116/123112	75	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
318	Vileda: Губка (зеленый абразив) 7х15 см голубой (10 шт/уп)	(10 шт/уп)	148	{/uploads/products/product_318_1.jpg}	101397/101404	108	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
324	PACLAN PRACTI PROFI ГУБКИ ДЛЯ ПОСУДЫ 2ШТ.	2 шт в упак	79	{/uploads/products/product_324_1.jpg}	409113	214	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
327	Универсальная тряпка Practi, 35x35cm,5 шт.	0,35*0,35 м по 5 шт в упак	84	{/uploads/products/product_327_1.jpg}	410121	185	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
330	PACLAN ТРЯПКА ДЛЯ ПОЛА ИЗ МИКРОФИБРЫ, 50X60CM, 1 ШТ.	0,5*0,6 м	289	{/uploads/products/product_330_1.jpg}	411023	273	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
333	Vileda: Контракт УльтраСпид Про 40см (шт.)	шт	597	{/uploads/products/product_333_1.jpg}	167275	40	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
336	Vileda: Моп МикроЛайт Макси УльтраСпид Про 40см, белый/серый	шт	867	{/uploads/products/product_336_1.jpg}	167292	129	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
341	Vileda: Салфетка* МикронКвик 40х38см голубой (шт.)	шт	567	{/uploads/products/product_341_1.jpg}	170635	75	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
345	Vileda: Салфетки Бризи 35,5x35 см голубой (25 шт/уп)	(25 шт/уп)	75	{/uploads/products/product_345_1.jpg}	161616	93	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
348	Vileda: Салфетки Бризи 35,5x35 см зеленый (25 шт/уп)	(25 шт/уп)	75	{/uploads/products/product_348_1.jpg}	161619	69	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
351	Vileda: Салфетки ПВАМикро зеленый	шт	497	{/uploads/products/product_351_1.jpg}	143593	349	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
353	Vileda: Салфетка* МикроТафф Бэйс 36х36см синий (шт.)	шт	237	{/uploads/products/product_353_1.jpg}	174176	195	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
356	Vileda: Салфетка* МикроТафф Бэйс 36х36см зеленый (шт.)	шт	237	{/uploads/products/product_356_1.jpg}	174180	176	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
359	Vileda Салфетки МикроТафф Плюс 38х38 см желтая	38*38 шт	519	{/uploads/products/product_359_1.jpg}	174205	71	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
362	Бумага туалетная Focus Economic Choice 12 рул/пачка, 125 л, 15 м, 2 слоя	12 рул/пачка, 125 л, 15 м, 2 слоя	199	{/uploads/products/product_362_1.jpg}	5071518	20	t	2025-09-06 11:27:47.43	2025-09-10 09:27:24.241	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
364	Бумага туалетная  Veiro Professional Comfort (95мм*125 мм - 15 м) 2 слоя	95*125 мм 15 м 2 слоя 8 рул/пачка	129	{/uploads/products/product_364_1.jpg}	T207/1	199	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
370	салфетки бумажные 24*24см 3сл 25шт АЖУРНЫЙ УЗОРBouquet de Luxe	24*24см 3сл 25шт	67	{/uploads/products/product_370_1.jpg}	37173	34	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
342	Vileda: Салфетка* МикронКвик 40х38см желтый (шт.)	de==	567	{/uploads/products/product_342_1.jpg}	170638	182	t	2025-09-06 11:27:47.43	2025-09-11 07:02:13.338	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
72	SANFOR для мытья полов УЛЬТРА БЛЕСК, Забота о домашних питомцах, 1 л	1 л	269	{/uploads/products/product_72_1.jpg}	22674	46	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
379	Мешки для мусора ПВД 120л (70*110*28мкн)Ромашка (50шт/пач 250шт/меш) в тарном мешке,прямое дно	ПВД 120л 70*110*28 мкн 50 шт/пач	15	{/uploads/products/product_379_1.jpg}	ВП-004	383	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
380	Мешки для мусора ПВД 120л (70*110*35мкн)Ромашка (50шт/пач 200шт/меш) в тарном мешке,прямое дно	ПВД 120л 70*110*35 мкн 50 шт/пач	17	{/uploads/products/product_380_1.jpg}	ВП-007	26	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
381	Мешки для мусора ПВД 120л (70*110*60мкн)Ромашка (50шт/пач 150шт/меш) в тарном мешке,прямое дно	ПВД 120л 70*110*60 мкн 50 шт/пач	22	{/uploads/products/product_381_1.jpg}	ВП-014	286	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
382	Мешки для мусора ПВД 180 л (86*105*20 мкн) 10 шт в рулоне/35 рулонов в коробке	180 л (86*105*20 мкн) 10 шт в рул/35 рул в кор	19	{/uploads/products/product_382_1.jpg}	ЕЛР-ВР -1801035	153	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
383	Мешки для мусора ПВД 240 л в рулоне ТИТАН (100*130*80 мкн) 5 шт в рулоне/10 рулонов в коробке	240 л (100*130*80 мкн) 5 шт в рул/10 рул в кор	52	{/uploads/products/product_383_1.jpg}	ТТ-ВР-240/5/10/С	186	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
384	Мешки для мусора ПВД 240 л в рулоне БРОНЯ (100*130*60 мкн) 10 шт в рулоне/7 рулонов в коробке	240 л БРОНЯ (100*130*60 мкн) 10 шт в рул/7 рул в кор	40	{/uploads/products/product_384_1.jpg}	ВР-0013	30	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
385	Батарейки OPTICELL Basic AAA	4 шт в упак/48 шт в кор	389	{/uploads/products/product_385_1.jpg}	1015220001	59	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{ПРОЧЕЕ}
386	Батарейки OPTICELL Basic AA	4 шт в упак/48 шт в кор	389	{/uploads/products/product_386_1.jpg}	1015220000	49	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{ПРОЧЕЕ}
387	Батарейки OPTICELL Basic 9V  (КРОНА)	1 шт в упак/10 шт в кор	489	{/uploads/products/product_387_1.jpg}	1015220009	70	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{ПРОЧЕЕ}
388	Стакан пластиковый 200 мл	100 шт в упак	1.5	{/uploads/products/product_388_1.jpg}	19-2862	63	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{ПРОЧЕЕ}
389	Фасовочные пакеты в рулоне  24*35*6,5 мкм, 280 шт/рул, 20 рулонов в мешке	24*35*6,5 мкм, 280 шт/рул, 20 рулонов в мешке	169	{/uploads/products/product_389_1.jpg}	БШП ХИ-001	137	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{ПРОЧЕЕ}
390	Фасовочные пакеты в рулоне БШП 30*40*8 мкн рулон прозрачный 40рул/кор 50шт/рул	30*40*8 мкн рулон прозрачный 40рул/кор 50шт/рул	55	{/uploads/products/product_390_1.jpg}	ПУ30/50П	427	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{ПРОЧЕЕ}
9	Гель для душа саше Fleur de Lis 2012 кор.	саше	3.5	{/uploads/products/product_9_1.jpg}	1823	8	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
11	Мыло 13 г, ЭКО Flow-pack кор.	индивид упак	10	{/uploads/products/product_11_1.jpg}	17156	155	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
1	Зубной набор ЭкоСфера Крафт (ламинированная) JME 3 гр	индивид упак	19	{/uploads/products/product_1_1.jpg}	ЭС001	182	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
2	Зубной набор ЭкоСфера Белая (ламинированная) JME 3 гр	индивид упак	19	{/uploads/products/product_2_1.jpg}	ЭС002	155	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
3	Зубной набор ЭкоСфера Белая (ламинированная) AME 3 гр	мндивид упак	20	{/uploads/products/product_3_1.jpg}	ЭС003	196	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
4	Тапочки TD1 подошва ЭВА 4 мм, закрытый мыс, махровые	индивид упак	35	{/uploads/products/product_4_1.jpg}	ЭС004	142	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
5	Тапочки TD21-С подошва 4 мм, закрытый мыс 60 гр, антискользящие	индивид упак	20	{/uploads/products/product_5_1.jpg}	ЭС005	435	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
6	Тапочки TD21-E подошва 5 мм, закрытый мыс 80 гр, антискользящие	индивид упак	22	{/uploads/products/product_6_1.jpg}	ЭС006	42	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
7	Тапки Узо спанбонд белый 40 подошва 3 мм flow-pack кор.	индивид упак	18	{/uploads/products/product_7_1.jpg}	22730	497	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
8	Зубной набор: щетка АК РСТ, зубная паста тюбик Aquatique 5 мл, ЭКО Flow-pack кор.	идивид упак	17	{/uploads/products/product_8_1.jpg}	17508	171	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
73	SANFOR для ванн АКРИЛАЙТ, 750 г	750 гр	249	{/uploads/products/product_73_1.jpg}	23655	13	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
12	Бритвенный набор (Бритвенный станок Rapira, крем для бритья тюбик 5 мл, ЭКО Flow-pack кор.	индивид упак	27	{/uploads/products/product_12_1.jpg}	19984	267	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
13	Шапочка для душа Flow-pack ЭКО кор.	индивид упак	10	{/uploads/products/product_13_1.jpg}	17507	7	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
14	Косметический набор (ватные палочки 3шт+ ватные диски 3 шт.) ЭКО Flow-pack кор.	индивид упак	9	{/uploads/products/product_14_1.jpg}	17157	184	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"РАСХОДНИКИ ДЛЯ ГОСТИНИЦ"}
17	BT Bath Acid +  средство усиленного действия для удаления ржавчины и минеральных отложений. Концентрат(1:200-1:500) 5 л	5 л	879	{/uploads/products/product_17_1.jpg}	ЭС007	107	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
18	BT Bath Acid +  средство усиленного действия для удаления ржавчины и минеральных отложений. Концентрат(1:200-1:500) 1 л	1 л	219	{/uploads/products/product_18_1.jpg}	ЭС008	278	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
19	BT Bath Extra гелеобразное средство усиленного действия для удаления ржавчины и минеральных отложений.  Концентрат(1:10-1:100)	5 л	889	{/uploads/products/product_19_1.jpg}	ЭС009	113	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
21	BT Bath Uni Универсальное кислотное чистящее средство для санитарных комнат с антимикробным эффектом 5 л	5 л	869	{/uploads/products/product_21_1.jpg}	ЭС011	447	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
22	BT Bath Uni Универсальное кислотное чистящее средство для санитарных комнат с антимикробным эффектом 500 мл	500 мл	219	{/uploads/products/product_22_1.jpg}	ЭС012	132	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
23	BT Bath DZ+ Средство для уборки и дезинфекции санитарных комнат 5 л	5 л	1179	{/uploads/products/product_23_1.jpg}	ЭС013	24	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
24	BT Bath DZ+ Средство для уборки и дезинфекции санитарных комнат 1 л	1 л	310	{/uploads/products/product_24_1.jpg}	ЭС014	210	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
25	BT Bath Prof средство для устранения засоров в трубах. Концентрат(1:100) 5 л	5 л	810	{/uploads/products/product_25_1.jpg}	ЭС015	234	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
26	BT Bath Prof средство для устранения засоров в трубах. Концентрат(1:100) 1 л	1 л	239	{/uploads/products/product_26_1.jpg}	ЭС016	70	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
27	BT Bath Fungi+ средство для удаления плесени  с дезинфицирующим эффектом. Концентрат(1:50-1:100) 5 л	5 л	649	{/uploads/products/product_27_1.jpg}	ЭС017	456	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
29	EFFECT SUPER средство с комплексным действием Белизна гель, 5 л	5 л	439	{/uploads/products/product_29_1.jpg}	26504	155	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
30	EFFECT Super средство универсальное для мытья пола и поверхностей 5 л	5 л	420	{/uploads/products/product_30_1.jpg}	25706	403	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
31	EFFECT Super средство с комплексным действием Белизна гель, 750 г	750 г	115	{/uploads/products/product_31_1.jpg}	25710	229	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
32	EFFECT Super Средство санитарно-гигиеническое для сантехники, 750 г	750 г	139	{/uploads/products/product_32_1.jpg}	25696	59	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
33	EFFECT Super Средство чистящее для ванн, 750 г	750 г	144	{/uploads/products/product_33_1.jpg}	25708	75	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
35	EFFECT ДЕЛЬТА 418 DesPro средство для дезинфекции и мытья поверхностей, 5000 мл	5 л	899	{/uploads/products/product_35_1.jpg}	9066	265	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
37	EFFECT АЛЬФА 109 Гель для удаления известкового налета и ржавчины, 5 л	5 л	956	{/uploads/products/product_37_1.jpg}	27109	248	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
38	EFFECT АЛЬФА 102 Средство санитарно-гигиеническое для удаления ржавчины, 5 л	5 л	879	{/uploads/products/product_38_1.jpg}	10717	488	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
40	EFFECT АЛЬФА 106 универсальное чистящее средство Универсал, 5 л (ВЕРСИЯ 2023)	5 л	559	{/uploads/products/product_40_1.jpg}	26008	76	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
41	EFFECT АЛЬФА 103 Средство чистящее для удаления известкового налета и ржавчины, 5 л (ВЕРСИЯ 2023)	5 л	875	{/uploads/products/product_41_1.jpg}	26596	271	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
16	Грасс GLOSS Для удаление известкового налета и ржавчины 600 мл *8	600 мл	249	{/uploads/products/product_16_1.jpg}	221600	67	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
45	EFFECT АЛЬФА 103 Средство чистящее для удаления известкового налета и ржавчины, 500 мл (ВЕРСИЯ 2023)	500 мл	235	{/uploads/products/product_45_1.jpg}	26194	109	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
46	EFFECT ДЕЛЬТА 416 Средство универсальное Дегризер, 5 л (ВЕРСИЯ 2023)	5 л	1689	{/uploads/products/product_46_1.jpg}	25984	101	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
47	EFFECT ДЕЛЬТА 412 Средство нейтральное для мытья полов, 5 л (ВЕРСИЯ 2023)	5 л	728	{/uploads/products/product_47_1.jpg}	26006	161	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
49	EFFECT ДЕЛЬТА 416 Средство универсальное Дегризер, 1 л	1 л	359	{/uploads/products/product_49_1.jpg}	27312	72	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
51	Средство санитарно-гигиеническое Sanfor WС гель, 750 г, морской бриз	750 г	199	{/uploads/products/product_51_1.jpg}	1549	212	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
52	Sanfor для труб, 1 кг	1 кг	259	{/uploads/products/product_52_1.jpg}	1957	50	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ"}
53	Средство санитарно-гигиеническое «Sanfor» Универсал морской бриз,1 кг	1 кг	230	{/uploads/products/product_53_1.jpg}	8893	166	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
54	Средство санитарно-гигиеническое «Sanfor»  Универсал лимонная свежесть,1 кг	1 кг	230	{/uploads/products/product_54_1.jpg}	8894	98	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
55	Средство для очистки труб Sanfor для труб (прочистка труб на кухне), 1 кг	1 кг	269	{/uploads/products/product_55_1.jpg}	10742	100	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ"}
56	Sanfor WС гель, 750 г, speсial black	750 гр	209	{/uploads/products/product_56_1.jpg}	1896	254	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
57	Sanfor Универсал, 750 г, лимонная свежесть	750 гр	189	{/uploads/products/product_57_1.jpg}	1544	200	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ"}
58	Sanfor WС гель, 1 кг, speсial black	1 кг	279	{/uploads/products/product_58_1.jpg}	1953	64	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
60	Sanfor Универсал, 750 г, морской бриз	750 гр	189	{/uploads/products/product_60_1.jpg}	1543	387	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
62	Sanfor Chlorum, 750 г	750 гр	166	{/uploads/products/product_62_1.jpg}	1880	51	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
63	Средство чистящее для унитаза SANFOR WC gel super power, 750г	750 гр	219	{/uploads/products/product_63_1.jpg}	9611	99	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
64	Sanfor для ванн, 750 г, лимонная свежесть, антиналет	750 гр	245	{/uploads/products/product_64_1.jpg}	1554	439	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
66	Sanfor WС гель, 1 кг, LEMON FRESH	1 кг	259	{/uploads/products/product_66_1.jpg}	1954	13	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
67	Sanfor WС гель, 750 г, лимонная свежесть	1 кг	199	{/uploads/products/product_67_1.jpg}	1550	393	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
69	Sanfor active антиржавчина, 750 г	750 гр	229	{/uploads/products/product_69_1.jpg}	1557	70	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
70	SANFOR для труб TURBO, 1 кг (новая этикетка)	1 кг	419	{/uploads/products/product_70_1.jpg}	21620	134	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ"}
74	SANFOR Универсал Ультра Блеск Чистота и гигиена, 750 г	750 гр	209	{/uploads/products/product_74_1.jpg}	24265	427	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
75	SANFOR Chlorum, 1,5 л	1,5 л	299	{/uploads/products/product_75_1.jpg}	24505	128	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
43	EFFECT АЛЬФА 104 Средство для очистки канализационных труб, 750 мл (ВЕРСИЯ 2023)	750 мл	149	{/uploads/products/product_43_1.jpg}	26211	110	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ"}
79	SANITA средство чистящее для удаления известкового налета Акрилайт, 500 мл	500 мл	245	{/uploads/products/product_79_1.jpg}	26270	416	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
80	SANFOR Универсал, Морской бриз, 1,5 л	1,5 л	289	{/uploads/products/product_80_1.jpg}	26283	86	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
82	SANFOR Универсал Ультра Блеск Чистота и гигиена, 1,5 л	1,5 л	289	{/uploads/products/product_82_1.jpg}	26289	32	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
84	Bagi ПОТХАН (средство для устранения засоров) 600 г	600 г	997	{/uploads/products/product_84_1.jpg}	H-395057-N	217	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ КУХНИ","ДЛЯ САНУЗЛОВ"}
85	Bagi ШУМАНИТ ОТ ИЗВЕСТКОВОГО НАЛЕТА, 550 мл	550 мл	669	{/uploads/products/product_85_1.webp}	H-208948-0	209	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
86	Bagi ШУМАНИТ ДЛЯ ЧИСТКИ САНТЕХНИКИ, 500 мл	500 мл	599	{/uploads/products/product_86_1.webp}	B-208979-0	85	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
87	Средство чистящее для сантехники Санокс - гель 10*1100 г	1100 г	179	{/uploads/products/product_87_1.webp}	4303010015	57	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
89	Средство чистящее для сантехники Санокс   15*750 г	750 г	119	{/uploads/products/product_89_1.jpg}	4303010007	142	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
90	Средство чистящее для сантехники Санокс - гель 15*750 г	750 г	129	{/uploads/products/product_90_1.jpg}	4303010006	143	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
91	Средство чистящее для сантехники Санокс   3*5л	5 л	668	{/uploads/products/product_91_1.jpg}	4303010002	307	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
94	Dolphin: Сани-Макс 5л щелочное средство для мытья и дезинфекции (шт.)	5 л	709	{/uploads/products/product_94_1.webp}	D010-5	187	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
95	Грасс Torus Очиститель-полироль для мебели 600 мл* 8	600 мл	259	{/uploads/products/product_95_1.webp}	219600	95	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
96	Грасс «G-oxi» Спрей пятновыводитель для ковровых покрытий  антибактериальный	600 мл	249	{/uploads/products/product_96_1.webp}	125636	69	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
98	TX Shampoo + Carpet Shampoo шампунь для чистки ковров и мягкой мебели. Концентрат (1:20 - 1:120) 1 л	1 л	409	{/uploads/products/product_98_1.jpg}	ЭС 020	407	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
99	TX DryClean + Carpet DryClean шампунь для сухой чистки ковров и текстильных изделий. Концентрат(1:20-1:100) 1 л	1 л	429	{/uploads/products/product_99_1.jpg}	ЭС021	28	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
101	UN Spray Universal Spray  универсальное моющее и чистящее средство. Готовое к применению. 5 л	5 л	649	{/uploads/products/product_101_1.jpg}	ЭС023	1	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
102	UN Spray Universal Spray  универсальное моющее и чистящее средство. Готовое к применению. 500 мл	500 мл	169	{/uploads/products/product_102_1.jpg}	ЭС024	169	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
104	UN DEZ+ Universal DZ  универсальное моющее средство с дезинфицирующим эффектом. Концентрат (1:10- 1:120) 5 л	5 л	1119	{/uploads/products/product_104_1.jpg}	ЭС026	79	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
105	UN Universal+ Universal E  универсальное моющее средство эконом - класса.   Концентрат (1:10-1:100) 5 л	5 л	719	{/uploads/products/product_105_1.jpg}	ЭС027	239	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
78	SANFOR Белизна гель, 3 в 1, 1,5 л	1,5 л	289	{/uploads/products/product_78_1.jpg}	25408	55	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081	{"ДЛЯ САНУЗЛОВ"}
114	MP Effect + Multipower E  средство эконом-класса  для мытья полов всех типов.   Концентрат (1:5-1:150)	5 л	669	{/uploads/products/product_114_1.jpg}	ЭС036	29	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
115	MP Effect Citrus + Multipower E (цитрус)  Концентрат эконом-класса для мытья полов.  Концентрат(1:5-1:150)	5 л	669	{/uploads/products/product_115_1.jpg}	ЭС037	71	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
116	Duty Graffiti средство для удаления граффити, маркера, краски. Готовое к применению. АЭРОЗОЛЬ 2 л	2 л	2879	{/uploads/products/product_116_1.jpg}	ЭС038	253	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
117	Duty Graffiti средство для удаления граффити, маркера, краски. Готовое к применению. АЭРОЗОЛЬ 400 мл	400 мл	459	{/uploads/products/product_117_1.jpg}	ЭС039	102	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
118	Duty Graffiti Max, Средство для удаления граффити, маркера, краски 2 л	2 л	2889	{/uploads/products/product_118_1.jpg}	ЭС040	330	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
119	Duty Universal  Средство для удаления клейкой ленты, клея, наклеек 2 л	2 л	2839	{/uploads/products/product_119_1.jpg}	ЭС041	49	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
120	Duty Universal  Средство для удаления клейкой ленты, клея, наклеек 400 мл	400 мл	509	{/uploads/products/product_120_1.jpg}	ЭС042	111	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
121	Duty Universal  Средство для удаления клейкой ленты, клея, наклеек 210 мл	210 мл	409	{/uploads/products/product_121_1.jpg}	ЭС043	94	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
122	EFFECT DELTA 403 Пятновыводитель для сухой чистки	500 мл	445	{/uploads/products/product_122_1.jpg}	26252	120	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
130	EFFECT ДЕЛЬТА 402 Средство для чистки ковровых покрытий и обивки, 5 л (ВЕРСИЯ 2023)	5 л	1389	{/uploads/products/product_130_1.webp}	26004	100	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
153	Diona Antibac,Антибактериальное мыло 5л	5 л	1099	{/uploads/products/product_153_1.jpg}	ЭС047	149	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
108	MP Bright + Multipower Bright средство для мытья полов с полимерным покрытием.  Концентрат(1:65-1:500)	5 л	1209	{/uploads/products/product_108_1.jpg}	ЭС030	255	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
109	MP Kerama + Multipower Kerama,Средство для мытья плитки и керамогранита\nКонцентрат (1:130) 5л	5 л	729	{/uploads/products/product_109_1.jpg}	ЭС031	99	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
110	MP Shine+ Multipower Shine+ Щелочной концентрат для мытья глянцевых полов\nКонцентрат(1:150)	5 л	1339	{/uploads/products/product_110_1.jpg}	ЭС032	55	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
111	MP Prof + Multipower Prof средство усиленного действия для мытья всех типов полов.  Концентрат(1:20 -1:300)	5 л	1327	{/uploads/products/product_111_1.jpg}	ЭС033	24	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
112	MP Prof + Multipower Prof средство усиленного действия для мытья всех типов полов.  Концентрат(1:20 -1:300)	1 л	349	{/uploads/products/product_112_1.jpg}	ЭС034	93	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
113	MP White + Multipower White средство для мытья светлых полов с отбеливающим эффектом.     Концентрат(1:20-1:200)	5 л	1289	{/uploads/products/product_113_1.jpg}	ЭС035	71	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
149	Bagi МАСТИКА ДЛЯ ПОЛИРОВКИ ПОЛОВ, 500 мл	500 мл	619	{/uploads/products/product_149_1.webp}	H-395422-N	75	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
150	PROF DZ ПРОФ ДЗ ( PROF DZ) кожный антисептик 5 л	5 л	1649	{/uploads/products/product_150_1.webp}	ЭС044	9	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
151	PROF DZ ПРОФ ДЗ ( PROF DZ) кожный антисептик 1 л	1 л	469	{/uploads/products/product_151_1.jpg}	ЭС045	260	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
152	Diona Aroma Пенное мыло для дозаторов. С цветочным ароматом 5 л	5 л ПЭТ	519	{/uploads/products/product_152_1.jpg}	ЭС046	92	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
154	Diona Apple, Гель-мыло с перламутром. \nC ароматом яблока 5л	5 л	549	{/uploads/products/product_154_1.jpg}	ЭС048	122	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
155	Diona жидкое гель-мыло с перламутром. Без цвета, без запаха. 5 л ПЭТ	5 л ПЭТ	419	{/uploads/products/product_155_1.jpg}	ЭС049	91	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
156	Diona E жидкое гель-мыло эконом-класса. Без красителей и ароматизаторов. 5 л ПЭТ	5 л ПЭТ	326	{/uploads/products/product_156_1.jpg}	ЭС050	110	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
157	Diona Apple E, Жидкое гель-мыло эконом-класса. C ароматом яблока\nготовое средство 5 л ПЭТ	5 л ПЭТ	326	{/uploads/products/product_157_1.jpg}	ЭС051	119	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
158	Diona Citrus E, Жидкое гель-мыло эконом-класса. C ароматом цитрусовых\nготовое средство 5 л ПЭТ	5 л ПЭТ	326	{/uploads/products/product_158_1.jpg}	ЭС052	14	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
159	EFFECT жидкое крем-мыло Sanfito, Пион и камелия, 1 л	1 л	196	{/uploads/products/product_159_1.jpg}	26436	87	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
160	EFFECT жидкое крем-мыло Sanfito, Цветочный микс, 1 л	1 л	196	{/uploads/products/product_160_1.jpg}	25509	173	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
161	EFFECT жидкое мыло Sanfito, Сочное алоэ, 1 л	1 л	196	{/uploads/products/product_161_1.jpg}	25505	139	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
162	ТОРК: Мыло- пена S4 1 л (картридж)	1 л 6 шт/упак	819	{/uploads/products/product_162_1.jpg}	520511	93	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
163	Мыло жидкое биоразлагаемое для мытья рук и тела Лаванда торговая марка SYNERGETIC 0.5л	500 мл	166	{/uploads/products/product_163_1.jpg}	105054/14	484	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
164	Мыло жидкое биоразлагаемое для мытья рук и тела Лаванда торговая марка SYNERGETIC 5л	5 л	799	{/uploads/products/product_164_1.jpg}	105501	275	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
165	Мыло жидкое биоразлагаемое для мытья рук и тела Фруктовый микс торговая марка SYNERGETIC 0.5л	500 мл	166	{/uploads/products/product_165_1.jpg}	105055/14	142	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
166	Мыло жидкое биоразлагаемое для мытья рук и тела Фруктовый микс торговая марка SYNERGETIC 5л	5 л	799	{/uploads/products/product_166_1.jpg}	105502	67	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
169	Натуральное биоразлагаемое мыло для рук и тела SYNERGETIC Пачули и ароматный бергамот, 0,38л	380 мл	219	{/uploads/products/product_169_1.jpg}	105001	124	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
170	Натуральное биоразлагаемое мыло для рук и тела SYNERGETIC Сандал и ягоды можжевельника, 0,38л	380 мл	219	{/uploads/products/product_170_1.jpg}	105003	91	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
172	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ИНТЕНСИВНОЕ УВЛАЖНЕНИЕ И БЛЕСК	флакон 0,75л	459	{/uploads/products/product_172_1.jpg}	701750	23	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
173	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ОБЪЁМ И УКРЕПЛЕНИЕ ВОЛОС	флакон 0,4л	289	{/uploads/products/product_173_1.jpg}	701403	500	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
174	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ОБЪЁМ И УКРЕПЛЕНИЕ ВОЛОС	флакон 0,75л	459	{/uploads/products/product_174_1.jpg}	701752	466	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
175	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ЭКСТРАМЯГКИЙ ДЛЯ ЕЖЕДНЕВНОГО УХОДА 2 В 1	флакон 0,4л	289	{/uploads/products/product_175_1.jpg}	701404	218	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
177	Натуральный биоразлагаемый гель для душа SYNERGETIC Пачули и ароматный бергамот, 0,38л	380 мл	225	{/uploads/products/product_177_1.jpg}	400001	124	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
178	Натуральный биоразлагаемый гель для душа SYNERGETIC Пачули и ароматный бергамот, 750мл	750 мл	357	{/uploads/products/product_178_1.jpg}	400009	175	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
179	Натуральный биоразлагаемый гель для душа SYNERGETIC Сандал и ягоды можжевельника, 0,38л	380 мл	225	{/uploads/products/product_179_1.jpg}	400003	258	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
181	Натуральный крем для рук и тела SYNERGETIC Карамельное яблоко и ваниль 380мл	380 мл	252	{/uploads/products/product_181_1.jpg}	300008/6	269	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
182	Натуральный крем для рук и тела SYNERGETIC Пачули и ароматный бергамот 380мл	380 мл	252	{/uploads/products/product_182_1.jpg}	300009/6	255	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
184	Натуральный крем для рук и тела Synergetic кокос и масло макадамии, 380мл	380 мл	252	{/uploads/products/product_184_1.jpg}	300023	220	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
185	FL Flox FLOX PROF Нейтрализатор запахов с антибактериальным компонентом, без запаха. Готов к применению 5 л	5 л	1105	{/uploads/products/product_185_1.jpg}	ЭС053	28	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
187	FL Sea FLOX SEA Нейтрализатор запахов с антибактериальным компонентом, аромат Морской бриз. Готов к применению. 5 л	5 л	1105	{/uploads/products/product_187_1.jpg}	ЭС055	438	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
188	FL Sea FLOX SEA Нейтрализатор запахов с антибактериальным компонентом, аромат Морской бриз. Готов к применению. 500 мл	500 мл	245	{/uploads/products/product_188_1.jpg}	ЭС056	83	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
189	EFFECT ИНТЕНСИВ 702 нейтрализатор запаха, 500 мл (ВЕРСИЯ 2024)	500 мл	369	{/uploads/products/product_189_1.jpg}	26206	33	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
190	Гипоаллергенный биоразлагаемый освежитель воздуха, нейтрализатор запахов SYNERGETIC «Миндаль и яблоневый цвет» 380мл	380 мл	219	{/uploads/products/product_190_1.jpg}	900001	48	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
220	EFFECT ГАММА 301 Средство чистящее для кухни, спрей, 500 мл (ВЕРСИЯ 2023)	500 мл	305	{/uploads/products/product_220_1.jpg}	25681	144	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
168	Мыло жидкое биоразлагаемое для мытья рук и тела Миндальное молочко торговая марка SYNERGETIC 5л	5 л	799	{/uploads/products/product_168_1.jpg}	105506	62	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ"}
197	CK Cooky Гель для мытья  посуды вручную. Без запаха\nCooky 1 л	1 л	231	{/uploads/products/product_197_1.jpg}	ЭС057	273	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"ДЛЯ КУХНИ"}
198	CK Cooky+ Пенное гелеобразное средство для мытья посуды. Без отдушки. Концентрат (1:200). 5 л ПЭТ	5 л ПЭТ	490	{/uploads/products/product_198_1.jpg}	ЭС058	374	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"ДЛЯ КУХНИ"}
199	CK Apple + Гелеобразное средство для мытья посуды. С ароматом яблока \nКонцентрат (1:250) 5 л ПЭТ	5 л	579	{/uploads/products/product_199_1.jpg}	ЭС059	74	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"ДЛЯ КУХНИ"}
200	CK Fruit + Cooky Fruit+ Гелеобразное средство для мытья посуды. С ароматом фруктов\nКонцентрат (1:250)	5 л	579	{/uploads/products/product_200_1.jpg}	ЭС060	329	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"ДЛЯ КУХНИ"}
201	CK Gel Lemon + Cooky Gel Lemon+ Пенное гелеобразное средство для мытья посуды. Аромат лимон. Концентрат(1:200)	5 л	589	{/uploads/products/product_201_1.jpg}	ЭС061	238	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
202	CK Cooky DEZ + Cooky Plus Пенное гелеобразное средство для мытья посуды с дезинфицирующим эффектом. Концентрат(1:250)	5 л	597	{/uploads/products/product_202_1.jpg}	ЭС062	243	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
203	CK Cooky White + Cooky White+ Средство для мытья и отбеливания посуды с дезинфицирующим эффектом. \nКонцентрат(1:30)	5 л	1110	{/uploads/products/product_203_1.jpg}	ЭС063	261	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
204	CK Automat + Cooky Automat+ Средство для мытья посуды в посудомоечных машинах. Концентрат	5 л	1390	{/uploads/products/product_204_1.jpg}	ЭС064	322	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
205	CK Rinser + Splash Rinser Кислотное средство для ополаскивания посуды в посудомоечной машине\nКонцентрат (1:200-1:3000)	5 л	1359	{/uploads/products/product_205_1.jpg}	ЭС065	295	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
206	EFFECT Super средство для мытья посуды, 5 л	5 л	399	{/uploads/products/product_206_1.jpg}	25700	136	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
208	EFFECT Super средство для мытья посуды, 1 л	1 л	149	{/uploads/products/product_208_1.jpg}	25704	71	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
210	EFFECT Super Средство чистящее для кухни Антижир, 500 мл	500 мл	155	{/uploads/products/product_210_1.jpg}	25694	394	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
216	EFFECT ВИТА 211 Концентрированное средство для ручного мытья посуды, 5 л	5 л	1279	{/uploads/products/product_216_1.jpg}	26656	185	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
217	EFFECT ГАММА 302 Средство чистящее для кухни, 5 л (ВЕРСИЯ 2023)	5 л	2159	{/uploads/products/product_217_1.jpg}	25684	117	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
219	EFFECT ГАММА 303 Универсальный чистящий крем, 600 г	600 г	135	{/uploads/products/product_219_1.jpg}	26434	195	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ","СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА"}
218	EFFECT ГАММА 301 Средство чистящее для кухни спрей, 5 л (ВЕРСИЯ 2023)	5 л	1589	{/uploads/products/product_218_1.jpg}	25680	453	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
193	Парфюмированный освежитель воздуха, нейтрализатор запахов SYNERGETIC Tobacco-vanille/Табак-ваниль 380мл	380 мл	319	{/uploads/products/product_193_1.jpg}	900010	154	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
194	Грасс Harmony Жидкий освежитель воздуха 400мл	400 мл	199	{/uploads/products/product_194_1.jpg}	125118	106	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
195	Грасс Liberty Жидкий освежитель воздуха 400мл	400 мл	199	{/uploads/products/product_195_1.jpg}	125117	21	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
196	Грасс Spring Жидкий освежитель воздуха 400 мл	400 мл	199	{/uploads/products/product_196_1.jpg}	125116	46	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176	{"НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА"}
236	SANITA крем СТЕКЛОКЕРАМИКА, 600 г (ВЕРСИЯ 2022)	600 г	199	{/uploads/products/product_236_1.jpg}	22945	255	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
237	SANITA крем УНИВЕРСАЛ, Сицилийский лимон, 600 г (ВЕРСИЯ 2022)	600 г	199	{/uploads/products/product_237_1.jpg}	22952	203	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
240	SANITA средство чистящее для кухни 1 минута, 500 мл (ВЕРСИЯ 2023)	500 мл	226	{/uploads/products/product_240_1.jpg}	25354	276	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
241	SANITA средство чистящее мгновенного действия Жироудалитель GOLD, 500 мл (ВЕРСИЯ 2023)	500 мл	259	{/uploads/products/product_241_1.jpg}	25360	142	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
242	SANITA спрей Антижир для стеклокерамики, 500 мл (ВЕРСИЯ 2023)	500 мл	219	{/uploads/products/product_242_1.jpg}	25363	293	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
243	SANITA средство чистящее быстрого действия спрей КАЗАН-МАНГАЛ, 500 мл (по 5 шт) ВЕРСИЯ 2023	500 мл	225	{/uploads/products/product_243_1.jpg}	25381	56	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
244	SANITA чистящее средство спрей ДЛЯ КУХНИ, 500 мл (ВЕРСИЯ 2024)	500 мл	235	{/uploads/products/product_244_1.jpg}	25386	73	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
249	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом лимона, 0,5л	500 мл	129	{/uploads/products/product_249_1.jpg}	103051/14	91	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
250	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом лимона, 1л	1 л	209	{/uploads/products/product_250_1.jpg}	103101/8	448	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
251	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом лимона, 5л	5 л	754	{/uploads/products/product_251_1.jpg}	103500	67	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
252	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом алоэ, 0,5л	500 мл	129	{/uploads/products/product_252_1.jpg}	103053/14	82	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
258	Средство биоразлагаемое для мытья стекол, зеркал и бытовой техники SYNERGETIC. 0,5л.	0,5 л	189	{/uploads/products/product_258_1.jpg}	107052/8	43	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
260	Средство чистящее Санокс Антижир - гель   15*450 мл	450 мл	115	{/uploads/products/product_260_1.webp}	4303010033	103	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
263	Bagi КУМКУМИТ ОТ НАКИПИ, 550 мл	550 мл	549	{/uploads/products/product_263_1.webp}	K-310423-N	128	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
264	Грасс EVA  Flower Кондиционер для белья 5 кг *4	5 кг	619	{/uploads/products/product_264_1.jpg}	125377	185	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
254	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом алоэ, 5л	5 л	754	{/uploads/products/product_254_1.jpg}	103503	25	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
265	Crystal Color, Cтиральный порошок для цветных тканей с функцией защита цвета \nКонцентрат 5 кг	5 кг	1450	{/uploads/products/product_265_1.jpg}	ЭС066	14	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
255	Биоразлагаемые бесфосфатные таблетки для посудомоечных машин SYNERGETIC, 55шт	55 шт в упак	745	{/uploads/products/product_255_1.jpg}	102055avt	112	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
256	Биоразлагаемые бесфосфатные таблетки для посудомоечных машин SYNERGETIC, 100шт	100 шт в упак	1149	{/uploads/products/product_256_1.jpg}	102100avt	130	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"ДЛЯ КУХНИ"}
266	Crystal White +, Стиральный порошок для белых тканей\nКонцентрат 5 кг	5 кг	1650	{/uploads/products/product_266_1.jpg}	ЭС067	57	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
267	Crystal, Жидкий моющий концентрат для стирки белья  \nКонцентрат 5 л	5 л	1389	{/uploads/products/product_267_1.jpg}	ЭС068	296	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
268	Crystal (белые ткани), Жидкое моющее средство для стирки белых и светлых тканей\nКонцентрат 1 л	1 л	379	{/uploads/products/product_268_1.jpg}	ЭС069	64	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
269	Crystal (спортивная одежда), Жидкое моющее средство для стирки спортивной одежды, обуви и пуховиков\nКонцентрат 1 л	1 л	498	{/uploads/products/product_269_1.jpg}	ЭС070	288	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
270	Crystal (цветные изделия), Жидкое моющее средство для стирки цветных тканей\nКонцентрат 1 л	1 л	379	{/uploads/products/product_270_1.jpg}	ЭС071	162	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
271	Crystal (чёрные ткани), Жидкое моющее средство для стирки белых и светлых тканей\nКонцентрат 1 л	1 л	379	{/uploads/products/product_271_1.jpg}	ЭС072	30	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
272	Crystal (шерсть и шелк), Жидкое моющее средство для стирки шерсти, шелка и деликатных тканей\nКонцентрат 1 л	1 л	379	{/uploads/products/product_272_1.jpg}	ЭС073	60	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
273	Crystal Rinser Альпийская свежесть, Кондиционер для белья с ароматом Альпийская свежесть\nКонцентрат 2 л	2 л	269	{/uploads/products/product_273_1.jpg}	ЭС074	133	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
274	Crystal Rinser Альпийская свежесть, Кондиционер для белья с ароматом Альпийская свежесть\nКонцентрат 5 л	5 л	599	{/uploads/products/product_274_1.jpg}	ЭС075	83	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
275	Crystal Rinser Королевский Ирис, Кондиционер для белья с ароматом  королевского Ириса\nКонцентрат 2 л	2 л	279	{/uploads/products/product_275_1.jpg}	ЭС076	91	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
276	Crystal Rinser Королевский Ирис, Кондиционер для белья с ароматом  королевского Ириса\nКонцентрат 5 л	5 л	599	{/uploads/products/product_276_1.jpg}	ЭС077	78	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
278	Crystal Rinser Лепестки Сакуры, Кондиционер для белья с ароматом лепестков Сакуры\nКонцентрат	5 л	599	{/uploads/products/product_278_1.jpg}	ЭС079	169	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
307	PACLAN PRACTI COMFORT ПЕРЧАТКИ РЕЗИНОВЫЕ М, ПАРА	пара	109	{/uploads/products/product_307_1.jpg}	407652	182	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
281	Crystal Rinser Японский чай, Кондиционер для белья с ароматом Японского чая\nКонцентрат 5 л	5 л	599	{/uploads/products/product_281_1.jpg}	ЭС082	253	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
282	Crystal Rinser, Кондиционер для белья без красителей и ароматизаторов \nКонцентрат 5 л	5 л	599	{/uploads/products/product_282_1.jpg}	ЭС083	299	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
283	Crystal Hand, Чистящее средство, сода эффект\nГотово к применению 400 гр	400 гр	97	{/uploads/products/product_283_1.jpg}	ЭС084	204	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
284	Crystal Lux, Чистящее средство, отбеливающий эффект\nГотово к применению 400 гр	400 гр	105	{/uploads/products/product_284_1.jpg}	ЭС085	465	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
285	EFFECT ОМЕГА 501 Средство для стирки, 5 л (ВЕРСИЯ 2023)	5 л	1459	{/uploads/products/product_285_1.jpg}	25986	98	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
286	EFFECT ОМЕГА 507 Гель-концентрат для стирки цветного белья Color, 5 л	5 л	1288	{/uploads/products/product_286_1.jpg}	25763	21	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
288	Биоразлагаемый концентрированный гель для стирки SYNERGETIC универсальный 2,75л (фиолетовая этикетка)	2,75 л	799	{/uploads/products/product_288_1.jpg}	109275	127	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
289	Биоразлагаемый концентрированный гель для стирки SYNERGETIC универсальный 5л (фиолетовая этикетка)	5 л	1099	{/uploads/products/product_289_1.jpg}	109500	318	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
291	Биоразлагаемый концентрированный  универсальный гипоаллергенный гель для стирки SYNERGETIC 5л (зеленая этикетка)	5 л	1099	{/uploads/products/product_291_1.jpg}	109804	61	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
292	Биоразлагаемый концентрированный гель для стирки SYNERGETIC COLOR 1,5л	1,5 л	419	{/uploads/products/product_292_1.jpg}	109805	149	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
293	Биоразлагаемый концентрированный гель для стирки SYNERGETIC COLOR 3,75л	3,75 л	929	{/uploads/products/product_293_1.jpg}	109836	146	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
294	Биоразлагаемые концентрированные гипоаллергенные капсулы для стирки SYNERGETIC COLOR (12 штук)	12 шт в упак	259	{/uploads/products/product_294_1.jpg}	109817	207	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
295	Биоразлагаемые концентрированные гипоаллергенные капсулы для стирки SYNERGETIC COLOR (40 штук)	40 шт в упак	689	{/uploads/products/product_295_1.jpg}	109815	267	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
296	Биоразлагаемые концентрированные гипоаллергенные капсулы для стирки SYNERGETIC COLOR (60 штук)	60 шт в упак	849	{/uploads/products/product_296_1.jpg}	109816	124	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
297	Средство моющее синтетическое порошкообразное АИСТ- ПРОФИ  стандарт 20кг.	20 кг	2599	{/uploads/products/product_297_1.jpg}	4301020057	68	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
298	Чайка-автомат 15 кг Балтийское море универсал	15 кг	1699	{/uploads/products/product_298_1.jpg}	87068	201	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"СРЕДСТВА ДЛЯ СТИРКИ"}
300	PACLAN GREEN MOP ПЛОСКАЯ НАСАДКА ШЕНИЛЛ ДЛЯ ШВАБРЫ 1 ШТ.	шт	389	{/uploads/products/product_300_1.jpg}	135931	38	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
301	PACLAN GREEN MOP ПЛОСКАЯ НАСАДКА ИЗ МИКРОФИБРЫ ДЛЯ ШВАБРЫ, 1 ШТ.	шт	299	{/uploads/products/product_301_1.jpg}	135951	265	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
303	PACLAN PRACTI EXTRA DRY РЕЗИНОВЫЕ ПЕРЧАТКИ Р. S, ПАРА	пара	105	{/uploads/products/product_303_1.jpg}	407331	16	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
304	PACLAN PRACTI EXTRA DRY РЕЗИНОВЫЕ ПЕРЧАТКИ Р. М, ПАРА	пара	105	{/uploads/products/product_304_1.jpg}	4073411	317	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
306	PACLAN PRACTI COMFORT ПЕРЧАТКИ РЕЗИНОВЫЕ S, ПАРА	пара	109	{/uploads/products/product_306_1.jpg}	407641	150	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
310	Перчатки нитриловые хлорированные неопудренные 200 шт/100 пар S голубой	100 пар/S голубой	820	{/uploads/products/product_310_1.jpg}	M223K2	120	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
311	Перчатки нитриловые хлорированные неопудренные 200 шт/100 пар M голубой	100 пар/M голубой	820	{/uploads/products/product_311_1.jpg}	ME6BB306BS103	191	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
312	Перчатки нитриловые хлорированные неопудренные 100 шт/50 пар M черный	50 пар/M черный	568	{/uploads/products/product_312_1.jpg}	M212K3	246	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
313	Перчатки нитриловые хлорированные неопудренные 100 шт/50 пар L черный	50 пар/L черный	568	{/uploads/products/product_313_1.jpg}	M212K4	106	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
314	Vileda: Губка с системой ПурАктив 6,3х14 см голубой (10 шт/уп)	(10 шт/уп)	185	{/uploads/products/product_314_1.jpg}	123118/123114	281	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
316	Vileda: Губка с системой ПурАктив 6,3х14 см желтый (10 шт/уп)	(10 шт/уп)	185	{/uploads/products/product_316_1.jpg}	123117/123113	55	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
317	Vileda: Губка с системой ПурАктив 6,3х14 см зеленый (10 шт/уп)	(10 шт/уп)	185	{/uploads/products/product_317_1.jpg}	123115/123111	320	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
322	PACLAN PRACTI SOFT POWER ГУБКИ ДЛЯ ПОСУДЫ, 2ШТ	2 шт в упак	159	{/uploads/products/product_322_1.jpg}	409172	225	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
323	PACLAN PRACTI UNIVERSAL ГУБКИ ДЛЯ ПОСУДЫ, 5ШТ.	5 шт в упак	99	{/uploads/products/product_323_1.jpg}	409135	36	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
325	Губка меламиновая Practi Magic, 1шт.	шт	119	{/uploads/products/product_325_1.jpg}	409140	65	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
309	Перчатки нитриловые хлорированные неопудренные 100 шт/50 пар M голубой	50 пар/ M голубой	459	{/uploads/products/product_309_1.jpg}	ME6BB306BS83	15	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
326	PACLAN PRACTI CRYSTAL ГУБКА ДЛЯ ВАННОЙ, 1ШТ.	шт	129	{/uploads/products/product_326_1.jpg}	409194	118	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
328	PACLAN САЛФЕТКИ ИЗ МИКРОФИБРЫ 30Х30СМ 2ШТ.	0,3*0,3 м по 2 шт в упак	119	{/uploads/products/product_328_1.jpg}	410310	415	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
329	PACLAN САЛФЕТКИ ИЗ МИКРОФИБРЫ 30Х30СМ 4ШТ.	0,3*0,3 м по 4 шт в упак	379	{/uploads/products/product_329_1.jpg}	410261	283	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
331	PACLAN ТРЯПКА УНИВЕРСАЛЬНАЯ КОМФОРТ 25Х35СМ, 70шт./рул.	0,25*0,35 м 70 шт в рулоне	410	{/uploads/products/product_331_1.jpg}	410341	69	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
332	Держатель мопов Vileda УльтраСпид Про голубой 40 см	40 см шт	4459	{/uploads/products/product_332_1.jpg}	147593	115	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
334	Vileda: УльтраСпид Про Моп Трио 40см серо-бело-бежевый (шт.)	шт	649	{/uploads/products/product_334_1.jpg}	167276	244	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
335	Vileda: Моп МикроПлюс УльтраСпид Про 40см	шт	829	{/uploads/products/product_335_1.jpg}	167291	128	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
337	Vileda: УльтраСпид Набор Мини Комплекс голубой (шт.)	шт	5989	{/uploads/products/product_337_1.jpg}	161099	75	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
371	салфетки бумажные 24*24см 3сл 25шт БЕЛЫЕ ТЮЛЬПАНЫ Bouquet de Luxe	24*24см 3сл 25шт	67	{/uploads/products/product_371_1.jpg}	57299	103	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
340	совок и сметка с длинными ручками 83см  Антелла	шт	569	{/uploads/products/product_340_1.jpg}	70974	62	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
343	Vileda: Салфетка* МикронКвик 40х38см зеленый (шт.)	шт	567	{/uploads/products/product_343_1.jpg}	170637	76	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
344	Vileda: Салфетка* МикронКвик 40х38см красный (шт.)	шт	567	{/uploads/products/product_344_1.jpg}	170636	455	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
346	Vileda: Салфетки Бризи 35,5x35 см красный (25 шт/уп)	(25 шт/уп)	75	{/uploads/products/product_346_1.jpg}	161617	50	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
347	Vileda: Салфетки Бризи 35,5x35 см желтый (25 шт/уп)	(25 шт/уп)	75	{/uploads/products/product_347_1.jpg}	161618	412	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
349	Vileda: Салфетки ПВАМикро  голубой	шт	497	{/uploads/products/product_349_1.jpg}	143590/143585	479	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
350	Vileda: Салфетки ПВАМикро желтый	шт	497	{/uploads/products/product_350_1.jpg}	143592/143587	476	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
352	Vileda: Салфетки ПВАМикро красный	шт	497	{/uploads/products/product_352_1.jpg}	143591/143586	128	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
354	Vileda: Салфетка* МикроТафф Бэйс 36х36см красный (шт.)	шт	237	{/uploads/products/product_354_1.jpg}	174178	3	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
355	Vileda: Салфетка* МикроТафф Бэйс 36х36см желтый (шт.)	шт	237	{/uploads/products/product_355_1.jpg}	174182	242	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
357	Vileda Салфетки МикроТафф Плюс 38х38 см голубая	38*38 шт	519	{/uploads/products/product_357_1.jpg}	174192	176	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
358	Vileda Салфетки МикроТафф Плюс 38х38 см красная	38*38 шт	519	{/uploads/products/product_358_1.jpg}	174201	439	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
360	Vileda Салфетки МикроТафф Плюс 38х38 см зеленая	38*38 шт	519	{/uploads/products/product_360_1.jpg}	174203	2	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
363	Бумага туалетная рулонная Focus Mini Jumbo белая 12 рул/упак, 170 м, 2 слоя	170 м, 2 слоя	159	{/uploads/products/product_363_1.jpg}	5036904	199	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
365	Туалетная бумага ТОРК: Т2 стандарт 1 сл, 200м/9,5 белая 12 рул/упак	200м/9,5 белая 12 рул/упак	137	{/uploads/products/product_365_1.jpg}	120197	137	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
366	Полотенца в пач. V-укладка ( 210 мм* 216мм - 250 л) 1 слой	250 листов 1 слой	91	{/uploads/products/product_366_1.jpg}	V1-250	197	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
367	FORTESS нетканый протир. материал повыш. прочности в рул, синие, длина 90м,35*30 см 300 л	35*30 см 90 м 300 листов	3099	{/uploads/products/product_367_1.jpg}	W80BR	310	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
368	салфетки 25*25см 1сл 80шт БЕЛЫЕ в боксе  Антелла	25*25см 1сл 80шт БЕЛЫЕ в боксе	69	{/uploads/products/product_368_1.jpg}	4147	150	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
369	салфетки 24*24см 1сл 100шт БЕЛЫЕ Verona	24*24см 1сл 100шт БЕЛЫЕ	45	{/uploads/products/product_369_1.jpg}	77198	164	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
372	салфетки бумажные 24*24см 3сл 25шт ВЕСЕЛЫЙ ПРАЗДНИК Bouquet de Luxe	24*24см 3сл 25шт	67	{/uploads/products/product_372_1.jpg}	37093	118	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"БУМАЖНАЯ ПРОДУКЦИЯ"}
339	Vileda: УльтраСпид Мини Ручка 84-144см телескопическая (шт.)	шт	699	{/uploads/products/product_339_1.jpg}	526693	213	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)"}
373	Мешки для мусора 35 л белые (50*58)	35 л (50*58) 15 шт/рул	75	{/uploads/products/product_373_1.jpg}	В3351517Б	247	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
374	Мешки для мусора ПНД 30л (48*57,5*5,6мкн)Ромашка (50шт/рул 20рул/кор) черные	30л  48*57,5*5,6 мкн 50 шт/рул	55	{/uploads/products/product_374_1.jpg}	ЕЛР-305020	44	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
375	Мешки для мусора 30л (48*57,5*7,3)Ромашка (50шт/рул 15рул/кор) черные 4612729610239	30л  48*57,5*7,3 мкн 50 шт/рул	68	{/uploads/products/product_375_1.jpg}	НМ30-50/15/ Э	12	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
376	Мешки для мусора ПСД 60 л белые  (59*64*23 мкн)	60 л (59*64*23 мкн) 10 шт/рул	98	{/uploads/products/product_376_1.jpg}	В30601017Б	17	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
377	Мешки для мусора ПНД 60л (58*68*6мкм)Ромашка (50шт/рул 20рул/кор) черные	ПНД 60л 58*68*6 мкм 50 шт/рул	85	{/uploads/products/product_377_1.jpg}	ЕЛР-605020	120	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
378	Мешки для мусора ПНД 60л (58*68*7,3)Ромашка (50шт/рул 15рул/кор) черные 4612729610185	ПНД 60л 58*68*7,3 мкм 50 шт/рул	98	{/uploads/products/product_378_1.jpg}	НМ60-50/15/ Э	360	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43	{"МЕШКИ ДЛЯ МУСОРА"}
\.


--
-- Data for Name: user_special_prices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_special_prices (id, "userId", "productId", price, "createdAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password, "userType", "createdAt", "updatedAt", "firstName", "lastName", phone, "ipName", "companyName", "legalAddress", inn, kpp, "discountPercent", "isVip", "loyaltyPoints", role, "ipActualAddress", "ipBankName", "ipBik", "ipCheckingAccount", "ipCorrAccount", "ipFullName", "ipOgrnip", "ipOkved", "ipRegistrationAddress", "ipShortName", "ipTaxSystem", "ipVatStatus", "isGuest", "oooAccountant", "oooActualAddress", "oooAuthorizedPerson", "oooBankName", "oooBik", "oooCheckingAccount", "oooCorrAccount", "oooDirector", "oooFullName", "oooLegalAddress", "oooOgrn", "oooOkved", "oooShortName", "oooTaxSystem", "oooVatStatus") FROM stdin;
cmf6nd64v00006i31kbsfio11	stazizovs@gmail.com	$2b$10$64/ViWf8Qb7FZS1uQlxdsOuP8ll96rk513MeQpt5VBnnL/uYP2SEm	INDIVIDUAL	2025-09-05 09:43:07.855	2025-09-09 09:50:44.096	Said	Azizov	+19176755086	\N	\N	\N	\N	\N	0	f	0	ADMIN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmfcdedg100006itnptrkfq9b	manager@ecosphere.su	$2b$12$GDjWxQCZFY5kFVl3fiz8EeAFp0jFkJhk5LVkTxWsGXlAFf8m3Mvcu	INDIVIDUAL	2025-09-09 09:50:44.881	2025-09-09 09:50:44.881	Manager	User	\N	\N	\N	\N	\N	\N	0	f	0	MANAGER	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: personal_discounts personal_discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_discounts
    ADD CONSTRAINT personal_discounts_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: product_discounts product_discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_discounts
    ADD CONSTRAINT product_discounts_pkey PRIMARY KEY (id);


--
-- Name: product_inventory product_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_inventory
    ADD CONSTRAINT product_inventory_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: user_special_prices user_special_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_special_prices
    ADD CONSTRAINT user_special_prices_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cart_items_userId_productId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "cart_items_userId_productId_key" ON public.cart_items USING btree ("userId", "productId");


--
-- Name: favorites_userId_productId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "favorites_userId_productId_key" ON public.favorites USING btree ("userId", "productId");


--
-- Name: orders_orderNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "orders_orderNumber_key" ON public.orders USING btree ("orderNumber");


--
-- Name: posts_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX posts_slug_key ON public.posts USING btree (slug);


--
-- Name: product_discounts_productId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "product_discounts_productId_key" ON public.product_discounts USING btree ("productId");


--
-- Name: product_inventory_productId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "product_inventory_productId_key" ON public.product_inventory USING btree ("productId");


--
-- Name: user_special_prices_userId_productId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "user_special_prices_userId_productId_key" ON public.user_special_prices USING btree ("userId", "productId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: cart_items cart_items_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: personal_discounts personal_discounts_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_discounts
    ADD CONSTRAINT "personal_discounts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: personal_discounts personal_discounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_discounts
    ADD CONSTRAINT "personal_discounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: posts posts_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_special_prices user_special_prices_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_special_prices
    ADD CONSTRAINT "user_special_prices_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict avvne4Tohuh8zMPUYN3Y4wWUdQQPD8apQIZra9Eob7vyzTOFqZQDFLxFYIrn1uu

