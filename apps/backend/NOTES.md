In backend development — especially when using frameworks like **Express.js**, **Fastify**, or similar — **router priority (or order)** refers to **the sequence in which routes are defined and matched** when handling incoming requests.

Let’s break it down clearly:

---P

### 🧩 What Is Router Priority?

When a request (like `GET /users`) hits your server, the framework **checks your routes in the order they were registered** — **top to bottom** — and executes the **first route that matches**.

So, **the order in which you define routers determines which one gets executed first**.
This is called **router or middleware priority**.

---

### 🔢 Example

```js
const express = require('express');
const app = express();

// Route 1
app.get('/users', (req, res) => {
  res.send('All Users');
});

// Route 2
app.get('/users/:id', (req, res) => {
  res.send(`User with ID ${req.params.id}`);
});
```

If you request:

```
GET /users
```

→ Express matches the first route and sends “All Users”.

If you request:

```
GET /users/123
```

→ Express matches the second route (`/users/:id`).

✅ **Works fine** because specific and general routes are placed correctly.

---

### ⚠️ Incorrect Order Example

```js
app.get('/users/:id', (req, res) => {
  res.send(`User with ID ${req.params.id}`);
});

app.get('/users', (req, res) => {
  res.send('All Users');
});
```

Now, `GET /users` will match the first route (`/users/:id`)
because `:id` can match *anything* — even the word "users".

So `/users` → `"User with ID users"` ❌

That’s why **order matters**.

---

### 🧠 Priority Rules Summary

| Priority Type                    | Description                                                                            | Example                                                                                           |
| -------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **1. Order of registration**     | Routes and middleware are executed in the order they’re added.                         | `app.use()` or `app.get()` defined first has higher priority.                                     |
| **2. Specificity of route path** | More specific paths should come before generic ones.                                   | `/users/profile` before `/users/:id`.                                                             |
| **3. Middleware placement**      | Middlewares run before routes that come **after** them.                                | If `app.use(authMiddleware)` is above routes, all routes are protected.                           |
| **4. Mounted routers**           | When using `app.use('/api', router)`, all routes inside inherit that prefix and order. | `app.use('/api', router)` before `app.use('/', webRouter)` means `/api` routes are checked first. |

---

### 🧩 With Routers Example

```js
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

app.use('/admin', adminRouter);
app.use('/users', userRouter);
```

**Priority:**

1. `/admin` routes checked first
2. `/users` routes next
3. Then any other app routes

---

### ⚙️ Practical Tip

* Always define **global middleware first** (e.g., CORS, JSON parser)
* Then define **API-specific routers**
* Finally define a **catch-all** route (e.g., 404 handler)

Example:

```js
app.use(express.json());         // Global middleware
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('*', (req, res) => res.status(404).send('Not Found'));
```

---

### 🧾 TL;DR

| Concept             | Meaning                                                                             |
| ------------------- | ----------------------------------------------------------------------------------- |
| **Router Priority** | Order in which routes and middleware are registered and matched.                    |
| **Why it matters**  | Wrong order can cause incorrect routes to handle requests.                          |
| **Fix**             | Put specific routes before general ones, and mount routers in the correct sequence. |

---

