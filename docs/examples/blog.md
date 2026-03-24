# Beyond SQL - A Complete Guide to NoSQL Databases

### DBS201 · Unit I Study Blog

---

## 0. Why Did NoSQL Even Exist?

For three decades, **relational databases ruled** - and for good reason. Edgar F. Codd's relational model (1970) gave us structured tables, ACID transactions, and the elegant power of SQL. Oracle, MySQL, and PostgreSQL became the backbone of virtually every application.

Then the internet exploded. Companies like **Google, Amazon, Facebook, and Twitter** emerged with problems RDBMS was simply never designed to solve: billions of users, petabytes of unstructured data, thousands of writes per second, and schemas that needed to change overnight.

> **The Breaking Point:** Facebook was storing billions of messages. Twitter handled thousands of tweets per second. Google was indexing the entire web. RDBMS started cracking under this pressure.

**The core problems at scale:**

| Problem                    | Why It Hurt RDBMS                                                                                 |
| :------------------------- | :------------------------------------------------------------------------------------------------ |
| Vertical scaling ceiling   | You can only buy a machine so big; horizontal distribution is painful with joins and foreign keys |
| Schema rigidity            | ALTER TABLE on 2 billion rows can lock a table for hours                                          |
| Object-relational mismatch | Apps work with objects; databases want rows - constant conversion overhead                        |
| Mismatched data shapes     | Graphs, key-value pairs, time-series - forcing all into tables is unnatural                       |

So Google wrote **Bigtable (2004)**, Amazon wrote **Dynamo (2007)**, Facebook open-sourced **Cassandra (2008)**. These internal systems became the blueprint for the entire NoSQL movement.

> **The Name:** The term "NoSQL" was coined in 2009 as a Twitter hashtag for a San Francisco meetup. The community now prefers **"Not Only SQL"** - these databases complement relational ones, they don't replace them.

---

## 1.1 Definition & Characteristics

**NoSQL databases** are non-relational database systems that store and manage data using flexible schemas and alternative data models - designed for horizontal scalability and high availability in large-scale, distributed applications.

### Key Characteristics

- **Schema Flexibility** - No fixed table structure; records can have different fields. Perfect for fast-evolving requirements.

- **Non-Relational Model** - Data as key-value pairs, documents, wide rows, or graphs instead of normalized tables and joins.

- **Horizontal Scalability** - Scale by adding more machines (sharding/partitioning) rather than upgrading a single server.

- **Distributed & Fault-Tolerant** - Data replicated across nodes and data centers for resilience and availability.

- **BASE over ACID** - Trades strong consistency for availability and partition tolerance.

---

### 1.1.1 ACID vs BASE

Traditional SQL databases follow **ACID**. Most NoSQL systems follow **BASE** - the philosophy of eventually consistent systems.

**BASE stands for:**

- **B**asically Available - The system always responds, even if the data isn't the most recent version.

- **S**oft State - The system's state may change over time as nodes synchronize, even without new input.

- **E**ventually Consistent - All nodes will agree on the data - just not necessarily right now.

| Feature      | ACID (SQL)                | BASE (NoSQL)              |
| :----------- | :------------------------ | :------------------------ |
| Consistency  | Immediate / Strong        | Eventual                  |
| Availability | Sacrificed for accuracy   | Highest priority          |
| Scalability  | Vertical (bigger servers) | Horizontal (more servers) |
| Best for     | Financial transactions    | Social media, Big Data    |

> **Analogy:** RDBMS is like a highly regulated library with strict catalog rules. NoSQL is like a dynamic warehouse optimized to quickly grab items in bulk - sometimes sacrificing strict cataloging for speed.

---

### 1.1.2 Comparison with Relational Databases

| Aspect         | Relational DB (RDBMS)            | NoSQL DB                                         |
| :------------- | :------------------------------- | :----------------------------------------------- |
| Data model     | Tables (rows, columns)           | Key-value, document, column-family, graph, etc.  |
| Schema         | Rigid, defined upfront           | Flexible / schema-less                           |
| Query language | SQL, standardized                | Often proprietary APIs, JSON-based queries       |
| Normalization  | Strongly encouraged              | Often denormalized for performance               |
| Transactions   | Strong ACID support              | Often weaker; many use eventual consistency      |
| Scaling        | Vertical (scale-up)              | Horizontal (scale-out)                           |
| Consistency    | Strong by default                | Often tunable; favors availability               |
| Use cases      | OLTP, financial, structured data | Big data, high-velocity, semi-/unstructured data |

