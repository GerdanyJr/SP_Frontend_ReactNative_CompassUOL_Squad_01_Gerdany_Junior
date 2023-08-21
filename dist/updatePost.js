var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const post = JSON.parse(sessionStorage.getItem("clickedPost"));
const posts = JSON.parse(sessionStorage.getItem("posts"));
const updateButton = document.querySelector("#update_button");
const returnButton = document.querySelector('#return');
returnButton.addEventListener("click", () => window.location.href = "index.html");
updateButton.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const titleInput = document.querySelector("#post_title");
    const tagsInput = document.querySelector("#post_tags");
    const contentInput = document.querySelector("#post_content");
    const title = titleInput.value || post.title;
    const tags = tagsInput.value || post.tags.join(',');
    const content = contentInput.value || post.body;
    let updatedPost;
    console.log("aaaaaa");
    if (post.createdPost) {
        updatedPost = Object.assign(Object.assign({}, post), { title: title, tags: tags.split(","), body: content });
    }
    else {
        const response = yield fetch(`https://dummyjson.com/posts/${post.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                body: content,
                tags: tags.split(",")
            })
        });
        const responseJson = yield response.json();
        updatedPost = Object.assign(Object.assign({}, post), { title: responseJson.title, tags: responseJson.tags, body: responseJson.body });
    }
    updatePostInArrayAndStorage(updatedPost);
    window.location.href = "index.html";
}));
function updatePostInArrayAndStorage(updatedPost) {
    const index = posts.findIndex(post => post.id === updatedPost.id);
    posts[index] = updatedPost;
    const storagePosts = JSON.parse(sessionStorage.getItem("posts"));
    storagePosts[index] = updatedPost;
    sessionStorage.setItem("posts", JSON.stringify(storagePosts));
    sessionStorage.setItem("clickedPost", JSON.stringify(updatedPost));
}
export {};
