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

    const redisPost = {
      title: "Unit 2: High-Performance Redis - A Deep Dive",
      slug: "redis-unit-2",
      excerpt:
        "Redis is more than a cache. It's an in-memory data structure store designed for extreme speed and low latency. Understanding Redis deeply means understanding its architecture, its rich data structures, and how it achieves reliability at scale.",
      content: `# Unit 2: High-Performance Redis - A Deep Dive

> Redis is a masterpiece of "less is more" - a system that achieves extraordinary performance by not adding complexity, but by ruthlessly eliminating it.


---

## Introduction

Redis is more than a cache. It's an **in-memory data structure store** designed for extreme speed and low latency. Unlike traditional databases that live on disk, Redis operates entirely in **RAM**, enabling it to handle millions of operations per second. Understanding Redis deeply means understanding its architecture, its rich data structures, and how it achieves reliability at scale.

---

## 1. The Core Philosophy

Redis is built on three architectural pillars:

- **In-Memory Storage** - Zero disk I/O for data access means blazing-fast reads and writes.
- **Single-Threaded Execution** - Eliminates context switching, mutex locks, and thread synchronization overhead.
- **Non-Blocking I/O (The Reactor Pattern)** - Handles thousands of concurrent connections despite being single-threaded.

The philosophy is simple: eliminate everything that wastes CPU cycles, and you get a system that is both fast and predictable.

---

## 2. Internal Architecture: The Reactor Pattern

The **Reactor Pattern** is the heart of Redis's concurrency model - an event-driven design that allows a single thread to serve thousands of clients simultaneously.

### How the Event Loop Works

1. **I/O Multiplexer** - Monitors all client connections using OS-level system calls like \`epoll\` (Linux) or \`kqueue\` (macOS/BSD).
2. **Event Dispatcher** - When a client sends a command, the OS notifies Redis. The dispatcher pulls the event from the queue.
3. **Single-Threaded Handler** - Executes the command (e.g., \`SET key value\`) without any locking.
4. **Response** - The result is written back to the client socket.

### Why Not Multi-Threading?

In multi-threaded systems, CPUs waste significant time on:

- **Context switching** - Saving and restoring thread states.
- **Lock contention** - Threads waiting for mutexes to release.

Redis replaces all of this with a queue. The CPU cache stays "warm," and there's no synchronization overhead.

### Little's Law & Redis Efficiency

Redis's efficiency is grounded in **Little's Law** - L = λW (average items = arrival rate × wait time):

> To maximize throughput, minimize wait time.

By eliminating context switching and locking, Redis keeps wait time ≈ 0, allowing extremely high arrival rates without resource exhaustion.

### Redis 6.0+: I/O Threads

While command execution remains single-threaded to preserve atomicity, Redis 6.0 introduced auxiliary **I/O Threads** for parsing and serializing network buffers - further reducing bottlenecks at high connection counts.

---

## 3. The Data Structure Palette

Redis is not just a key-value store. It offers a rich set of native data structures, each optimized for specific use cases.

### Strings

The most fundamental type - binary-safe, storing text, numbers, or serialized JSON up to 512 MB.

\`\`\`redis
SET user:101:name "Alice"
GET user:101:name          # → "Alice"

SET page:views 0
INCR page:views            # → 1
INCRBY page:views 10       # → 11
\`\`\`

### Lists

Doubly linked lists - ideal for queues, stacks, and activity feeds.

\`\`\`redis
# Push to a queue (FIFO)
RPUSH jobs "email:send" "report:generate"
LPOP jobs                  # → "email:send"

# Push to a stack (LIFO)
LPUSH history "page1" "page2"
LPOP history               # → "page2"
\`\`\`

### Sets

Unordered collections of unique strings with O(1) membership testing. A key strength is native support for **set operations** like intersections and unions.

\`\`\`redis
SADD team:backend "alice" "bob" "carol"
SADD team:frontend "bob" "dave"

SMEMBERS team:backend      # → {"alice", "bob", "carol"}
SISMEMBER team:backend "alice"  # → 1 (true)

# Who works on BOTH teams?
SINTER team:backend team:frontend   # → {"bob"}

# Everyone across both teams?
SUNION team:backend team:frontend   # → {"alice", "bob", "carol", "dave"}
\`\`\`

### Hashes

Field-value maps - more memory-efficient for objects than storing serialized JSON strings, thanks to \`listpack\` encoding for small objects.

\`\`\`redis
HSET user:101 name "Alice" age 30 role "engineer"
HGET user:101 name         # → "Alice"
HGETALL user:101           # → {name: Alice, age: 30, role: engineer}
HINCRBY user:101 age 1     # → 31
\`\`\`

### Sorted Sets (ZSets)

Unique members each associated with a floating-point **score**. Internally uses a **skip list** - a probabilistic data structure that keeps members sorted in O(log N) time, making it perfect for real-time leaderboards.

\`\`\`redis
ZADD leaderboard 9500 "alice"
ZADD leaderboard 8200 "bob"
ZADD leaderboard 9900 "carol"

# Top 3 players (highest score first)
ZREVRANGE leaderboard 0 2 WITHSCORES
# → carol 9900, alice 9500, bob 8200

# Alice's rank (0-indexed)
ZREVRANK leaderboard "alice"   # → 1
\`\`\`

---

## 4. Persistence & Durability

RAM is volatile - a power failure means data loss. Redis provides three strategies to address this.

### RDB (Redis Database)

Point-in-time binary **snapshots** of the entire dataset.

- **Pros:** Fast recovery, compact backup files, minimal runtime overhead.
- **Cons:** Data written after the last snapshot can be lost.

\`\`\`
# In redis.conf
save 900 1      # snapshot if ≥1 key changed in 15 min
save 300 10     # snapshot if ≥10 keys changed in 5 min
save 60 10000   # snapshot if ≥10,000 keys changed in 1 min
\`\`\`

### AOF (Append Only File)

Logs **every write operation** to a journal file in human-readable format.

\`\`\`
# In redis.conf
appendonly yes
appendfsync everysec   # sync to disk every second
\`\`\`

- **Pros:** Highly durable, minimal data loss.
- **Cons:** Larger files, slightly slower on restart.

### Hybrid Strategy (Recommended for Production)

Use **RDB + AOF** together:

- AOF starts with an embedded RDB snapshot for fast restarts.
- AOF journal fills in the gap between snapshots.
- Result: Fast recovery + minimal data loss.

---

## 5. Scaling and High Availability

A single Redis instance is a **single point of failure**. Redis provides two complementary scaling strategies.

### Replication (The Foundation)

A **primary node** handles all writes. **Replica nodes** sync data and serve read-heavy workloads - effectively scaling read throughput horizontally.

\`\`\`redis
# On the replica instance
REPLICAOF 192.168.1.10 6379
\`\`\`

### Redis Sentinel - High Availability

| Feature       | Detail                                                  |
| ------------- | ------------------------------------------------------- |
| **Goal**      | Automatic failover                                      |
| **Mechanism** | Monitors nodes; promotes a replica if the primary fails |
| **Capacity**  | Limited to one machine's RAM                            |

### Redis Cluster - Horizontal Scaling

| Feature         | Detail                                      |
| --------------- | ------------------------------------------- |
| **Goal**        | Sharding data across multiple nodes         |
| **Mechanism**   | Divides keyspace into **16,384 hash slots** |
| **Capacity**    | Scales linearly with nodes added            |
| **Replication** | Each shard has its own primary and replicas |

For most production systems, Redis Cluster is used when data exceeds a single server's RAM, while Sentinel is used when HA is needed without sharding.

---

## 6. Performance Optimization

### Pipelining

Without pipelining, every command waits for a full network round-trip before the next one is sent.

\`\`\`
# Without pipelining - 3 separate round-trips
SET key1 "a"   # wait...
SET key2 "b"   # wait...
SET key3 "c"   # wait...
\`\`\`

With pipelining, all commands are batched and sent in one shot.

### Atomic Lua Scripts

Complex multi-step operations can be run atomically inside Redis using Lua. The entire script executes as a single unit - no race conditions, no client-side locks needed.

\`\`\`lua
-- Atomically increment a counter only if it's below a limit
local current = redis.call('GET', KEYS[1])
if tonumber(current) < tonumber(ARGV[1]) then
    return redis.call('INCR', KEYS[1])
else
    return current
end
\`\`\`

### Anti-Pattern: KEYS * vs SCAN

Never use \`KEYS *\` in production - it's an **O(N)** blocking operation that scans the entire keyspace, freezing Redis for all other clients during execution.

\`\`\`redis
# NEVER in production
KEYS user:*

# Safe - cursor-based, non-blocking iteration
SCAN 0 MATCH user:* COUNT 100
# Returns a cursor + batch of keys; repeat until cursor returns 0
\`\`\`

---

## 7. Security Best Practices

| Layer                 | Practice                                                                          |
| --------------------- | --------------------------------------------------------------------------------- |
| **Network**           | Bind to \`127.0.0.1\`; use firewalls to restrict access                             |
| **Authentication**    | Use **ACLs (Access Control Lists)** for per-user permissions and strong passwords |
| **Command Hardening** | Disable or rename dangerous commands like \`FLUSHALL\`, \`KEYS *\`, \`CONFIG\`          |
| **Encryption**        | Use **TLS/SSL** for all data in transit                                           |

---

## 8. Redis Stack & Modules

Redis can be extended far beyond its core with official modules:

- **RediSearch** - Full-text search and secondary indexing.
- **RedisJSON** - Native JSON storage with partial update support.
- **RedisTimeSeries** - High-volume time-series data and analytics.
- **RedisAI** - Run ML models directly inside Redis.

---

## 9. Logical Databases

Redis supports up to **16 logical databases** (\`db=0\` to \`db=15\`), providing independent keyspaces within a single instance.

\`\`\`redis
SELECT 0    # default database
SET app:config "production"

SELECT 1    # switch to db 1
SET app:config "development"   # completely separate key

SELECT 0
GET app:config   # → "production" (unaffected)
\`\`\`

- Useful for separating dev/test/prod environments on a single server.
- They share the **same memory and process** - not true multi-tenancy.
- For strict isolation, run separate Redis instances.

---

## Summary

Redis rewards engineers who understand its internals. The more you work with it, the more you appreciate that every design decision - from the single-threaded model to the 16,384 hash slots - is a deliberate trade-off made in the name of speed, simplicity, and reliability.`,
      cover_image_url:
        "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=1200&h=600&fit=crop",
      cover_image_alt: "Redis Database Architecture",
      tags: [
        "Redis",
        "In-Memory Database",
        "Architecture",
        "Performance",
        "DBS302",
      ],
      published: true,
      author_name: "KP",
      author_email: "02230287.cst@rub.edu.bt",
    };

    const noSQLResult = await createPost(noSQLPost);
    const redisResult = await createPost(redisPost);

    if (!noSQLResult && !redisResult) {
      return Response.json(
        { error: "Failed to create posts" },
        { status: 500 },
      );
    }

    const createdPosts = [];
    if (noSQLResult) createdPosts.push("NoSQL");
    if (redisResult) createdPosts.push("Redis");

    return Response.json({
      success: true,
      message: `Successfully created: ${createdPosts.join(", ")}`,
      posts: {
        nosql: noSQLResult || null,
        redis: redisResult || null,
      },
    });
  } catch (error) {
    console.error("Error seeding posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
