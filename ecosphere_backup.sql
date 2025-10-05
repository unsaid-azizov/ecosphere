xxx--
-- PostgreSQL database dump
--

-- Dumped from database version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)
-- Dumped by pg_dump version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)

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
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: ecosphere_user
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PRODUCT',
    'CATEGORY',
    'ALL'
);


ALTER TYPE public."DiscountType" OWNER TO ecosphere_user;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: ecosphere_user
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO ecosphere_user;

--
-- Name: PostStatus; Type: TYPE; Schema: public; Owner: ecosphere_user
--

CREATE TYPE public."PostStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."PostStatus" OWNER TO ecosphere_user;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: ecosphere_user
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'MANAGER',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO ecosphere_user;

--
-- Name: UserType; Type: TYPE; Schema: public; Owner: ecosphere_user
--

CREATE TYPE public."UserType" AS ENUM (
    'INDIVIDUAL',
    'IP',
    'OOO'
);


ALTER TYPE public."UserType" OWNER TO ecosphere_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: ecosphere_user
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


ALTER TABLE public._prisma_migrations OWNER TO ecosphere_user;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: ecosphere_user
--

CREATE TABLE public.cart_items (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cart_items OWNER TO ecosphere_user;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: ecosphere_user
--

CREATE TABLE public.favorites (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.favorites OWNER TO ecosphere_user;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: ecosphere_user
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "productName" text NOT NULL,
    "productCategory" text NOT NULL,
    "productArticle" text NOT NULL
);


ALTER TABLE public.order_items OWNER TO ecosphere_user;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: ecosphere_user
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


ALTER TABLE public.orders OWNER TO ecosphere_user;

--
-- Name: personal_discounts; Type: TABLE; Schema: public; Owner: ecosphere_user
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


ALTER TABLE public.personal_discounts OWNER TO ecosphere_user;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: ecosphere_user
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


ALTER TABLE public.posts OWNER TO ecosphere_user;

--
-- Name: product_discounts; Type: TABLE; Schema: public; Owner: ecosphere_user
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


ALTER TABLE public.product_discounts OWNER TO ecosphere_user;

--
-- Name: product_inventory; Type: TABLE; Schema: public; Owner: ecosphere_user
--

CREATE TABLE public.product_inventory (
    id text NOT NULL,
    "productId" text NOT NULL,
    "stockQuantity" integer DEFAULT 0 NOT NULL,
    "minStock" integer DEFAULT 5 NOT NULL,
    "maxStock" integer DEFAULT 100 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product_inventory OWNER TO ecosphere_user;

--
-- Name: products; Type: TABLE; Schema: public; Owner: ecosphere_user
--

CREATE TABLE public.products (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price double precision NOT NULL,
    category text NOT NULL,
    images text[],
    article text NOT NULL,
    "stockQuantity" integer DEFAULT 0 NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.products OWNER TO ecosphere_user;

--
-- Name: user_special_prices; Type: TABLE; Schema: public; Owner: ecosphere_user
--

CREATE TABLE public.user_special_prices (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_special_prices OWNER TO ecosphere_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: ecosphere_user
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
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
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL
);


ALTER TABLE public.users OWNER TO ecosphere_user;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4ee78023-641b-4141-a828-447d961041aa	85e8878ec8c8098fe0e80161d404b85dd1850ab294fae2d1d3c3182164f42c44	2025-09-05 09:34:18.139213+00	20250905093418_init	\N	\N	2025-09-05 09:34:18.049376+00	1
12e25934-4fa4-4366-8ea6-8df8fd56d370	456fcf7cf0eb128611a80eec8d72df524b72f872ae36415290e7aa6318d9cdf1	2025-09-05 10:48:18.26959+00	20250905104818_add_products_table	\N	\N	2025-09-05 10:48:18.238287+00	1
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public.cart_items (id, "userId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
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
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public.order_items (id, "orderId", "productId", quantity, price, "createdAt", "productName", "productCategory", "productArticle") FROM stdin;
cmfca4er000076i28p8rbt36h	cmfca4eqo00056i28a8e8lgp3	1	2	19	2025-09-09 08:19:01.164	Зубной набор ЭкоСфера Крафт (ламинированная) JME 3 гр	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	ЭС001
cmfca4er000096i282yxwayyk	cmfca4eqo00056i28a8e8lgp3	101	1	649	2025-09-09 08:19:01.164	UN Spray Universal Spray  универсальное моющее и чистящее средство. Готовое к применению. 5 л	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	ЭС023
cmfca4er0000b6i28jvfeqd79	cmfca4eqo00056i28a8e8lgp3	120	1	509	2025-09-09 08:19:01.164	Duty Universal  Средство для удаления клейкой ленты, клея, наклеек 400 мл	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	ЭС042
cmfca4er0000d6i2843t7je5i	cmfca4eqo00056i28a8e8lgp3	106	1	1239	2025-09-09 08:19:01.164	UN Uni+ Universal Uni+ Универсальное низкопенное кислотное моющее средство  для удаления минеральных загрязнений\nКонцентрат (1:20) 5 л	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	ЭС028
cmfdy2n0j00096ilj359uclww	cmfdy2n0c00076iljk62bx4z0	107	1	1099	2025-09-10 12:17:15.523	MP Neutral + Multipower Neutral средство для мытья полов всех типов. Концентрат(1:64 - 1:500)	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	ЭС029
cmfdy2n0j000b6iljfmy9yee7	cmfdy2n0c00076iljk62bx4z0	109	1	729	2025-09-10 12:17:15.523	MP Kerama + Multipower Kerama,Средство для мытья плитки и керамогранита\nКонцентрат (1:130) 5л	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	ЭС031
cmfdy2n0k000d6iljxr706uwc	cmfdy2n0c00076iljk62bx4z0	108	1	1209	2025-09-10 12:17:15.523	MP Bright + Multipower Bright средство для мытья полов с полимерным покрытием.  Концентрат(1:65-1:500)	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	ЭС030
cmfl6880200036i6fv5jjh5ei	cmfl687zu00016i6f5nezxomf	10	1	3.5	2025-09-15 13:39:56.162	Шампунь саше Fleur de Lis 2012 кор.	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	1825
cmfl6880200056i6fvabxjk7t	cmfl687zu00016i6f5nezxomf	1	2	19	2025-09-15 13:39:56.162	Зубной набор ЭкоСфера Крафт (ламинированная) JME 3 гр	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	ЭС001
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public.orders (id, "orderNumber", "userId", status, "totalAmount", "createdAt", "updatedAt", "contactEmail", "contactPhone", "deliveryAddress") FROM stdin;
cmfca4eqo00056i28a8e8lgp3	ORD-1757405941136	cmf6nd64v00006i31kbsfio11	SHIPPED	2435	2025-09-09 08:19:01.152	2025-09-10 09:58:43.173	stazizovs@gmail.com	+79361111860	\N
cmfdy2n0c00076iljk62bx4z0	ORD-1757506635509	cmf6nd64v00006i31kbsfio11	SHIPPED	3037	2025-09-10 12:17:15.516	2025-09-14 11:25:10.185	stazizovs@gmail.com	+79361111860	\N
cmfl687zu00016i6f5nezxomf	ORD-1757943596147	cmf6nd64v00006i31kbsfio11	PENDING	41.5	2025-09-15 13:39:56.154	2025-09-15 13:39:56.154	stazizovs@gmail.com	+7936111860	home
\.


--
-- Data for Name: personal_discounts; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public.personal_discounts (id, name, description, "userId", "userType", "discountType", "productId", category, "discountPercent", "validFrom", "validUntil", "isActive", "createdAt", "updatedAt", "createdBy") FROM stdin;
cmfcnh2ux00016i0exjnd5uvh	Тестовая скидка на освежители	\N	cmf6nd64v00006i31kbsfio11	\N	CATEGORY	\N	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	15	2025-09-09 14:25:34.967	2025-09-10 21:00:00	t	2025-09-09 14:32:47.288	2025-09-09 14:32:47.288	cmf6nd64v00006i31kbsfio11
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public.posts (id, title, slug, excerpt, content, "coverImage", images, status, featured, views, category, tags, "metaTitle", "metaDescription", "publishedAt", "createdAt", "updatedAt", "authorId", blocks, "contentType") FROM stdin;
cmfioffxh00016ichltye0tzb	Добро пожаловать в EcoSphere: Ваш партнер в устойчивом развитии	добро-пожаловать-в-ecosphere-ваш-партнер-в-устойчивом-развитии	Узнайте, как EcoSphere помогает компаниям и частным лицам делать\n  экологически осознанный выбор и создавать более устойчивое будущее.	# Добро пожаловать в мир экологических решений\n\n  Мы рады приветствовать вас на страницах нашего блога! **EcoSphere** —\n  это больше, чем просто каталог товаров. Это ваш надежный проводник в\n  мире экологически чистых решений и устойчивого развития.\n\n  ## Наша миссия\n\n  В современном мире забота об окружающей среде становится не просто\n  трендом, а жизненной необходимостью. Мы верим, что каждый человек и\n  каждая компания могут внести свой вклад в создание более чистого и\n  здорового будущего.\n\n  ### Что мы предлагаем:\n\n  - **Экологически чистые продукты** для дома и офиса\n  - **Инновационные решения** для бизнеса\n  - **Консультации** по внедрению зеленых технологий\n  - **Образовательные материалы** о sustainable развитии\n\n  ## Почему выбирают EcoSphere?\n\n  > "Изменения начинаются с малого. Каждый экологически осознанный выбор\n   — это шаг к лучшему будущему."\n\n  1. **Качество и сертификация** — все наши товары имеют необходимые\n  экологические сертификаты\n  2. **Широкий ассортимент** — от бытовых товаров до промышленных\n  решений\n  3. **Экспертная поддержка** — наши специалисты помогут подобрать\n  оптимальное решение\n  4. **Конкурентные цены** — экологичность не должна быть дорогой\n\n  ## Что вас ждет в нашем блоге\n\n  В наших будущих статьях мы будем делиться:\n\n  - Актуальными новостями из мира экологии\n  - Практическими советами по внедрению эко-решений\n  - Обзорами инновационных продуктов\n  - Историями успеха наших клиентов\n  - Экспертными мнениями о будущем зеленых технологий\n\n  ## Присоединяйтесь к нам!\n\n  Станьте частью сообщества людей, которые заботятся о планете.\n  Подписывайтесь на наши обновления, делитесь статьями и оставляйте\n  комментарии — вместе мы сможем больше!\n\n  ---\n\n  *Готовы начать свой путь к более экологичному образу жизни? Исследуйте\n   наш каталог и найдите решения, которые подходят именно вам.*\n\n  Этот текст содержит все необходимые элементы для первой статьи блога и\n   демонстрирует возможности Markdown-редактора, включая заголовки,\n  списки, цитаты и выделение текста.\n\n![](https://plus.unsplash.com/premium_photo-1757343190565-3b99182167e3?q=80&w=2428&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)	https://plus.unsplash.com/premium_photo-1757343190565-3b99182167e3?q=80&w=2428&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D	{}	PUBLISHED	t	13	Экология	{экология,"устойчивое развитие","зеленые технологии"}			2025-09-13 19:46:07.584	2025-09-13 19:46:07.589	2025-09-14 14:16:01.353	cmf6nd64v00006i31kbsfio11	[{"id": "block_1757792674369_9nbd2b11z", "data": {"content": "# Добро пожаловать в мир экологических решений\\n\\n  Мы рады приветствовать вас на страницах нашего блога! **EcoSphere** —\\n  это больше, чем просто каталог товаров. Это ваш надежный проводник в\\n  мире экологически чистых решений и устойчивого развития.\\n\\n  ## Наша миссия\\n\\n  В современном мире забота об окружающей среде становится не просто\\n  трендом, а жизненной необходимостью. Мы верим, что каждый человек и\\n  каждая компания могут внести свой вклад в создание более чистого и\\n  здорового будущего.\\n\\n  ### Что мы предлагаем:\\n\\n  - **Экологически чистые продукты** для дома и офиса\\n  - **Инновационные решения** для бизнеса\\n  - **Консультации** по внедрению зеленых технологий\\n  - **Образовательные материалы** о sustainable развитии\\n\\n  ## Почему выбирают EcoSphere?\\n\\n  > \\"Изменения начинаются с малого. Каждый экологически осознанный выбор\\n   — это шаг к лучшему будущему.\\"\\n\\n  1. **Качество и сертификация** — все наши товары имеют необходимые\\n  экологические сертификаты\\n  2. **Широкий ассортимент** — от бытовых товаров до промышленных\\n  решений\\n  3. **Экспертная поддержка** — наши специалисты помогут подобрать\\n  оптимальное решение\\n  4. **Конкурентные цены** — экологичность не должна быть дорогой\\n\\n  ## Что вас ждет в нашем блоге\\n\\n  В наших будущих статьях мы будем делиться:\\n\\n  - Актуальными новостями из мира экологии\\n  - Практическими советами по внедрению эко-решений\\n  - Обзорами инновационных продуктов\\n  - Историями успеха наших клиентов\\n  - Экспертными мнениями о будущем зеленых технологий\\n\\n  ## Присоединяйтесь к нам!\\n\\n  Станьте частью сообщества людей, которые заботятся о планете.\\n  Подписывайтесь на наши обновления, делитесь статьями и оставляйте\\n  комментарии — вместе мы сможем больше!\\n\\n  ---\\n\\n  *Готовы начать свой путь к более экологичному образу жизни? Исследуйте\\n   наш каталог и найдите решения, которые подходят именно вам.*\\n\\n  Этот текст содержит все необходимые элементы для первой статьи блога и\\n   демонстрирует возможности Markdown-редактора, включая заголовки,\\n  списки, цитаты и выделение текста."}, "type": "text"}, {"id": "block_1757792758109_vj1f5a9n9", "data": {"alt": "", "url": "https://plus.unsplash.com/premium_photo-1757343190565-3b99182167e3?q=80&w=2428&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "caption": ""}, "type": "image"}]	blocks
\.


--
-- Data for Name: product_discounts; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public.product_discounts (id, "productId", "discountPercent", "validFrom", "validUntil", "isActive", "createdAt") FROM stdin;
\.


--
-- Data for Name: product_inventory; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public.product_inventory (id, "productId", "stockQuantity", "minStock", "maxStock", "updatedAt") FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public.products (id, name, description, price, category, images, article, "stockQuantity", "isAvailable", "createdAt", "updatedAt") FROM stdin;
362	Бумага туалетная Focus Economic Choice 12 рул/пачка, 125 л, 15 м, 2 слоя	12 рул/пачка, 125 л, 15 м, 2 слоя	199	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000361/1.jpg}	5071518	20	t	2025-09-06 11:27:47.43	2025-09-10 09:27:24.241
342	Vileda: Салфетка* МикронКвик 40х38см желтый (шт.)	de==	567	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000341/1.jpg}	170638	182	t	2025-09-06 11:27:47.43	2025-09-11 07:02:13.338
72	SANFOR для мытья полов УЛЬТРА БЛЕСК, Забота о домашних питомцах, 1 л	1 л	269	ДЛЯ САНУЗЛОВ	{/data/images/product_00000071/1.jpg}	22674	46	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
1	Зубной набор ЭкоСфера Крафт (ламинированная) JME 3 гр	индивид упак	19	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000000/1.jpg,/data/images/product_00000000/2.jpg}	ЭС001	182	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
2	Зубной набор ЭкоСфера Белая (ламинированная) JME 3 гр	индивид упак	19	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000001/1.jpg,/data/images/product_00000001/2.jpg}	ЭС002	155	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
3	Зубной набор ЭкоСфера Белая (ламинированная) AME 3 гр	мндивид упак	20	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000002/1.jpg}	ЭС003	196	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
4	Тапочки TD1 подошва ЭВА 4 мм, закрытый мыс, махровые	индивид упак	35	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000003/1.jpg}	ЭС004	142	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
5	Тапочки TD21-С подошва 4 мм, закрытый мыс 60 гр, антискользящие	индивид упак	20	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000004/1.jpg}	ЭС005	435	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
6	Тапочки TD21-E подошва 5 мм, закрытый мыс 80 гр, антискользящие	индивид упак	22	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000005/1.jpg}	ЭС006	42	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
7	Тапки Узо спанбонд белый 40 подошва 3 мм flow-pack кор.	индивид упак	18	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000006/1.jpg}	22730	497	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
8	Зубной набор: щетка АК РСТ, зубная паста тюбик Aquatique 5 мл, ЭКО Flow-pack кор.	идивид упак	17	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000007/1.jpg}	17508	171	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
9	Гель для душа саше Fleur de Lis 2012 кор.	саше	3.5	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000008/1.jpg}	1823	8	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
10	Шампунь саше Fleur de Lis 2012 кор.	саше	3.5	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000009/1.jpg}	1825	77	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
11	Мыло 13 г, ЭКО Flow-pack кор.	индивид упак	10	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000010/1.jpg}	17156	155	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
12	Бритвенный набор (Бритвенный станок Rapira, крем для бритья тюбик 5 мл, ЭКО Flow-pack кор.	индивид упак	27	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000011/1.jpg}	19984	267	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
13	Шапочка для душа Flow-pack ЭКО кор.	индивид упак	10	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000012/1.jpg}	17507	7	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
14	Косметический набор (ватные палочки 3шт+ ватные диски 3 шт.) ЭКО Flow-pack кор.	индивид упак	9	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000013/1.jpg}	17157	184	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
15	Губка для обуви круглая d-60 мм с бесцветной пропиткой	штука	29	РАСХОДНИКИ ДЛЯ ГОСТИНИЦ	{/data/images/product_00000014/1.jpg}	491531	411	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
16	Грасс GLOSS Для удаление известкового налета и ржавчины 600 мл *8	600 мл	249	ДЛЯ САНУЗЛОВ	{/data/images/product_00000015/1.jpg}	221600	67	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
17	BT Bath Acid +  средство усиленного действия для удаления ржавчины и минеральных отложений. Концентрат(1:200-1:500) 5 л	5 л	879	ДЛЯ САНУЗЛОВ	{/data/images/product_00000016/1.jpg}	ЭС007	107	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
18	BT Bath Acid +  средство усиленного действия для удаления ржавчины и минеральных отложений. Концентрат(1:200-1:500) 1 л	1 л	219	ДЛЯ САНУЗЛОВ	{/data/images/product_00000017/1.jpg}	ЭС008	278	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
19	BT Bath Extra гелеобразное средство усиленного действия для удаления ржавчины и минеральных отложений.  Концентрат(1:10-1:100)	5 л	889	ДЛЯ САНУЗЛОВ	{/data/images/product_00000018/1.jpg}	ЭС009	113	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
20	BT Bath Extra гелеобразное средство усиленного действия для удаления ржавчины и минеральных отложений.  Концентрат(1:10-1:100)	1 л	239	ДЛЯ САНУЗЛОВ	{/data/images/product_00000019/1.jpg}	ЭС010	150	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
21	BT Bath Uni Универсальное кислотное чистящее средство для санитарных комнат с антимикробным эффектом 5 л	5 л	869	ДЛЯ САНУЗЛОВ	{/data/images/product_00000020/1.jpg}	ЭС011	447	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
22	BT Bath Uni Универсальное кислотное чистящее средство для санитарных комнат с антимикробным эффектом 500 мл	500 мл	219	ДЛЯ САНУЗЛОВ	{/data/images/product_00000021/1.jpg}	ЭС012	132	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
23	BT Bath DZ+ Средство для уборки и дезинфекции санитарных комнат 5 л	5 л	1179	ДЛЯ САНУЗЛОВ	{/data/images/product_00000022/1.jpg}	ЭС013	24	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
24	BT Bath DZ+ Средство для уборки и дезинфекции санитарных комнат 1 л	1 л	310	ДЛЯ САНУЗЛОВ	{/data/images/product_00000023/1.jpg}	ЭС014	210	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
25	BT Bath Prof средство для устранения засоров в трубах. Концентрат(1:100) 5 л	5 л	810	ДЛЯ САНУЗЛОВ	{/data/images/product_00000024/1.jpg}	ЭС015	234	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
26	BT Bath Prof средство для устранения засоров в трубах. Концентрат(1:100) 1 л	1 л	239	ДЛЯ САНУЗЛОВ	{/data/images/product_00000025/1.jpg}	ЭС016	70	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
27	BT Bath Fungi+ средство для удаления плесени  с дезинфицирующим эффектом. Концентрат(1:50-1:100) 5 л	5 л	649	ДЛЯ САНУЗЛОВ	{/data/images/product_00000026/1.jpg}	ЭС017	456	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
28	BT Bath Fungi+ средство для удаления плесени  с дезинфицирующим эффектом. Концентрат(1:50-1:100) 500 мл	500 мл	219	ДЛЯ САНУЗЛОВ	{/data/images/product_00000027/1.jpg}	ЭС018	134	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
29	EFFECT SUPER средство с комплексным действием Белизна гель, 5 л	5 л	439	ДЛЯ САНУЗЛОВ	{/data/images/product_00000028/1.jpg}	26504	155	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
30	EFFECT Super средство универсальное для мытья пола и поверхностей 5 л	5 л	420	ДЛЯ САНУЗЛОВ	{/data/images/product_00000029/1.jpg}	25706	403	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
31	EFFECT Super средство с комплексным действием Белизна гель, 750 г	750 г	115	ДЛЯ САНУЗЛОВ	{/data/images/product_00000030/1.jpg}	25710	229	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
32	EFFECT Super Средство санитарно-гигиеническое для сантехники, 750 г	750 г	139	ДЛЯ САНУЗЛОВ	{/data/images/product_00000031/1.jpg}	25696	59	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
33	EFFECT Super Средство чистящее для ванн, 750 г	750 г	144	ДЛЯ САНУЗЛОВ	{/data/images/product_00000032/1.jpg}	25708	75	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
34	EFFECT Super Средство чистящее универсальное для стеклянных поверхностей, 500 мл	500 мл	154	ДЛЯ САНУЗЛОВ	{/data/images/product_00000033/1.jpg}	25698	162	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
35	EFFECT ДЕЛЬТА 418 DesPro средство для дезинфекции и мытья поверхностей, 5000 мл	5 л	899	ДЛЯ САНУЗЛОВ	{/data/images/product_00000034/1.jpg}	9066	265	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
36	EFFECT АЛЬФА 108 концентрированное средство чистящее для удаления известкового налета и ржавчины, 5л	5 л	2299	ДЛЯ САНУЗЛОВ	{/data/images/product_00000035/1.jpg}	24612	46	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
37	EFFECT АЛЬФА 109 Гель для удаления известкового налета и ржавчины, 5 л	5 л	956	ДЛЯ САНУЗЛОВ	{/data/images/product_00000036/1.jpg}	27109	248	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
38	EFFECT АЛЬФА 102 Средство санитарно-гигиеническое для удаления ржавчины, 5 л	5 л	879	ДЛЯ САНУЗЛОВ	{/data/images/product_00000037/1.jpg}	10717	488	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
39	EFFECT АЛЬФА 104 Средство для очистки канализационных труб, 5 л (ВЕРСИЯ 2023)	5 л	659	ДЛЯ САНУЗЛОВ	{/data/images/product_00000038/1.jpg}	26216	302	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
40	EFFECT АЛЬФА 106 универсальное чистящее средство Универсал, 5 л (ВЕРСИЯ 2023)	5 л	559	ДЛЯ САНУЗЛОВ	{/data/images/product_00000039/1.jpg}	26008	76	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
41	EFFECT АЛЬФА 103 Средство чистящее для удаления известкового налета и ржавчины, 5 л (ВЕРСИЯ 2023)	5 л	875	ДЛЯ САНУЗЛОВ	{/data/images/product_00000040/1.jpg}	26596	271	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
73	SANFOR для ванн АКРИЛАЙТ, 750 г	750 гр	249	ДЛЯ САНУЗЛОВ	{/data/images/product_00000072/1.jpg}	23655	13	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
42	EFFECT АЛЬФА 105 Средство санитарно-гигиеническое для сложных загрязнений, 5 л (ВЕРСИЯ 2023)	5 л	619	ДЛЯ САНУЗЛОВ	{/data/images/product_00000041/1.jpg}	25994	296	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
43	EFFECT АЛЬФА 104 Средство для очистки канализационных труб, 750 мл (ВЕРСИЯ 2023)	750 мл	149	ДЛЯ САНУЗЛОВ	{/data/images/product_00000042/1.jpg}	26211	110	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
44	EFFECT АЛЬФА 106 Универсал, универсальное чистящее средство, 750 мл (ВЕРСИЯ 2023)	750 мл	129	ДЛЯ САНУЗЛОВ	{/data/images/product_00000043/1.jpg}	26196	388	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
45	EFFECT АЛЬФА 103 Средство чистящее для удаления известкового налета и ржавчины, 500 мл (ВЕРСИЯ 2023)	500 мл	235	ДЛЯ САНУЗЛОВ	{/data/images/product_00000044/1.jpg}	26194	109	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
46	EFFECT ДЕЛЬТА 416 Средство универсальное Дегризер, 5 л (ВЕРСИЯ 2023)	5 л	1689	ДЛЯ САНУЗЛОВ	{/data/images/product_00000045/1.jpg}	25984	101	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
47	EFFECT ДЕЛЬТА 412 Средство нейтральное для мытья полов, 5 л (ВЕРСИЯ 2023)	5 л	728	ДЛЯ САНУЗЛОВ	{/data/images/product_00000046/1.jpg}	26006	161	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
48	EFFECT ДЕЛЬТА 401 Средство универсальное высокопенное для мытья поверхностей, 5 л (ВЕРСИЯ 2023)	5 л	689	ДЛЯ САНУЗЛОВ	{/data/images/product_00000047/1.jpg}	26002	295	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
49	EFFECT ДЕЛЬТА 416 Средство универсальное Дегризер, 1 л	1 л	359	ДЛЯ САНУЗЛОВ	{/data/images/product_00000048/1.jpg}	27312	72	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
50	EFFECT ДЕЛЬТА 404 средство чистящее универсальное для стекол и зеркал, 500 мл (ВЕРСИЯ 2023)	500 мл	149	ДЛЯ САНУЗЛОВ	{/data/images/product_00000049/1.jpg}	25689	114	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
51	Средство санитарно-гигиеническое Sanfor WС гель, 750 г, морской бриз	750 г	199	ДЛЯ САНУЗЛОВ	{/data/images/product_00000050/1.jpg}	1549	212	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
52	Sanfor для труб, 1 кг	1 кг	259	ДЛЯ САНУЗЛОВ	{/data/images/product_00000051/1.jpg}	1957	50	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
53	Средство санитарно-гигиеническое «Sanfor» Универсал морской бриз,1 кг	1 кг	230	ДЛЯ САНУЗЛОВ	{/data/images/product_00000052/1.jpg}	8893	166	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
54	Средство санитарно-гигиеническое «Sanfor»  Универсал лимонная свежесть,1 кг	1 кг	230	ДЛЯ САНУЗЛОВ	{/data/images/product_00000053/1.jpg}	8894	98	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
55	Средство для очистки труб Sanfor для труб (прочистка труб на кухне), 1 кг	1 кг	269	ДЛЯ САНУЗЛОВ	{/data/images/product_00000054/1.jpg}	10742	100	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
56	Sanfor WС гель, 750 г, speсial black	750 гр	209	ДЛЯ САНУЗЛОВ	{/data/images/product_00000055/1.jpg}	1896	254	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
57	Sanfor Универсал, 750 г, лимонная свежесть	750 гр	189	ДЛЯ САНУЗЛОВ	{/data/images/product_00000056/1.jpg}	1544	200	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
58	Sanfor WС гель, 1 кг, speсial black	1 кг	279	ДЛЯ САНУЗЛОВ	{/data/images/product_00000057/1.jpg}	1953	64	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
59	Sanfor Универсал, 1 кг, летний дождь	1 кг	250	ДЛЯ САНУЗЛОВ	{/data/images/product_00000058/1.jpg}	1956	279	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
60	Sanfor Универсал, 750 г, морской бриз	750 гр	189	ДЛЯ САНУЗЛОВ	{/data/images/product_00000059/1.jpg}	1543	387	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
61	Средство чистящее для унитаза SANFOR WC gel super power, 1 кг	1 кг	309	ДЛЯ САНУЗЛОВ	{/data/images/product_00000060/1.jpg}	10008	22	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
62	Sanfor Chlorum, 750 г	750 гр	166	ДЛЯ САНУЗЛОВ	{/data/images/product_00000061/1.jpg}	1880	51	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
63	Средство чистящее для унитаза SANFOR WC gel super power, 750г	750 гр	219	ДЛЯ САНУЗЛОВ	{/data/images/product_00000062/1.jpg}	9611	99	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
64	Sanfor для ванн, 750 г, лимонная свежесть, антиналет	750 гр	245	ДЛЯ САНУЗЛОВ	{/data/images/product_00000063/1.jpg}	1554	439	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
65	SANITA спрей для стекол, Горная свежесть, 500 мл (НОВЫЙ ДИЗАЙН ВЕРСИЯ 2020)	500 мл	217	ДЛЯ САНУЗЛОВ	{/data/images/product_00000064/1.jpg}	14123	119	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
66	Sanfor WС гель, 1 кг, LEMON FRESH	1 кг	259	ДЛЯ САНУЗЛОВ	{/data/images/product_00000065/1.jpg}	1954	13	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
67	Sanfor WС гель, 750 г, лимонная свежесть	1 кг	199	ДЛЯ САНУЗЛОВ	{/data/images/product_00000066/1.jpg}	1550	393	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
68	Sanfor Универсал, 750 г, зеленое яблоко	750 гр	189	ДЛЯ САНУЗЛОВ	{/data/images/product_00000067/1.jpg}	1542	64	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
69	Sanfor active антиржавчина, 750 г	750 гр	229	ДЛЯ САНУЗЛОВ	{/data/images/product_00000068/1.jpg}	1557	70	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
70	SANFOR для труб TURBO, 1 кг (новая этикетка)	1 кг	419	ДЛЯ САНУЗЛОВ	{/data/images/product_00000069/1.jpg}	21620	134	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
71	SANFOR для мытья полов УЛЬТРА БЛЕСК, Забота о доме, 1 л	1 л	269	ДЛЯ САНУЗЛОВ	{/data/images/product_00000070/1.jpg}	22157	443	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
74	SANFOR Универсал Ультра Блеск Чистота и гигиена, 750 г	750 гр	209	ДЛЯ САНУЗЛОВ	{/data/images/product_00000073/1.jpg}	24265	427	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
75	SANFOR Chlorum, 1,5 л	1,5 л	299	ДЛЯ САНУЗЛОВ	{/data/images/product_00000074/1.jpg}	24505	128	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
76	SANITA спрей для стекол с нашатырным спиртом, 500 мл (ВЕРСИЯ 2023)	500 мл	209	ДЛЯ САНУЗЛОВ	{/data/images/product_00000075/1.jpg}	24608	334	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
77	SANITA чистящее средство спрей УНИВЕРСАЛЬНЫЙ для всех поверхностей и текстиля, 500 мл (ВЕРСИЯ 2023)	500 мл	227	ДЛЯ САНУЗЛОВ	{/data/images/product_00000076/1.jpg}	25382	211	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
78	SANFOR Белизна гель, 3 в 1, 1,5 л	1,5 л	289	ДЛЯ САНУЗЛОВ	{/data/images/product_00000077/1.jpg}	25408	55	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
79	SANITA средство чистящее для удаления известкового налета Акрилайт, 500 мл	500 мл	245	ДЛЯ САНУЗЛОВ	{/data/images/product_00000078/1.jpg}	26270	416	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
80	SANFOR Универсал, Морской бриз, 1,5 л	1,5 л	289	ДЛЯ САНУЗЛОВ	{/data/images/product_00000079/1.jpg}	26283	86	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
81	SANFOR Универсал, Зеленое яблоко, 1,5 л	1,5 л	289	ДЛЯ САНУЗЛОВ	{/data/images/product_00000080/1.jpg}	26285	188	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
82	SANFOR Универсал Ультра Блеск Чистота и гигиена, 1,5 л	1,5 л	289	ДЛЯ САНУЗЛОВ	{/data/images/product_00000081/1.jpg}	26289	32	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
83	SANFOR для труб, прочистка труб на кухне, 1 кг (250 г бесплатно)	1 кг	269	ДЛЯ САНУЗЛОВ	{/data/images/product_00000082/1.jpg}	26400	137	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
84	Bagi ПОТХАН (средство для устранения засоров) 600 г	600 г	997	ДЛЯ САНУЗЛОВ	{/data/images/product_00000083/1.jpg}	H-395057-N	217	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
85	Bagi ШУМАНИТ ОТ ИЗВЕСТКОВОГО НАЛЕТА, 550 мл	550 мл	669	ДЛЯ САНУЗЛОВ	{/data/images/product_00000084/1.jpg}	H-208948-0	209	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
86	Bagi ШУМАНИТ ДЛЯ ЧИСТКИ САНТЕХНИКИ, 500 мл	500 мл	599	ДЛЯ САНУЗЛОВ	{/data/images/product_00000085/1.jpg}	B-208979-0	85	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
87	Средство чистящее для сантехники Санокс - гель 10*1100 г	1100 г	179	ДЛЯ САНУЗЛОВ	{/data/images/product_00000086/1.jpg}	4303010015	57	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
88	Средство чистящее для сантехники Санокс   10*1100 г	1100 г	169	ДЛЯ САНУЗЛОВ	{/data/images/product_00000087/1.jpg}	4303010014	113	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
89	Средство чистящее для сантехники Санокс   15*750 г	750 г	119	ДЛЯ САНУЗЛОВ	{/data/images/product_00000088/1.jpg}	4303010007	142	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
90	Средство чистящее для сантехники Санокс - гель 15*750 г	750 г	129	ДЛЯ САНУЗЛОВ	{/data/images/product_00000089/1.jpg}	4303010006	143	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
91	Средство чистящее для сантехники Санокс   3*5л	5 л	668	ДЛЯ САНУЗЛОВ	{/data/images/product_00000090/1.jpg}	4303010002	307	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
92	Dolphin: Юниверсал Экстра 5л для ежедневного ухода за полами и мебелью (шт.	5 л	1089	ДЛЯ САНУЗЛОВ	{/data/images/product_00000091/1.jpg}	D015-5	50	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
93	Dolphin: Юниверсал Клин 5л для ежедневного ухода за интерьером (шт.)	5 л	859	ДЛЯ САНУЗЛОВ	{/data/images/product_00000092/1.jpg}	D016-5	183	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
94	Dolphin: Сани-Макс 5л щелочное средство для мытья и дезинфекции (шт.)	5 л	709	ДЛЯ САНУЗЛОВ	{/data/images/product_00000093/1.jpg}	D010-5	187	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
95	Грасс Torus Очиститель-полироль для мебели 600 мл* 8	600 мл	259	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000094/1.jpg}	219600	95	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
96	Грасс «G-oxi» Спрей пятновыводитель для ковровых покрытий  антибактериальный	600 мл	249	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000095/1.jpg}	125636	69	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
97	TX Shampoo + Carpet Shampoo шампунь для чистки ковров и мягкой мебели. Концентрат (1:20 - 1:120) 5 л	5 л	1699	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000096/1.jpg}	ЭС 019	147	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
98	TX Shampoo + Carpet Shampoo шампунь для чистки ковров и мягкой мебели. Концентрат (1:20 - 1:120) 1 л	1 л	409	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000097/1.jpg}	ЭС 020	407	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
99	TX DryClean + Carpet DryClean шампунь для сухой чистки ковров и текстильных изделий. Концентрат(1:20-1:100) 1 л	1 л	429	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000098/1.jpg}	ЭС021	28	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
100	TX Candy Универсальный пятновыводитель. Готов к применению 500 мл	500 мл	319	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000099/1.jpg}	ЭС022	84	t	2025-09-06 11:27:47.081	2025-09-06 11:27:47.081
101	UN Spray Universal Spray  универсальное моющее и чистящее средство. Готовое к применению. 5 л	5 л	649	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000100/1.jpg}	ЭС023	1	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
102	UN Spray Universal Spray  универсальное моющее и чистящее средство. Готовое к применению. 500 мл	500 мл	169	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000101/1.jpg}	ЭС024	169	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
103	UN Spray+ Universal Spray + универсальное моющее и чистящее средство. Концентрат 5 л	5 л	1319	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000102/1.jpg}	ЭС025	415	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
104	UN DEZ+ Universal DZ  универсальное моющее средство с дезинфицирующим эффектом. Концентрат (1:10- 1:120) 5 л	5 л	1119	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000103/1.jpg}	ЭС026	79	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
105	UN Universal+ Universal E  универсальное моющее средство эконом - класса.   Концентрат (1:10-1:100) 5 л	5 л	719	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000104/1.jpg}	ЭС027	239	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
106	UN Uni+ Universal Uni+ Универсальное низкопенное кислотное моющее средство  для удаления минеральных загрязнений\nКонцентрат (1:20) 5 л	5 л	1239	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000105/1.jpg}	ЭС028	171	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
107	MP Neutral + Multipower Neutral средство для мытья полов всех типов. Концентрат(1:64 - 1:500)	5 л	1099	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000106/1.jpg}	ЭС029	35	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
108	MP Bright + Multipower Bright средство для мытья полов с полимерным покрытием.  Концентрат(1:65-1:500)	5 л	1209	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000107/1.jpg}	ЭС030	255	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
109	MP Kerama + Multipower Kerama,Средство для мытья плитки и керамогранита\nКонцентрат (1:130) 5л	5 л	729	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000108/1.jpg}	ЭС031	99	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
110	MP Shine+ Multipower Shine+ Щелочной концентрат для мытья глянцевых полов\nКонцентрат(1:150)	5 л	1339	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000109/1.jpg}	ЭС032	55	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
111	MP Prof + Multipower Prof средство усиленного действия для мытья всех типов полов.  Концентрат(1:20 -1:300)	5 л	1327	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000110/1.jpg}	ЭС033	24	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
112	MP Prof + Multipower Prof средство усиленного действия для мытья всех типов полов.  Концентрат(1:20 -1:300)	1 л	349	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000111/1.jpg}	ЭС034	93	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
113	MP White + Multipower White средство для мытья светлых полов с отбеливающим эффектом.     Концентрат(1:20-1:200)	5 л	1289	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000112/1.jpg}	ЭС035	71	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
114	MP Effect + Multipower E  средство эконом-класса  для мытья полов всех типов.   Концентрат (1:5-1:150)	5 л	669	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000113/1.jpg}	ЭС036	29	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
115	MP Effect Citrus + Multipower E (цитрус)  Концентрат эконом-класса для мытья полов.  Концентрат(1:5-1:150)	5 л	669	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000114/1.jpg}	ЭС037	71	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
116	Duty Graffiti средство для удаления граффити, маркера, краски. Готовое к применению. АЭРОЗОЛЬ 2 л	2 л	2879	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000115/1.jpg}	ЭС038	253	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
117	Duty Graffiti средство для удаления граффити, маркера, краски. Готовое к применению. АЭРОЗОЛЬ 400 мл	400 мл	459	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000116/1.jpg}	ЭС039	102	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
118	Duty Graffiti Max, Средство для удаления граффити, маркера, краски 2 л	2 л	2889	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000117/1.jpg}	ЭС040	330	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
119	Duty Universal  Средство для удаления клейкой ленты, клея, наклеек 2 л	2 л	2839	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000118/1.jpg}	ЭС041	49	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
120	Duty Universal  Средство для удаления клейкой ленты, клея, наклеек 400 мл	400 мл	509	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000119/1.jpg}	ЭС042	111	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
121	Duty Universal  Средство для удаления клейкой ленты, клея, наклеек 210 мл	210 мл	409	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000120/1.jpg}	ЭС043	94	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
122	EFFECT DELTA 403 Пятновыводитель для сухой чистки	500 мл	445	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000121/1.jpg}	26252	120	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
123	EFFECT Super средство универсальное для мытья поверхностей 5 л	5 л	420	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000122/1.jpg}	25706	259	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
124	EFFECT Super Средство чистящее универсальное для стеклянных поверхностей, 500 мл	500 мл	154	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000123/1.jpg}	25698	9	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
125	EFFECT ДЕЛЬТА 418 DesPro средство для дезинфекции и мытья поверхностей, 5000 мл	5 л	899	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000124/1.jpg}	9066	8	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
126	EFFECT АЛЬФА 106 универсальное чистящее средство Универсал, 5 л (ВЕРСИЯ 2023)	5 л	559	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000125/1.jpg}	26008	172	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
127	EFFECT АЛЬФА 106 Универсал, универсальное чистящее средство, 750 мл (ВЕРСИЯ 2023)	750 мл	129	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000126/1.jpg}	26196	45	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
128	EFFECT ГАММА 303 Универсальный чистящий крем, 600 г	600 г	135	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000127/1.jpg}	26434	122	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
129	EFFECT ДЕЛЬТА 416 Средство универсальное Дегризер, 5 л (ВЕРСИЯ 2023)	5 л	1689	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000128/1.jpg}	25984	35	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
130	EFFECT ДЕЛЬТА 402 Средство для чистки ковровых покрытий и обивки, 5 л (ВЕРСИЯ 2023)	5 л	1389	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000129/1.jpg}	26004	100	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
131	EFFECT ДЕЛЬТА 412 Средство нейтральное для мытья полов, 5 л (ВЕРСИЯ 2023)	5 л	728	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000130/1.jpg}	26006	196	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
132	EFFECT ДЕЛЬТА 401 Средство универсальное высокопенное для мытья поверхностей, 5 л (ВЕРСИЯ 2023)	5 л	689	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000131/1.jpg}	26002	460	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
133	EFFECT ДЕЛЬТА 416 Средство универсальное Дегризер, 1 л	1 л	359	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000132/1.jpg}	27312	114	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
134	EFFECT ДЕЛЬТА 404 средство чистящее универсальное для стекол и зеркал, 500 мл (ВЕРСИЯ 2023)	500 мл	149	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000133/1.jpg}	25689	284	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
135	Sanfor Универсал, 1 кг, летний дождь	1 кг	250	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000134/1.jpg}	1956	143	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
136	Sanfor Универсал, 750 г, морской бриз	750 гр	189	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000135/1.jpg}	1543	201	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
137	SANITA спрей для стекол, Горная свежесть, 500 мл (НОВЫЙ ДИЗАЙН ВЕРСИЯ 2020)	500 мл	217	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000136/1.jpg}	14123	259	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
138	Sanfor Универсал, 750 г, зеленое яблоко	750 гр	189	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000137/1.jpg}	1542	185	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
139	SANFOR для мытья полов УЛЬТРА БЛЕСК, Забота о доме, 1 л	1 л	269	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000138/1.jpg}	22157	97	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
140	SANFOR для мытья полов УЛЬТРА БЛЕСК, Забота о домашних питомцах, 1 л	1 л	269	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000139/1.jpg}	22674	196	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
141	SANFOR Универсал Ультра Блеск Чистота и гигиена, 750 г	750 г	209	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000140/1.jpg}	24265	181	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
142	SANITA спрей для стекол с нашатырным спиртом, 500 мл (ВЕРСИЯ 2023)	500 мл	209	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000141/1.jpg}	24608	353	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
143	SANITA чистящее средство спрей УНИВЕРСАЛЬНЫЙ для всех поверхностей и текстиля, 500 мл (ВЕРСИЯ 2023)	500 мл	227	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000142/1.jpg}	25382	127	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
144	SANFOR Универсал, Морской бриз, 1,5 л	1,5 л	289	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000143/1.jpg}	26283	278	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
145	SANFOR Универсал, Зеленое яблоко, 1,5 л	1,5 л	289	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000144/1.jpg}	26285	25	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
146	SANFOR Универсал Ультра Блеск Чистота и гигиена, 1,5 л	1,5 л	289	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000145/1.jpg}	26289	129	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
147	Dolphin: Юниверсал Экстра 5л для ежедневного ухода за полами и мебелью (шт.	5 л	1089	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000146/1.jpg}	D015-5	49	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
148	Dolphin: Юниверсал Клин 5л для ежедневного ухода за интерьером (шт.)	5 л	859	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000147/1.jpg}	D016-5	184	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
149	Bagi МАСТИКА ДЛЯ ПОЛИРОВКИ ПОЛОВ, 500 мл	500 мл	619	СРЕДСТВА ДЛЯ УБОРКИ ПОМЕЩЕНИЙ И НОМЕРНОГО ФОНДА	{/data/images/product_00000148/1.jpg}	H-395422-N	75	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
150	PROF DZ ПРОФ ДЗ ( PROF DZ) кожный антисептик 5 л	5 л	1649	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000149/1.jpg}	ЭС044	9	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
151	PROF DZ ПРОФ ДЗ ( PROF DZ) кожный антисептик 1 л	1 л	469	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000150/1.jpg}	ЭС045	260	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
152	Diona Aroma Пенное мыло для дозаторов. С цветочным ароматом 5 л	5 л ПЭТ	519	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000151/1.jpg}	ЭС046	92	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
153	Diona Antibac,Антибактериальное мыло 5л	5 л	1099	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000152/1.jpg}	ЭС047	149	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
154	Diona Apple, Гель-мыло с перламутром. \nC ароматом яблока 5л	5 л	549	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000153/1.jpg}	ЭС048	122	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
155	Diona жидкое гель-мыло с перламутром. Без цвета, без запаха. 5 л ПЭТ	5 л ПЭТ	419	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000154/1.jpg}	ЭС049	91	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
156	Diona E жидкое гель-мыло эконом-класса. Без красителей и ароматизаторов. 5 л ПЭТ	5 л ПЭТ	326	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000155/1.jpg}	ЭС050	110	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
157	Diona Apple E, Жидкое гель-мыло эконом-класса. C ароматом яблока\nготовое средство 5 л ПЭТ	5 л ПЭТ	326	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000156/1.jpg}	ЭС051	119	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
158	Diona Citrus E, Жидкое гель-мыло эконом-класса. C ароматом цитрусовых\nготовое средство 5 л ПЭТ	5 л ПЭТ	326	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000157/1.jpg}	ЭС052	14	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
159	EFFECT жидкое крем-мыло Sanfito, Пион и камелия, 1 л	1 л	196	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000158/1.jpg}	26436	87	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
160	EFFECT жидкое крем-мыло Sanfito, Цветочный микс, 1 л	1 л	196	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000159/1.jpg}	25509	173	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
161	EFFECT жидкое мыло Sanfito, Сочное алоэ, 1 л	1 л	196	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000160/1.jpg}	25505	139	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
162	ТОРК: Мыло- пена S4 1 л (картридж)	1 л 6 шт/упак	819	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000161/1.jpg}	520511	93	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
163	Мыло жидкое биоразлагаемое для мытья рук и тела Лаванда торговая марка SYNERGETIC 0.5л	500 мл	166	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000162/1.jpg}	105054/14	484	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
164	Мыло жидкое биоразлагаемое для мытья рук и тела Лаванда торговая марка SYNERGETIC 5л	5 л	799	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000163/1.jpg}	105501	275	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
165	Мыло жидкое биоразлагаемое для мытья рук и тела Фруктовый микс торговая марка SYNERGETIC 0.5л	500 мл	166	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000164/1.jpg}	105055/14	142	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
166	Мыло жидкое биоразлагаемое для мытья рук и тела Фруктовый микс торговая марка SYNERGETIC 5л	5 л	799	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000165/1.jpg}	105502	67	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
167	Мыло жидкое биоразлагаемое для мытья рук и тела Миндальное молочко торговая марка SYNERGETIC 0.5л	500 мл	166	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000166/1.jpg}	105058/6	471	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
168	Мыло жидкое биоразлагаемое для мытья рук и тела Миндальное молочко торговая марка SYNERGETIC 5л	5 л	799	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000167/1.jpg}	105506	62	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
169	Натуральное биоразлагаемое мыло для рук и тела SYNERGETIC Пачули и ароматный бергамот, 0,38л	380 мл	219	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000168/1.jpg}	105001	124	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
170	Натуральное биоразлагаемое мыло для рук и тела SYNERGETIC Сандал и ягоды можжевельника, 0,38л	380 мл	219	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000169/1.jpg}	105003	91	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
171	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ИНТЕНСИВНОЕ УВЛАЖНЕНИЕ И БЛЕСК	флакон 0,4л	289	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000170/1.jpg}	701401	9	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
172	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ИНТЕНСИВНОЕ УВЛАЖНЕНИЕ И БЛЕСК	флакон 0,75л	459	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000171/1.jpg}	701750	23	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
173	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ОБЪЁМ И УКРЕПЛЕНИЕ ВОЛОС	флакон 0,4л	289	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000172/1.jpg}	701403	500	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
174	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ОБЪЁМ И УКРЕПЛЕНИЕ ВОЛОС	флакон 0,75л	459	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000173/1.jpg}	701752	466	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
175	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ЭКСТРАМЯГКИЙ ДЛЯ ЕЖЕДНЕВНОГО УХОДА 2 В 1	флакон 0,4л	289	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000174/1.jpg}	701404	218	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
176	НАТУРАЛЬНЫЙ БЕССУЛЬФАТНЫЙ ШАМПУНЬ SYNERGETIC ЭКСТРАМЯГКИЙ ДЛЯ ЕЖЕДНЕВНОГО УХОДА 2 В 1	флакон 0,75л	459	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000175/1.jpg}	701753	128	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
177	Натуральный биоразлагаемый гель для душа SYNERGETIC Пачули и ароматный бергамот, 0,38л	380 мл	225	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000176/1.jpg}	400001	124	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
178	Натуральный биоразлагаемый гель для душа SYNERGETIC Пачули и ароматный бергамот, 750мл	750 мл	357	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000177/1.jpg}	400009	175	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
179	Натуральный биоразлагаемый гель для душа SYNERGETIC Сандал и ягоды можжевельника, 0,38л	380 мл	225	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000178/1.jpg}	400003	258	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
180	Натуральный биоразлагаемый гель для душа SYNERGETIC Сандал и ягоды можжевельника, 750мл	750 мл	357	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000179/1.jpg}	400011	360	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
181	Натуральный крем для рук и тела SYNERGETIC Карамельное яблоко и ваниль 380мл	380 мл	252	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000180/1.jpg}	300008/6	269	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
182	Натуральный крем для рук и тела SYNERGETIC Пачули и ароматный бергамот 380мл	380 мл	252	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000181/1.jpg}	300009/6	255	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
183	Натуральный крем для рук и тела SYNERGETIC Сандал и ягоды можжевельника 380мл	380 мл	252	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000182/1.jpg}	300010/6	74	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
184	Натуральный крем для рук и тела Synergetic кокос и масло макадамии, 380мл	380 мл	252	СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ	{/data/images/product_00000183/1.jpg}	300023	220	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
185	FL Flox FLOX PROF Нейтрализатор запахов с антибактериальным компонентом, без запаха. Готов к применению 5 л	5 л	1105	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000184/1.jpg}	ЭС053	28	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
186	FL Flox FLOX PROF Нейтрализатор запахов с антибактериальным компонентом, без запаха. Готов к применению 500 мл	500 мл	245	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000185/1.jpg}	ЭС054	155	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
187	FL Sea FLOX SEA Нейтрализатор запахов с антибактериальным компонентом, аромат Морской бриз. Готов к применению. 5 л	5 л	1105	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000186/1.jpg}	ЭС055	438	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
188	FL Sea FLOX SEA Нейтрализатор запахов с антибактериальным компонентом, аромат Морской бриз. Готов к применению. 500 мл	500 мл	245	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000187/1.jpg}	ЭС056	83	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
189	EFFECT ИНТЕНСИВ 702 нейтрализатор запаха, 500 мл (ВЕРСИЯ 2024)	500 мл	369	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000188/1.jpg}	26206	33	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
190	Гипоаллергенный биоразлагаемый освежитель воздуха, нейтрализатор запахов SYNERGETIC «Миндаль и яблоневый цвет» 380мл	380 мл	219	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000189/1.jpg}	900001	48	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
191	Гипоаллергенный биоразлагаемый освежитель воздуха, нейтрализатор запахов SYNERGETIC «Пачули и нероли» 380мл	380 мл	219	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000190/1.jpg}	900003	427	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
192	Гипоаллергенный биоразлагаемый освежитель воздуха, нейтрализатор запахов SYNERGETIC  Горные травы и эдельвейс, 380 мл	380 мл	219	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000191/1.jpg}	900006	314	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
193	Парфюмированный освежитель воздуха, нейтрализатор запахов SYNERGETIC Tobacco-vanille/Табак-ваниль 380мл	380 мл	319	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000192/1.jpg}	900010	154	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
194	Грасс Harmony Жидкий освежитель воздуха 400мл	400 мл	199	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000193/1.jpg}	125118	106	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
195	Грасс Liberty Жидкий освежитель воздуха 400мл	400 мл	199	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000194/1.jpg}	125117	21	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
196	Грасс Spring Жидкий освежитель воздуха 400 мл	400 мл	199	НЕЙТРАЛИЗАТОРЫ И ОСВЕЖИТЕЛИ ВОЗДУХА	{/data/images/product_00000195/1.jpg}	125116	46	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
197	CK Cooky Гель для мытья  посуды вручную. Без запаха\nCooky 1 л	1 л	231	ДЛЯ КУХНИ	{/data/images/product_00000196/1.jpg}	ЭС057	273	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
198	CK Cooky+ Пенное гелеобразное средство для мытья посуды. Без отдушки. Концентрат (1:200). 5 л ПЭТ	5 л ПЭТ	490	ДЛЯ КУХНИ	{/data/images/product_00000197/1.jpg}	ЭС058	374	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
199	CK Apple + Гелеобразное средство для мытья посуды. С ароматом яблока \nКонцентрат (1:250) 5 л ПЭТ	5 л	579	ДЛЯ КУХНИ	{/data/images/product_00000198/1.jpg}	ЭС059	74	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
200	CK Fruit + Cooky Fruit+ Гелеобразное средство для мытья посуды. С ароматом фруктов\nКонцентрат (1:250)	5 л	579	ДЛЯ КУХНИ	{/data/images/product_00000199/1.jpg}	ЭС060	329	t	2025-09-06 11:27:47.176	2025-09-06 11:27:47.176
201	CK Gel Lemon + Cooky Gel Lemon+ Пенное гелеобразное средство для мытья посуды. Аромат лимон. Концентрат(1:200)	5 л	589	ДЛЯ КУХНИ	{/data/images/product_00000200/1.jpg}	ЭС061	238	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
202	CK Cooky DEZ + Cooky Plus Пенное гелеобразное средство для мытья посуды с дезинфицирующим эффектом. Концентрат(1:250)	5 л	597	ДЛЯ КУХНИ	{/data/images/product_00000201/1.jpg}	ЭС062	243	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
203	CK Cooky White + Cooky White+ Средство для мытья и отбеливания посуды с дезинфицирующим эффектом. \nКонцентрат(1:30)	5 л	1110	ДЛЯ КУХНИ	{/data/images/product_00000202/1.jpg}	ЭС063	261	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
204	CK Automat + Cooky Automat+ Средство для мытья посуды в посудомоечных машинах. Концентрат	5 л	1390	ДЛЯ КУХНИ	{/data/images/product_00000203/1.jpg}	ЭС064	322	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
205	CK Rinser + Splash Rinser Кислотное средство для ополаскивания посуды в посудомоечной машине\nКонцентрат (1:200-1:3000)	5 л	1359	ДЛЯ КУХНИ	{/data/images/product_00000204/1.jpg}	ЭС065	295	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
206	EFFECT Super средство для мытья посуды, 5 л	5 л	399	ДЛЯ КУХНИ	{/data/images/product_00000205/1.jpg}	25700	136	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
207	EFFECT Super средство универсальное для мытья пола и поверхностей 5 л	5 л	420	ДЛЯ КУХНИ	{/data/images/product_00000206/1.jpg}	25706	236	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
208	EFFECT Super средство для мытья посуды, 1 л	1 л	149	ДЛЯ КУХНИ	{/data/images/product_00000207/1.jpg}	25704	71	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
209	EFFECT Super Средство чистящее универсальное для стеклянных поверхностей, 500 мл	500 мл	154	ДЛЯ КУХНИ	{/data/images/product_00000208/1.jpg}	25698	141	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
210	EFFECT Super Средство чистящее для кухни Антижир, 500 мл	500 мл	155	ДЛЯ КУХНИ	{/data/images/product_00000209/1.jpg}	25694	394	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
211	EFFECT ДЕЛЬТА 418 DesPro средство для дезинфекции и мытья поверхностей, 5000 мл	5 л	899	ДЛЯ КУХНИ	{/data/images/product_00000210/1.jpg}	9066	166	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
212	EFFECT АЛЬФА 104 Средство для очистки канализационных труб, 5 л (ВЕРСИЯ 2023)	5 л	659	ДЛЯ КУХНИ	{/data/images/product_00000211/1.jpg}	26216	182	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
213	EFFECT АЛЬФА 106 универсальное чистящее средство Универсал, 5 л (ВЕРСИЯ 2023)	5 л	559	ДЛЯ КУХНИ	{/data/images/product_00000212/1.jpg}	26008	267	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
214	EFFECT АЛЬФА 104 Средство для очистки канализационных труб, 750 мл (ВЕРСИЯ 2023)	750 мл	149	ДЛЯ КУХНИ	{/data/images/product_00000213/1.jpg}	26211	129	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
215	EFFECT АЛЬФА 106 Универсал, универсальное чистящее средство, 750 мл (ВЕРСИЯ 2023)	750 мл	129	ДЛЯ КУХНИ	{/data/images/product_00000214/1.jpg}	26196	248	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
216	EFFECT ВИТА 211 Концентрированное средство для ручного мытья посуды, 5 л	5 л	1279	ДЛЯ КУХНИ	{/data/images/product_00000215/1.jpg}	26656	185	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
217	EFFECT ГАММА 302 Средство чистящее для кухни, 5 л (ВЕРСИЯ 2023)	5 л	2159	ДЛЯ КУХНИ	{/data/images/product_00000216/1.jpg}	25684	117	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
218	EFFECT ГАММА 301 Средство чистящее для кухни спрей, 5 л (ВЕРСИЯ 2023)	5 л	1589	ДЛЯ КУХНИ	{/data/images/product_00000217/1.jpg}	25680	453	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
219	EFFECT ГАММА 303 Универсальный чистящий крем, 600 г	600 г	135	ДЛЯ КУХНИ	{/data/images/product_00000218/1.jpg}	26434	195	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
220	EFFECT ГАММА 301 Средство чистящее для кухни, спрей, 500 мл (ВЕРСИЯ 2023)	500 мл	305	ДЛЯ КУХНИ	{/data/images/product_00000219/1.jpg}	25681	144	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
221	EFFECT ДЕЛЬТА 416 Средство универсальное Дегризер, 5 л (ВЕРСИЯ 2023)	5 л	1689	ДЛЯ КУХНИ	{/data/images/product_00000220/1.jpg}	25984	93	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
222	EFFECT ДЕЛЬТА 412 Средство нейтральное для мытья полов, 5 л (ВЕРСИЯ 2023)	5 л	728	ДЛЯ КУХНИ	{/data/images/product_00000221/1.jpg}	26006	60	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
223	EFFECT ДЕЛЬТА 401 Средство универсальное высокопенное для мытья поверхностей, 5 л (ВЕРСИЯ 2023)	5 л	689	ДЛЯ КУХНИ	{/data/images/product_00000222/1.jpg}	26002	173	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
224	EFFECT ДЕЛЬТА 416 Средство универсальное Дегризер, 1 л	1 л	359	ДЛЯ КУХНИ	{/data/images/product_00000223/1.jpg}	27312	161	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
225	EFFECT ДЕЛЬТА 404 средство чистящее универсальное для стекол и зеркал, 500 мл (ВЕРСИЯ 2023)	500 мл	149	ДЛЯ КУХНИ	{/data/images/product_00000224/1.jpg}	25689	66	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
226	Sanfor для труб, 1 кг	1 кг	259	ДЛЯ КУХНИ	{/data/images/product_00000225/1.jpg}	1957	132	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
227	Средство для очистки труб Sanfor для труб (прочистка труб на кухне), 1 кг	1 кг	269	ДЛЯ КУХНИ	{/data/images/product_00000226/1.jpg}	10742	306	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
228	Sanfor Универсал, 750 г, лимонная свежесть	750 гр	189	ДЛЯ КУХНИ	{/data/images/product_00000227/1.jpg}	1544	283	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
229	Sanfor Универсал, 1 кг, летний дождь	1 кг	250	ДЛЯ КУХНИ	{/data/images/product_00000228/1.jpg}	1956	193	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
230	Sanfor Универсал, 750 г, морской бриз	750 гр	189	ДЛЯ КУХНИ	{/data/images/product_00000229/1.jpg}	1543	376	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
231	SANITA спрей для стекол, Горная свежесть, 500 мл (НОВЫЙ ДИЗАЙН ВЕРСИЯ 2020)	500 мл	217	ДЛЯ КУХНИ	{/data/images/product_00000230/1.jpg}	14123	68	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
232	Sanfor Универсал, 750 г, зеленое яблоко	750 гр	189	ДЛЯ КУХНИ	{/data/images/product_00000231/1.jpg}	1542	361	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
233	SANFOR для труб TURBO, 1 кг (новая этикетка)	1 кг	419	ДЛЯ КУХНИ	{/data/images/product_00000232/1.jpg}	21620	291	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
234	SANFOR для мытья полов УЛЬТРА БЛЕСК, Забота о доме, 1 л	1 л	269	ДЛЯ КУХНИ	{/data/images/product_00000233/1.jpg}	22157	311	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
235	SANFOR для мытья полов УЛЬТРА БЛЕСК, Забота о домашних питомцах, 1 л	1 л	269	ДЛЯ КУХНИ	{/data/images/product_00000234/1.jpg}	22674	245	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
236	SANITA крем СТЕКЛОКЕРАМИКА, 600 г (ВЕРСИЯ 2022)	600 г	199	ДЛЯ КУХНИ	{/data/images/product_00000235/1.jpg}	22945	255	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
237	SANITA крем УНИВЕРСАЛ, Сицилийский лимон, 600 г (ВЕРСИЯ 2022)	600 г	199	ДЛЯ КУХНИ	{/data/images/product_00000236/1.jpg}	22952	203	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
238	SANFOR Универсал Ультра Блеск Чистота и гигиена, 750 г	750 гр	209	ДЛЯ КУХНИ	{/data/images/product_00000237/1.jpg}	24265	93	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
239	SANITA спрей для стекол с нашатырным спиртом, 500 мл (ВЕРСИЯ 2023)	500 мл	209	ДЛЯ КУХНИ	{/data/images/product_00000238/1.jpg}	24608	64	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
240	SANITA средство чистящее для кухни 1 минута, 500 мл (ВЕРСИЯ 2023)	500 мл	226	ДЛЯ КУХНИ	{/data/images/product_00000239/1.jpg}	25354	276	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
241	SANITA средство чистящее мгновенного действия Жироудалитель GOLD, 500 мл (ВЕРСИЯ 2023)	500 мл	259	ДЛЯ КУХНИ	{/data/images/product_00000240/1.jpg}	25360	142	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
242	SANITA спрей Антижир для стеклокерамики, 500 мл (ВЕРСИЯ 2023)	500 мл	219	ДЛЯ КУХНИ	{/data/images/product_00000241/1.jpg}	25363	293	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
243	SANITA средство чистящее быстрого действия спрей КАЗАН-МАНГАЛ, 500 мл (по 5 шт) ВЕРСИЯ 2023	500 мл	225	ДЛЯ КУХНИ	{/data/images/product_00000242/1.jpg}	25381	56	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
244	SANITA чистящее средство спрей ДЛЯ КУХНИ, 500 мл (ВЕРСИЯ 2024)	500 мл	235	ДЛЯ КУХНИ	{/data/images/product_00000243/1.jpg}	25386	73	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
245	SANFOR Универсал, Морской бриз, 1,5 л	1,5 л	289	ДЛЯ КУХНИ	{/data/images/product_00000244/1.jpg}	26283	84	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
246	SANFOR Универсал, Зеленое яблоко, 1,5 л	1,5 л	289	ДЛЯ КУХНИ	{/data/images/product_00000245/1.jpg}	26285	48	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
247	SANFOR Универсал Ультра Блеск Чистота и гигиена, 1,5 л	1,5 л	289	ДЛЯ КУХНИ	{/data/images/product_00000246/1.jpg}	26289	72	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
248	SANFOR для труб, прочистка труб на кухне, 1 кг (250 г бесплатно)	1 кг	269	ДЛЯ КУХНИ	{/data/images/product_00000247/1.jpg}	26400	276	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
249	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом лимона, 0,5л	500 мл	129	ДЛЯ КУХНИ	{/data/images/product_00000248/1.jpg}	103051/14	91	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
250	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом лимона, 1л	1 л	209	ДЛЯ КУХНИ	{/data/images/product_00000249/1.jpg}	103101/8	448	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
251	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом лимона, 5л	5 л	754	ДЛЯ КУХНИ	{/data/images/product_00000250/1.jpg}	103500	67	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
252	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом алоэ, 0,5л	500 мл	129	ДЛЯ КУХНИ	{/data/images/product_00000251/1.jpg}	103053/14	82	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
253	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом алоэ, 1л	1 л	209	ДЛЯ КУХНИ	{/data/images/product_00000252/1.jpg}	103103/8	99	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
254	Средство биоразлагаемое для мытья посуды SYNERGETIC с ароматом алоэ, 5л	5 л	754	ДЛЯ КУХНИ	{/data/images/product_00000253/1.jpg}	103503	25	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
255	Биоразлагаемые бесфосфатные таблетки для посудомоечных машин SYNERGETIC, 55шт	55 шт в упак	745	ДЛЯ КУХНИ	{/data/images/product_00000254/1.jpg}	102055avt	112	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
256	Биоразлагаемые бесфосфатные таблетки для посудомоечных машин SYNERGETIC, 100шт	100 шт в упак	1149	ДЛЯ КУХНИ	{/data/images/product_00000255/1.jpg}	102100avt	130	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
257	Биоразлагаемое универсальное чистящее средство для удаления жира, копоти, нагара с плит, сковородок, духовых шкафов, гриля и других кухонных поверхностей «Антижир» SYNERGETIC 0,5л	0,5 л	249	ДЛЯ КУХНИ	{/data/images/product_00000256/1.jpg}	106055	213	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
258	Средство биоразлагаемое для мытья стекол, зеркал и бытовой техники SYNERGETIC. 0,5л.	0,5 л	189	ДЛЯ КУХНИ	{/data/images/product_00000257/1.jpg}	107052/8	43	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
259	Bagi ПОТХАН (средство для устранения засоров) 600 г	600 г	997	ДЛЯ КУХНИ	{/data/images/product_00000258/1.jpg}	H-395057-N	21	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
260	Средство чистящее Санокс Антижир - гель   15*450 мл	450 мл	115	ДЛЯ КУХНИ	{/data/images/product_00000259/1.jpg}	4303010033	103	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
261	Dolphin: Юниверсал Экстра 5л для ежедневного ухода за полами и мебелью (шт.	5 л	1089	ДЛЯ КУХНИ	{/data/images/product_00000260/1.jpg}	D015-5	230	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
262	Dolphin: Юниверсал Клин 5л для ежедневного ухода за интерьером (шт.)	5 л	859	ДЛЯ КУХНИ	{/data/images/product_00000261/1.jpg}	D016-5	71	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
263	Bagi КУМКУМИТ ОТ НАКИПИ, 550 мл	550 мл	549	ДЛЯ КУХНИ	{/data/images/product_00000262/1.jpg}	K-310423-N	128	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
264	Грасс EVA  Flower Кондиционер для белья 5 кг *4	5 кг	619	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000263/1.jpg}	125377	185	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
265	Crystal Color, Cтиральный порошок для цветных тканей с функцией защита цвета \nКонцентрат 5 кг	5 кг	1450	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000264/1.jpg}	ЭС066	14	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
266	Crystal White +, Стиральный порошок для белых тканей\nКонцентрат 5 кг	5 кг	1650	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000265/1.jpg}	ЭС067	57	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
267	Crystal, Жидкий моющий концентрат для стирки белья  \nКонцентрат 5 л	5 л	1389	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000266/1.jpg}	ЭС068	296	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
268	Crystal (белые ткани), Жидкое моющее средство для стирки белых и светлых тканей\nКонцентрат 1 л	1 л	379	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000267/1.jpg}	ЭС069	64	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
269	Crystal (спортивная одежда), Жидкое моющее средство для стирки спортивной одежды, обуви и пуховиков\nКонцентрат 1 л	1 л	498	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000268/1.jpg}	ЭС070	288	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
270	Crystal (цветные изделия), Жидкое моющее средство для стирки цветных тканей\nКонцентрат 1 л	1 л	379	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000269/1.jpg}	ЭС071	162	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
271	Crystal (чёрные ткани), Жидкое моющее средство для стирки белых и светлых тканей\nКонцентрат 1 л	1 л	379	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000270/1.jpg}	ЭС072	30	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
272	Crystal (шерсть и шелк), Жидкое моющее средство для стирки шерсти, шелка и деликатных тканей\nКонцентрат 1 л	1 л	379	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000271/1.jpg}	ЭС073	60	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
273	Crystal Rinser Альпийская свежесть, Кондиционер для белья с ароматом Альпийская свежесть\nКонцентрат 2 л	2 л	269	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000272/1.jpg}	ЭС074	133	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
274	Crystal Rinser Альпийская свежесть, Кондиционер для белья с ароматом Альпийская свежесть\nКонцентрат 5 л	5 л	599	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000273/1.jpg}	ЭС075	83	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
275	Crystal Rinser Королевский Ирис, Кондиционер для белья с ароматом  королевского Ириса\nКонцентрат 2 л	2 л	279	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000274/1.jpg}	ЭС076	91	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
276	Crystal Rinser Королевский Ирис, Кондиционер для белья с ароматом  королевского Ириса\nКонцентрат 5 л	5 л	599	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000275/1.jpg}	ЭС077	78	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
277	Crystal Rinser Лепестки Сакуры, Кондиционер для белья с ароматом лепестков Сакуры\nКонцентрат 2 л	2 л	287	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000276/1.jpg}	ЭС078	313	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
278	Crystal Rinser Лепестки Сакуры, Кондиционер для белья с ароматом лепестков Сакуры\nКонцентрат	5 л	599	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000277/1.jpg}	ЭС079	169	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
279	Crystal Rinser Экзотические цветы, Кондиционер для белья с ароматом экзотических цветов\nКонцентрат 2 л	2 л	269	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000278/1.jpg}	ЭС080	137	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
280	Crystal Rinser Японский чай, Кондиционер для белья с ароматом Японского чая\nКонцентрат 2 л	2 л	269	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000279/1.jpg}	ЭС081	206	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
281	Crystal Rinser Японский чай, Кондиционер для белья с ароматом Японского чая\nКонцентрат 5 л	5 л	599	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000280/1.jpg}	ЭС082	253	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
282	Crystal Rinser, Кондиционер для белья без красителей и ароматизаторов \nКонцентрат 5 л	5 л	599	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000281/1.jpg}	ЭС083	299	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
283	Crystal Hand, Чистящее средство, сода эффект\nГотово к применению 400 гр	400 гр	97	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000282/1.jpg}	ЭС084	204	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
284	Crystal Lux, Чистящее средство, отбеливающий эффект\nГотово к применению 400 гр	400 гр	105	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000283/1.jpg}	ЭС085	465	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
285	EFFECT ОМЕГА 501 Средство для стирки, 5 л (ВЕРСИЯ 2023)	5 л	1459	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000284/1.jpg}	25986	98	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
286	EFFECT ОМЕГА 507 Гель-концентрат для стирки цветного белья Color, 5 л	5 л	1288	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000285/1.jpg}	25763	21	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
287	EFFECT ОМЕГА 502 пятновыводитель с активным кислородом, 5 л (ВЕРСИЯ 2023)	5 л	886	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000286/1.jpg}	25996	105	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
288	Биоразлагаемый концентрированный гель для стирки SYNERGETIC универсальный 2,75л (фиолетовая этикетка)	2,75 л	799	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000287/1.jpg}	109275	127	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
289	Биоразлагаемый концентрированный гель для стирки SYNERGETIC универсальный 5л (фиолетовая этикетка)	5 л	1099	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000288/1.jpg}	109500	318	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
290	Биоразлагаемый концентрированный  универсальный гипоаллергенный гель для стирки SYNERGETIC 3,75л (зеленая этикетка)	3,75  л	929	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000289/1.jpg}	109803	326	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
291	Биоразлагаемый концентрированный  универсальный гипоаллергенный гель для стирки SYNERGETIC 5л (зеленая этикетка)	5 л	1099	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000290/1.jpg}	109804	61	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
292	Биоразлагаемый концентрированный гель для стирки SYNERGETIC COLOR 1,5л	1,5 л	419	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000291/1.jpg}	109805	149	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
293	Биоразлагаемый концентрированный гель для стирки SYNERGETIC COLOR 3,75л	3,75 л	929	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000292/1.jpg}	109836	146	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
294	Биоразлагаемые концентрированные гипоаллергенные капсулы для стирки SYNERGETIC COLOR (12 штук)	12 шт в упак	259	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000293/1.jpg}	109817	207	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
295	Биоразлагаемые концентрированные гипоаллергенные капсулы для стирки SYNERGETIC COLOR (40 штук)	40 шт в упак	689	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000294/1.jpg}	109815	267	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
296	Биоразлагаемые концентрированные гипоаллергенные капсулы для стирки SYNERGETIC COLOR (60 штук)	60 шт в упак	849	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000295/1.jpg}	109816	124	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
297	Средство моющее синтетическое порошкообразное АИСТ- ПРОФИ  стандарт 20кг.	20 кг	2599	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000296/1.jpg}	4301020057	68	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
298	Чайка-автомат 15 кг Балтийское море универсал	15 кг	1699	СРЕДСТВА ДЛЯ СТИРКИ	{/data/images/product_00000297/1.jpg}	87068	201	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
299	PACLAN GREEN MOP SOFT ШВАБРА С ПЛОСКОЙ НАСАДКОЙ ШЕНИЛЛ И ТЕЛЕСКОПИЧЕСКОЙ РУЧКОЙ, 1 ШТ.	телескоп ручка	989	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000298/1.jpg}	135921	25	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
300	PACLAN GREEN MOP ПЛОСКАЯ НАСАДКА ШЕНИЛЛ ДЛЯ ШВАБРЫ 1 ШТ.	шт	389	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000299/1.jpg}	135931	38	t	2025-09-06 11:27:47.264	2025-09-06 11:27:47.264
301	PACLAN GREEN MOP ПЛОСКАЯ НАСАДКА ИЗ МИКРОФИБРЫ ДЛЯ ШВАБРЫ, 1 ШТ.	шт	299	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000300/1.jpg}	135951	265	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
302	Вик: Набор совок-ленивка и щетка /AF201/ 36CL/1	шт	639	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000301/1.jpg}	1037844	90	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
303	PACLAN PRACTI EXTRA DRY РЕЗИНОВЫЕ ПЕРЧАТКИ Р. S, ПАРА	пара	105	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000302/1.jpg}	407331	16	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
304	PACLAN PRACTI EXTRA DRY РЕЗИНОВЫЕ ПЕРЧАТКИ Р. М, ПАРА	пара	105	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000303/1.jpg}	4073411	317	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
305	PACLAN UNIVERSAL ПАРА РЕЗИНОВЫХ ПЕРЧАТОК (M) ЖЕЛТЫЕ	пара	99	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000304/1.jpg}	407897	152	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
306	PACLAN PRACTI COMFORT ПЕРЧАТКИ РЕЗИНОВЫЕ S, ПАРА	пара	109	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000305/1.jpg}	407641	150	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
307	PACLAN PRACTI COMFORT ПЕРЧАТКИ РЕЗИНОВЫЕ М, ПАРА	пара	109	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000306/1.jpg}	407652	182	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
308	Перчатки нитриловые хлорированные неопудренные 100 шт/50 пар S голубой	50 пар/ S голубой	459	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000307/1.jpg}	ME6BB306BS82	80	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
309	Перчатки нитриловые хлорированные неопудренные 100 шт/50 пар M голубой	50 пар/ M голубой	459	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000308/1.jpg}	ME6BB306BS83	15	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
310	Перчатки нитриловые хлорированные неопудренные 200 шт/100 пар S голубой	100 пар/S голубой	820	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000309/1.jpg}	M223K2	120	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
311	Перчатки нитриловые хлорированные неопудренные 200 шт/100 пар M голубой	100 пар/M голубой	820	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000310/1.jpg}	ME6BB306BS103	191	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
312	Перчатки нитриловые хлорированные неопудренные 100 шт/50 пар M черный	50 пар/M черный	568	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000311/1.jpg}	M212K3	246	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
313	Перчатки нитриловые хлорированные неопудренные 100 шт/50 пар L черный	50 пар/L черный	568	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000312/1.jpg}	M212K4	106	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
314	Vileda: Губка с системой ПурАктив 6,3х14 см голубой (10 шт/уп)	(10 шт/уп)	185	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000313/1.jpg}	123118/123114	281	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
315	Vileda: Губка с системой ПурАктив 6,3х14 см красный (10 шт/уп)	(10 шт/уп)	185	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000314/1.jpg}	123116/123112	75	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
316	Vileda: Губка с системой ПурАктив 6,3х14 см желтый (10 шт/уп)	(10 шт/уп)	185	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000315/1.jpg}	123117/123113	55	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
317	Vileda: Губка с системой ПурАктив 6,3х14 см зеленый (10 шт/уп)	(10 шт/уп)	185	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000316/1.jpg}	123115/123111	320	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
318	Vileda: Губка (зеленый абразив) 7х15 см голубой (10 шт/уп)	(10 шт/уп)	148	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000317/1.jpg}	101397/101404	108	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
319	Vileda: Губка (зеленый абразив) 7х15 см красный (10 шт/уп)	(10 шт/уп)	148	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000318/1.jpg}	101397/101404	10	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
320	Vileda: Губка (зеленый абразив) 7х15 см желтый (10 шт/уп)	(10 шт/уп)	148	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000319/1.jpg}	101397/101404	107	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
321	Vileda: Губка (зеленый абразив) 7х15 см зеленый (10 шт/уп)	(10 шт/уп)	148	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000320/1.jpg}	101397/101404	124	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
371	салфетки бумажные 24*24см 3сл 25шт БЕЛЫЕ ТЮЛЬПАНЫ Bouquet de Luxe	24*24см 3сл 25шт	67	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000370/1.jpg}	57299	103	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
322	PACLAN PRACTI SOFT POWER ГУБКИ ДЛЯ ПОСУДЫ, 2ШТ	2 шт в упак	159	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000321/1.jpg}	409172	225	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
323	PACLAN PRACTI UNIVERSAL ГУБКИ ДЛЯ ПОСУДЫ, 5ШТ.	5 шт в упак	99	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000322/1.jpg}	409135	36	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
324	PACLAN PRACTI PROFI ГУБКИ ДЛЯ ПОСУДЫ 2ШТ.	2 шт в упак	79	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000323/1.jpg}	409113	214	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
325	Губка меламиновая Practi Magic, 1шт.	шт	119	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000324/1.jpg}	409140	65	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
326	PACLAN PRACTI CRYSTAL ГУБКА ДЛЯ ВАННОЙ, 1ШТ.	шт	129	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000325/1.jpg}	409194	118	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
327	Универсальная тряпка Practi, 35x35cm,5 шт.	0,35*0,35 м по 5 шт в упак	84	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000326/1.jpg}	410121	185	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
328	PACLAN САЛФЕТКИ ИЗ МИКРОФИБРЫ 30Х30СМ 2ШТ.	0,3*0,3 м по 2 шт в упак	119	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000327/1.jpg}	410310	415	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
329	PACLAN САЛФЕТКИ ИЗ МИКРОФИБРЫ 30Х30СМ 4ШТ.	0,3*0,3 м по 4 шт в упак	379	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000328/1.jpg}	410261	283	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
330	PACLAN ТРЯПКА ДЛЯ ПОЛА ИЗ МИКРОФИБРЫ, 50X60CM, 1 ШТ.	0,5*0,6 м	289	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000329/1.jpg}	411023	273	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
331	PACLAN ТРЯПКА УНИВЕРСАЛЬНАЯ КОМФОРТ 25Х35СМ, 70шт./рул.	0,25*0,35 м 70 шт в рулоне	410	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000330/1.jpg}	410341	69	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
332	Держатель мопов Vileda УльтраСпид Про голубой 40 см	40 см шт	4459	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000331/1.jpg}	147593	115	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
333	Vileda: Контракт УльтраСпид Про 40см (шт.)	шт	597	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000332/1.jpg}	167275	40	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
334	Vileda: УльтраСпид Про Моп Трио 40см серо-бело-бежевый (шт.)	шт	649	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000333/1.jpg}	167276	244	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
335	Vileda: Моп МикроПлюс УльтраСпид Про 40см	шт	829	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000334/1.jpg}	167291	128	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
336	Vileda: Моп МикроЛайт Макси УльтраСпид Про 40см, белый/серый	шт	867	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000335/1.jpg}	167292	129	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
337	Vileda: УльтраСпид Набор Мини Комплекс голубой (шт.)	шт	5989	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000336/1.jpg}	161099	75	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
338	Vileda: Ручка алюминиевая с цветовой кодировкой 150см для держателей и сгонов,	шт	1719	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000337/1.jpg}	512413	90	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
339	Vileda: УльтраСпид Мини Ручка 84-144см телескопическая (шт.)	шт	699	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000338/1.jpg}	526693	213	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
340	совок и сметка с длинными ручками 83см  Антелла	шт	569	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000339/1.jpg}	70974	62	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
341	Vileda: Салфетка* МикронКвик 40х38см голубой (шт.)	шт	567	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000340/1.jpg}	170635	75	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
343	Vileda: Салфетка* МикронКвик 40х38см зеленый (шт.)	шт	567	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000342/1.jpg}	170637	76	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
344	Vileda: Салфетка* МикронКвик 40х38см красный (шт.)	шт	567	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000343/1.jpg}	170636	455	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
345	Vileda: Салфетки Бризи 35,5x35 см голубой (25 шт/уп)	(25 шт/уп)	75	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000344/1.jpg}	161616	93	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
346	Vileda: Салфетки Бризи 35,5x35 см красный (25 шт/уп)	(25 шт/уп)	75	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000345/1.jpg}	161617	50	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
347	Vileda: Салфетки Бризи 35,5x35 см желтый (25 шт/уп)	(25 шт/уп)	75	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000346/1.jpg}	161618	412	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
348	Vileda: Салфетки Бризи 35,5x35 см зеленый (25 шт/уп)	(25 шт/уп)	75	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000347/1.jpg}	161619	69	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
349	Vileda: Салфетки ПВАМикро  голубой	шт	497	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000348/1.jpg}	143590/143585	479	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
350	Vileda: Салфетки ПВАМикро желтый	шт	497	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000349/1.jpg}	143592/143587	476	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
351	Vileda: Салфетки ПВАМикро зеленый	шт	497	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000350/1.jpg}	143593	349	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
352	Vileda: Салфетки ПВАМикро красный	шт	497	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000351/1.jpg}	143591/143586	128	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
353	Vileda: Салфетка* МикроТафф Бэйс 36х36см синий (шт.)	шт	237	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000352/1.jpg}	174176	195	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
354	Vileda: Салфетка* МикроТафф Бэйс 36х36см красный (шт.)	шт	237	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000353/1.jpg}	174178	3	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
355	Vileda: Салфетка* МикроТафф Бэйс 36х36см желтый (шт.)	шт	237	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000354/1.jpg}	174182	242	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
356	Vileda: Салфетка* МикроТафф Бэйс 36х36см зеленый (шт.)	шт	237	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000355/1.jpg}	174180	176	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
357	Vileda Салфетки МикроТафф Плюс 38х38 см голубая	38*38 шт	519	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000356/1.jpg}	174192	176	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
358	Vileda Салфетки МикроТафф Плюс 38х38 см красная	38*38 шт	519	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000357/1.jpg}	174201	439	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
359	Vileda Салфетки МикроТафф Плюс 38х38 см желтая	38*38 шт	519	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000358/1.jpg}	174205	71	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
360	Vileda Салфетки МикроТафф Плюс 38х38 см зеленая	38*38 шт	519	УБОРОЧНЫЙ ИНВЕНТАРЬ (тряпки, салфетки, перчатки, губки)	{/data/images/product_00000359/1.jpg}	174203	2	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
363	Бумага туалетная рулонная Focus Mini Jumbo белая 12 рул/упак, 170 м, 2 слоя	170 м, 2 слоя	159	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000362/1.jpg}	5036904	199	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
364	Бумага туалетная  Veiro Professional Comfort (95мм*125 мм - 15 м) 2 слоя	95*125 мм 15 м 2 слоя 8 рул/пачка	129	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000363/1.jpg}	T207/1	199	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
365	Туалетная бумага ТОРК: Т2 стандарт 1 сл, 200м/9,5 белая 12 рул/упак	200м/9,5 белая 12 рул/упак	137	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000364/1.jpg}	120197	137	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
366	Полотенца в пач. V-укладка ( 210 мм* 216мм - 250 л) 1 слой	250 листов 1 слой	91	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000365/1.jpg}	V1-250	197	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
367	FORTESS нетканый протир. материал повыш. прочности в рул, синие, длина 90м,35*30 см 300 л	35*30 см 90 м 300 листов	3099	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000366/1.jpg}	W80BR	310	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
368	салфетки 25*25см 1сл 80шт БЕЛЫЕ в боксе  Антелла	25*25см 1сл 80шт БЕЛЫЕ в боксе	69	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000367/1.jpg}	4147	150	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
369	салфетки 24*24см 1сл 100шт БЕЛЫЕ Verona	24*24см 1сл 100шт БЕЛЫЕ	45	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000368/1.jpg}	77198	164	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
370	салфетки бумажные 24*24см 3сл 25шт АЖУРНЫЙ УЗОРBouquet de Luxe	24*24см 3сл 25шт	67	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000369/1.jpg}	37173	34	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
361	Бумага туалетная PAPIA PROFESSIONAL 8 рул/упак (125*95 мм - 140 л, 20 м) 3 слоя	8 рул/пачка; 125*95 мм - 140 л, 20 м, 3 слоя	237	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000360/1.jpg}	5060404/5080998	20	t	2025-09-06 11:27:47.43	2025-09-10 09:27:35.822
372	салфетки бумажные 24*24см 3сл 25шт ВЕСЕЛЫЙ ПРАЗДНИК Bouquet de Luxe	24*24см 3сл 25шт	67	БУМАЖНАЯ ПРОДУКЦИЯ	{/data/images/product_00000371/1.jpg}	37093	118	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
373	Мешки для мусора 35 л белые (50*58)	35 л (50*58) 15 шт/рул	75	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000372/1.jpg}	В3351517Б	247	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
374	Мешки для мусора ПНД 30л (48*57,5*5,6мкн)Ромашка (50шт/рул 20рул/кор) черные	30л  48*57,5*5,6 мкн 50 шт/рул	55	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000373/1.jpg}	ЕЛР-305020	44	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
375	Мешки для мусора 30л (48*57,5*7,3)Ромашка (50шт/рул 15рул/кор) черные 4612729610239	30л  48*57,5*7,3 мкн 50 шт/рул	68	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000374/1.jpg}	НМ30-50/15/ Э	12	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
376	Мешки для мусора ПСД 60 л белые  (59*64*23 мкн)	60 л (59*64*23 мкн) 10 шт/рул	98	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000375/1.jpg}	В30601017Б	17	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
377	Мешки для мусора ПНД 60л (58*68*6мкм)Ромашка (50шт/рул 20рул/кор) черные	ПНД 60л 58*68*6 мкм 50 шт/рул	85	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000376/1.jpg}	ЕЛР-605020	120	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
378	Мешки для мусора ПНД 60л (58*68*7,3)Ромашка (50шт/рул 15рул/кор) черные 4612729610185	ПНД 60л 58*68*7,3 мкм 50 шт/рул	98	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000377/1.jpg}	НМ60-50/15/ Э	360	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
379	Мешки для мусора ПВД 120л (70*110*28мкн)Ромашка (50шт/пач 250шт/меш) в тарном мешке,прямое дно	ПВД 120л 70*110*28 мкн 50 шт/пач	15	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000378/1.jpg}	ВП-004	383	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
380	Мешки для мусора ПВД 120л (70*110*35мкн)Ромашка (50шт/пач 200шт/меш) в тарном мешке,прямое дно	ПВД 120л 70*110*35 мкн 50 шт/пач	17	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000379/1.jpg}	ВП-007	26	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
381	Мешки для мусора ПВД 120л (70*110*60мкн)Ромашка (50шт/пач 150шт/меш) в тарном мешке,прямое дно	ПВД 120л 70*110*60 мкн 50 шт/пач	22	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000380/1.jpg}	ВП-014	286	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
382	Мешки для мусора ПВД 180 л (86*105*20 мкн) 10 шт в рулоне/35 рулонов в коробке	180 л (86*105*20 мкн) 10 шт в рул/35 рул в кор	19	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000381/1.jpg}	ЕЛР-ВР -1801035	153	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
383	Мешки для мусора ПВД 240 л в рулоне ТИТАН (100*130*80 мкн) 5 шт в рулоне/10 рулонов в коробке	240 л (100*130*80 мкн) 5 шт в рул/10 рул в кор	52	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000382/1.jpg}	ТТ-ВР-240/5/10/С	186	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
384	Мешки для мусора ПВД 240 л в рулоне БРОНЯ (100*130*60 мкн) 10 шт в рулоне/7 рулонов в коробке	240 л БРОНЯ (100*130*60 мкн) 10 шт в рул/7 рул в кор	40	МЕШКИ ДЛЯ МУСОРА	{/data/images/product_00000383/1.jpg}	ВР-0013	30	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
385	Батарейки OPTICELL Basic AAA	4 шт в упак/48 шт в кор	389	ПРОЧЕЕ	{/data/images/product_00000384/1.jpg}	1015220001	59	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
386	Батарейки OPTICELL Basic AA	4 шт в упак/48 шт в кор	389	ПРОЧЕЕ	{/data/images/product_00000385/1.jpg}	1015220000	49	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
387	Батарейки OPTICELL Basic 9V  (КРОНА)	1 шт в упак/10 шт в кор	489	ПРОЧЕЕ	{/data/images/product_00000386/1.jpg}	1015220009	70	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
388	Стакан пластиковый 200 мл	100 шт в упак	1.5	ПРОЧЕЕ	{/data/images/product_00000387/1.jpg}	19-2862	63	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
389	Фасовочные пакеты в рулоне  24*35*6,5 мкм, 280 шт/рул, 20 рулонов в мешке	24*35*6,5 мкм, 280 шт/рул, 20 рулонов в мешке	169	ПРОЧЕЕ	{/data/images/product_00000388/1.jpg}	БШП ХИ-001	137	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
390	Фасовочные пакеты в рулоне БШП 30*40*8 мкн рулон прозрачный 40рул/кор 50шт/рул	30*40*8 мкн рулон прозрачный 40рул/кор 50шт/рул	55	ПРОЧЕЕ	{/data/images/product_00000389/1.jpg}	ПУ30/50П	427	t	2025-09-06 11:27:47.43	2025-09-06 11:27:47.43
\.


