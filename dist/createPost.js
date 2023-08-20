var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { genericFetch } from "./index.js";
const posts = JSON.parse(sessionStorage.getItem("posts"));
const form = document.querySelector('#post_form');
const returnButton = document.querySelector('#return');
form.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const titleInput = document.querySelector("#post_title");
    const contentInput = document.querySelector("#post_content");
    const title = titleInput.value;
    const content = contentInput.value;
    const response = yield createPost({ title: title, body: content });
    const img = yield genericFetch('https://dog.ceo/api/breeds/image/random');
    const comments = yield genericFetch(`https://dummyjson.com/posts/${Math.ceil(Math.random() * 100)}/comments`);
    const newPost = {
        id: response.id,
        userId: response.userId,
        title: response.title,
        body: response.body,
        imgUrl: img.message,
        isDeleted: false,
        comments: comments.comments,
        tags: []
    };
    posts.push(newPost);
    sessionStorage.setItem('posts', JSON.stringify(posts));
    window.location.href = "index.html";
}));
returnButton.addEventListener('click', () => {
    window.location.href = "index.html";
});
function createPost(post) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://dummyjson.com/posts/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: post.title,
                userId: Math.ceil(Math.random() * 100),
                body: post.body,
            })
        });
        const data = yield response.json();
        return data;
    });
}
