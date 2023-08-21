var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const layout = document.getElementById('articles_section');
const posts = JSON.parse(sessionStorage.getItem("posts"));
const postNumber = 20;
function loadData() {
    return __awaiter(this, void 0, void 0, function* () {
        const combinedData = [];
        return Promise.all([genericFetch(`https://dog.ceo/api/breeds/image/random/${postNumber}`), genericFetch(`https://dummyjson.com/posts?limit=${postNumber}`)])
            .then(([imgsJson, postsJson]) => {
            const imgsData = imgsJson.message;
            const postsData = postsJson.posts;
            for (let i = 0; i < postNumber; i++) {
                combinedData.push({
                    id: postsData[i].id,
                    userId: postsData[i].userId,
                    title: postsData[i].title,
                    body: postsData[i].body,
                    imgUrl: imgsData[i],
                    tags: postsData[i].tags,
                    comments: [],
                    isDeleted: false,
                    createdPost: false
                });
            }
            return combinedData;
        })
            .catch(error => {
            console.error("Erro ao carregar dados:", error);
        });
    });
}
function renderPost(post) {
    const article = document.createElement('article');
    const postLink = document.createElement('a');
    const postImg = document.createElement('img');
    const postTitle = document.createElement('h1');
    postImg.src = post.imgUrl;
    postLink.href = `/post.html`;
    postLink.addEventListener("click", () => {
        sessionStorage.setItem("clickedPost", JSON.stringify(post));
    });
    postTitle.innerText = post.title;
    postLink.appendChild(postImg);
    postLink.appendChild(postTitle);
    article.append(postLink);
    layout && layout.appendChild(article);
}
export function genericFetch(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const data = yield response.json();
        return data;
    });
}
function renderPosts(posts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (posts === null) {
            posts = yield loadData();
        }
        posts.filter(post => !post.isDeleted).map((post) => renderPost(post));
        sessionStorage.setItem("posts", JSON.stringify(posts));
    });
}
renderPosts(posts);
