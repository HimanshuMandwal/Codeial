{
  const successMessage = "success";
  const errorMessage = "error";
  //method to submit form data to
  let createPost = function () {
    let newPostForm = $('#new-post-form');
    // this is to add delete listner to all the post
    let postLists = $("#post-list-container>div");
    for (let post of postLists) {

      //this will add listner to each comment
      let postDivId = post.id;
      let postId = postDivId.split("-")[1];
      let commentContainer = $(`#post-comments-${postId}`);
      createComment($(" .comment-form",post));
      for(let comment of commentContainer){
        console.log(comment);
        deleteComment($(" .delete-comment-button",comment))
      }
      deletePost($(" .delete-post-button", post));
    }

    newPostForm.submit(function (e) {
      e.preventDefault()
      $.ajax({
        type: "post",
        url: "/post/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newpost = newPostDom(data.data);
          $('#post-list-container').prepend(newpost);
          NotyFlashMessage(successMessage, data.message);
          // to add the deletePost listner to the newly created post
          deletePost($(" .delete-post-button", newpost))
          createComment($(" .comment-form",newpost));
        },
        error: function (err) {
          NotyFlashMessage(errorMessage , "error in creating post");
          console.error(err.responseText);
        }
      })
    })
  }



  //method to get the data for the newly added post in DOM
  let newPostDom = function (data) {
    const { post, user } = data;
    return $(`<div class="post" id="post-${post._id}">
        <p>
            <div class="post-content">
                <small>
                    <a class="delete-post-button" href="/post/destroy/${post._id}">delete Post</a>
                </small>
                Post : -  ${post.content}
            </div>
            <div class="post-creator">
                Creator : - ${user.name}
            </div>
        </p>
        <div class="post-comments">
            <form class="comment-form" method="POST" action="/comment/create">
                <input type="text" name="content" placeholder="type here to add comment..."></input>
                <input type="hidden" name="post" value="${post._id}"></input>
                <input type="submit" value="Comment">
            </form>
            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">
                </ul>
            </div>
        </div>
    </div>`
    )
  }


  // methode to delete a post
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          NotyFlashMessage(successMessage, data.message);
        },
        error: function (error) {
          NotyFlashMessage(errorMessage , "error in deleting post");
          console.error(`Error in deleting a post ${error.responseText}`)
        }
      })
    })
  }

  let createComment = function (newCommentForm) {

    newCommentForm.submit(function (e) {
      e.preventDefault()
      $.ajax({
        type: "post",
        url: "/comment/create",
        data: newCommentForm.serialize(),
        success: function (data) {
          let newcomment = newCommentDom(data.data);
          let commentList= $(`#post-comments-${data.data.comment.post}`).append(newcomment);
          NotyFlashMessage(successMessage , data.message);
          deleteComment($(' .delete-comment-button', commentList));
        },
        error: function (err) {
          NotyFlashMessage(errorMessage , "error in adding comment");
          console.error(err.responseText);
        }
      })
    })
  }

  let newCommentDom = function(data) {
    const { comment, user} = data;
    return `<div>
        <small>
            <a href="/comment/destroy/${comment._id}">X</a>
        </small>
      ${comment.content}
      <br>
      <small>
      ${user.name}
      </small>
    </div>`
  }

  let deleteComment = function(deleteLink){
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'),
        success: function (data) {
          $(`#comment-${data.data.comment._id}`).remove();
          NotyFlashMessage(successMessage, data.message);
        },
        error: function (error) {
          NotyFlashMessage(errorMessage , "error in deleting comment");
          console.error(`Error in deleting a post ${error.responseText}`)
        }
      })
    })
  }

  let NotyFlashMessage = function (type, message) {
    return new Noty({
      theme: 'relax',
      text: message,
      type: type,
      layout: 'topRight',
      timeout: 1000,
    }).show();
  }

  createPost();
}