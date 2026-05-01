TaskManager: Finally, a tool that keeps out of your way.

Let's be honest—most task managers are either too simple to be useful or so complex they become a task themselves. I built this because I wanted something in the Goldilocks zone: professional, reliable, and dead-simple for the team to actually use.

---

What makes this special?

This isn't just another Todo list. It's built for actual team workflows where everyone has a specific role:

- Admin Control without the Headaches: As an Admin, you own the project. You create the vision, set the deadlines, and invite the team. You get a birds-eye view of everything through a dashboard that actually makes sense.
- Member-First Progress: We hate friction. Members don't need to dive into complex menus just to say they started a task. They get a Quick Status Dropdown right in the table. Toggle to In Progress and get back to work.
- Smart Deadlines: The app keeps track of time so you don't have to. Tasks that are past their due date glow red—a gentle (but firm) nudge to stay on track.
- Sort Your Way: Whether you want to see what was just added or what's due in an hour, the sorting system has your back.
- Stay Logged In: I set the sessions to last for a full week. No more logging in every single morning before your first coffee.

---

Test it out (Demo Credentials)

Want to see both sides of the app right away? Use these accounts to see how the Admin and Member roles feel:

Admin Account (Full Control)
- Email: armaansiddiqui.pms@gmail.com
- Password: admin123

Member Account (Status Updates Only)
- Email: a@gmail.com
- Password: 123456

---

The Engine Under the Hood

I kept the tech stack clean and modern so it's snappy and easy to maintain:
- The Core: React (Vite) for a fast UI and Node/Express for a rock-solid API.
- The Brain: MongoDB handles the data, and JWT keeps everything locked down tight.
- The Look: Clean, minimalist design using Lucide Icons and smooth transitions.

---

Getting it Running Locally

If you want to play with the code on your own machine, it's pretty straightforward:

1. Grab the dependencies: 
   In the root folder, just run: npm run install-all. (I made this script so you don't have to jump between folders).
2. Environment Setup: 
   - Pop into the backend/ and create a .env with your MONGO_URI and a JWT_SECRET. 
   - The frontend already has a .env ready for localhost.
3. Launch:
   - cd backend && npm start
   - cd frontend && npm run dev

---

Deploying to the Cloud (The One-Click Way)

I've optimized this project for Railway. The best part? You only need one service to host everything.

1. Connect your GitHub repo to Railway.
2. Add your database variables (MONGO_URI, etc.).
3. Railway will see the root package.json and handle the rest. It'll build your React app and start the server in one go.
4. Boom. Your team is now live.

---

A Note from the Developer
I built this with a focus on cleanliness. The code is commented, the structure is logical, and there’s no bloat. It’s meant to be a foundation you can actually build on.

If you like it, feel free to use it, break it, or improve it!
