function dataFixture() {
  person("liqiang")
    .hasPost(
      post("reactjs 101")
        .withContent("reactjs is a nice framework to ease the complicated web design")
    ).hasPost(
      post("redux 101")
        .withContent("redux is a nice framework to ease the state management")
    );
  person("railsman")
    .hasPost(
      post("ROR 101")
        .withContent("ruby on rails is a nice framework to ease the web development")
    )
    .hasPost(
      post("Active Recored 101")
        .withContent("Active Recored is a pattern to ease the database manipulation")
    );
}

dataFixture();

function remoteCall(f) {
  return function(options, callback) {
    setTimeout(function() {
      const result = f(...Object.values(options));
      callback(result);
    }, 500);
  }
}

const fetchUser = remoteCall((name) => {
  var person = persons.find(entity => entity.name == name);
  if(person) {
    return {
      id: person.id,
      name: person.name,
    }
  }
});

const fetchPostsByUser = remoteCall((userId) => {
  return posts.filter( p => p.userId == userId);
});