--
-- Data for Name: user_special_prices; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public.user_special_prices (id, "userId", "productId", price, "createdAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ecosphere_user
--

COPY public.users (id, email, password, "userType", "createdAt", "updatedAt", "firstName", "lastName", phone, "ipName", "companyName", "legalAddress", inn, kpp, "discountPercent", "isVip", "loyaltyPoints", role) FROM stdin;
cmf6nd64v00006i31kbsfio11	stazizovs@gmail.com	$2b$10$64/ViWf8Qb7FZS1uQlxdsOuP8ll96rk513MeQpt5VBnnL/uYP2SEm	INDIVIDUAL	2025-09-05 09:43:07.855	2025-09-09 09:50:44.096	Said	Azizov	+19176755086	\N	\N	\N	\N	\N	0	f	0	ADMIN
cmfcdedg100006itnptrkfq9b	manager@ecosphere.su	$2b$12$GDjWxQCZFY5kFVl3fiz8EeAFp0jFkJhk5LVkTxWsGXlAFf8m3Mvcu	INDIVIDUAL	2025-09-09 09:50:44.881	2025-09-09 09:50:44.881	Manager	User	\N	\N	\N	\N	\N	\N	0	f	0	MANAGER
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: personal_discounts personal_discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.personal_discounts
    ADD CONSTRAINT personal_discounts_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: product_discounts product_discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.product_discounts
    ADD CONSTRAINT product_discounts_pkey PRIMARY KEY (id);


--
-- Name: product_inventory product_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.product_inventory
    ADD CONSTRAINT product_inventory_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: user_special_prices user_special_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.user_special_prices
    ADD CONSTRAINT user_special_prices_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cart_items_userId_productId_key; Type: INDEX; Schema: public; Owner: ecosphere_user
--

CREATE UNIQUE INDEX "cart_items_userId_productId_key" ON public.cart_items USING btree ("userId", "productId");


--
-- Name: favorites_userId_productId_key; Type: INDEX; Schema: public; Owner: ecosphere_user
--

CREATE UNIQUE INDEX "favorites_userId_productId_key" ON public.favorites USING btree ("userId", "productId");


--
-- Name: orders_orderNumber_key; Type: INDEX; Schema: public; Owner: ecosphere_user
--

CREATE UNIQUE INDEX "orders_orderNumber_key" ON public.orders USING btree ("orderNumber");


--
-- Name: posts_slug_key; Type: INDEX; Schema: public; Owner: ecosphere_user
--

CREATE UNIQUE INDEX posts_slug_key ON public.posts USING btree (slug);


--
-- Name: product_discounts_productId_key; Type: INDEX; Schema: public; Owner: ecosphere_user
--

CREATE UNIQUE INDEX "product_discounts_productId_key" ON public.product_discounts USING btree ("productId");


--
-- Name: product_inventory_productId_key; Type: INDEX; Schema: public; Owner: ecosphere_user
--

CREATE UNIQUE INDEX "product_inventory_productId_key" ON public.product_inventory USING btree ("productId");


--
-- Name: user_special_prices_userId_productId_key; Type: INDEX; Schema: public; Owner: ecosphere_user
--

CREATE UNIQUE INDEX "user_special_prices_userId_productId_key" ON public.user_special_prices USING btree ("userId", "productId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: ecosphere_user
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: cart_items cart_items_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: personal_discounts personal_discounts_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.personal_discounts
    ADD CONSTRAINT "personal_discounts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: personal_discounts personal_discounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.personal_discounts
    ADD CONSTRAINT "personal_discounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: posts posts_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_special_prices user_special_prices_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecosphere_user
--

ALTER TABLE ONLY public.user_special_prices
    ADD CONSTRAINT "user_special_prices_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

