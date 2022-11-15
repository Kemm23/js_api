var articles = [];
const demand = {
  country: "us",
  theme: "sport",
};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//call API
async function getArticles({ country, theme }) {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        apiKey: "08537a557cb8430d9b567a544423fab6",
        q: `${theme}`,
        pageSize: 10,
        country: `${country}`,
        page: 1,
      },
    });
    articles = response.data.articles;
    return response.data.articles;
  } catch (error) {
    console.error(error);
  }
}

getArticles(demand).then((data) => {
  renderArticles(data);
});

//Handle event
$("#country").onchange = (e) => {
  demand.country = e.target.value;
  reRenderArticles();
};

$("#Theme").onchange = (e) => {
  demand.theme = e.target.value;
  reRenderArticles();
};

$("#Search").oninput = (e) => {
  let valueSearchInput = e.target.value.toUpperCase();
  let articleSearch = articles.filter((article) => {
    return (
      article.title.toUpperCase().includes(valueSearchInput.toUpperCase()) ||
      article.description.toUpperCase().includes(valueSearchInput.toUpperCase())
    );
  });
  return renderArticles(articleSearch);
};

$("#Headlines").onclick = (e) => {
  e.preventDefault();
  enableReRender = false;
  reRenderArticles();
};

//render View
function renderArticles(data) {
  $("#article-list").innerHTML = "";
  data.forEach((article, index) => {
    $("#article-list").innerHTML += `<li>
                <div class="article-title font-weight-bold font-32px" onclick="showDetail(${index})">${article.title}</div>
                <div>${article.description}</div>
            </li>`;
  });
}

function showDetail(id) {
  let article = articles[id];
  $("#article-list").innerHTML = `
      <div class="text-center">
          <div class="font-weight-bold font-32 my-3">${article.title}</div>
        <div class="my-3">Public at : ${article.publishedAt}</div>
        <div class="my-3">Author: ${article.author}</div>
        <div class="my-3">Description: ${article.description}</div>
        <div class="my-3">Link article: <a href="${article.url}">Click here</a></div>
        <img src="${article.urlToImage}" />
        <div class="my-3 font-32">${article.content}</div>
      </div>
        `;
}

function reRenderArticles() {
  getArticles(demand).then((data) => {
    renderArticles(data);
  });
}
