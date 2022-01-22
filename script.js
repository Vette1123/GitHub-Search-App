const APIURL = "https://api.github.com/users/";
const form = document.getElementById("form");
const search = document.getElementById("search");
const mainEl = document.getElementById("main");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);
    console.log(data);
    createUserCard(data);
    getRepos(username);
  } catch (error) {
    if (error.response.status == 404) {
      createErrorCard("No such profile with this username");
    }
  }
}
async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    console.log(data);
    addReposToCard(data);
  } catch (error) {
    createErrorCard("No such profile with this username");
  }
}

function createUserCard(user) {
  const cardHTML = `
    <div class="card">
    <div>
      <img
        src="${user.avatar_url}"
        alt="${user.name}"
        class="avatar"
      />
    </div>
    <div class="user-info">
      <h2>${user.name}</h2>
      <p>
      ${user.bio} 
      </p>
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Public Repos</strong></li>
      </ul>
      <div id="repos">
      </div>
    </div>
  </div>
    `;
  mainEl.innerHTML = cardHTML;
}
function createErrorCard(msg) {
  const errorCard = `
    <div class="card">
    <h2>${msg}</h2>
    </div>
    `;
  mainEl.innerHTML = errorCard;
}
function addReposToCard(repos) {
  const reposEL = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repos");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerHTML = repo.name;
    reposEL.appendChild(repoEl);
  });
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);
    search.value = "";
  }
});
