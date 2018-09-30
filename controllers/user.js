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
      res.end('this is mine!');
    }
  }
}

module.exports = new UserController();
