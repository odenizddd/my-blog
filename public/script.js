const postButton = document.getElementById("post-button");
const postContainer = document.getElementById("post-container");
const textInput = document.getElementById("post-input");
const baseUrl = location.href + "posts";

const appendPost = (postObj) => {
    const post = document.createElement("div");
    post.classList.add("post");
    const postContentContainer = document.createElement("div");
    postContentContainer.classList.add("post-content-container");
    const postContent = document.createTextNode(postObj.content);
    postContentContainer.appendChild(postContent);
    post.appendChild(postContentContainer);
    const deleteButton = document.createElement("button");
    deleteButton.addEventListener("click", async () => {
        const response = await fetch(baseUrl + `/${postObj._id}`, {
            method: "DELETE"
        });
        if(response.status !== 200) {
            console.log("Bad response for my DELETE request.");
            return;
        }
        post.remove();
    });
    deleteButton.classList.add("delete-button");
    const deleteButtonContent = document.createTextNode("DELETE");
    deleteButton.appendChild(deleteButtonContent);
    post.appendChild(deleteButton);
    const editButton = document.createElement("button");
    editButton.addEventListener("click", async () => {
        if(editButton.innerHTML === "EDIT") {
            postContentContainer.setAttribute("contenteditable", "true");
            postContentContainer.focus();
            editButton.innerHTML = "SAVE"
        } else {
            postContentContainer.setAttribute("contenteditable", "false");
            editButton.innerHTML = "EDIT";
            let response = await fetch(baseUrl + `/${postObj._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({content: post.firstChild.wholeText})
            });
            if(response.status !== 200) {
                console.log("Bad response for my PUT request.");
            }
            response = response.json();
            post.firstChild.wholeText = response.content;
        }
    });
    editButton.classList.add("edit-button");
    const editButtonContent = document.createTextNode("EDIT");
    editButton.appendChild(editButtonContent);
    post.appendChild(editButton);
    postContainer.appendChild(post);
};

const clearPosts = () => {
    while(postContainer.childElementCount !== 1) {
        postContainer.removeChild(postContainer.lastChild);
    }
}

postButton.addEventListener("click", async () => {
    const input = textInput.value;
    if(!input) return;
    let response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({content: input})
    });
    if(response.status !== 200) {
        console.log("Bad response to my POST request.");
        return;
    }
    response = await response.json();
    appendPost({_id: response._id, content: response.content});
    textInput.value = "";
});

window.addEventListener("load", async () => {
    let response = await fetch(baseUrl, {
        method: "GET"
    });
    response = await response.json();
    clearPosts();
    response.forEach(post => {
        console.log(post);
        appendPost(post);
    });
});
