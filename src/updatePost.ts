import { Post } from "./index.js";

const post = JSON.parse(sessionStorage.getItem("clickedPost")!) as Post;
const posts = JSON.parse(sessionStorage.getItem("posts")!) as Post[];
const updateButton = document.querySelector("#update_button")! as HTMLButtonElement;
const returnButton = document.querySelector('#return')! as HTMLButtonElement;

returnButton.addEventListener("click", () => window.location.href = "index.html");
updateButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const titleInput = document.querySelector("#post_title")! as HTMLInputElement;
    const tagsInput = document.querySelector("#post_tags")! as HTMLInputElement;
    const contentInput = document.querySelector("#post_content")! as HTMLTextAreaElement;

    const title = titleInput.value || post.title;
    const tags = tagsInput.value || post.tags.join(',');
    const content = contentInput.value || post.body;

    let updatedPost: Post;
    console.log("aaaaaa");

    if (post.createdPost) {
        updatedPost = {
            ...post,
            title: title,
            tags: tags.split(","),
            body: content
        }
    } else {
        const response = await fetch(`https://dummyjson.com/posts/${post.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                body: content,
                tags: tags.split(",")
            })
        })
        const responseJson = await response.json();
        updatedPost = {
            ...post,
            title: responseJson.title,
            tags: responseJson.tags,
            body: responseJson.body
        }
    }
    updatePostInArrayAndStorage(updatedPost);
    window.location.href = "index.html";
})

function updatePostInArrayAndStorage(updatedPost: Post) {
    const index = posts.findIndex(post => post.id === updatedPost.id);
    posts[index] = updatedPost;
    const storagePosts = JSON.parse(sessionStorage.getItem("posts")!) as Post[];
    storagePosts[index] = updatedPost;
    sessionStorage.setItem("posts", JSON.stringify(storagePosts));
    sessionStorage.setItem("clickedPost", JSON.stringify(updatedPost));
}