---

### 1.1.3 CAP Theorem

Proposed by **Eric Brewer in 2000** and formally proven by Gilbert & Lynch in 2002, the CAP Theorem states: in a distributed data store, it is impossible to simultaneously guarantee all three of the following:

![CAP Theorem Diagram](/CAP.png)

| Property                    | Meaning                                                           |
| :-------------------------- | :---------------------------------------------------------------- |
| **C - Consistency**         | Every read gets the most recent write, or an error                |
| **A - Availability**        | Every request gets a non-error response, regardless of node state |
| **P - Partition Tolerance** | System works even when network partitions occur                   |

In real-world distributed systems, **P is non-negotiable** - networks will fail. So the real choice is always between Consistency and Availability:

| Choice                                      | Behavior During Partition                        | Example Systems                         |
| :------------------------------------------ | :----------------------------------------------- | :-------------------------------------- |
| **CP** (Consistency + Partition Tolerance)  | Returns an error or blocks until partition heals | HBase, Zookeeper, MongoDB (strong mode) |
| **AP** (Availability + Partition Tolerance) | Returns responses even if not all replicas agree | Cassandra, CouchDB, DynamoDB            |

> **Real-world example:** When you add someone on Instagram, your friend count might update immediately on your screen but take a few seconds to reflect on theirs. Both nodes will eventually agree - this is an AP system in action.

> **Exam tip:** "CA" (Consistency + Availability, no Partition Tolerance) is not possible in any real distributed system. Networks always risk partitioning.

---

## 1.2 Types of NoSQL Databases

NoSQL isn't a single thing - it's a family of data models, each optimized for a specific shape of data and query pattern.

