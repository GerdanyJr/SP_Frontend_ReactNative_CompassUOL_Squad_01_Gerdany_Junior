const layout = document.getElementById('articles_section') as HTMLDivElement;
const posts = JSON.parse(sessionStorage.getItem("posts")!);
const postNumber = 20;

export interface Post {
    id: string,
    userId: number,
    title: string,
    body: string,
    imgUrl: string,
    tags: string[],
    comments: Comment[],
    isDeleted: boolean
}

export interface Comment {
    body: string,
    user: { username:string }
}

async function loadData(): Promise<any> {
    const combinedData: Post[] = [];
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
                    isDeleted: false
                })
            }
            return combinedData;
        })
        .catch(error => {
            console.error("Erro ao carregar dados:", error);
        });
}

function renderPost(post: Post) {
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
    layout && layout.appendChild(article);
}
export async function genericFetch(url: string) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
async function renderPosts(posts?: Post[]) {
    if (posts === null) {
        posts = await loadData();
    }
    posts!.filter(post => !post.isDeleted).map((post: Post) => renderPost(post));
    sessionStorage.setItem("posts", JSON.stringify(posts));
}
renderPosts(posts);