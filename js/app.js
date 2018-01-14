let requestButton = document.getElementById(`requestResourceButton`);
requestButton.addEventListener(`click`, function (event) {
  clearElement(`contentContainer`);
  let resourceType = document.getElementById(`resourceType`).value;
  let resourceId = document.getElementById(`resourceId`).value;
  updateDisplay(resourceType, resourceId);
});

function updateDisplay(resourceType, resourceId) {
  let container = createElement(`div`);
  let xhr = new XMLHttpRequest();
  xhr.addEventListener(`load`, function (event) {
    if (checkForError(event)) {
      if (resourceType === `people`) {
        data = fetchData(event, [`name`, `gender`, `species`]);
        container.appendChild(createElement(`h2`, false, data.name));
        container.appendChild(createElement(`p`, false, data.gender));

        let speciesXHR = new XMLHttpRequest();
        speciesXHR.addEventListener(`load`, function (event) {
          let data = fetchData(event, [`name`]);
          container.appendChild(createElement(`p`, false, data.name));
        });
        speciesXHR.open(`GET`, data.species);
        speciesXHR.send();
      } else if (resourceType === `planets`) {
        data = fetchData(event, [`name`, `terrain`, `population`, `films`]);
        container.appendChild(createElement(`h2`, false, data.name));
        container.appendChild(createElement(`p`, false, data.terrain));
        container.appendChild(createElement(`p`, false, data.population));
      } else {
        data = fetchData(event, [`name`, `manufacturer`, `starship_class`, `films`]);
        container.appendChild(createElement(`h2`, false, data.name));
        container.appendChild(createElement(`p`, false, data.manufacturer));
        container.appendChild(createElement(`p`, false, data.starship_class));
      }

      if (resourceType === `planets` || resourceType === `starships`) {
        let films = createElement(`ul`);
        addFilmsToList(films, data.films);
        container.appendChild(films);
      }

      document.getElementById(`contentContainer`).appendChild(container);
    }
  });

  switch (resourceType) {
    case `people`:
      xhr.open(`GET`, `https://swapi.co/api/people/${resourceId}/`);
      break;
    case `planets`:
      xhr.open(`GET`, `https://swapi.co/api/planets/${resourceId}/`);
      break;
    case `starships`:
      xhr.open(`GET`, `https://swapi.co/api/starships/${resourceId}/`);
  }
  xhr.send();
}

function fetchData(event, keys) {
  let data = JSON.parse(event.target.responseText);
  let results = {};
  keys.forEach((curr) => {
    if (curr === `species`) {
      results[curr] = data[curr][0];
    } else {
      results[curr] = data[curr];
    }
  });
  return results;
}

function checkForError(event) {
  if (event.target.status >= 300) {
    document.getElementById(`contentContainer`).appendChild(
      createElement(
        `p`, `errorMessage`, `Error: Fetching resource: ${event.target.responseURL} ${event.target.statusText}`
      )
    );
    return false;
  }
  return true;
}

function addFilmsToList(listElement, films) {
  films.forEach((curr) => {
    let filmXHR = new XMLHttpRequest();
    filmXHR.addEventListener(`load`, function (event) {
      let data = fetchData(event, [`title`]);
      listElement.appendChild(createElement(`li`, false, data.title));
    });
    filmXHR.open(`GET`, curr);
    filmXHR.send();
  });
}

function createElement(type, className, innerHTML) {
  let element = document.createElement(type);
  if (className) {
    element.className = className;
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  return element;
}

function clearElement(id) {
  let element = document.getElementById(id);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}