async function request(option) {
  let { url, data, method = "GET" } = option;
  url = 'http://10.162.149.227:3033' + url
  
  return new Promise((resolve, reject) => {
    let fetchItem;

    if (method === "GET") {
      fetchItem = fetch(url);
    } else if (method === "POST") {
      fetchItem = fetch(url, {
        body: JSON.stringify(data),
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
          "user-agent": "Mozilla/4.0 MDN Example",
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer" // *client, no-referrer
      });
    }

    fetchItem
      .then(r => {
        return r.json();
      })
      .then(resData => {
        resolve(resData);
      })
      .catch(err => {
        reject(err);
      });
  });
}


async function requestSync(option) {
  let { url, data, method = "GET" } = option;
  url = 'http://localhost:3033' + url
  let fetchItem;

  if (method === "GET") {
    fetchItem = await fetch(url);
  } else if (method === "POST") {
    fetchItem = await fetch(url, {
      body: JSON.stringify(data),
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "user-agent": "Mozilla/4.0 MDN Example",
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8080"
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer" // *client, no-referrer
    });
  }

  let res = await fetchItem.json()
  return res
}

