class UserController {
  index() {
    return {
      ok: true,
      message: 'flawless'
    };
  }

  handlePost(data) {
    return data.body;
  }

  myHandler() {
    return (req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('this is mine!');
    }
  }
}

module.exports = new UserController();
