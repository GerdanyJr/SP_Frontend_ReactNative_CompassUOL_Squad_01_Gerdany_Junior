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
const post = JSON.parse(sessionStorage.getItem("clickedPost"));
const posts = JSON.parse(sessionStorage.getItem("posts"));
const nextPosts = posts.filter(nextPost => nextPost.id !== post.id);
const nextPostsContainer = document.querySelector('#articles');
const commentsContainer = document.querySelector('#comments');
const commentFormContainer = document.querySelector('#comments_form');
const deleteButton = document.querySelector("#delete_button");
deleteButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://dummyjson.com/posts/${post.id}`, {
        method: 'DELETE',
    });
    const deletedPost = yield response.json();
    updatePostInArrayAndStorage(deletedPost);
    window.location.href = "index.html";
}));
commentFormContainer.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('#username');
    const body = document.querySelector('#comment');
    const comment = {
        user: { username: username.value },
        body: body.value
    };
    username.value = '';
    body.value = '';
    postComment(comment);
});
function postComment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        let newComment;
        if (post.createdPost) {
            newComment = {
                body: comment.body,
                user: { username: comment.user.username }
            };
        }
        else {
            const response = yield fetch('https://dummyjson.com/comments/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: comment.body,
                    postId: post.id,
                    userId: post.userId,
                })
            });
            const commentJson = yield response.json();
            newComment = {
                body: commentJson.body,
                user: { username: commentJson.user.username }
            };
        }
        post.comments.push(newComment);
        updatePostInArrayAndStorage(post);
        createComment(newComment, commentsContainer);
    });
}
function createComment(comment, commentsContainer) {
    const container = document.createElement('div');
    const userName = document.createElement('h1');
    const content = document.createElement('p');
    userName.innerText = comment.user.username;
    content.innerText = comment.body;
    container.append(userName, content);
    commentsContainer.appendChild(container);
}
function renderSinglePost(postId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield genericFetch(`https://dummyjson.com/users/${userId}`);
        const postHeader = document.querySelector('#post_header');
        const postBody = document.querySelector(".text_area");
        const user_info = document.querySelector('#user_info');
        const tags = document.querySelector("#tags span");
        const user_img = document.querySelectorAll('.user_img');
        const img = document.querySelector('#main_img');
        const author_info = document.querySelector('#author_info p');
        const title = document.createElement('h1');
        const user_name = document.createElement('h1');
        user_name.innerText = `${user.firstName} ${user.lastName}`;
        user_img.forEach(imgElem => imgElem.src = user.image);
        if (post.comments.length == 0) {
            const commentsJson = yield genericFetch(`https://dummyjson.com/posts/${postId}/comments`);
            post.comments = commentsJson.comments.map((comment) => { return { body: comment.body, user: { username: comment.user.username } }; });
            commentsJson.comments.map((comment) => createComment({ body: comment.body, user: { username: comment.user.username } }, commentsContainer));
        }
        else {
            post.comments.map(((comment) => createComment({ body: comment.body, user: { username: comment.user.username } }, commentsContainer)));
        }
        postBody.innerHTML = `
    <p>${post.body}</p>
    <p>Thanks for reading, ${user.firstName}</p>`;
        author_info.innerHTML = `
    <span>${user.firstName} ${user.lastName}</span> is a ${user.company.title} in the sector of ${user.company.department} for ${user.company.name}, and is a ${user.university} student.`;
        tags.innerText = post.tags.join(", ");
        title.innerText = post.title;
        img.src = post.imgUrl;
        postHeader.appendChild(title);
        user_info.append(user_name);
    });
}
function renderNextPosts(nextPosts, nextPostsContainer) {
    nextPosts.filter(post => !post.isDeleted).map(post => {
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
        nextPostsContainer && nextPostsContainer.appendChild(article);
    });
}
function updatePostInArrayAndStorage(updatedPost) {
    const index = posts.findIndex(post => post.id === updatedPost.id);
    posts[index] = updatedPost;
    const storagePosts = JSON.parse(sessionStorage.getItem("posts"));
    storagePosts[index] = updatedPost;
    sessionStorage.setItem("posts", JSON.stringify(storagePosts));
    sessionStorage.setItem("clickedPost", JSON.stringify(updatedPost));
}
renderSinglePost(post.id, post.userId);
renderNextPosts(nextPosts, nextPostsContainer);