![NoSQL Database Types](https://cdn.educba.com/academy/wp-content/uploads/2019/12/Types-of-NoSQL-Databases.jpg)

---

### 1.2.1 Key-Value Stores

The simplest NoSQL model. Data stored as `(key, value)` pairs where the key is unique and the value is opaque to the database. Think of it as a **distributed, persistent hash map**.

- **Operations:** `GET key`, `SET key value`, `DELETE key`

- **Strengths:** Extremely fast lookups, simple to scale horizontally

- **Limitations:** No rich querying on value fields, no joins

- **Best for:** Caching, session storage, feature flags, leaderboards, rate limiting

- **Examples:** Redis, Amazon DynamoDB, Riak

---

### 1.2.2 Document Databases

Store data as **JSON or BSON documents** grouped into collections. Each document can have nested fields, arrays, and embedded objects - with rich querying on any field.

- **Strengths:** Flexible schema, intuitive mapping to application objects, aggregation pipelines

- **Limitations:** Not ideal for highly relational data with many joins

- **Best for:** User profiles, content management, product catalogs, event logs

- **Examples:** MongoDB, CouchDB

---

### 1.2.3 Column-Family Stores

Also called **wide-column stores**. Data organized into tables, but each row can have different columns, grouped into column families. Storage is optimized for write-heavy workloads. Data modeling is **query-driven** - you design tables around specific queries, not around normalization.

```
Row key → { column1: value1, column2: value2, ... }
Rows can have very many columns and vary per row.
```

- **Strengths:** High write throughput, massive scale, efficient time-based scans

- **Best for:** Time-series data, IoT metrics, large-scale analytics, logging

- **Examples:** Apache Cassandra, HBase

---

### 1.2.4 Graph Databases

Store data as **nodes** (entities) and **edges** (relationships), both with properties. Graph traversals are first-class operations - like a network diagram stored directly in the database.

- **Strengths:** Efficient for traversing complex relationships (shortest paths, friend-of-friend, recommendations)

- **Best for:** Social networks, fraud detection, recommendation engines, knowledge graphs

- **Examples:** Neo4j, Amazon Neptune, JanusGraph

---

### 1.2.5 Time-Series Databases

Optimized for data points indexed by **timestamp**. Built-in features like downsampling, retention policies, and time-window aggregations that you'd have to build yourself in a general-purpose DB.

- **Data pattern:** `(timestamp, metric_name, tags, value)`

- **Strengths:** High write throughput, efficient time-ordered storage, native time queries

- **Best for:** System monitoring, IoT sensor readings, financial tick data

- **Examples:** InfluxDB, TimescaleDB, Prometheus

---

### 1.2.6 Vector Databases

The newest member of the family. Store **high-dimensional vectors** (ML embeddings) and enable similarity search using cosine distance or Euclidean distance.

- **Strengths:** Semantic similarity search, nearest-neighbor lookups at scale

- **Best for:** Semantic search, retrieval-augmented generation (RAG), image similarity, AI/ML applications

- **Examples:** Pinecone, Milvus, Weaviate, pgvector (PostgreSQL extension)

---

### Quick Classification Reference

| Scenario                                         | Best NoSQL Type             |
| :----------------------------------------------- | :-------------------------- |
| Only key-based lookups                           | Key-Value Store             |
| Nested documents, flexible schema, field queries | Document Store              |
| Append-only metrics with predictable queries     | Column-Family / Time-Series |
| Rich network relationships                       | Graph DB                    |
| Semantic similarity, ML embeddings               | Vector DB                   |

---

## 1.3 Use Cases & Applications

### 1.3.1 Big Data Processing

Big data characteristics (the 3Vs): **Volume, Velocity, Variety**. RDBMS struggles to scale and adapt here.

- Column-family stores (Cassandra, HBase) for large-scale, high-velocity write workloads
- Document stores for schema-flexible event streams
- Often combined with big data frameworks (Hadoop, Spark) as storage/query layers

**Example:** Logging billions of events per day for analytics - store in Cassandra or HBase, process using Spark.

---

### 1.3.2 Real-Time Web Applications

Requirements: low latency, high concurrency, immediate updates.

- **Key-value stores** - Caching pages/sessions, rate limiting, leaderboards (Redis)
- **Document stores** - Real-time feeds, user profiles, chat messages (MongoDB)
- **Graph DB** - Real-time recommendations (Neo4j)

**Example:** A social media platform storing user sessions in Redis, posts in MongoDB, and relationships in Neo4j.

---

### 1.3.3 Content Management Systems (CMS)

CMS must handle varied content types and frequently changing structures.

- Each article or page stored as a document with fields like `title`, `body`, `tags`, `metadata`
- Schemas can evolve without painful migrations or table locks
- Field-level querying enables filtering by tag, author, date, etc.

**Example:** A news website storing articles and user-generated content in MongoDB.

---

### 1.3.4 Internet of Things (IoT) Data Storage

IoT devices send continuous data streams - bursty, high-throughput, time-ordered.

- **Time-series DBs** - Efficient storage of sensor readings over time with native downsampling
- **Column-family stores** - Large-scale, distributed storage of device metrics

**Example:** Smart city sensors sending temperature, traffic flow, etc. into InfluxDB for dashboards and alerts.

---

## 1.4 NoSQL Database Selection Criteria

In design questions and exams, always argue why a specific NoSQL type is appropriate. Use these four criteria to structure your answer.

---

### 1.4.1 Data Structure & Access Patterns

Key questions to ask:

- What does your data look like? (key-value, JSON docs, wide rows, graph, time-series, vectors)
- How will you query it? (point lookups, complex filters, joins, graph traversals, time-window aggregations, similarity search)

The golden rule: **data shape + query pattern = database choice**.

---

### 1.4.2 Scalability Requirements

- Expected data volume - GB / TB / PB?
- Read vs write ratio?
- Geographic distribution - single region or multi-region?

Guidelines:

- Very high write throughput, global scale → Column-family (Cassandra)
- Read-heavy workloads → Add a KV cache (Redis) on top of any primary store
- Multi-region, eventual consistency acceptable → AP systems (Cassandra-type)

---

### 1.4.3 Consistency Needs

| Need                                                | Recommendation                                          |
| :-------------------------------------------------- | :------------------------------------------------------ |
| Strong consistency (banking, inventory, counters)   | CP systems or strong consistency settings               |
| Eventual consistency OK (likes, view counts, feeds) | AP systems with eventual convergence                    |
| Per-operation control                               | Tunable consistency (e.g., Cassandra's quorum settings) |

In exam answers, explicitly mention CAP: _"Given high availability and partition tolerance requirements, we choose an AP-oriented system with eventual consistency."_

---

### 1.4.4 Development Ecosystem & Tooling

Factors to consider:

- **Language drivers** - Official, mature drivers for your stack
- **Cloud support** - Managed services (MongoDB Atlas, hosted Redis, AWS DynamoDB)
- **Monitoring & tooling** - GUI tools, dashboards, backup/restore utilities
- **Community** - Documentation, tutorials, Stack Overflow support

Sometimes a slightly less "perfect" technical choice wins because of better operational support. This is a real-world consideration worth mentioning in design justifications.

---

## Modern Architecture: Polyglot Persistence

Today, the industry has settled on a **polyglot persistence** approach - a single application may use multiple databases, each chosen for the workload it handles best.

```
YourApplication
      │
      ├── PostgreSQL  →  Transactional financial data (ACID)
      ├── Redis        →  Caching, sessions, rate limiting
      ├── MongoDB      →  Flexible user profiles & content
      ├── Cassandra    →  Time-series event logs at scale
      └── Neo4j       →  Recommendation graphs
```

Understanding **when** and **why** to use each database is one of the most valuable skills a modern software engineer can have.

---

## History Timeline

| Year  | Event                                                              |
| :---- | :----------------------------------------------------------------- |
| 1970  | Edgar F. Codd's Relational Model - the foundation of SQL and RDBMS |
| 2000  | Eric Brewer proposes CAP Theorem; formally proven in 2002          |
| 2004  | Google publishes Bigtable and MapReduce papers                     |
| 2007  | Amazon publishes the Dynamo paper                                  |
| 2008  | Cassandra open-sourced by Facebook; HBase releases                 |
| 2009  | MongoDB and Redis launch; the #NoSQL hashtag is coined             |
| Today | Polyglot persistence is the industry norm                          |

> Google's **Bigtable paper** and Amazon's **Dynamo paper** are arguably the two most influential academic papers in modern database history.

---

## Common Mistakes to Avoid

- **Treating column-family as "just tables"** - Rows can have varying columns and storage is write-optimized; it's not RDBMS.
- **Thinking NoSQL = better RDBMS** - NoSQL trades features (joins, ACID) for scalability and flexibility in specific scenarios.
- **Misreading CAP** - "You cannot have consistency in NoSQL" is false. Many NoSQL systems support strong or tunable consistency.
- **Designing NoSQL schemas like relational schemas** - NoSQL schema design is query-driven, not normalization-driven.
- **Using eventually consistent AP systems for critical transactions** - Bank transfers in an AP system without proper design is a recipe for disaster.

---

## Quick Revision Sheet

```
NoSQL = non-relational, schema-flexible, horizontally scalable,
        distributed, BASE-oriented

6 Types:
  key-value       → Redis, DynamoDB
  document        → MongoDB, CouchDB
  column-family   → Cassandra, HBase
  graph           → Neo4j, Neptune
  time-series     → InfluxDB, Prometheus
  vector          → Pinecone, Milvus

CAP Theorem:
  P is non-negotiable → choose C or A
  CP = consistent, may timeout during partition
  AP = always responds, may return stale data

Use cases:
  Big data    → Column-family (Cassandra / HBase)
  Real-time   → Key-value cache (Redis)
  CMS / Feeds → Document store (MongoDB)
  IoT sensors → Time-series (InfluxDB)
  AI search   → Vector DB (Pinecone / Milvus)

Selection: Data shape + Query pattern + Scale
         + Consistency needs + Tooling
```

---

> _NoSQL wasn't born out of ideology - it was born out of necessity. When the internet scaled to billions of users and petabytes of unstructured data, relational databases became the bottleneck. NoSQL doesn't replace SQL - it expands your toolkit so you can pick the right database for the right problem._

---

_DBS201 · Unit I: Introduction to NoSQL Databases · Study Notes_
