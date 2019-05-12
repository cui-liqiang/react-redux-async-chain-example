const persons = []
const posts = []

const  nextPersonId = function () {
  var count = 1;
  return function() {
    return count++;
  }
}();

function person(name) {
  var onePerson = {
    id: nextPersonId(),
    name: name,
    hasPost: function(post) {
      post.userId = this.id;
      return this;
    }
  };
  persons.push(onePerson);
  return onePerson;
}

function post(title) {
  var onePost = {
    title: title,
    content: '',
    withContent: function(content) {
      this.content = content;
      return this;
    }
  };
  posts.push(onePost);
  return onePost;
}
