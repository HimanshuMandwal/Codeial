{
  //method to submit form data to
  let createPost = function() {
    let newPostForm = $('#new-post-form');
    // this is to add delete listner to all the post
    let postLists = $("#post-list-container>div");
    for(let post of postLists) {
      deletePost($(" .delete-post-button",post));
    }

    newPostForm.submit(function(e){
      e.preventDefault()
    $.ajax({
      type:"post",
      url:"/post/create",
      data: newPostForm.serialize(),
      success: function(data){
       let newpost = newPostDom(data.data.post);
       $('#post-list-container').prepend(newpost);
       // to add the deletePost listner to the newly created post
       deletePost($(" .delete-post-button",newpost))
      },
      error: function(err){
        console.error(err.responseText);
      }
    })
    })
  }



    //method to get the data for the newly added post in DOM
  let newPostDom = function(post){
    return $(`<div class="post" id="post-${post._id}">
        <p>
            <div class="post-content">
                <small>
                    <a class="delete-post-button" href="/post/destroy/${post._id}">delete Post</a>
                </small>
                Post : -  ${post.content}
            </div>
            <div class="post-creator">
                Creator : - ${post.user.name}
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
  let deletePost = function(deleteLink) {
    $(deleteLink).click(function(e){
      e.preventDefault();
      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'),
        success: function(data){

          $(`#post-${data.data.post_id}`).remove();
        },
        error: function(error){
          console.error(`Error in deleting a post ${error.responseText}`)
        }
      })
    })
  }

  let createComment = function(){

  }


  createComment();
  createPost();
}