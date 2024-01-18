//router
import SameDay from "./views/SameDay.js";
import FiveDays from "./views/FiveDays.js";

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

// Ajoute les différentes routes et les associe à leurs vues, puis les ajoute au DOM si elles sont valides
const router = async () => {
  const routes = [
    { path: "/current", view: SameDay },
    { path: "/fivedays", view: FiveDays },
  ];
  //match
  const potencialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });
  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result != null
  );

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  let view = new match.route.view(getParams(match));

  // Ajoute la barre de recherche dans la page pour faire la recherche de la météo pour une ville spécifique dans le DOM
  document.querySelector("#app").innerHTML = view.getSearch();

  document
    .querySelector("#search-city")
    .addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        let searchValue = document.querySelector("#search-city").value;
        document.querySelector("#container").innerHTML = await view.getWeather(
          searchValue
        );
      }
    });

  // Ajoute les informations météo dans le DOM
  document.querySelector("#search-btn").addEventListener("click", async () => {
    let searchValue = document.querySelector("#search-city").value;
    document.querySelector("#container").innerHTML = await view.getWeather(
      searchValue
    );
  });
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});
