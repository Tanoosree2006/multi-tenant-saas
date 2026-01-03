import http from "http";

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Multi-Tenant SaaS</title>
  <style>
    body { font-family: Arial; margin: 20px; }
    nav button { margin-right: 10px; }
    section { display: none; }
    section.active { display: block; }
    .card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
  </style>
</head>
<body>

<h1>Multi-Tenant SaaS</h1>

<nav id="nav" style="display:none;">
  <button onclick="go('dashboard')">Dashboard</button>
  <button onclick="go('projects')">Projects</button>
  <button onclick="go('tasks')">Tasks</button>
  <button onclick="go('users')">Users</button>
  <button onclick="logout()">Logout</button>
</nav>

<!-- LOGIN -->
<section id="login" class="active">
  <h2>Login</h2>
  <input id="email" placeholder="Email"><br><br>
  <input id="password" type="password" placeholder="Password"><br><br>
  <input id="subdomain" placeholder="Tenant Subdomain"><br><br>
  <button onclick="login()">Login</button>
</section>

<!-- DASHBOARD -->
<section id="dashboard">
  <h2>Dashboard</h2>
  <div class="card">Total Projects: <b id="projectCount">0</b></div>
  <div class="card">Total Tasks: <b id="taskCount">0</b></div>
  <div class="card">Total Users: <b id="userCount">0</b></div>
</section>

<!-- PROJECTS -->
<section id="projects">
  <h2>Projects</h2>
  <button onclick="addProject()">Add Project</button>
  <pre id="projectsData"></pre>
</section>

<!-- TASKS -->
<section id="tasks">
  <h2>Tasks</h2>
  <button onclick="addTask()">Add Task</button>
  <pre id="tasksData"></pre>
</section>

<!-- USERS -->
<section id="users">
  <h2>Users</h2>
  <pre id="usersData"></pre>
</section>

<script>
const API = "http://localhost:5000";

function setToken(t){ localStorage.setItem("token", t); }
function getToken(){ return localStorage.getItem("token"); }

function show(id){
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function go(page){
  show(page);
  if(page==="dashboard") loadCounts();
  if(page==="projects") loadProjects();
  if(page==="tasks") loadTasks();
  if(page==="users") loadUsers();
}

async function login(){
  const res = await fetch(API+"/api/auth/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      email: email.value,
      password: password.value,
      tenantSubdomain: subdomain.value
    })
  });
  const data = await res.json();
  if(!data.success){ alert(data.message); return; }
  setToken(data.data.token);
  nav.style.display="block";
  go("dashboard");
}

function logout(){
  localStorage.removeItem("token");
  nav.style.display="none";
  show("login");
}

async function authGet(url){
  return fetch(url,{
    headers:{ Authorization:"Bearer "+getToken() }
  }).then(r=>r.json());
}

async function loadCounts(){
  const projects = await authGet(API+"/api/projects");
  const tasks = await authGet(API+"/api/tasks");
  const users = await authGet(API+"/api/users");

  projectCount.innerText = projects.data?.length || 0;
  taskCount.innerText = tasks.data?.length || 0;
  userCount.innerText = users.data?.length || 0;
}

async function loadProjects(){
  const data = await authGet(API+"/api/projects");
  projectsData.innerText = JSON.stringify(data,null,2);
}

async function loadTasks(){
  const data = await authGet(API+"/api/tasks");
  tasksData.innerText = JSON.stringify(data,null,2);
}

async function loadUsers(){
  const data = await authGet(API+"/api/users");
  usersData.innerText = JSON.stringify(data,null,2);
}

async function addProject(){
  const name = prompt("Project name?");
  if(!name) return;
  await fetch(API+"/api/projects",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:"Bearer "+getToken()
    },
    body:JSON.stringify({ name, description:"Created from UI" })
  });
  loadProjects();
  loadCounts();
}

async function addTask(){
  const title = prompt("Task title?");
  if(!title) return;
  const projects = await authGet(API+"/api/projects");
  const projectId = projects.data?.[0]?.id;
  if(!projectId){ alert("Create a project first"); return; }

  await fetch(API+"/api/tasks",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:"Bearer "+getToken()
    },
    body:JSON.stringify({ projectId, title })
  });
  loadTasks();
  loadCounts();
}
</script>

</body>
</html>
`;

http.createServer((req,res)=>{
  res.writeHead(200,{"Content-Type":"text/html"});
  res.end(html);
}).listen(3000,"0.0.0.0",()=>{
  console.log("Frontend running on 3000");
});

