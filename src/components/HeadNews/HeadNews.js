let articles = [];
const demand = {
  country: "us",
  theme: "sport",
  pageSize: null,
  page: 1,
};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//call API
async function getArticles({ country, theme, pageSize, page }) {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        apiKey: "8e275467c90449ea816a98a90f711797",
        q: `${theme}`,
        pageSize: `${pageSize}`,
        country: `${country}`,
        page: `${page}`,
      },
    });
    articles = response.data.articles;
    return response.data.articles;
  } catch (error) {
    console.error(error);
  }
}

getArticles(demand).then(() => {
  renderPageNumber();
  renderArticles();
});
//Handle Event
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

$("#home-link").onclick = (e) => {
  e.preventDefault();
  enableReRender = false;
  reRenderArticles();
};

//Handle Page Number
let currentPage = demand.page;
let perPage = 10;
let totalPage = 0;
let perArticle = [];

function handlePageNumber(num) {
  $("#pagination").querySelector(".active").classList.remove("active");
  $("#pagination")
    .querySelector(`span:nth-child(${num})`)
    .classList.add("active");
  demand.page = num;
  currentPage = num;
  renderArticles();
}

function renderPageNumber() {
  $("#pagination").innerHTML = "";
  if(articles.length !== 0) {
    totalPage = Math.ceil(articles.length / perPage);
  for (let i = 1; i <= totalPage; i++) {
    $("#pagination").innerHTML += `<span onclick="handlePageNumber(${i })">${
      i
    }</span>`;
  }
  $("#pagination")
    .querySelector(`span:nth-child(${currentPage})`)
    .classList.add("active");
  }
}

//Render View
function renderArticles() {
  perArticle = articles.slice(
    (currentPage - 1) * perPage,
    (currentPage - 1) * perPage + perPage
  );
  $("#article-list").innerHTML = "";
  perArticle.forEach((article, index) => {
    $("#article-list").innerHTML += `<li class="row mb-4">
                <div class="col-3"><img class="" src="${
                  article.urlToImage
                }" /></div>
                <div class="col-9">
                    <div class="article-title font-weight-bold font-24" onclick="showDetail(${
                      (currentPage - 1) * perPage + index
                    })">${article.title}</div>
                    <div class="font-18">${article.description}</div>
                </div>
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
  getArticles(demand).then(() => {
    renderPageNumber();
    renderArticles();
  });
}
