import { createPost } from "@/lib/blog-data";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId, sessionClaims } = await auth();
    const userEmail = sessionClaims?.email as string;

    // Check if admin (by email)
    const adminEmail = "02230287.cst@rub.edu.bt";
    if (!userId || userEmail !== adminEmail) {
      return Response.json(
        { error: "Unauthorized — only admin can seed posts" },
        { status: 401 },
      );
    }

    const noSQLPost = {
      title: "Beyond SQL: A Deep Dive into NoSQL Databases",
      slug: "nosql-databases-unit-i",
      excerpt:
        "A complete deep-dive into NoSQL databases — what they are, why they exist, the types you need to know, and how to pick the right one.",
      content: `# Beyond SQL: A Deep Dive into NoSQL Databases

## Why Did NoSQL Even Exist?

For three decades, **relational databases ruled** — and for good reason. Edgar F. Codd's relational model (1970) gave us structured tables, ACID transactions, and the elegant power of SQL. Oracle, MySQL, and PostgreSQL became the backbone of virtually every application.

Then the internet exploded. Companies like **Google, Amazon, Facebook, and Twitter** emerged with problems RDBMS was simply never designed to solve: billions of users, petabytes of unstructured data, thousands of writes per second, and schemas that needed to change overnight.

### The Breaking Point

Facebook was storing **billions of messages**. Twitter handled **thousands of tweets per second**. Google was indexing the **entire web**. RDBMS started cracking under this pressure.

The core problems at scale were:

- **Vertical scaling ceiling**: You can only buy a machine so big; horizontal distribution is painful with joins and foreign keys
- **Schema rigidity**: ALTER TABLE on 2 billion rows can lock a table for hours
- **Object-relational mismatch**: Apps work with objects; databases want rows — constant conversion overhead
- **Mismatched data shapes**: Graphs, key-value pairs, time-series — forcing all into tables is unnatural

So Google wrote **Bigtable (2004)**, Amazon wrote **Dynamo (2007)**, Facebook open-sourced **Cassandra (2008)**. These internal systems became the blueprint for the entire NoSQL movement.

### The Name

The term **"NoSQL"** was coined in 2009 as a Twitter hashtag for a meetup in San Francisco. It stuck. The community now prefers **"Not Only SQL"** — these databases *complement* relational ones, not replace them.

---

## What Is a NoSQL Database?

**NoSQL databases** are non-relational database systems that store and manage data using flexible schemas and alternative data models — designed for horizontal scalability and high availability in large-scale, distributed applications.

### Key Characteristics

**Schema Flexibility**: No fixed table structure — records can have different fields. Perfect for fast-evolving requirements.

**Non-Relational Model**: Data as key-value, documents, wide rows, or graphs instead of normalized tables and joins.

**Horizontal Scalability**: Scale by adding more machines (sharding) rather than upgrading a single server.

**Distributed & Fault-Tolerant**: Data replicated across nodes and data centers for resilience and availability.

**BASE Over ACID**: Trades strong consistency for availability and partition tolerance — Basically Available, Soft state, Eventually consistent.

### BASE vs ACID

Traditional SQL databases follow **ACID** (Atomicity, Consistency, Isolation, Durability). Most NoSQL systems follow **BASE** — the philosophy of eventually consistent systems.

| Feature | ACID (SQL) | BASE (NoSQL) |
|---------|-----------|-------------|
| Consistency | Immediate / Strong | Eventual |
| Availability | Sacrificed for accuracy | Highest priority |
| Scalability | Vertical (bigger servers) | Horizontal (more servers) |
| Best for | Financial transactions | Social media, Big Data |

**Analogy**: RDBMS is like a highly regulated library with strict catalog rules. NoSQL is like a dynamic warehouse optimized to quickly grab items in bulk — sometimes sacrificing strict cataloging for speed.

---

## The CAP Theorem

Proposed by **Eric Brewer in 2000** and formally proven by Gilbert & Lynch in 2002, the CAP Theorem states: in a distributed data store, it is *impossible* to simultaneously guarantee all three of the following:

- **Consistency**: Every read receives the most recent write
- **Availability**: Every request receives a response (without guarantee of containing most recent write)
- **Partition Tolerance**: System continues to function despite network partitions

In real-world distributed systems, **P (Partition Tolerance) is non-negotiable** — networks will fail. So the real choice is always between Consistency and Availability:

| Choice | Behavior During Partition | Example Systems |
|--------|--------------------------|-----------------|
| **CP** - Consistency + Partition Tolerance | Returns an error or blocks until partition heals — sacrifices availability | HBase, Zookeeper, MongoDB (strong mode) |
| **AP** - Availability + Partition Tolerance | Returns responses even if not all replicas agree — eventual consistency | Cassandra, CouchDB, DynamoDB |

**Real-world example**: When you add someone on Instagram, your friend count might update immediately on your screen but take a few seconds to reflect on theirs. Both nodes will *eventually* agree — this is an AP system in action.

---

## The Six Types You Must Know

NoSQL isn't a single thing — it's a family of different data models, each optimized for a specific shape of data and query pattern.

### 1. Key-Value Stores 🗝️

The simplest model: data stored as \`(key, value)\` pairs where the key is unique. Think of it as a distributed hash map with persistent storage.

**Best for**: Caching, session storage, feature flags, leaderboards.

**Examples**: Redis · DynamoDB · Riak

### 2. Document Databases 📄

Store data as JSON/BSON documents in collections. Each document can have nested fields, arrays, and embedded objects with rich querying.

**Best for**: User profiles, content management, product catalogs, event logs.

**Examples**: MongoDB · CouchDB

### 3. Column-Family Stores 📊

Also called wide-column stores. Rows can have different columns; storage is optimized for write-heavy workloads. Data modeling is query-driven.

**Best for**: Time-series data, IoT metrics, large-scale analytics, logging.

**Examples**: Cassandra · HBase

### 4. Graph Databases 🕸️

Store data as nodes (entities) and edges (relationships), both with properties. Traversals are first-class operations — like a network diagram stored directly in the DB.

**Best for**: Social networks, fraud detection, recommendation engines.

**Examples**: Neo4j · Amazon Neptune

### 5. Time-Series Databases 📈

Optimized for data points indexed by timestamp. High write throughput, downsampling, and retention policies built in.

**Best for**: System monitoring, IoT sensors, financial tick data.

**Examples**: InfluxDB · TimescaleDB · Prometheus

### 6. Vector Databases 🤖

Store high-dimensional vectors (ML embeddings) and enable similarity search using cosine distance or Euclidean distance. The newest member of the family.

**Best for**: Semantic search, RAG, image similarity, AI/ML applications.

**Examples**: Pinecone · Milvus · Weaviate

---

## How We Got Here: Timeline

**1970** — Edgar F. Codd's Relational Model
Foundation of RDBMS — tables, rows, and SQL. Rules the industry for 30+ years.

**2000** — CAP Theorem — Eric Brewer
The theoretical groundwork for understanding distributed system trade-offs. Formally proven in 2002.

**2004** — Google Bigtable & MapReduce Papers
Internal Google systems that inspired HBase, Cassandra, and the Hadoop ecosystem.

**2007** — Amazon Dynamo Paper
Amazon's internal key-value store — inspired Cassandra, Riak, and DynamoDB.

**2008–09** — The Open-Source Explosion
Cassandra (Facebook), MongoDB, Redis, HBase all launch or are open-sourced. The #NoSQL hashtag coined at San Francisco meetup in 2009.

**Today** — Polyglot Persistence is the Norm
Modern applications use multiple databases for different needs — the right tool for the right job.

---

## Where NoSQL Shines

### Big Data Processing 🗄️
Column-family stores like Cassandra and HBase handle billions of events with high write throughput. Combined with Spark or Hadoop for analytics on petabyte-scale data with the 3Vs: Volume, Velocity, Variety.

### Real-Time Web Applications ⚡
Redis for session caching and leaderboards, MongoDB for user profiles and feeds, Neo4j for real-time recommendations. A social media platform might use all three simultaneously.

### Content Management Systems 📰
Document databases fit perfectly — each article or page as a JSON document with flexible fields like title, body, tags, metadata. Schemas evolve without painful migrations.

### Internet of Things 🌡️
Smart city sensors, industrial equipment, wearables — continuously streaming time-stamped data. Time-series databases handle the bursty, high-throughput writes and enable time-window dashboards and alerts.

---

## How to Pick the Right NoSQL

Always anchor your selection around four key questions — in exams and in real design work.

### 01 · DATA SHAPE
**Data Structure & Access Patterns**: What does your data look like? Only key lookups → KV store. Nested JSON → Document. Rich relationships → Graph. Timestamps + metrics → Time-series. ML embeddings → Vector.

### 02 · SCALE
**Scalability Requirements**: Expected volume (GB/TB/PB)? Read vs write ratio? Global distribution? Very high write throughput at scale → Column-family. Read-heavy → add a KV cache on top.

### 03 · CORRECTNESS
**Consistency Needs**: Strong consistency needed (banking, inventory) → CP systems. Eventual consistency acceptable (likes, view counts, social feeds) → AP systems. Many NoSQL offer tunable consistency per operation.

### 04 · OPERATIONS
**Ecosystem & Tooling**: Driver support for your language stack, managed cloud services (Atlas, hosted Redis), monitoring dashboards, backup utilities, and community documentation all matter in production.

**Exam Tip**: In design questions, always explicitly state: "Given the **data shape** of X, **access pattern** Y, and **consistency requirement** Z, the most suitable model is…" — this structure gets full marks.

---

## Polyglot Persistence

Today, the industry has settled on a **polyglot persistence** approach — a single application may use multiple databases, each chosen for the specific workload it handles best.

\`\`\`
YourApplication
  ├── PostgreSQL    →  Transactional financial data (ACID)
  ├── Redis         →  Caching, sessions, rate limiting
  ├── MongoDB       →  Flexible user profiles & content
  ├── Cassandra     →  Time-series event logs at scale
  └── Neo4j         →  Recommendation graphs
\`\`\`

Understanding **when** and **why** to use each database is one of the most valuable skills a modern software engineer can have.

---

## The Core Lesson

NoSQL wasn't born out of ideology — it was born out of **necessity**. When the internet scaled to billions of users and petabytes of unstructured data, relational databases became the bottleneck. NoSQL doesn't replace SQL — it **expands your toolkit** so you can pick the right database for the right problem.

---

## Revision Bullets

- NoSQL = non-relational, schema-flexible, horizontally scalable, distributed, BASE-oriented
- 6 types: key-value, document, column-family, graph, time-series, vector
- CAP: distributed systems must choose C or A when P (partition) occurs
  - CP: consistent but may timeout during partition
  - AP: always responds but may return stale data
- Common use cases:
  - Big data → Column-family (Cassandra / HBase)
  - Real-time → Key-value cache (Redis)
  - CMS / Feeds → Document store (MongoDB)
  - IoT sensors → Time-series (InfluxDB)
  - AI search → Vector DB (Pinecone / Milvus)
- Selection: Data shape + Query pattern + Scale + Consistency + Tooling
`,
      cover_image_url:
        "https://images.unsplash.com/photo-1516321318423-f06f70d504d0?w=1200&h=600&fit=crop",
      cover_image_alt: "NoSQL Databases",
      tags: ["Database", "NoSQL", "Architecture", "Systems Design"],
      published: true,
      author_name: "KP",
      author_email: "02230287.cst@rub.edu.bt",
    };

    const result = await createPost(noSQLPost);

    if (!result) {
      return Response.json({ error: "Failed to create post" }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: "NoSQL blog post created successfully!",
      post: result,
    });
  } catch (error) {
    console.error("Error seeding post:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
