import { Post, genericFetch, Comment } from "./index.js";

const post = JSON.parse(sessionStorage.getItem("clickedPost")!) as Post;
const posts = JSON.parse(sessionStorage.getItem("posts")!) as Post[];
const nextPosts = posts.filter(nextPost => nextPost.id !== post.id);
const nextPostsContainer = document.querySelector('#articles')! as HTMLDivElement;
const commentsContainer = document.querySelector('#comments')! as HTMLDivElement;
const commentFormContainer = document.querySelector('#comments_form')! as HTMLFormElement;
const deleteButton = document.querySelector("#delete_button")! as HTMLButtonElement;

deleteButton.addEventListener("click", async () => {
    const response = await fetch(`https://dummyjson.com/posts/${post.id}`, {
        method: 'DELETE',
    });
    const deletedPost = await response.json();
    updatePostInArrayAndStorage(deletedPost);
    window.location.href = "index.html";
})

commentFormContainer.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('#username')! as HTMLInputElement;
    const body = document.querySelector('#comment')! as HTMLInputElement;
    const comment: Comment = {
        user: { username: username.value },
        body: body.value
    }
    username.value = '';
    body.value = '';
    postComment(comment);
})


async function postComment(comment: Comment) {
    let newComment: Comment;
    if (post.createdPost) {
        newComment = {
            body: comment.body,
            user: { username: comment.user.username }
        };
    } else {
        const response = await fetch('https://dummyjson.com/comments/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                body: comment.body,
                postId: post.id,
                userId: post.userId,
            })
        })
        const commentJson = await response.json();
        newComment = {
            body: commentJson.body,
            user: { username: commentJson.user.username }
        };
    }

    post.comments.push(newComment);
    updatePostInArrayAndStorage(post);
    createComment(newComment, commentsContainer);
}

function createComment(comment: Comment, commentsContainer: HTMLDivElement) {
    const container = document.createElement('div');
    const userName = document.createElement('h1');
    const content = document.createElement('p');
    userName.innerText = comment.user.username;
    content.innerText = comment.body;
    container.append(userName, content);
    commentsContainer.appendChild(container);
}

async function renderSinglePost(postId: string, userId: number) {
    const user = await genericFetch(`https://dummyjson.com/users/${userId}`);
    const postHeader = document.querySelector('#post_header')! as HTMLDivElement;
    const postBody = document.querySelector(".text_area")! as HTMLDivElement;
    const user_info = document.querySelector('#user_info')! as HTMLDivElement;
    const tags = document.querySelector("#tags span")! as HTMLSpanElement;
    const user_img = document.querySelectorAll('.user_img')! as NodeListOf<HTMLImageElement>;
    const img = document.querySelector('#main_img')! as HTMLImageElement;
    const author_info = document.querySelector('#author_info p')! as HTMLParagraphElement;

    const title = document.createElement('h1');
    const user_name = document.createElement('h1');

    user_name.innerText = `${user.firstName} ${user.lastName}`;
    user_img.forEach(imgElem => imgElem.src = user.image);

    if (post.comments.length == 0) {
        const commentsJson = await genericFetch(`https://dummyjson.com/posts/${postId}/comments`)
        post.comments = commentsJson.comments.map((comment: Comment) => { return { body: comment.body, user: { username: comment.user.username } } });
        commentsJson.comments.map((comment: any) => createComment({ body: comment.body, user: { username: comment.user.username } }, commentsContainer));
    } else {
        post.comments.map(((comment: any) => createComment({ body: comment.body, user: { username: comment.user.username } }, commentsContainer)));
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
}

function renderNextPosts(nextPosts: Post[], nextPostsContainer: HTMLDivElement) {
    nextPosts.filter(post => !post.isDeleted).map(post => {
        const article = document.createElement('article');
        const postLink = document.createElement('a');
        const postImg = document.createElement('img');
        const postTitle = document.createElement('h1');

        postImg.src = post.imgUrl;
        postLink.href = `/post.html`;
        postLink.addEventListener("click", () => {
            sessionStorage.setItem("clickedPost", JSON.stringify(post));
        })
        postTitle.innerText = post.title;
        postLink.appendChild(postImg);
        postLink.appendChild(postTitle)
        article.append(postLink);
        nextPostsContainer && nextPostsContainer.appendChild(article);
    })
}

function updatePostInArrayAndStorage(updatedPost: Post) {
    const index = posts.findIndex(post => post.id === updatedPost.id);
    posts[index] = updatedPost;
    const storagePosts = JSON.parse(sessionStorage.getItem("posts")!) as Post[];
    storagePosts[index] = updatedPost;
    sessionStorage.setItem("posts", JSON.stringify(storagePosts));
    sessionStorage.setItem("clickedPost", JSON.stringify(updatedPost));
}
renderSinglePost(post.id, post.userId);
renderNextPosts(nextPosts, nextPostsContainer);