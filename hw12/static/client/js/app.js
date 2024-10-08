let token = localStorage.getItem("access_token");

const BASE_URL = "http://localhost:9000";

function setLoading(target) {
  target.innerHTML =
    '<div class="alert alert-primary" role="alert">Loading...</div>';
}

get_refresh_token = async () => {
  get_refresh_token.counter = (get_refresh_token.counter || 0) + 1;
  if (get_refresh_token > 1) {
    console.log("get_refresh_token is busy, try later");
    return;
  }
  const URL = `${BASE_URL}/api/auth/refresh_token`;
  let refresh_token = localStorage.getItem("refresh_token");
  console.log(`refresh_token. token=${token}, refresh_token=${refresh_token}`);

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${refresh_token}`,
    },
  });

  if (response.ok) {
    result = await response.json();
    localStorage.setItem("access_token", result?.access_token);
    localStorage.setItem("refresh_token", result?.refresh_token);
    token = localStorage.getItem("access_token");
    get_refresh_token.counter = 0;
    return token;
  } else if (response.status == 401) {
    get_refresh_token.counter = 0;
  } else {
    get_refresh_token.counter = 0;
  }
  get_refresh_token.counter = 0;
};

get_contacts = async () => {
  get_contacts.counter = (get_contacts.counter || 0) + 1;
  setLoading(contacts);
  const URL = `${BASE_URL}/api/contacts`;
  const response = await fetch(URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    get_contacts.counter = 0;
    contacts.innerHTML = "";
    result = await response.json();
    for (contact of result) {
      el = document.createElement("li");
      el.className = "list-group-item";
      el.innerHTML = `ID: ${contact?.id} ${contact?.first_name} ${contact?.last_name}, Email: <strong>${contact?.email}</strong>. User: ${contact?.user.username} `;
      contacts.appendChild(el);
    }
  } else if (response.status == 401) {
    if (get_contacts.counter < 4) {
      console.log(`Try: refresh_token counter: ${get_contacts.counter}`);
      token = await get_refresh_token();
      setTimeout(get_contacts, 3000);
    } else {
      window.location = "index.html";
    }
  }
};

get_contacts();
