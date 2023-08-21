import { Post, genericFetch } from "./index.js";

const posts = JSON.parse(sessionStorage.getItem("posts")!) as Post[];
const form = document.querySelector('#post_form')! as HTMLFormElement;
const returnButton = document.querySelector('#return')! as HTMLButtonElement;

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const titleInput = document.querySelector("#post_title")! as HTMLInputElement;
    const tagsInput = document.querySelector("#post_tags")! as HTMLInputElement;
    const contentInput = document.querySelector("#post_content")! as HTMLTextAreaElement;

    const title = titleInput.value;
    const tags = tagsInput.value.split(',');
    const content = contentInput.value;

    const response = await createPost({ title: title, body: content });
    const img = await genericFetch('https://dog.ceo/api/breeds/image/random');
    const comments = await genericFetch(`https://dummyjson.com/posts/${Math.ceil(Math.random() * 100)}/comments`);
    const newPost: Post = {
        id: response.id,
        userId: response.userId,
        title: response.title,
        body: response.body,
        imgUrl: img.message,
        isDeleted: false,
        createdPost: true,
        comments: comments.comments,
        tags: tags
    }
    posts.push(newPost);
    sessionStorage.setItem('posts', JSON.stringify(posts));
    window.location.href = "index.html";
});

returnButton.addEventListener('click', () => {
    window.location.href = "index.html";
})

async function createPost(post: any) {
    const response = await fetch('https://dummyjson.com/posts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: post.title,
            userId: Math.ceil(Math.random() * 100),
            body: post.body,
        })
    });
    const data = await response.json()
    return data;
}