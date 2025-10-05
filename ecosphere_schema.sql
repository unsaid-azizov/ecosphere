--
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

